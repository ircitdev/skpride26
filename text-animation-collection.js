/**
 * ================================================
 * Text Animation Collection - JavaScript
 * СК ПРАЙД 2026 - GSAP Text Animations
 * ================================================
 */

// Регистрация плагина ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// Инициализация при загрузке DOM
document.addEventListener('DOMContentLoaded', function() {
    initThemeToggle();
    initTextAnimations();
    initHeroAnimation();
    console.log('%c Text Animations Initialized! ', 'background: #c89b4f; color: #fff; font-weight: bold; padding: 8px;');
});

// ============================================
// Theme Toggle
// ============================================

function initThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    const body = document.body;
    const themeIcon = themeToggle.querySelector('.theme-icon');

    // Загружаем сохраненную тему
    const savedTheme = localStorage.getItem('text-anim-theme');
    if (savedTheme === 'dark') {
        body.classList.add('dark-theme');
        themeIcon.textContent = '☀️';
    }

    // Переключение темы
    themeToggle.addEventListener('click', function() {
        body.classList.toggle('dark-theme');

        if (body.classList.contains('dark-theme')) {
            themeIcon.textContent = '☀️';
            localStorage.setItem('text-anim-theme', 'dark');
        } else {
            themeIcon.textContent = '🌙';
            localStorage.setItem('text-anim-theme', 'light');
        }
    });
}

// ============================================
// Hero Animation
// ============================================

function initHeroAnimation() {
    const heroTitle = document.querySelector('.ta-hero-title');

    if (heroTitle) {
        // Split text на слова
        const split = new SplitType(heroTitle, { types: 'words' });

        // Анимация слов
        gsap.from(split.words, {
            opacity: 0,
            y: 100,
            rotateX: -90,
            stagger: 0.05,
            duration: 1,
            ease: 'power4.out'
        });
    }

    // Subtitle fade in
    gsap.from('.ta-hero-subtitle', {
        opacity: 0,
        y: 30,
        duration: 0.8,
        delay: 0.5,
        ease: 'power2.out'
    });
}

// ============================================
// Main Text Animations
// ============================================

function initTextAnimations() {
    const textElements = document.querySelectorAll('[data-animation]');

    textElements.forEach(element => {
        const animationType = element.getAttribute('data-animation');

        // Создаем ScrollTrigger для каждой анимации
        ScrollTrigger.create({
            trigger: element,
            start: 'top 85%',
            onEnter: () => {
                animateText(element, animationType);
            },
            once: true // Анимация срабатывает только один раз
        });
    });
}

