// ===== Pride34 Components Collection - JavaScript with GSAP =====

document.addEventListener('DOMContentLoaded', function() {
    initThemeToggle();
    initSmoothScroll();
    initGSAPAnimations();
    init3DTilt();
    initAnimatedTitles();
    initModals();
    initSidebar();
    initExpandingCards();
    initFlipCards();
    initParallaxTiltedCards();
    initSlideRevealCards();
});

// Theme Toggle
function initThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    const body = document.body;
    const themeIcon = themeToggle.querySelector('.theme-icon');

    // Load saved theme from localStorage
    const savedTheme = localStorage.getItem('pride34-theme');
    if (savedTheme === 'dark') {
        body.classList.add('dark-theme');
        themeIcon.textContent = '☀️';
    } else {
        themeIcon.textContent = '🌙';
    }

    // Toggle theme on button click
    themeToggle.addEventListener('click', function() {
        body.classList.toggle('dark-theme');

        // Update icon and save preference
        if (body.classList.contains('dark-theme')) {
            themeIcon.textContent = '☀️';
            localStorage.setItem('pride34-theme', 'dark');
        } else {
            themeIcon.textContent = '🌙';
            localStorage.setItem('pride34-theme', 'light');
        }
    });
}

// Smooth Scroll
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;

            e.preventDefault();

            const target = document.querySelector(href);
            if (target) {
                const headerOffset = 140;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// GSAP Animations
function initGSAPAnimations() {
    // Регистрируем ScrollTrigger плагин
    gsap.registerPlugin(ScrollTrigger);

    // ===== HEADER ANIMATION =====
    gsap.from('.cc-header', {
        y: -100,
        opacity: 0,
        duration: 1,
        ease: 'power3.out'
    });

    // ===== NAVIGATION ANIMATION =====
    gsap.from('.cc-nav a', {
        y: -20,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power2.out',
        delay: 0.3
    });

    // ===== HERO SECTIONS ANIMATIONS =====

    // Hero 1 - Gradient with shapes
    gsap.from('.hero-1 .hero-content h1', {
        scrollTrigger: {
            trigger: '.hero-1',
            start: 'top 80%'
        },
        y: 50,
        opacity: 0,
        duration: 1,
        ease: 'power3.out'
    });

    gsap.from('.hero-1 .hero-content p', {
        scrollTrigger: {
            trigger: '.hero-1',
            start: 'top 80%'
        },
        y: 30,
        opacity: 0,
        duration: 0.8,
        delay: 0.2,
        ease: 'power2.out'
    });

    gsap.from('.hero-1 .btn', {
        scrollTrigger: {
            trigger: '.hero-1',
            start: 'top 80%'
        },
        scale: 0,
        opacity: 0,
        duration: 0.5,
        stagger: 0.1,
        delay: 0.4,
        ease: 'back.out(1.7)'
    });

    // Анимация фоновых форм
    gsap.to('.hero-1 .shape-1', {
        y: 30,
        x: 20,
        rotation: 15,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
    });

    gsap.to('.hero-1 .shape-2', {
        y: -40,
        x: -30,
        rotation: -20,
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
    });

    gsap.to('.hero-1 .shape-3', {
        y: 20,
        x: -15,
        rotation: 10,
        duration: 3.5,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
    });

    // Hero 2 - Split screen
    gsap.from('.hero-2 .hero-left', {
        scrollTrigger: {
            trigger: '.hero-2',
            start: 'top 70%'
        },
        x: -100,
        opacity: 0,
        duration: 1,
        ease: 'power3.out'
    });

    gsap.from('.hero-2 .hero-right', {
        scrollTrigger: {
            trigger: '.hero-2',
            start: 'top 70%'
        },
        x: 100,
        opacity: 0,
        duration: 1,
        ease: 'power3.out'
    });

    // Hero 3 - Stats
    gsap.from('.hero-3 h1', {
        scrollTrigger: {
            trigger: '.hero-3',
            start: 'top 70%'
        },
        scale: 0.5,
        opacity: 0,
        duration: 0.8,
        ease: 'back.out(1.7)'
    });

    gsap.from('.hero-3 .stat-box', {
        scrollTrigger: {
            trigger: '.hero-3',
            start: 'top 70%'
        },
        y: 50,
        opacity: 0,
        duration: 0.6,
        stagger: 0.15,
        delay: 0.3,
        ease: 'power2.out'
    });

    // Анимация чисел в статистике
    document.querySelectorAll('.hero-3 .stat-number').forEach(stat => {
        const finalValue = stat.textContent;
        const isPlus = finalValue.includes('+');
        const numValue = parseInt(finalValue.replace('+', ''));

        ScrollTrigger.create({
            trigger: stat,
            start: 'top 80%',
            onEnter: () => {
                gsap.from(stat, {
                    textContent: 0,
                    duration: 2,
                    ease: 'power1.out',
                    snap: { textContent: 1 },
                    onUpdate: function() {
                        stat.textContent = Math.ceil(this.targets()[0].textContent) + (isPlus ? '+' : '');
                    }
                });
            }
        });
    });

    // ===== CARDS ANIMATIONS =====

    // Card Style 1 - Hover lift
    gsap.utils.toArray('.card-style-1').forEach((card, i) => {
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: 'top 85%'
            },
            y: 60,
            opacity: 0,
            duration: 0.6,
            delay: i * 0.1,
            ease: 'power2.out'
        });
    });

    // Card Style 2 - Image cards
    gsap.utils.toArray('.card-style-2').forEach((card, i) => {
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: 'top 85%'
            },
            scale: 0.8,
            opacity: 0,
            duration: 0.5,
            delay: i * 0.15,
            ease: 'back.out(1.7)'
        });
    });

    // Card Style 3 - Flip cards
    gsap.utils.toArray('.card-flip').forEach((card, i) => {
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: 'top 85%'
            },
            rotationY: 180,
            opacity: 0,
            duration: 0.8,
            delay: i * 0.1,
            ease: 'power2.out'
        });
    });

    // Card Style 4 - Gradient border
    gsap.utils.toArray('.card-gradient').forEach((card, i) => {
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: 'top 85%'
            },
            y: 80,
            opacity: 0,
            duration: 0.7,
            delay: i * 0.2,
            ease: 'power3.out'
        });

        // Пульсация для featured карточки
        if (card.classList.contains('card-gradient-featured')) {
            gsap.to(card, {
                boxShadow: '0 10px 40px rgba(189, 157, 93, 0.3)',
                duration: 1.5,
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut'
            });
        }
    });

    // Card Style 5 - Horizontal cards
    gsap.utils.toArray('.card-horizontal').forEach((card, i) => {
        const direction = i % 2 === 0 ? -100 : 100;
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: 'top 85%'
            },
            x: direction,
            opacity: 0,
            duration: 0.8,
            ease: 'power2.out'
        });
    });

    // ===== FEATURES ANIMATIONS =====

    // Feature boxes
    gsap.utils.toArray('.feature-box').forEach((box, i) => {
        gsap.from(box, {
            scrollTrigger: {
                trigger: box,
                start: 'top 85%'
            },
            y: 50,
            opacity: 0,
            duration: 0.6,
            delay: i * 0.1,
            ease: 'power2.out'
        });

        // Анимация иконки при наведении
        box.addEventListener('mouseenter', () => {
            gsap.to(box.querySelector('.feature-icon'), {
                scale: 1.2,
                rotation: 10,
                duration: 0.3,
                ease: 'back.out(1.7)'
            });
        });

        box.addEventListener('mouseleave', () => {
            gsap.to(box.querySelector('.feature-icon'), {
                scale: 1,
                rotation: 0,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
    });

    // Feature rows (alternating)
    gsap.utils.toArray('.feature-row').forEach((row, i) => {
        const content = row.querySelector('.feature-content');
        const visual = row.querySelector('.feature-visual');
        const isReverse = row.classList.contains('feature-row-reverse');

        gsap.from(content, {
            scrollTrigger: {
                trigger: row,
                start: 'top 75%'
            },
            x: isReverse ? 100 : -100,
            opacity: 0,
            duration: 1,
            ease: 'power3.out'
        });

        gsap.from(visual, {
            scrollTrigger: {
                trigger: row,
                start: 'top 75%'
            },
            x: isReverse ? -100 : 100,
            opacity: 0,
            duration: 1,
            ease: 'power3.out'
        });
    });

    // ===== PRICING ANIMATIONS =====

    gsap.utils.toArray('.pricing-card, .pricing-card-2').forEach((card, i) => {
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: 'top 80%'
            },
            y: 80,
            opacity: 0,
            duration: 0.7,
            delay: i * 0.15,
            ease: 'power2.out'
        });

        // Выделение featured карточки
        if (card.classList.contains('pricing-featured') || card.classList.contains('pricing-highlight')) {
            gsap.from(card, {
                scrollTrigger: {
                    trigger: card,
                    start: 'top 80%'
                },
                scale: 0.9,
                duration: 0.5,
                delay: 0.3,
                ease: 'back.out(1.7)'
            });
        }
    });

    // ===== TEAM ANIMATIONS =====

    // Team cards with overlay
    gsap.utils.toArray('.team-card').forEach((card, i) => {
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: 'top 85%'
            },
            y: 60,
            opacity: 0,
            duration: 0.6,
            delay: i * 0.1,
            ease: 'power2.out'
        });
    });

    // Team horizontal cards
    gsap.utils.toArray('.team-horizontal').forEach((card, i) => {
        const direction = i % 2 === 0 ? -80 : 80;
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: 'top 85%'
            },
            x: direction,
            opacity: 0,
            duration: 0.8,
            ease: 'power3.out'
        });
    });

    // ===== TESTIMONIALS ANIMATIONS =====

    gsap.utils.toArray('.testimonial-card').forEach((card, i) => {
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: 'top 85%'
            },
            scale: 0.9,
            opacity: 0,
            duration: 0.6,
            delay: i * 0.15,
            ease: 'back.out(1.7)'
        });

        // Анимация звезд
        gsap.from(card.querySelector('.testimonial-stars'), {
            scrollTrigger: {
                trigger: card,
                start: 'top 85%'
            },
            scale: 0,
            rotation: 360,
            duration: 0.8,
            delay: 0.2,
            ease: 'back.out(2)'
        });
    });

    // Featured testimonial
    const featuredTest = document.querySelector('.testimonial-featured');
    if (featuredTest) {
        gsap.from(featuredTest.querySelector('.testimonial-f-content'), {
            scrollTrigger: {
                trigger: featuredTest,
                start: 'top 75%'
            },
            x: -100,
            opacity: 0,
            duration: 1,
            ease: 'power3.out'
        });

        gsap.from(featuredTest.querySelector('.testimonial-f-image'), {
            scrollTrigger: {
                trigger: featuredTest,
                start: 'top 75%'
            },
            x: 100,
            opacity: 0,
            duration: 1,
            ease: 'power3.out'
        });
    }

    // ===== CTA ANIMATIONS =====

    gsap.utils.toArray('.cta').forEach((cta, i) => {
        gsap.from(cta, {
            scrollTrigger: {
                trigger: cta,
                start: 'top 80%'
            },
            scale: 0.95,
            opacity: 0,
            duration: 0.8,
            ease: 'power2.out'
        });

        const btn = cta.querySelector('.btn');
        if (btn) {
            gsap.from(btn, {
                scrollTrigger: {
                    trigger: cta,
                    start: 'top 80%'
                },
                scale: 0,
                duration: 0.5,
                delay: 0.3,
                ease: 'back.out(1.7)'
            });

            // Пульсация кнопки
            gsap.to(btn, {
                scale: 1.05,
                duration: 1.5,
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut'
            });
        }
    });

    // ===== STATS ANIMATIONS =====

    // Stats grid
    gsap.utils.toArray('.stats .stat-box, .stats .stat-item').forEach((stat, i) => {
        gsap.from(stat, {
            scrollTrigger: {
                trigger: stat,
                start: 'top 85%'
            },
            y: 50,
            opacity: 0,
            duration: 0.6,
            delay: i * 0.1,
            ease: 'power2.out'
        });
    });

    // Анимация чисел в статистике
    document.querySelectorAll('.stat-number, .stat-value').forEach(stat => {
        ScrollTrigger.create({
            trigger: stat,
            start: 'top 85%',
            onEnter: () => {
                const finalValue = stat.textContent;
                const hasPlus = finalValue.includes('+');
                const hasK = finalValue.includes('к');
                const hasSlash = finalValue.includes('/');

                if (!hasSlash) {
                    const numValue = parseInt(finalValue.replace(/[^\d]/g, ''));

                    gsap.from(stat, {
                        textContent: 0,
                        duration: 2,
                        ease: 'power1.out',
                        snap: { textContent: 1 },
                        onUpdate: function() {
                            let current = Math.ceil(this.targets()[0].textContent);
                            stat.textContent = current + (hasPlus ? '+' : '') + (hasK ? 'к+' : '');
                        }
                    });
                }
            }
        });
    });

    // Progress bars animation
    gsap.utils.toArray('.stat-progress-fill').forEach(bar => {
        const width = bar.style.width;
        bar.style.width = '0%';

        gsap.to(bar, {
            scrollTrigger: {
                trigger: bar,
                start: 'top 85%'
            },
            width: width,
            duration: 1.5,
            ease: 'power2.out'
        });
    });

    // ===== SECTION TITLES ANIMATION =====

    gsap.utils.toArray('.section-title').forEach(title => {
        gsap.from(title, {
            scrollTrigger: {
                trigger: title,
                start: 'top 85%'
            },
            y: 30,
            opacity: 0,
            duration: 0.8,
            ease: 'power2.out'
        });
    });

    // ===== PARALLAX EFFECTS =====

    // Параллакс для hero секций с фоном
    gsap.utils.toArray('.hero-5, .hero-6').forEach(hero => {
        gsap.to(hero, {
            scrollTrigger: {
                trigger: hero,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 1
            },
            backgroundPosition: '50% 100%',
            ease: 'none'
        });
    });

    // ===== BUTTON HOVER ANIMATIONS =====

    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('mouseenter', () => {
            gsap.to(btn, {
                scale: 1.05,
                duration: 0.3,
                ease: 'back.out(1.7)'
            });
        });

        btn.addEventListener('mouseleave', () => {
            gsap.to(btn, {
                scale: 1,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
    });

    // ===== FLIP CARDS ANIMATIONS =====

    gsap.utils.toArray('.flip-card-interactive').forEach((card, i) => {
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: 'top 85%'
            },
            y: 80,
            opacity: 0,
            rotationY: -15,
            duration: 0.8,
            delay: i * 0.2,
            ease: 'power3.out'
        });
    });

    // ===== PARALLAX TILTED CARDS ANIMATIONS =====

    gsap.utils.toArray('.parallax-card-wrapper').forEach((card, i) => {
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: 'top 85%'
            },
            y: 60,
            opacity: 0,
            scale: 0.9,
            duration: 0.8,
            delay: i * 0.15,
            ease: 'power2.out'
        });
    });

    // ===== SLIDE REVEAL CARDS ANIMATIONS =====

    gsap.utils.toArray('.slide-card').forEach((card, i) => {
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: 'top 85%'
            },
            y: 70,
            opacity: 0,
            duration: 0.7,
            delay: i * 0.2,
            ease: 'power3.out'
        });

        // Анимация появления фигур
        const shapes = card.querySelectorAll('.slide-shape');
        shapes.forEach((shape, j) => {
            gsap.from(shape, {
                scrollTrigger: {
                    trigger: card,
                    start: 'top 85%'
                },
                scale: 0,
                opacity: 0,
                duration: 1,
                delay: 0.3 + (j * 0.1),
                ease: 'back.out(1.7)'
            });
        });
    });

    // ===== SECTION REVEAL =====

    gsap.utils.toArray('.cc-section').forEach(section => {
        gsap.from(section, {
            scrollTrigger: {
                trigger: section,
                start: 'top 90%',
                toggleActions: 'play none none reverse'
            },
            opacity: 0,
            duration: 0.5,
            ease: 'power1.out'
        });
    });

    console.log('%c GSAP Animations Initialized! ', 'background: #bd9d5d; color: #fff; font-weight: bold; padding: 8px;');
}

