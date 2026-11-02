/**
 * POST /api/subscribe — newsletter signup (Cloudflare Pages Function).
 *
 * Subscribers land in Shopify as customers with email-marketing consent, the
 * same list checkout's "email me with news" box feeds, so Shopify Email can
 * send to everyone from one place. No third-party list, no popup.
 *
 * Env (Pages → Settings → Variables and secrets):
 *   SHOPIFY_SHOP            e.g. wawawave.myshopify.com
 *   SHOPIFY_CLIENT_ID       Dev Dashboard app, installed on the store, with
 *   SHOPIFY_CLIENT_SECRET   read_customers + write_customers scopes
 *   (or SHOPIFY_ADMIN_TOKEN, a static Admin API token, instead of the pair)
 */

interface Env {
  SHOPIFY_SHOP: string;
  SHOPIFY_CLIENT_ID?: string;
  SHOPIFY_CLIENT_SECRET?: string;
  SHOPIFY_ADMIN_TOKEN?: string;
}

const API_VERSION = '2025-10';
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// Client-credentials tokens last 24h; reuse within a warm isolate.
let cached: { token: string; expires: number } | null = null;

async function adminToken(env: Env): Promise<string> {
  if (env.SHOPIFY_ADMIN_TOKEN) return env.SHOPIFY_ADMIN_TOKEN;
  if (cached && cached.expires > Date.now()) return cached.token;
  const res = await fetch(`https://${env.SHOPIFY_SHOP}/admin/oauth/access_token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: env.SHOPIFY_CLIENT_ID ?? '',
      client_secret: env.SHOPIFY_CLIENT_SECRET ?? '',
    }),
  });
  if (!res.ok) throw new Error(`token ${res.status}`);
  const data = (await res.json()) as { access_token: string; expires_in?: number };
  // Refresh an hour early.
  cached = {
    token: data.access_token,
    expires: Date.now() + ((data.expires_in ?? 86400) - 3600) * 1000,
  };
  return cached.token;
}

async function gql<T>(env: Env, query: string, variables: Record<string, unknown>): Promise<T> {
  const res = await fetch(`https://${env.SHOPIFY_SHOP}/admin/api/${API_VERSION}/graphql.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': await adminToken(env),
    },
    body: JSON.stringify({ query, variables }),
  });
  if (!res.ok) throw new Error(`graphql ${res.status}`);
  const body = (await res.json()) as { data?: T; errors?: unknown };
  if (body.errors || !body.data) throw new Error(`graphql ${JSON.stringify(body.errors)}`);
  return body.data;
}

const consent = () => ({
  marketingState: 'SUBSCRIBED',
  marketingOptInLevel: 'SINGLE_OPT_IN',
  consentUpdatedAt: new Date().toISOString(),
});

async function subscribe(env: Env, email: string, source: string): Promise<void> {
  const found = await gql<{ customers: { nodes: { id: string; tags: string[] }[] } }>(
    env,
    `query($q: String!) { customers(first: 1, query: $q) { nodes { id tags } } }`,
    { q: `email:"${email.replace(/"/g, '')}"` },
  );
  const existing = found.customers.nodes[0];
  const tags = ['newsletter', `signup:${source}`];

  if (existing) {
    const r = await gql<{
      customerEmailMarketingConsentUpdate: { userErrors: { message: string }[] };
    }>(
      env,
      `mutation($input: CustomerEmailMarketingConsentUpdateInput!) {
        customerEmailMarketingConsentUpdate(input: $input) { userErrors { message } }
      }`,
      { input: { customerId: existing.id, emailMarketingConsent: consent() } },
    );
    const errs = r.customerEmailMarketingConsentUpdate.userErrors;
    if (errs.length) throw new Error(errs.map((e) => e.message).join('; '));
    await gql(
      env,
      `mutation($id: ID!, $tags: [String!]!) { tagsAdd(id: $id, tags: $tags) { userErrors { message } } }`,
      { id: existing.id, tags },
    );
    return;
  }

  const r = await gql<{ customerCreate: { userErrors: { message: string }[] } }>(
    env,
    `mutation($input: CustomerInput!) {
      customerCreate(input: $input) { userErrors { message } }
    }`,
    { input: { email, tags, emailMarketingConsent: consent() } },
  );
  const errs = r.customerCreate.userErrors;
  if (errs.length) throw new Error(errs.map((e) => e.message).join('; '));
}

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });

export const onRequestPost = async ({ request, env }: { request: Request; env: Env }) => {
  let data: Record<string, string>;
  try {
    const type = request.headers.get('content-type') ?? '';
    data = type.includes('application/json')
      ? await request.json()
      : (Object.fromEntries(await request.formData()) as Record<string, string>);
  } catch {
    return json({ ok: false, error: 'bad_request' }, 400);
  }

  // Honeypot: real people never see or fill this field. Pretend success.
  if (data.website) return json({ ok: true });

  const email = String(data.email ?? '').trim().toLowerCase();
  if (!EMAIL_RE.test(email) || email.length > 254) {
    return json({ ok: false, error: 'invalid_email' }, 400);
  }
  const source = String(data.source ?? 'site').replace(/[^a-z0-9-]/gi, '').slice(0, 32) || 'site';

  try {
    await subscribe(env, email, source);
    // Plain no-JS form post: bounce back to the page it came from.
    if (!(request.headers.get('accept') ?? '').includes('application/json')) {
      const back = new URL(request.headers.get('referer') ?? '/', request.url);
      const to = back.origin === new URL(request.url).origin ? back : new URL('/', request.url);
      to.hash = 'subscribed';
      return Response.redirect(to.toString(), 303);
    }
    return json({ ok: true });
  } catch (err) {
    console.error('subscribe failed', err);
    return json({ ok: false, error: 'server' }, 502);
  }
};