function animateText(element, type) {
    // Пропускаем hero анимацию
    if (type === 'hero') return;

    switch(type) {
        // ============ WORDS ANIMATIONS ============

        case 'words-slam-down':
            {
                const split = new SplitType(element, { types: 'words' });
                gsap.from(split.words, {
                    opacity: 0,
                    y: -100,
                    rotateX: -90,
                    transformOrigin: 'top center',
                    stagger: 0.08,
                    duration: 0.8,
                    ease: 'power3.out'
                });
            }
            break;

        case 'words-slide-up':
            {
                const split = new SplitType(element, { types: 'words' });
                gsap.from(split.words, {
                    opacity: 0,
                    y: 50,
                    stagger: 0.05,
                    duration: 0.6,
                    ease: 'power2.out'
                });
            }
            break;

        case 'words-rotate-in':
            {
                const split = new SplitType(element, { types: 'words' });
                gsap.from(split.words, {
                    opacity: 0,
                    rotateY: 90,
                    transformOrigin: 'left center',
                    stagger: 0.06,
                    duration: 0.7,
                    ease: 'power3.out'
                });
            }
            break;

        case 'words-float-up':
            {
                const split = new SplitType(element, { types: 'words' });
                gsap.from(split.words, {
                    opacity: 0,
                    y: 80,
                    scale: 0.8,
                    stagger: {
                        each: 0.05,
                        from: 'random'
                    },
                    duration: 1,
                    ease: 'power2.out'
                });
            }
            break;

        case 'words-scale-in':
            {
                const split = new SplitType(element, { types: 'words' });
                gsap.from(split.words, {
                    opacity: 0,
                    scale: 0,
                    stagger: 0.06,
                    duration: 0.6,
                    ease: 'back.out(1.7)'
                });
            }
            break;

        case 'words-flip-in':
            {
                const split = new SplitType(element, { types: 'words' });
                gsap.from(split.words, {
                    opacity: 0,
                    rotateX: 180,
                    transformPerspective: 1000,
                    transformOrigin: 'center center',
                    stagger: 0.07,
                    duration: 0.8,
                    ease: 'power3.out'
                });
            }
            break;

        case 'words-jelly-in':
            {
                const split = new SplitType(element, { types: 'words' });
                gsap.from(split.words, {
                    opacity: 0,
                    scaleX: 0.3,
                    scaleY: 1.5,
                    stagger: 0.05,
                    duration: 0.8,
                    ease: 'elastic.out(1, 0.5)'
                });
            }
            break;

        // ============ LETTERS ANIMATIONS ============

        case 'letters-slide-up':
            {
                const split = new SplitType(element, { types: 'chars' });
                gsap.from(split.chars, {
                    opacity: 0,
                    y: 50,
                    stagger: 0.03,
                    duration: 0.5,
                    ease: 'power2.out'
                });
            }
            break;

        case 'letters-fade-random':
            {
                const split = new SplitType(element, { types: 'chars' });
                gsap.from(split.chars, {
                    opacity: 0,
                    stagger: {
                        each: 0.03,
                        from: 'random'
                    },
                    duration: 0.6,
                    ease: 'power1.out'
                });
            }
            break;

        case 'letters-zoom-in':
            {
                const split = new SplitType(element, { types: 'chars' });
                gsap.from(split.chars, {
                    opacity: 0,
                    scale: 2,
                    stagger: 0.02,
                    duration: 0.4,
                    ease: 'power2.out'
                });
            }
            break;

        case 'letters-rotate-in':
            {
                const split = new SplitType(element, { types: 'chars' });
                gsap.from(split.chars, {
                    opacity: 0,
                    rotation: 180,
                    stagger: 0.02,
                    duration: 0.5,
                    ease: 'power3.out'
                });
            }
            break;

        case 'letters-blur-in':
            {
                const split = new SplitType(element, { types: 'chars' });
                gsap.from(split.chars, {
                    opacity: 0,
                    filter: 'blur(10px)',
                    stagger: 0.03,
                    duration: 0.6,
                    ease: 'power2.out'
                });
            }
            break;

        case 'letters-pulse-in':
            {
                const split = new SplitType(element, { types: 'chars' });
                gsap.from(split.chars, {
                    opacity: 0,
                    scale: 0,
                    stagger: 0.02,
                    duration: 0.4,
                    ease: 'back.out(3)'
                });
            }
            break;

        case 'letters-clip-up':
            {
                const split = new SplitType(element, { types: 'chars' });
                split.chars.forEach(char => {
                    char.style.overflow = 'hidden';
                });
                gsap.from(split.chars, {
                    clipPath: 'inset(100% 0% 0% 0%)',
                    stagger: 0.02,
                    duration: 0.5,
                    ease: 'power2.out'
                });
            }
            break;

        case 'letters-blast-apart':
            {
                const split = new SplitType(element, { types: 'chars' });

                // Сначала взрыв
                gsap.from(split.chars, {
                    opacity: 0,
                    x: () => gsap.utils.random(-200, 200),
                    y: () => gsap.utils.random(-200, 200),
                    rotation: () => gsap.utils.random(-360, 360),
                    scale: 0,
                    stagger: 0.01,
                    duration: 0.8,
                    ease: 'power4.out'
                });
            }
            break;

        // ============ LINES ANIMATIONS ============

        case 'lines-slide-up':
            {
                const split = new SplitType(element, { types: 'lines' });
                gsap.from(split.lines, {
                    opacity: 0,
                    y: 60,
                    stagger: 0.15,
                    duration: 0.8,
                    ease: 'power3.out'
                });
            }
            break;

        case 'lines-fade-stagger':
            {
                const split = new SplitType(element, { types: 'lines' });
                gsap.from(split.lines, {
                    opacity: 0,
                    stagger: 0.2,
                    duration: 0.6,
                    ease: 'power2.out'
                });
            }
            break;

        case 'lines-scale-reveal':
            {
                const split = new SplitType(element, { types: 'lines' });
                gsap.from(split.lines, {
                    opacity: 0,
                    scale: 0.5,
                    stagger: 0.2,
                    duration: 0.7,
                    ease: 'back.out(1.7)'
                });
            }
            break;

        // ============ SPECIAL EFFECTS ============

        case 'gradient-wave':
            {
                const split = new SplitType(element, { types: 'chars' });

                gsap.from(split.chars, {
                    opacity: 0,
                    y: 50,
                    stagger: {
                        each: 0.03,
                        from: 'center'
                    },
                    duration: 0.8,
                    ease: 'sine.out'
                });

                // Волновая анимация после появления
                gsap.to(split.chars, {
                    y: -10,
                    stagger: {
                        each: 0.05,
                        repeat: -1,
                        yoyo: true
                    },
                    duration: 0.5,
                    ease: 'sine.inOut',
                    delay: 1
                });
            }
            break;

        case 'glitch':
            {
                // Добавляем data-text атрибут для псевдоэлементов
                element.setAttribute('data-text', element.textContent);

                const split = new SplitType(element, { types: 'chars' });

                gsap.from(split.chars, {
                    opacity: 0,
                    x: () => gsap.utils.random(-20, 20),
                    stagger: 0.02,
                    duration: 0.3,
                    ease: 'power1.out'
                });

                // Периодический glitch эффект
                setInterval(() => {
                    gsap.to(element, {
                        x: gsap.utils.random(-5, 5),
                        duration: 0.1,
                        yoyo: true,
                        repeat: 3
                    });
                }, 3000);
            }
            break;

        case 'typewriter':
            {
                const text = element.textContent;
                element.textContent = '';

                let index = 0;
                const cursor = document.createElement('span');
                cursor.textContent = '|';
                cursor.style.animation = 'blink 1s infinite';
                element.appendChild(cursor);

                // Добавляем CSS для курсора
                if (!document.getElementById('typewriter-style')) {
                    const style = document.createElement('style');
                    style.id = 'typewriter-style';
                    style.textContent = `
                        @keyframes blink {
                            0%, 50% { opacity: 1; }
                            51%, 100% { opacity: 0; }
                        }
                    `;
                    document.head.appendChild(style);
                }

                function type() {
                    if (index < text.length) {
                        element.insertBefore(document.createTextNode(text.charAt(index)), cursor);
                        index++;
                        setTimeout(type, 50);
                    } else {
                        setTimeout(() => cursor.remove(), 1000);
                    }
                }

                type();
            }
            break;

        case 'split-reveal':
            {
                const split = new SplitType(element, { types: 'chars' });

                split.chars.forEach((char, i) => {
                    const isLeft = i < split.chars.length / 2;
                    gsap.from(char, {
                        opacity: 0,
                        x: isLeft ? -50 : 50,
                        duration: 0.6,
                        delay: Math.abs(i - split.chars.length / 2) * 0.02,
                        ease: 'power3.out'
                    });
                });
            }
            break;

        default:
            console.warn(`Unknown animation type: ${type}`);
    }
}

// ============================================
// Smooth Scroll для навигации
// ============================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#') return;

        e.preventDefault();
        const target = document.querySelector(href);

        if (target) {
            const headerOffset = 100;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ============================================
// Section Title Animations
// ============================================

gsap.utils.toArray('.section-title').forEach(title => {
    gsap.from(title, {
        scrollTrigger: {
            trigger: title,
            start: 'top 90%'
        },
        opacity: 0,
        y: 50,
        duration: 0.8,
        ease: 'power3.out'
    });
});

// ============================================
// Animation Demo Cards
// ============================================

gsap.utils.toArray('.animation-demo').forEach((demo, i) => {
    gsap.from(demo, {
        scrollTrigger: {
            trigger: demo,
            start: 'top 90%'
        },
        opacity: 0,
        y: 40,
        duration: 0.6,
        delay: i * 0.05,
        ease: 'power2.out'
    });
});

console.log('%c СК ПРАЙД - Text Animations Ready! ', 'background: #c89b4f; color: #000; font-weight: bold; padding: 10px; font-size: 14px;');