console.log('%c Pride34 Components Loaded! ', 'background: #bd9d5d; color: #fff; font-weight: bold; padding: 8px;');

// ===== 3D TILT FUNCTIONALITY =====
function init3DTilt() {
    // Vanilla Tilt for standard tilt cards
    const tiltCards = document.querySelectorAll('[data-tilt]');

    tiltCards.forEach(card => {
        card.addEventListener('mousemove', handleTilt);
        card.addEventListener('mouseleave', resetTilt);
    });

    function handleTilt(e) {
        const card = e.currentTarget;
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;

        gsap.to(card, {
            duration: 0.3,
            rotationX: rotateX,
            rotationY: rotateY,
            transformPerspective: 1000,
            ease: 'power1.out'
        });

        // Shine effect position
        const shine = card.querySelector('.tilt-shine');
        if (shine) {
            const shineX = (x / rect.width) * 100;
            const shineY = (y / rect.height) * 100;
            shine.style.background = `radial-gradient(circle at ${shineX}% ${shineY}%, rgba(255,255,255,0.3), transparent)`;
        }
    }

    function resetTilt(e) {
        const card = e.currentTarget;
        gsap.to(card, {
            duration: 0.5,
            rotationX: 0,
            rotationY: 0,
            ease: 'power2.out'
        });
    }

    // Deep tilt with parallax layers
    const deepTiltCards = document.querySelectorAll('[data-tilt-deep]');

    deepTiltCards.forEach(card => {
        card.addEventListener('mousemove', handleDeepTilt);
        card.addEventListener('mouseleave', resetDeepTilt);
    });

    function handleDeepTilt(e) {
        const card = e.currentTarget;
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = (y - centerY) / 8;
        const rotateY = (centerX - x) / 8;

        // Tilt the card
        gsap.to(card, {
            duration: 0.3,
            rotationX: rotateX,
            rotationY: rotateY,
            transformPerspective: 1000,
            ease: 'power1.out'
        });

        // Parallax layers
        const layers = card.querySelectorAll('.tilt-layer');
        layers.forEach((layer, index) => {
            const depth = parseFloat(layer.getAttribute('data-depth')) || 0.1;
            const moveX = (x - centerX) * depth;
            const moveY = (y - centerY) * depth;

            gsap.to(layer, {
                duration: 0.3,
                x: moveX,
                y: moveY,
                ease: 'power1.out'
            });
        });
    }

    function resetDeepTilt(e) {
        const card = e.currentTarget;
        const layers = card.querySelectorAll('.tilt-layer');

        gsap.to(card, {
            duration: 0.5,
            rotationX: 0,
            rotationY: 0,
            ease: 'power2.out'
        });

        layers.forEach(layer => {
            gsap.to(layer, {
                duration: 0.5,
                x: 0,
                y: 0,
                ease: 'power2.out'
            });
        });
    }

    console.log('%c 3D Tilt Initialized! ', 'background: #4ecdc4; color: #fff; font-weight: bold; padding: 8px;');
}

