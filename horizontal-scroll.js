/**
 * ================================================
 * HORIZONTAL SCROLL HERO SECTIONS
 * GSAP ScrollTrigger - Вертикальный скролл → Горизонтальная прокрутка
 * СК ПРАЙД 2026
 * ================================================
 *
 * Основан на технике из CodePen GreenSock: XWzRraJ
 * Вертикальный скролл страницы преобразуется в горизонтальное
 * движение панелей с помощью GSAP ScrollTrigger pin + scrub
 */

// Класс для управления горизонтальным скроллом
class HorizontalScrollHero {
    constructor(containerSelector, options = {}) {
        this.container = document.querySelector(containerSelector);
        if (!this.container) {
            console.warn(`HorizontalScrollHero: Container "${containerSelector}" not found`);
            return;
        }

        this.options = {
            scrub: 1,              // Плавность привязки к скроллу (0-3)
            snap: true,            // Привязка к секциям
            snapDuration: 0.3,     // Длительность снапа
            showProgress: true,    // Показывать индикатор прогресса
            animateContent: true,  // Анимировать контент панелей
            scroller: null,        // Кастомный scroller (для модалок)
            ...options
        };

        this.wrapper = this.container.querySelector('.horizontal-scroll-wrapper');
        this.scrollContainer = this.container.querySelector('.horizontal-scroll-container');
        this.panels = this.container.querySelectorAll('.horizontal-hero-panel');
        this.progressDots = [];
        this.currentPanel = 0;
        this.scrollTrigger = null;

        if (this.panels.length === 0) {
            console.warn('HorizontalScrollHero: No panels found');
            return;
        }

        this.init();
    }

    init() {
        // Регистрируем плагины GSAP
        gsap.registerPlugin(ScrollTrigger);

        // Создаем индикатор прогресса
        if (this.options.showProgress) {
            this.createProgressIndicator();
        }

        // Настраиваем горизонтальный скролл
        this.setupHorizontalScroll();

        // Анимируем контент панелей
        if (this.options.animateContent) {
            this.setupContentAnimations();
        }

        // Управление видео
        this.setupVideoControl();

        console.log('%c HorizontalScrollHero Initialized! ', 'background: #c89b4f; color: #000; font-weight: bold; padding: 8px;');
    }

    createProgressIndicator() {
        const progressContainer = document.createElement('div');
        progressContainer.className = 'horizontal-scroll-progress';
        progressContainer.setAttribute('data-horizontal-progress', '');

        this.panels.forEach((panel, index) => {
            const dot = document.createElement('div');
            dot.className = 'progress-dot';
            if (index === 0) dot.classList.add('active');

            dot.addEventListener('click', () => {
                this.goToPanel(index);
            });

            this.progressDots.push(dot);
            progressContainer.appendChild(dot);
        });

        this.container.appendChild(progressContainer);
    }

