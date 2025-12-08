/**
 * ================================================
 * FULLPAGE MODAL TRANSITIONS
 * Модалки как полноэкранные страницы с GSAP анимациями
 * СК ПРАЙД 2026
 * ================================================
 *
 * ИНТЕГРАЦИЯ: Этот скрипт работает ВМЕСТЕ с main.js
 * - main.js обрабатывает открытие/закрытие модалок с внутренними анимациями
 * - modal-fullpage.js добавляет ДОПОЛНИТЕЛЬНЫЕ эффекты:
 *   - Индикатор прогресса скролла
 *   - Кнопка "Наверх"
 *   - Открытие модалки по хешу URL
 *   - Вложенные модалки (открытие модалки из модалки)
 * ================================================
 */

// Регистрация GSAP плагинов
gsap.registerPlugin(ScrollTrigger);

/**
 * Класс для расширенной функциональности модалок
 * Наблюдает за открытием/закрытием модалок и добавляет:
 * - Прогресс-бар скролла
 * - Кнопку "Наверх"
 * - Обработку хешей URL
 */
class FullpageModal {
    constructor() {
        this.modals = {};
        this.activeModal = null;
        this.modalStack = [];
        this.observers = {};

        this.init();
    }

    init() {
        // Регистрируем все модалки на странице
        this.registerModals();

        // Наблюдаем за изменениями классов модалок
        this.observeModals();

        // Слушаем изменения URL хеша
        this.handleHashChange();

        console.log('%c FullpageModal Enhanced! ', 'background: #c89b4f; color: #000; font-weight: bold; padding: 8px;');
    }

    /**
     * Регистрация всех модалок
     */
    registerModals() {
        const modalConfigs = [
            { id: 'aboutModal', trigger: '.about-trigger, [data-modal="aboutModal"]', hash: 'about' },
            { id: 'relaxModal', trigger: '.relax-trigger, [data-modal="relaxModal"]', hash: 'relax' },
            { id: 'iceModal', trigger: '.ice-trigger, [data-modal="iceModal"]', hash: 'ice' },
            { id: 'pricingModal', trigger: '.pricing-trigger, [data-modal="pricingModal"]', hash: 'pricing' },
            { id: 'reviewModal', trigger: '.review-trigger, [data-modal="reviewModal"]', hash: 'review' },
            { id: 'sportModal', trigger: '.sport-trigger, [data-modal="sportModal"]', hash: 'sport' },
            { id: 'restModal', trigger: '.rest-trigger, [data-modal="restModal"]', hash: 'rest' },
            { id: 'kidsModal', trigger: '.kids-trigger, [data-modal="kidsModal"]', hash: 'kids' },
            { id: 'eventsModal', trigger: '.events-trigger, [data-modal="eventsModal"]', hash: 'events' },
            { id: 'contactsModal', trigger: '.contacts-trigger, [data-modal="contactsModal"]', hash: 'contacts' }
        ];

        modalConfigs.forEach(config => {
            const modalElement = document.getElementById(config.id);
            if (modalElement) {
                // Добавляем data-атрибут хеша
                modalElement.setAttribute('data-hash', config.hash);

                this.modals[config.id] = {
                    element: modalElement,
                    scroller: modalElement.querySelector('.about-scroller, .relax-scroller, .ice-modal-scroller, .pricing-scroller, .review-scroller, .sport-content, .rest-content, .kids-content, .events-content, .contacts-content'),
                    hash: config.hash,
                    triggers: config.trigger
                };

                // Создаем индикатор прогресса скролла
                this.createScrollProgress(config.id);
            }
        });
    }

    /**
     * Создание индикатора прогресса скролла
     */
    createScrollProgress(modalId) {
        const modal = this.modals[modalId];
        if (!modal || !modal.scroller) return;

        const progress = document.createElement('div');
        progress.className = 'modal-scroll-progress';
        modal.element.appendChild(progress);
        modal.progressBar = progress;

        // Кнопка "Наверх"
        const scrollTopBtn = document.createElement('button');
        scrollTopBtn.className = 'modal-scroll-top';
        scrollTopBtn.innerHTML = '↑';
        scrollTopBtn.setAttribute('aria-label', 'Наверх');
        modal.element.appendChild(scrollTopBtn);
        modal.scrollTopBtn = scrollTopBtn;
    }