// ===== ANIMATED TITLES FUNCTIONALITY =====
function initAnimatedTitles() {
    // Split Text Animation
    const splitTitles = document.querySelectorAll('[data-animation="split"]');
    splitTitles.forEach(title => {
        const text = title.textContent;
        title.innerHTML = '';

        text.split('').forEach((char, index) => {
            const span = document.createElement('span');
            span.textContent = char === ' ' ? '\u00A0' : char;
            span.style.display = 'inline-block';
            title.appendChild(span);

            gsap.from(span, {
                scrollTrigger: {
                    trigger: title,
                    start: 'top 80%'
                },
                y: 100,
                opacity: 0,
                rotation: 20,
                duration: 0.8,
                delay: index * 0.03,
                ease: 'back.out(1.7)'
            });
        });
    });

    // Typewriter Animation
    const typewriterTitles = document.querySelectorAll('[data-animation="typewriter"]');
    typewriterTitles.forEach(title => {
        const textElement = title.querySelector('.typewriter-text');
        const words = ['Тренируйтесь Эффективно', 'Достигайте Целей', 'Будьте Лучшей Версией Себя'];
        let wordIndex = 0;
        let charIndex = 0;
        let isDeleting = false;

        function type() {
            const currentWord = words[wordIndex];

            if (isDeleting) {
                textElement.textContent = currentWord.substring(0, charIndex - 1);
                charIndex--;
            } else {
                textElement.textContent = currentWord.substring(0, charIndex + 1);
                charIndex++;
            }

            if (!isDeleting && charIndex === currentWord.length) {
                isDeleting = true;
                setTimeout(type, 2000);
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                wordIndex = (wordIndex + 1) % words.length;
                setTimeout(type, 500);
            } else {
                setTimeout(type, isDeleting ? 50 : 100);
            }
        }

        ScrollTrigger.create({
            trigger: title,
            start: 'top 80%',
            onEnter: () => type()
        });
    });

    // Rotating Words
    const rotatingTitles = document.querySelectorAll('[data-animation="rotate"]');
    rotatingTitles.forEach(title => {
        const words = title.querySelectorAll('.rotate-word');
        let currentIndex = 0;

        words.forEach((word, index) => {
            if (index !== 0) {
                gsap.set(word, { position: 'absolute', opacity: 0 });
            }
        });

        function rotateWords() {
            const current = words[currentIndex];
            const next = words[(currentIndex + 1) % words.length];

            gsap.to(current, {
                opacity: 0,
                rotationX: 90,
                duration: 0.5,
                onComplete: () => {
                    gsap.set(current, { position: 'absolute' });
                }
            });

            gsap.set(next, { position: 'relative' });
            gsap.fromTo(next, {
                opacity: 0,
                rotationX: -90
            }, {
                opacity: 1,
                rotationX: 0,
                duration: 0.5
            });

            currentIndex = (currentIndex + 1) % words.length;
        }

        setInterval(rotateWords, 3000);
    });

    // Reveal Animation
    const revealTitles = document.querySelectorAll('[data-animation="reveal"]');
    revealTitles.forEach(title => {
        const block = title.querySelector('.reveal-block');

        gsap.from(block, {
            scrollTrigger: {
                trigger: title,
                start: 'top 80%'
            },
            width: '100%',
            duration: 1.5,
            ease: 'power4.inOut'
        });

        gsap.to(block, {
            scrollTrigger: {
                trigger: title,
                start: 'top 80%'
            },
            left: '100%',
            duration: 1.5,
            delay: 1.5,
            ease: 'power4.inOut'
        });
    });

    console.log('%c Animated Titles Initialized! ', 'background: #ff6b6b; color: #fff; font-weight: bold; padding: 8px;');
}

