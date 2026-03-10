// Hero slideshow — add filenames here as you drop images into public/assets/img/
const heroImages = [
    'assets/img/surfers.jpeg',
    'assets/img/storefront.png',
    'assets/img/boards.png',
    'assets/img/cafe.png',
    'assets/img/workshop.png',
];

const DURATION = 5000;

const hero = document.getElementById('hero');
const heroGrid = hero.querySelector('.hero-grid');

// Create slides
heroImages.forEach((src, i) => {
    const div = document.createElement('div');
    div.className = 'hero-slide' + (i === 0 ? ' active' : '');
    div.style.backgroundImage = `url('${src}')`;
    hero.insertBefore(div, heroGrid);
});

// Create dot nav
const heroNav = document.createElement('div');
heroNav.className = 'hero-nav';
heroImages.forEach((_, i) => {
    const btn = document.createElement('button');
    btn.className = 'hero-dot' + (i === 0 ? ' active' : '');
    btn.setAttribute('aria-label', `Image ${i + 1}`);
    btn.innerHTML = '<span class="hero-dot-fill"></span>';
    btn.addEventListener('click', () => goTo(i));
    heroNav.appendChild(btn);
});
heroGrid.appendChild(heroNav);

const slides = hero.querySelectorAll('.hero-slide');
const dots = heroNav.querySelectorAll('.hero-dot');
let current = 0;
let timer;

function goTo(index) {
    slides[current].classList.remove('active');
    dots[current].classList.remove('active');
    current = index;
    // Reset Ken Burns so it always starts from fully zoomed in
    const slide = slides[current];
    slide.style.animation = 'none';
    slide.offsetWidth; // force reflow
    slide.style.animation = '';
    slide.classList.add('active');
    // Remove and re-add active to restart the fill animation
    const dot = dots[current];
    dot.classList.remove('active');
    dot.offsetWidth; // force reflow
    dot.classList.add('active');
    clearInterval(timer);
    timer = setInterval(() => goTo((current + 1) % slides.length), DURATION);
}

timer = setInterval(() => goTo((current + 1) % slides.length), DURATION);

// Instagram-style tap to navigate
hero.addEventListener('click', (e) => {
    if (e.target.closest('a, button')) return;
    const rect = hero.getBoundingClientRect();
    if (e.clientX < rect.left + rect.width / 2) {
        goTo((current - 1 + slides.length) % slides.length);
    } else {
        goTo((current + 1) % slides.length);
    }
});

const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
        if (e.isIntersecting) e.target.classList.add('visible');
    });
}, { threshold: 0.07, rootMargin: '0px 0px -30px 0px' });

document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

const nav = document.querySelector('nav');

// Track nav height so the slide-down drawer sits flush below it
function setNavHeight() {
    if (nav) {
        document.documentElement.style.setProperty('--nav-height', nav.offsetHeight + 'px');
    }
}
setNavHeight();
window.addEventListener('resize', setNavHeight);

const fabWa = document.querySelector('.fab-wa');
const heroHeight = document.querySelector('#hero')?.offsetHeight ?? window.innerHeight;

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }
    if (window.scrollY > heroHeight * 0.15) {
        fabWa.classList.add('visible');
    } else {
        fabWa.classList.remove('visible');
    }
});

// Hamburger menu
const menuBtn = document.querySelector('.nav-menu-btn');
const navDrawer = document.querySelector('.nav-drawer');

function openMenu() {
    menuBtn.classList.add('open');
    menuBtn.setAttribute('aria-expanded', 'true');
    navDrawer.classList.add('open');
    nav.classList.add('nav-open');
    document.body.style.overflow = 'hidden';
}

function closeMenu() {
    menuBtn.classList.remove('open');
    menuBtn.setAttribute('aria-expanded', 'false');
    navDrawer.classList.remove('open');
    nav.classList.remove('nav-open');
    document.body.style.overflow = '';
}

menuBtn.addEventListener('click', () => {
    navDrawer.classList.contains('open') ? closeMenu() : openMenu();
});

navDrawer.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', closeMenu);
});

document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeMenu();
});

// Active section tracking for sidebar
const sections = document.querySelectorAll('section[id]');
const sidebarLinks = navDrawer.querySelectorAll('.nav-drawer-nav a');

function updateActiveSection() {
    let current = '';
    sections.forEach(section => {
        if (section.getBoundingClientRect().top <= window.innerHeight / 2) {
            current = section.id;
        }
    });
    sidebarLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
    });
}

window.addEventListener('scroll', updateActiveSection, { passive: true });
updateActiveSection();