    setupHorizontalScroll() {
        const totalWidth = this.panels.length * 100; // vw
        const scrollDistance = (this.panels.length - 1) * window.innerWidth;

        // Основная GSAP анимация горизонтального скролла
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: this.wrapper,
                scroller: this.options.scroller,
                start: 'top top',
                end: () => `+=${scrollDistance}`,
                pin: true,
                scrub: this.options.scrub,
                anticipatePin: 1,
                invalidateOnRefresh: true,
                snap: this.options.snap ? {
                    snapTo: 1 / (this.panels.length - 1),
                    duration: { min: 0.2, max: this.options.snapDuration },
                    ease: 'power1.inOut'
                } : false,
                onUpdate: (self) => {
                    this.updateProgress(self.progress);
                }
            }
        });

        // Анимация движения контейнера
        tl.to(this.scrollContainer, {
            x: () => -(this.scrollContainer.scrollWidth - window.innerWidth),
            ease: 'none'
        });

        this.scrollTrigger = tl.scrollTrigger;
    }

    setupContentAnimations() {
        this.panels.forEach((panel, index) => {
            const content = panel.querySelector('.horizontal-hero-content');
            if (!content) return;

            const elements = content.children;

            // Начальное состояние - скрыто
            gsap.set(elements, {
                opacity: 0,
                y: 50
            });

            // Анимация появления при входе в зону видимости
            ScrollTrigger.create({
                trigger: panel,
                scroller: this.options.scroller,
                containerAnimation: this.scrollTrigger ? this.scrollTrigger.animation : null,
                start: 'left 80%',
                end: 'left 20%',
                onEnter: () => this.animatePanelContent(panel, 'in'),
                onLeave: () => this.animatePanelContent(panel, 'out'),
                onEnterBack: () => this.animatePanelContent(panel, 'in'),
                onLeaveBack: () => this.animatePanelContent(panel, 'out')
            });
        });

        // Анимируем первую панель сразу
        setTimeout(() => {
            this.animatePanelContent(this.panels[0], 'in');
        }, 500);
    }

    animatePanelContent(panel, direction) {
        const content = panel.querySelector('.horizontal-hero-content');
        if (!content) return;

        const elements = content.children;

        if (direction === 'in') {
            gsap.to(elements, {
                opacity: 1,
                y: 0,
                duration: 0.8,
                stagger: 0.15,
                ease: 'power3.out'
            });
        } else {
            gsap.to(elements, {
                opacity: 0,
                y: -30,
                duration: 0.4,
                stagger: 0.05,
                ease: 'power2.in'
            });
        }
    }

    setupVideoControl() {
        this.panels.forEach((panel, index) => {
            const video = panel.querySelector('video');
            if (!video) return;

            // Ставим на паузу все видео кроме первого
            if (index !== 0) {
                video.pause();
            }

            // ScrollTrigger для управления видео
            ScrollTrigger.create({
                trigger: panel,
                scroller: this.options.scroller,
                containerAnimation: this.scrollTrigger ? this.scrollTrigger.animation : null,
                start: 'left 60%',
                end: 'right 40%',
                onEnter: () => {
                    video.play().catch(() => {});
                    panel.classList.add('active');
                },
                onLeave: () => {
                    video.pause();
                    panel.classList.remove('active');
                },
                onEnterBack: () => {
                    video.play().catch(() => {});
                    panel.classList.add('active');
                },
                onLeaveBack: () => {
                    video.pause();
                    panel.classList.remove('active');
                }
            });
        });
    }

    updateProgress(progress) {
        const panelIndex = Math.round(progress * (this.panels.length - 1));

        if (panelIndex !== this.currentPanel) {
            this.currentPanel = panelIndex;

            this.progressDots.forEach((dot, index) => {
                dot.classList.toggle('active', index === panelIndex);
            });
        }
    }

    goToPanel(index) {
        if (!this.scrollTrigger) return;

        const progress = index / (this.panels.length - 1);
        const scrollTo = this.scrollTrigger.start + (this.scrollTrigger.end - this.scrollTrigger.start) * progress;

        gsap.to(this.options.scroller || window, {
            scrollTo: scrollTo,
            duration: 0.8,
            ease: 'power2.inOut'
        });
    }

    // Обновить при ресайзе
    refresh() {
        ScrollTrigger.refresh();
    }

    // Уничтожить
    destroy() {
        if (this.scrollTrigger) {
            this.scrollTrigger.kill();
        }
        ScrollTrigger.getAll().forEach(st => {
            if (st.trigger && this.container.contains(st.trigger)) {
                st.kill();
            }
        });

        const progress = this.container.querySelector('.horizontal-scroll-progress');
        if (progress) progress.remove();
    }
}

// ============================================
// Инициализация для модалок СК ПРАЙД
// ============================================

// Хранилище экземпляров
const horizontalScrollInstances = {};

