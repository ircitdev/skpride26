/**
 * ================================================
 * HORIZONTAL SCROLL - GSAP ScrollTrigger
 * Вертикальный скролл → Горизонтальная прокрутка hero секций
 * СК ПРАЙД 2026
 * ================================================
 */

(function() {
    'use strict';

    // Проверяем наличие GSAP и ScrollTrigger
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
        console.error('GSAP или ScrollTrigger не загружен!');
        return;
    }

    // Регистрируем плагин
    gsap.registerPlugin(ScrollTrigger);

    // ============================================
    // Инициализация при загрузке DOM
    // ============================================

    function initHorizontalScroll() {
        const sections = document.querySelectorAll('.horizontal-scroll-section');

        if (sections.length === 0) {
            console.log('Horizontal scroll sections not found');
            return;
        }

        sections.forEach((section, sectionIndex) => {
            const container = section.querySelector('.horizontal-scroll-container');
            const panels = section.querySelectorAll('.horizontal-hero-panel');
            const progressDots = section.querySelectorAll('.progress-dot');

            if (!container || panels.length === 0) {
                console.warn('Horizontal scroll: container or panels not found');
                return;
            }

            // Устанавливаем ширину контейнера
            const totalWidth = panels.length * 100; // 100vw на панель
            gsap.set(container, { width: `${totalWidth}vw` });

            // ============================================
            // Основная анимация горизонтального скролла
            // ============================================

            const scrollTween = gsap.to(container, {
                x: () => -(container.scrollWidth - window.innerWidth),
                ease: 'none',
                scrollTrigger: {
                    trigger: section,
                    start: 'top top',
                    end: () => `+=${container.scrollWidth - window.innerWidth}`,
                    scrub: 1,
                    pin: true,
                    anticipatePin: 1,
                    invalidateOnRefresh: true,
                    onUpdate: (self) => {
                        updateProgress(self.progress, panels, progressDots);
                    }
                }
            });

            // ============================================
            // Анимации контента на каждой панели
            // ============================================

            panels.forEach((panel, index) => {
                const content = panel.querySelectorAll('.horizontal-hero-content > *');

                // Анимация появления контента
                gsap.timeline({
                    scrollTrigger: {
                        trigger: panel,
                        containerAnimation: scrollTween,
                        start: 'left center',
                        end: 'center center',
                        scrub: 1,
                        toggleActions: 'play none none reverse'
                    }
                })
                .to(content, {
                    opacity: 1,
                    y: 0,
                    stagger: 0.1,
                    duration: 0.5,
                    ease: 'power2.out'
                });

                // Параллакс эффект для фона
                const bg = panel.querySelector('.horizontal-hero-bg');
                if (bg) {
                    gsap.to(bg, {
                        x: '10%',
                        ease: 'none',
                        scrollTrigger: {
                            trigger: panel,
                            containerAnimation: scrollTween,
                            start: 'left right',
                            end: 'right left',
                            scrub: 1
                        }
                    });
                }

                // Управление видео
                const video = panel.querySelector('video');
                if (video) {
                    ScrollTrigger.create({
                        trigger: panel,
                        containerAnimation: scrollTween,
                        start: 'left right',
                        end: 'right left',
                        onEnter: () => {
                            video.play().catch(e => console.log('Video play error:', e));
                        },
                        onLeave: () => {
                            video.pause();
                        },
                        onEnterBack: () => {
                            video.play().catch(e => console.log('Video play error:', e));
                        },
                        onLeaveBack: () => {
                            video.pause();
                        }
                    });
                }
            });

            // ============================================
            // Progress dots - клик для навигации
            // ============================================

            progressDots.forEach((dot, index) => {
                dot.addEventListener('click', () => {
                    // Вычисляем позицию панели
                    const panelPosition = index * window.innerWidth;
                    const totalScrollDistance = container.scrollWidth - window.innerWidth;
                    const progress = panelPosition / totalScrollDistance;

                    // Скроллим к нужной позиции
                    const scrollPosition = section.offsetTop + (progress * totalScrollDistance);

                    gsap.to(window, {
                        scrollTo: scrollPosition,
                        duration: 1,
                        ease: 'power2.inOut'
                    });
                });
            });

            console.log(`%c Horizontal Scroll Section ${sectionIndex + 1} initialized `, 'background: #c89b4f; color: #000; font-weight: bold; padding: 8px;');
        });
    }

    // ============================================
    // Обновление progress indicators
    // ============================================

    function updateProgress(progress, panels, dots) {
        if (!dots || dots.length === 0) return;

        const currentPanelIndex = Math.min(
            Math.floor(progress * panels.length),
            panels.length - 1
        );

        dots.forEach((dot, index) => {
            if (index === currentPanelIndex) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });

        // Добавляем класс active к текущей панели
        panels.forEach((panel, index) => {
            if (index === currentPanelIndex) {
                panel.classList.add('active');
            } else {
                panel.classList.remove('active');
            }
        });
    }

    // ============================================
    // Обработка resize
    // ============================================

    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            ScrollTrigger.refresh();
        }, 250);
    });

    // ============================================
    // Инициализация при открытии модального окна
    // ============================================

    function initOnModalOpen() {
        // Ждем, когда модалка откроется и станет видимой
        const modals = document.querySelectorAll('.about-modal, .relax-modal, .ice-modal');

        modals.forEach(modal => {
            // Наблюдаем за классом .active
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.attributeName === 'class') {
                        if (modal.classList.contains('active')) {
                            // Модалка открылась - инициализируем скролл
                            setTimeout(() => {
                                ScrollTrigger.refresh();
                            }, 300);
                        }
                    }
                });
            });

            observer.observe(modal, {
                attributes: true,
                attributeFilter: ['class']
            });
        });
    }

    // ============================================
    // Запуск при загрузке DOM
    // ============================================

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            initHorizontalScroll();
            initOnModalOpen();
        });
    } else {
        initHorizontalScroll();
        initOnModalOpen();
    }

    // ============================================
    // Публичный API для переинициализации
    // ============================================

    window.HorizontalScroll = {
        refresh: () => {
            ScrollTrigger.refresh();
        },
        init: initHorizontalScroll
    };

    console.log('%c Horizontal Scroll Module Loaded ', 'background: #c89b4f; color: #000; font-weight: bold; padding: 8px;');

})();
