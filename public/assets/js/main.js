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

const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
        if (e.isIntersecting) e.target.classList.add('visible');
    });
}, { threshold: 0.07, rootMargin: '0px 0px -30px 0px' });

document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

const nav = document.querySelector('nav');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
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
    document.body.style.overflow = 'hidden';
}

function closeMenu() {
    menuBtn.classList.remove('open');
    menuBtn.setAttribute('aria-expanded', 'false');
    navDrawer.classList.remove('open');
    navOverlay.classList.remove('open');
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