// ===== MODALS FUNCTIONALITY =====
function initModals() {
    const modalButtons = document.querySelectorAll('[data-modal]');
    const modals = document.querySelectorAll('.modal-overlay');
    const closeButtons = document.querySelectorAll('.modal-close');

    // Modal animation configurations
    const animations = {
        'modal-fade': {
            open: { opacity: 0, scale: 1 },
            animate: { opacity: 1, scale: 1, duration: 0.3 }
        },
        'modal-slide-up': {
            open: { y: '100%' },
            animate: { y: 0, duration: 0.5, ease: 'power3.out' }
        },
        'modal-slide-left': {
            open: { x: '100%' },
            animate: { x: 0, duration: 0.5, ease: 'power3.out' }
        },
        'modal-scale': {
            open: { scale: 0 },
            animate: { scale: 1, duration: 0.5, ease: 'back.out(1.7)' }
        },
        'modal-rotate': {
            open: { rotationX: -90, opacity: 0 },
            animate: { rotationX: 0, opacity: 1, duration: 0.6, ease: 'power3.out' }
        },
        'modal-flip': {
            open: { rotationY: 180, opacity: 0 },
            animate: { rotationY: 0, opacity: 1, duration: 0.7, ease: 'power3.out' }
        },
        'modal-split': {
            open: { scaleX: 0, scaleY: 1.5 },
            animate: { scaleX: 1, scaleY: 1, duration: 0.6, ease: 'power4.out' }
        },
        'modal-zoom': {
            open: { scale: 2, opacity: 0, filter: 'blur(20px)' },
            animate: { scale: 1, opacity: 1, filter: 'blur(0px)', duration: 0.7, ease: 'power3.out' }
        }
    };

    modalButtons.forEach(button => {
        button.addEventListener('click', () => {
            const modalId = button.getAttribute('data-modal');
            const modal = document.getElementById(modalId);
            const modalContent = modal.querySelector('.modal-content');
            const animation = animations[modalId];

            if (modal && animation) {
                modal.classList.add('active');

                // Set initial state
                gsap.set(modalContent, animation.open);

                // Animate in
                gsap.to(modalContent, animation.animate);
            }
        });
    });

    function closeModal(modal) {
        const modalContent = modal.querySelector('.modal-content');
        const modalId = modal.id;
        const animation = animations[modalId];

        if (animation) {
            // Animate out
            gsap.to(modalContent, {
                ...animation.open,
                duration: 0.3,
                onComplete: () => {
                    modal.classList.remove('active');
                }
            });
        }
    }

    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            const modal = button.closest('.modal-overlay');
            closeModal(modal);
        });
    });

    modals.forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal(modal);
            }
        });
    });

    // Close modal on ESC key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const activeModal = document.querySelector('.modal-overlay.active');
            if (activeModal) {
                closeModal(activeModal);
            }
        }
    });

    console.log('%c Modals Initialized! ', 'background: #9b59b6; color: #fff; font-weight: bold; padding: 8px;');
}

