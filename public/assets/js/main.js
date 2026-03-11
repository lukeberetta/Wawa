// Hero slideshow — add filenames here as you drop images into public/assets/img/
const heroImages = [
    'assets/img/surfers.jpg',
    'assets/img/storefront.jpg',
    'assets/img/boards.jpg',
    'assets/img/cafe.jpg',
    'assets/img/workshop.jpg',
    'assets/img/floor.jpg',
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
    const atBottom = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 80;
    if (window.scrollY > heroHeight * 0.15 && !atBottom) {
        fabWa.classList.add('visible');
    } else {
        fabWa.classList.remove('visible');
    }
});

// Hamburger menu
const menuBtn = document.querySelector('.nav-menu-btn');
const navDrawer = document.querySelector('.nav-drawer');
const navOverlay = document.querySelector('.nav-overlay');

function openMenu() {
    menuBtn.classList.add('open');
    menuBtn.setAttribute('aria-expanded', 'true');
    navDrawer.classList.add('open');
    navOverlay.classList.add('open');
    nav.classList.add('nav-open');
    document.body.style.overflow = 'hidden';
}

function closeMenu() {
    menuBtn.classList.remove('open');
    menuBtn.setAttribute('aria-expanded', 'false');
    navDrawer.classList.remove('open');
    navOverlay.classList.remove('open');
    nav.classList.remove('nav-open');
    document.body.style.overflow = '';
}

menuBtn.addEventListener('click', () => {
    navDrawer.classList.contains('open') ? closeMenu() : openMenu();
});

navOverlay.addEventListener('click', closeMenu);

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

document.getElementById('footer-year').textContent = new Date().getFullYear();

// Featured section — scroll nav
const featuredTrack = document.querySelector('.featured-track');
const featuredPrev = document.querySelector('.featured-nav-prev');
const featuredNext = document.querySelector('.featured-nav-next');

function updateFeaturedNav() {
    const { scrollLeft, scrollWidth, clientWidth } = featuredTrack;
    featuredPrev.hidden = scrollLeft <= 0;
    featuredNext.hidden = scrollLeft >= scrollWidth - clientWidth - 1;
}

featuredTrack.addEventListener('scroll', updateFeaturedNav, { passive: true });
updateFeaturedNav();

featuredPrev.addEventListener('click', () => {
    const cardWidth = featuredTrack.querySelector('.featured-card').offsetWidth;
    featuredTrack.scrollBy({ left: -cardWidth, behavior: 'smooth' });
});

featuredNext.addEventListener('click', () => {
    const cardWidth = featuredTrack.querySelector('.featured-card').offsetWidth;
    featuredTrack.scrollBy({ left: cardWidth, behavior: 'smooth' });
});

// Board modal
const boardModal = document.getElementById('boardModal');
const boardModalOverlay = boardModal.querySelector('.board-modal-overlay');
const boardModalClose = boardModal.querySelector('.board-modal-close');
const modalImgContainer = document.getElementById('modalImgContainer');
const modalImgFront = document.getElementById('modalImgFront');
const modalImgBack = document.getElementById('modalImgBack');
const modalDots = modalImgContainer.querySelectorAll('.modal-img-indicator span');
const modalType = document.getElementById('modalType');
const modalName = document.getElementById('modalName');
const modalDesc = document.getElementById('modalDesc');
const modalPrice = document.getElementById('modalPrice');
const modalWa = document.getElementById('modalWa');
const WA_BASE = 'https://api.whatsapp.com/send?phone=27823723142';

modalImgContainer.addEventListener('click', () => {
    const showingBack = modalImgContainer.classList.toggle('show-back');
    modalDots[0].classList.toggle('active', !showingBack);
    modalDots[1].classList.toggle('active', showingBack);
});

document.querySelectorAll('.featured-card').forEach(card => {
    card.addEventListener('click', () => {
        modalImgFront.src = card.dataset.img;
        modalImgFront.alt = card.dataset.name;
        modalImgBack.src = card.dataset.back;
        modalImgBack.alt = card.dataset.name;
        modalImgContainer.classList.remove('show-back');
        modalDots[0].classList.add('active');
        modalDots[1].classList.remove('active');
        modalType.textContent = card.dataset.type;
        modalName.textContent = card.dataset.name;
        modalDesc.textContent = card.dataset.desc;
        modalPrice.textContent = card.dataset.price;
        const msg = encodeURIComponent(`Hi, I'm interested in a ${card.dataset.name}. Can you tell me more?`);
        modalWa.href = `${WA_BASE}&text=${msg}`;
        boardModal.classList.add('open');
        document.body.style.overflow = 'hidden';
    });
});

function closeBoardModal() {
    boardModal.classList.remove('open');
    document.body.style.overflow = '';
}

boardModalOverlay.addEventListener('click', closeBoardModal);
boardModalClose.addEventListener('click', closeBoardModal);
document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && boardModal.classList.contains('open')) closeBoardModal();
});