// Функция инициализации для конкретной модалки
function initHorizontalScrollForModal(modalId, scroller) {
    const containerSelector = `#${modalId} .horizontal-scroll-section`;
    const container = document.querySelector(containerSelector);

    if (!container) {
        console.log(`No horizontal scroll section found in ${modalId}`);
        return null;
    }

    // Уничтожаем предыдущий экземпляр если есть
    if (horizontalScrollInstances[modalId]) {
        horizontalScrollInstances[modalId].destroy();
    }

    // Создаем новый экземпляр
    horizontalScrollInstances[modalId] = new HorizontalScrollHero(containerSelector, {
        scroller: scroller,
        scrub: 1,
        snap: true,
        snapDuration: 0.5,
        showProgress: true,
        animateContent: true
    });

    return horizontalScrollInstances[modalId];
}

// Функция уничтожения при закрытии модалки
function destroyHorizontalScrollForModal(modalId) {
    if (horizontalScrollInstances[modalId]) {
        horizontalScrollInstances[modalId].destroy();
        delete horizontalScrollInstances[modalId];
    }
}

// ============================================
// Упрощенная версия для встраивания в модалки
// (без pin, только горизонтальный скролл по свайпу)
// ============================================

class HorizontalSwipeHero {
    constructor(containerSelector, options = {}) {
        this.container = document.querySelector(containerSelector);
        if (!this.container) return;

        this.options = {
            showProgress: true,
            autoplay: false,
            autoplayDelay: 5000,
            ...options
        };

        this.scrollContainer = this.container.querySelector('.horizontal-scroll-container');
        this.panels = this.container.querySelectorAll('.horizontal-hero-panel');
        this.currentIndex = 0;
        this.progressDots = [];
        this.autoplayTimer = null;

        if (this.panels.length === 0) return;

        this.init();
    }

    init() {
        // Создаем индикатор
        if (this.options.showProgress) {
            this.createProgressIndicator();
        }

        // Touch/Swipe events
        this.setupSwipe();

        // Keyboard navigation
        this.setupKeyboard();

        // Autoplay
        if (this.options.autoplay) {
            this.startAutoplay();
        }

        // Показываем первую панель
        this.goToPanel(0, false);

        console.log('%c HorizontalSwipeHero Initialized! ', 'background: #c89b4f; color: #000; font-weight: bold; padding: 8px;');
    }

    createProgressIndicator() {
        const progressContainer = document.createElement('div');
        progressContainer.className = 'horizontal-scroll-progress';

        this.panels.forEach((panel, index) => {
            const dot = document.createElement('div');
            dot.className = 'progress-dot';
            if (index === 0) dot.classList.add('active');

            dot.addEventListener('click', () => this.goToPanel(index));

            this.progressDots.push(dot);
            progressContainer.appendChild(dot);
        });

        this.container.appendChild(progressContainer);
    }