// ===== SIDEBAR & ACCORDION FUNCTIONALITY =====
function initSidebar() {
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebar = document.getElementById('sidebarRight');
    const sidebarClose = document.getElementById('sidebarClose');
    const accordionHeaders = document.querySelectorAll('.accordion-header');

    // Sidebar toggle
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', () => {
            sidebar.classList.add('active');
            gsap.from(sidebar, {
                x: 400,
                duration: 0.4,
                ease: 'power3.out'
            });
        });
    }

    if (sidebarClose) {
        sidebarClose.addEventListener('click', closeSidebar);
    }

    // Close sidebar on overlay click
    sidebar.addEventListener('click', (e) => {
        if (e.target === sidebar) {
            closeSidebar();
        }
    });

    function closeSidebar() {
        gsap.to(sidebar, {
            x: 400,
            duration: 0.3,
            ease: 'power2.in',
            onComplete: () => {
                sidebar.classList.remove('active');
            }
        });
    }

    // Accordion functionality
    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const accordionItem = header.closest('.accordion-item');
            const content = accordionItem.querySelector('.accordion-content');
            const isActive = accordionItem.classList.contains('active');

            // Close all other accordions
            document.querySelectorAll('.accordion-item').forEach(item => {
                if (item !== accordionItem && item.classList.contains('active')) {
                    item.classList.remove('active');
                    const otherContent = item.querySelector('.accordion-content');
                    gsap.to(otherContent, {
                        maxHeight: 0,
                        duration: 0.3,
                        ease: 'power2.inOut'
                    });
                }
            });

            // Toggle current accordion
            if (isActive) {
                accordionItem.classList.remove('active');
                gsap.to(content, {
                    maxHeight: 0,
                    duration: 0.3,
                    ease: 'power2.inOut'
                });
            } else {
                accordionItem.classList.add('active');
                gsap.to(content, {
                    maxHeight: content.scrollHeight + 50,
                    duration: 0.4,
                    ease: 'power2.out'
                });
            }
        });
    });

    // Close sidebar on ESC key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && sidebar.classList.contains('active')) {
            closeSidebar();
        }
    });

    console.log('%c Sidebar & Accordion Initialized! ', 'background: #e74c3c; color: #fff; font-weight: bold; padding: 8px;');
}

