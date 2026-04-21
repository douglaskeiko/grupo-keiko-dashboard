document.addEventListener('DOMContentLoaded', () => {

    // --- LENIS SMOOTH SCROLL ---
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: 'vertical',
        gestureDirection: 'vertical',
        smooth: true,
        mouseMultiplier: 1,
        smoothTouch: false,
        touchMultiplier: 2,
        infinite: false,
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Synchronize Lenis with Anchor Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            lenis.scrollTo(this.getAttribute('href'));
        });
    });

    // --- VSL PLAY ---
    const playBtn = document.getElementById('playBtn');
    const vslPlaceholder = document.getElementById('vslPlaceholder');
    const vslFrame = document.getElementById('vslFrame');

    if (playBtn && vslPlaceholder) {
        playBtn.addEventListener('click', () => {
            const videoUrl = 'https://www.youtube.com/embed/55ygA5LELLI?autoplay=1&rel=0&modestbranding=1&showinfo=0';
            vslPlaceholder.style.display = 'none';
            vslFrame.src = videoUrl;
            vslFrame.style.display = 'block';
        });
    }

    // --- INTERSECTION OBSERVER FOR ANIMATIONS ---
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -40px 0px',
        threshold: 0.1
    };

    const animateOnScroll = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-visible');
                animateOnScroll.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all major sections and cards
    const selectors = [
        '.feediz-card', '.module-big-card', '.bonus-card', 
        '.objection-card', '.target-item', '.faq-item',
        '.section-header', '.vsl-wrapper', '.offer-layout',
        '.guarantee-box', '.about-layout', '.final-cta h2',
        '.final-text', '.final-question', '.netflix-card'
    ];
    
    selectors.forEach(selector => {
        document.querySelectorAll(selector).forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            animateOnScroll.observe(el);
        });
    });

    // Add visible class handler
    document.head.insertAdjacentHTML('beforeend', `
        <style>
            .animate-visible {
                opacity: 1 !important;
                transform: translateY(0) !important;
            }
        </style>
    `);

    // Stagger animation delays for grid items
    const staggerGroups = [
        { selector: '.feediz-card', delay: 120 },
        { selector: '.module-big-card', delay: 100 },
        { selector: '.bonus-card', delay: 150 },
        { selector: '.objection-card', delay: 100 },
        { selector: '.target-item', delay: 80 },
        { selector: '.faq-item', delay: 80 },
        { selector: '.netflix-card', delay: 150 }
    ];

    staggerGroups.forEach(group => {
        document.querySelectorAll(group.selector).forEach((el, i) => {
            el.style.transitionDelay = `${i * group.delay}ms`;
        });
    });

});

// --- FAQ TOGGLE ---
function toggleFaq(button) {
    const item = button.closest('.faq-item');
    const isActive = item.classList.contains('active');
    
    document.querySelectorAll('.faq-item').forEach(i => {
        i.classList.remove('active');
    });
    
    if (!isActive) {
        item.classList.add('active');
    }
}

// --- FEEDIZ CAROUSEL ---
function scrollCarousel(direction) {
    const carousel = document.getElementById('proofCarousel');
    if (carousel) {
        const scrollAmount = 380;
        carousel.scrollBy({ left: direction * scrollAmount, behavior: 'smooth' });
    }
}

// Drag-to-scroll for carousel
(function() {
    const carousel = document.getElementById('proofCarousel');
    if (!carousel) return;
    let isDown = false;
    let startX;
    let scrollLeft;

    carousel.addEventListener('mousedown', (e) => {
        isDown = true;
        startX = e.pageX - carousel.offsetLeft;
        scrollLeft = carousel.scrollLeft;
    });
    carousel.addEventListener('mouseleave', () => { isDown = false; });
    carousel.addEventListener('mouseup', () => { isDown = false; });
    carousel.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - carousel.offsetLeft;
        const walk = (x - startX) * 1.5;
        carousel.scrollLeft = scrollLeft - walk;
    });
})();

// --- VIDEO CONTROLS ---
function toggleVideo(btn) {
    const video = btn.closest('.feediz-media-video').querySelector('video');
    if (!video) return;
    if (video.paused) {
        video.play();
        btn.textContent = '❚❚';
    } else {
        video.pause();
        btn.textContent = '▶';
    }
}

function toggleSound(btn) {
    const video = btn.closest('.feediz-media-video').querySelector('video');
    if (!video) return;
    video.muted = !video.muted;
    btn.textContent = video.muted ? '🔇' : '🔊';
}