    /**
     * Наблюдаем за изменениями классов модалок (открытие/закрытие)
     */
    observeModals() {
        Object.keys(this.modals).forEach(modalId => {
            const modal = this.modals[modalId];

            // MutationObserver для отслеживания класса 'active'
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.attributeName === 'class') {
                        const isActive = modal.element.classList.contains('active');

                        if (isActive && this.activeModal !== modalId) {
                            this.onModalOpen(modalId);
                        } else if (!isActive && this.activeModal === modalId) {
                            this.onModalClose(modalId);
                        }
                    }
                });
            });

            observer.observe(modal.element, { attributes: true });
            this.observers[modalId] = observer;

            // Скролл внутри модалки
            if (modal.scroller) {
                modal.scroller.addEventListener('scroll', () => this.handleScroll(modalId));
            }

            // Кнопка "Наверх"
            if (modal.scrollTopBtn) {
                modal.scrollTopBtn.addEventListener('click', () => this.scrollToTop(modalId));
            }
        });

        // Обработка истории браузера
        window.addEventListener('popstate', () => this.handleHashChange());
    }

    /**
     * Обработчик открытия модалки
     */
    onModalOpen(modalId) {
        const modal = this.modals[modalId];
        if (!modal) return;

        // Если уже открыта другая модалка, добавляем в стек
        if (this.activeModal && this.activeModal !== modalId) {
            this.modalStack.push(this.activeModal);
        }

        this.activeModal = modalId;

        // Обновляем URL хеш
        if (modal.hash) {
            history.replaceState({ modal: modalId }, '', `#${modal.hash}`);
        }

        // Инициализируем horizontal scroll если есть
        this.initHorizontalScroll(modalId);

        console.log(`%c Modal "${modalId}" detected open `, 'background: #27ae60; color: #fff; padding: 4px 8px;');
    }

    /**
     * Обработчик закрытия модалки
     */
    onModalClose(modalId) {
        const modal = this.modals[modalId];
        if (!modal) return;

        // Сбрасываем скролл модалки
        if (modal.scroller) {
            modal.scroller.scrollTop = 0;
        }

        // Скрываем прогресс-бар и кнопку "Наверх"
        if (modal.progressBar) {
            modal.progressBar.style.width = '0%';
        }
        if (modal.scrollTopBtn) {
            modal.scrollTopBtn.classList.remove('visible');
        }

        // Возвращаем предыдущую модалку из стека
        if (this.modalStack.length > 0) {
            this.activeModal = this.modalStack.pop();
        } else {
            this.activeModal = null;
            // Убираем хеш из URL
            history.replaceState(null, '', window.location.pathname);
        }

        console.log(`%c Modal "${modalId}" detected close `, 'background: #e74c3c; color: #fff; padding: 4px 8px;');
    }

    /**
     * Программное открытие модалки (триггерит клик на кнопку)
     * Используется для открытия по хешу URL
     */
    triggerOpen(modalId) {
        const modal = this.modals[modalId];
        if (!modal) return;

        // Ищем триггер-кнопку для этой модалки
        const trigger = document.querySelector(modal.triggers.split(',')[0].trim());
        if (trigger) {
            trigger.click();
        }
    }

    /**
     * Инициализация горизонтального скролла
     */
    initHorizontalScroll(modalId) {
        const modal = this.modals[modalId];
        if (!modal) return;

        const horizontalSection = modal.element.querySelector('.horizontal-scroll-section[data-auto-init]');
        if (horizontalSection && window.HorizontalSwipeHero) {
            // Удаляем предыдущий экземпляр
            const existingProgress = horizontalSection.querySelector('.horizontal-scroll-progress');
            if (existingProgress) existingProgress.remove();

            new HorizontalSwipeHero(`#${modalId} .horizontal-scroll-section`);
        }
    }

    /**
     * Обработка скролла внутри модалки
     */
    handleScroll(modalId) {
        const modal = this.modals[modalId];
        if (!modal || !modal.scroller) return;

        const scroller = modal.scroller;
        const scrollTop = scroller.scrollTop;
        const scrollHeight = scroller.scrollHeight - scroller.clientHeight;
        const progress = (scrollTop / scrollHeight) * 100;

        // Обновляем прогресс-бар
        if (modal.progressBar) {
            modal.progressBar.style.width = `${progress}%`;
        }

        // Показываем/скрываем кнопку "Наверх"
        if (modal.scrollTopBtn) {
            if (scrollTop > 300) {
                modal.scrollTopBtn.classList.add('visible');
            } else {
                modal.scrollTopBtn.classList.remove('visible');
            }
        }
    }

    /**
     * Прокрутка наверх
     */
    scrollToTop(modalId) {
        const modal = this.modals[modalId];
        if (!modal || !modal.scroller) return;

        gsap.to(modal.scroller, {
            scrollTop: 0,
            duration: 0.8,
            ease: 'power2.out'
        });
    }

    /**
     * Обработка изменения хеша URL
     */
    handleHashChange() {
        const hash = window.location.hash.slice(1);

        if (hash) {
            // Ищем модалку по хешу
            const modalId = Object.keys(this.modals).find(id => {
                return this.modals[id].hash === hash;
            });

            if (modalId && !this.activeModal) {
                // Небольшая задержка для загрузки страницы
                setTimeout(() => {
                    this.triggerOpen(modalId);
                }, 500);
            }
        }
    }

    /**
     * Программное открытие модалки
     */
    openModal(modalId) {
        this.triggerOpen(modalId);
    }
}

// ============================================
// Инициализация при загрузке DOM
// ============================================

let fullpageModalInstance = null;

document.addEventListener('DOMContentLoaded', function() {
    // Небольшая задержка для загрузки всех модалок
    setTimeout(() => {
        fullpageModalInstance = new FullpageModal();

        // Экспорт в глобальную область
        window.fullpageModal = fullpageModalInstance;
    }, 100);
});

// Экспорт класса
window.FullpageModal = FullpageModal;