// ===== EXPANDING CARDS FUNCTIONALITY =====
function initExpandingCards() {
    const expandingCards = document.querySelectorAll('.card-expanding');

    if (expandingCards.length === 0) return;

    // Set first card as active by default
    if (expandingCards[0]) {
        expandingCards[0].classList.add('active');
    }

    expandingCards.forEach(card => {
        card.addEventListener('click', () => {
            // Remove active class from all cards
            expandingCards.forEach(c => c.classList.remove('active'));

            // Add active class to clicked card
            card.classList.add('active');
        });
    });

    console.log('%c Expanding Cards Initialized! ', 'background: #3498db; color: #fff; font-weight: bold; padding: 8px;');
}

// ===== INTERACTIVE FLIP CARDS FUNCTIONALITY =====
function initFlipCards() {
    const flipCards = document.querySelectorAll('.flip-card-interactive');

    if (flipCards.length === 0) return;

    flipCards.forEach(card => {
        const cardInner = card.querySelector('.flip-card-inner');
        const flipButton = card.querySelector('.flip-card-button');
        const closeButton = card.querySelector('.flip-close-button');
        let isAnimating = false;

        // Функция переворота
        function flipCard(e) {
            // Предотвращаем всплытие события если клик был на кнопке
            if (e && e.target.closest('.flip-card-button, .flip-close-button')) {
                return;
            }

            if (!isAnimating) {
                isAnimating = true;
                card.classList.toggle('flipped');
                setTimeout(() => {
                    isAnimating = false;
                }, 700);
            }
        }

        // 3D Tilt эффект при движении мыши
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = (y - centerY) / 30;
            const rotateY = (centerX - x) / 30;

            // Применяем tilt только к самой карточке, не к inner
            gsap.to(card, {
                duration: 0.3,
                rotationX: rotateX,
                rotationY: rotateY,
                transformPerspective: 1500,
                ease: 'power1.out'
            });
        });

        // Reset tilt при уходе мыши
        card.addEventListener('mouseleave', () => {
            gsap.to(card, {
                duration: 0.5,
                rotationX: 0,
                rotationY: 0,
                ease: 'power2.out'
            });
        });

        // Обработчики событий переворота
        if (flipButton) {
            flipButton.addEventListener('click', (e) => {
                e.stopPropagation();
                flipCard();
            });
        }

        if (closeButton) {
            closeButton.addEventListener('click', (e) => {
                e.stopPropagation();
                flipCard();
            });
        }

        // Клик по всей карточке (опционально)
        // Раскомментируйте, если хотите переворот по клику на любую часть карточки
        // card.addEventListener('click', flipCard);
    });

    console.log('%c Interactive Flip Cards Initialized! ', 'background: #f39c12; color: #fff; font-weight: bold; padding: 8px;');
}