    setupSwipe() {
        let startX = 0;
        let startY = 0;
        let isDragging = false;

        this.scrollContainer.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
            isDragging = true;
            this.stopAutoplay();
        }, { passive: true });

        this.scrollContainer.addEventListener('touchmove', (e) => {
            if (!isDragging) return;

            const deltaX = e.touches[0].clientX - startX;
            const deltaY = e.touches[0].clientY - startY;

            // Если движение больше по горизонтали - блокируем вертикальный скролл
            if (Math.abs(deltaX) > Math.abs(deltaY)) {
                e.preventDefault();
            }
        }, { passive: false });

        this.scrollContainer.addEventListener('touchend', (e) => {
            if (!isDragging) return;
            isDragging = false;

            const endX = e.changedTouches[0].clientX;
            const deltaX = endX - startX;
            const threshold = 50;

            if (deltaX > threshold) {
                this.prev();
            } else if (deltaX < -threshold) {
                this.next();
            }

            if (this.options.autoplay) {
                this.startAutoplay();
            }
        }, { passive: true });

        // Mouse drag для десктопа
        let mouseStartX = 0;
        let isMouseDragging = false;

        this.scrollContainer.addEventListener('mousedown', (e) => {
            mouseStartX = e.clientX;
            isMouseDragging = true;
            this.scrollContainer.style.cursor = 'grabbing';
            this.stopAutoplay();
        });

        document.addEventListener('mousemove', (e) => {
            if (!isMouseDragging) return;
            e.preventDefault();
        });

        document.addEventListener('mouseup', (e) => {
            if (!isMouseDragging) return;
            isMouseDragging = false;
            this.scrollContainer.style.cursor = 'grab';

            const deltaX = e.clientX - mouseStartX;
            const threshold = 50;

            if (deltaX > threshold) {
                this.prev();
            } else if (deltaX < -threshold) {
                this.next();
            }

            if (this.options.autoplay) {
                this.startAutoplay();
            }
        });

        this.scrollContainer.style.cursor = 'grab';
    }

    setupKeyboard() {
        this.container.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                this.prev();
            } else if (e.key === 'ArrowRight') {
                this.next();
            }
        });

        this.container.setAttribute('tabindex', '0');
    }

    goToPanel(index, animate = true) {
        if (index < 0) index = 0;
        if (index >= this.panels.length) index = this.panels.length - 1;

        this.currentIndex = index;

        // Анимация перехода
        const offset = -index * 100;

        gsap.to(this.scrollContainer, {
            x: `${offset}vw`,
            duration: animate ? 0.6 : 0,
            ease: 'power2.out'
        });

        // Обновляем индикаторы
        this.progressDots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });

        // Управление видео
        this.panels.forEach((panel, i) => {
            const video = panel.querySelector('video');
            if (video) {
                if (i === index) {
                    video.play().catch(() => {});
                } else {
                    video.pause();
                }
            }
            panel.classList.toggle('active', i === index);
        });

        // Анимация контента
        this.animateContent(this.panels[index]);
    }

    animateContent(panel) {
        const content = panel.querySelector('.horizontal-hero-content');
        if (!content) return;

        gsap.fromTo(content.children,
            { opacity: 0, y: 40 },
            {
                opacity: 1,
                y: 0,
                duration: 0.8,
                stagger: 0.1,
                ease: 'power3.out'
            }
        );
    }

    next() {
        this.goToPanel(this.currentIndex + 1);
    }

    prev() {
        this.goToPanel(this.currentIndex - 1);
    }

    startAutoplay() {
        this.stopAutoplay();
        this.autoplayTimer = setInterval(() => {
            const nextIndex = (this.currentIndex + 1) % this.panels.length;
            this.goToPanel(nextIndex);
        }, this.options.autoplayDelay);
    }

    stopAutoplay() {
        if (this.autoplayTimer) {
            clearInterval(this.autoplayTimer);
            this.autoplayTimer = null;
        }
    }

    destroy() {
        this.stopAutoplay();
        const progress = this.container.querySelector('.horizontal-scroll-progress');
        if (progress) progress.remove();
    }
}

// ============================================
// Автоинициализация при загрузке DOM
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    // Ищем все секции с горизонтальным скроллом на странице
    const sections = document.querySelectorAll('.horizontal-scroll-section[data-auto-init]');

    sections.forEach((section, index) => {
        const id = section.id || `horizontal-scroll-${index}`;
        section.id = id;

        const mode = section.getAttribute('data-mode') || 'swipe';

        if (mode === 'scroll') {
            // Режим с ScrollTrigger (для длинных страниц)
            new HorizontalScrollHero(`#${id}`);
        } else {
            // Режим со свайпом (для модалок)
            new HorizontalSwipeHero(`#${id}`);
        }
    });
});

// Экспорт для использования в других скриптах
window.HorizontalScrollHero = HorizontalScrollHero;
window.HorizontalSwipeHero = HorizontalSwipeHero;
window.initHorizontalScrollForModal = initHorizontalScrollForModal;
window.destroyHorizontalScrollForModal = destroyHorizontalScrollForModal;
