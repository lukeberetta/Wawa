// Hero slideshow — add filenames here as you drop images into public/img/
const heroImages = [
    'public/img/storefront.png',
    'public/img/surfers.jpeg',
    'public/img/workshop.png',
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
    slides[current].classList.add('active');
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