// ===== 3D PARALLAX TILTED CARDS FUNCTIONALITY =====
function initParallaxTiltedCards() {
    const parallaxCards = document.querySelectorAll('.parallax-card-wrapper');

    if (parallaxCards.length === 0) return;

    parallaxCards.forEach(cardWrapper => {
        const headerBg = cardWrapper.querySelector('.parallax-header-bg');

        // Mouse move handler для 3D эффекта - только когда мышь над карточкой
        cardWrapper.addEventListener('mousemove', (e) => {
            const rect = cardWrapper.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = (y - centerY) / 20; // Уменьшил с 25 до 20 для более мягкого эффекта
            const rotateY = (centerX - x) / 20;

            // Применяем трансформацию к wrapper
            cardWrapper.style.transform = `rotateY(${rotateY}deg) rotateX(${rotateX}deg)`;

            // Параллакс эффект для фона
            if (headerBg) {
                const bgX = (x - centerX) / 30;
                const bgY = (y - centerY) / 30;
                headerBg.style.transform = `translateZ(-10px) translateX(${bgX}px) translateY(${bgY}px)`;
            }
        });

        // Reset при уходе мыши с карточки
        cardWrapper.addEventListener('mouseleave', () => {
            cardWrapper.style.transform = 'rotateY(-5deg) rotateX(5deg)';
            if (headerBg) {
                headerBg.style.transform = 'translateZ(-10px)';
            }
        });
    });

    console.log('%c Parallax Tilted Cards Initialized! ', 'background: #16a085; color: #fff; font-weight: bold; padding: 8px;');
}

// ===== SLIDE REVEAL CARDS FUNCTIONALITY =====
function initSlideRevealCards() {
    const slideCards = document.querySelectorAll('.slide-card');

    if (slideCards.length === 0) return;

    slideCards.forEach(card => {
        const cardImage = card.querySelector('.slide-card-image');

        // Добавляем параллакс эффект к изображению при движении мыши
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const xAxis = (rect.width / 2 - x) / 25;
            const yAxis = (rect.height / 2 - y) / 25;

            // Применяем параллакс только если карточка в состоянии hover
            if (cardImage) {
                gsap.to(cardImage, {
                    duration: 0.3,
                    x: xAxis,
                    y: -100 + yAxis,
                    ease: 'power1.out'
                });
            }
        });

        // Reset при уходе мыши
        card.addEventListener('mouseleave', () => {
            if (cardImage) {
                gsap.to(cardImage, {
                    duration: 0.5,
                    x: 0,
                    y: -100,
                    ease: 'power2.out'
                });
            }
        });
    });

    console.log('%c Slide Reveal Cards Initialized! ', 'background: #8e44ad; color: #fff; font-weight: bold; padding: 8px;');
}

// ===============================================
// FAQ ACCORDIONS FUNCTIONALITY
// ===============================================

document.addEventListener('DOMContentLoaded', function() {
    // Получаем все FAQ элементы
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            // Закрываем другие элементы в той же секции (опционально)
            const parentAccordion = item.closest('.faq-accordion, .faq-grid');
            const siblings = parentAccordion.querySelectorAll('.faq-item');
            
            // Закрываем все остальные элементы
            siblings.forEach(sibling => {
                if (sibling !== item && sibling.classList.contains('active')) {
                    sibling.classList.remove('active');
                }
            });
            
            // Переключаем текущий элемент
            item.classList.toggle('active');
        });
    });
    
    // GSAP анимация появления FAQ при скролле
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.utils.toArray('.faq-item').forEach((item, index) => {
            gsap.from(item, {
                scrollTrigger: {
                    trigger: item,
                    start: 'top 85%',
                    toggleActions: 'play none none reverse'
                },
                opacity: 0,
                y: 30,
                duration: 0.6,
                delay: index * 0.1,
                ease: 'power2.out'
            });
        });
    }
});

// ===============================================
// FAQ V6 & V8 TAB SWITCHING FUNCTIONALITY
// ===============================================

document.addEventListener('DOMContentLoaded', function() {
    // FAQ V6 - Табы с категориями (Getting started, Pricing, Sales)
    const v6Container = document.querySelector('#faq-v6');
    if (v6Container) {
        const v6Tabs = v6Container.querySelectorAll('.faq-tab');
        const v6Items = v6Container.querySelectorAll('.faq-item[data-category]');
        
        v6Tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const category = tab.getAttribute('data-category');
                
                // Убираем active у всех табов
                v6Tabs.forEach(t => t.classList.remove('active'));
                // Добавляем active к текущему табу
                tab.classList.add('active');
                
                // Скрываем все items, показываем только нужные
                v6Items.forEach(item => {
                    const itemCategory = item.getAttribute('data-category');
                    if (category === 'all' || itemCategory === category) {
                        item.style.display = 'block';
                        // Анимация появления
                        if (typeof gsap !== 'undefined') {
                            gsap.from(item, {
                                opacity: 0,
                                y: 20,
                                duration: 0.4,
                                ease: 'power2.out'
                            });
                        }
                    } else {
                        item.style.display = 'none';
                    }
                });
            });
        });
        
        // Инициализация - показываем все по умолчанию
        const defaultTab = v6Container.querySelector('.faq-tab[data-category="all"]');
        if (defaultTab) {
            defaultTab.click();
        }
    }
    
    // FAQ V8 - Premium с категориями (General, Account, Billing)
    const v8Container = document.querySelector('#faq-v8');
    if (v8Container) {
        const v8Tabs = v8Container.querySelectorAll('.faq-tab');
        const v8Items = v8Container.querySelectorAll('.faq-item[data-category]');
        
        v8Tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const category = tab.getAttribute('data-category');
                
                // Убираем active у всех табов
                v8Tabs.forEach(t => t.classList.remove('active'));
                // Добавляем active к текущему табу
                tab.classList.add('active');
                
                // Скрываем все items, показываем только нужные
                v8Items.forEach(item => {
                    const itemCategory = item.getAttribute('data-category');
                    if (category === 'all' || itemCategory === category) {
                        item.style.display = 'block';
                        // Анимация появления
                        if (typeof gsap !== 'undefined') {
                            gsap.from(item, {
                                opacity: 0,
                                y: 20,
                                duration: 0.4,
                                ease: 'power2.out'
                            });
                        }
                    } else {
                        item.style.display = 'none';
                    }
                });
            });
        });
        
        // Инициализация - показываем все по умолчанию
        const defaultTab = v8Container.querySelector('.faq-tab[data-category="all"]');
        if (defaultTab) {
            defaultTab.click();
        }
    }
    
    console.log('%c FAQ Tabs Initialized! ', 'background: #27ae60; color: #fff; font-weight: bold; padding: 8px;');
});

