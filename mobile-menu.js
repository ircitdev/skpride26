/**
 * 📱 GSAP Animated Hamburger Menu
 * СК ПРАЙД
 * Анимация: снизу вверх (как в примере)
 */

(function() {
    'use strict';

    // Ждем загрузки DOM и GSAP
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    function init() {
        // Проверяем наличие GSAP
        if (typeof gsap === 'undefined') {
            console.warn('GSAP not loaded, mobile menu disabled');
            return;
        }

        createMenuHTML();
        initGSAPAnimation();
    }

    function createMenuHTML() {
        // Проверяем, существует ли hamburger кнопка в HTML
        let hamburger = document.getElementById('hamburger-menu');

        if (!hamburger) {
            // Создаем hamburger кнопку только если её нет
            hamburger = document.createElement('div');
            hamburger.id = 'hamburger-menu';
            hamburger.innerHTML = `
                <span id="top-line"></span>
                <span id="bottom-line"></span>
            `;

            // Добавляем hamburger внутрь nav.slides-nav для мобильных
            const slidesNav = document.querySelector('nav.slides-nav');
            if (slidesNav && window.innerWidth <= 768) {
                slidesNav.appendChild(hamburger);
            } else {
                document.body.appendChild(hamburger);
            }
        }

        // При изменении размера окна перемещаем hamburger
        window.addEventListener('resize', () => {
            const nav = document.querySelector('nav.slides-nav');
            const menu = document.getElementById('hamburger-menu');
            if (!menu) return;

            if (window.innerWidth <= 768 && nav && menu.parentNode !== nav) {
                nav.appendChild(menu);
            } else if (window.innerWidth > 768 && menu.parentNode === nav) {
                document.body.appendChild(menu);
            }
        });

        // Проверяем, существует ли mobile-nav в HTML
        let nav = document.getElementById('mobile-nav');

        if (!nav) {
            // Создаем fullscreen меню только если его нет
            nav = document.createElement('nav');
            nav.id = 'mobile-nav';
            nav.innerHTML = `
            <button class="mobile-nav-close" id="mobileNavClose" aria-label="Закрыть меню"></button>
            <div id="mobile-nav-links">
                <a href="#" data-action="gym">Тренажерный зал</a>
                <a href="#" data-action="relax">Релакс-зона</a>
                <a href="#" data-action="ice">Ледовая Арена</a>
                <a href="#" data-action="pricing">Цены</a>
                <a href="#" data-action="hotel">Отель</a>
                <a href="#" data-action="restaurant">Ресторан</a>
            </div>
            <div id="mobile-nav-contacts">
                <a href="#virtual-tour" class="virtual-tour-btn" data-action="tour">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="10"/>
                        <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/>
                        <path d="M2 12h20"/>
                    </svg>
                    Виртуальный тур
                </a>
                <div class="contacts-block">
                    <span class="contacts-title">Телефон</span>
                    <a href="tel:+78442509550" class="contacts-value">+7 (8442) 50-95-50</a>
                </div>
                <div id="mobile-nav-socials">
                    <a href="https://vk.com/pridevolgograd" target="_blank" aria-label="VK">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12.785 16.241s.288-.032.436-.194c.136-.148.132-.427.132-.427s-.02-1.304.587-1.496c.598-.189 1.366 1.26 2.18 1.817.616.422 1.084.33 1.084.33l2.178-.03s1.14-.071.6-.972c-.044-.074-.314-.665-1.616-1.879-1.363-1.272-1.18-1.066.461-3.267.998-1.339 1.398-2.156 1.273-2.507-.12-.335-.858-.247-.858-.247l-2.45.015s-.182-.025-.317.056c-.131.079-.216.264-.216.264s-.388 1.035-.905 1.914c-1.09 1.852-1.527 1.95-1.705 1.836-.416-.267-.312-1.07-.312-1.641 0-1.785.271-2.53-.527-2.724-.265-.064-.46-.107-1.138-.114-.87-.009-1.606.003-2.023.208-.278.136-.492.44-.361.457.161.022.527.099.721.363.25.342.241 1.11.241 1.11s.144 2.102-.335 2.363c-.329.18-.78-.187-1.748-1.87-.495-.862-.869-1.815-.869-1.815s-.072-.177-.2-.272c-.156-.115-.373-.151-.373-.151l-2.327.015s-.349.01-.477.162c-.114.134-.009.412-.009.412s1.829 4.282 3.901 6.442c1.9 1.982 4.058 1.852 4.058 1.852h.978z"/>
                        </svg>
                    </a>
                    <a href="https://t.me/pridevolgograd" target="_blank" aria-label="Telegram">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.2-.08-.06-.19-.04-.27-.02-.12.03-1.99 1.27-5.62 3.72-.53.36-1.01.54-1.44.53-.47-.01-1.38-.27-2.06-.49-.83-.27-1.49-.42-1.43-.88.03-.24.37-.49 1.02-.74 3.99-1.74 6.65-2.89 7.99-3.45 3.8-1.6 4.59-1.88 5.1-1.89.11 0 .37.03.54.17.14.12.18.28.2.45-.01.06.01.24 0 .38z"/>
                        </svg>
                    </a>
                    <a href="https://www.instagram.com/pride.volgograd/" target="_blank" aria-label="Instagram">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                        </svg>
                    </a>
                </div>
            </div>
        `;
            document.body.appendChild(nav);
        }
    }

    function initGSAPAnimation() {
        const hamburgerMenu = document.getElementById('hamburger-menu');
        const nav = document.getElementById('mobile-nav');

        if (!hamburgerMenu || !nav) {
            console.warn('Menu elements not found');
            return;
        }

        let isOpen = false;

        // Устанавливаем начальное состояние через GSAP
        gsap.set('#mobile-nav', { y: '100%', autoAlpha: 0 });

        // Создаем GSAP timeline (paused)
        const tl = gsap.timeline({ paused: true });

        // Top line rotate and move down
        tl.to('#top-line', {
            rotate: 45,
            y: 4,
            duration: 0.8,
            ease: 'expo.out'
        }, 0);

        // Bottom line rotate and move up
        tl.to('#bottom-line', {
            rotate: -45,
            y: -4,
            duration: 0.8,
            ease: 'expo.out'
        }, '<');

        // Menu slide up (from bottom)
        tl.to('#mobile-nav', {
            y: '0%',
            autoAlpha: 1,
            duration: 0.8,
            ease: 'expo.out'
        }, '<');

        // Links slide in
        tl.from('#mobile-nav-links', {
            y: 50,
            autoAlpha: 0,
            duration: 0.8,
            ease: 'back.out(1.2)'
        }, '<0.2');

        // Contacts slide in
        tl.from('#mobile-nav-contacts', {
            y: 30,
            autoAlpha: 0,
            duration: 0.8,
            ease: 'back.out(1.2)'
        }, '<0.2');

        // Click handler for hamburger
        hamburgerMenu.addEventListener('click', () => {
            if (isOpen) {
                tl.reverse();
                document.body.classList.remove('mobile-menu-open');
            } else {
                tl.play(0);
                document.body.classList.add('mobile-menu-open');
            }
            isOpen = !isOpen;
        });

        // Click handler for close button
        const closeBtn = document.getElementById('mobileNavClose');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                tl.reverse();
                document.body.classList.remove('mobile-menu-open');
                isOpen = false;
            });
        }

        // Setup link handlers
        setupLinkHandlers(tl, () => {
            isOpen = false;
            document.body.classList.remove('mobile-menu-open');
        });

        // ESC key handler
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && isOpen) {
                tl.reverse();
                document.body.classList.remove('mobile-menu-open');
                isOpen = false;
            }
        });

        console.log('✅ GSAP Hamburger Menu initialized');
    }

    function setupLinkHandlers(tl, closeCallback) {
        // Обработчики для основных ссылок меню
        const links = document.querySelectorAll('#mobile-nav-links a');

        // Обработчик для кнопки виртуального тура
        const tourBtn = document.querySelector('.virtual-tour-btn');
        if (tourBtn) {
            tourBtn.addEventListener('click', (e) => {
                e.preventDefault();
                tl.reverse();
                closeCallback();
                setTimeout(() => {
                    openVirtualTourModal();
                }, 600);
            });
        }

        links.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const action = link.dataset.action;

                // Закрываем меню
                tl.reverse();
                closeCallback();

                // Открываем соответствующую секцию с задержкой
                setTimeout(() => {
                    switch(action) {
                        case 'gym':
                            // Открываем модалку "О нас" (тренажерный зал)
                            openModalByTrigger('aboutModal', '.about-trigger');
                            break;
                        case 'relax':
                            // Открываем Релакс-зону
                            openModalByTrigger('relaxModal', '.relax-trigger');
                            break;
                        case 'ice':
                            // Открываем Ледовую Арену
                            openModalByTrigger('iceModal', '.ice-trigger');
                            break;
                        case 'pricing':
                            // Открываем Цены
                            openModal('pricingModal');
                            break;
                        case 'hotel':
                            // Переход на сайт отеля
                            window.open('https://pride34.ru/hotel', '_blank');
                            break;
                        case 'restaurant':
                            // Переход на сайт ресторана
                            window.open('https://pride34.ru/restaurant', '_blank');
                            break;
                        case 'tour':
                            // Виртуальный тур
                            openVirtualTourModal();
                            break;
                    }
                }, 600);
            });
        });
    }

    function openModalByTrigger(modalId, triggerSelector) {
        const trigger = document.querySelector(triggerSelector);
        if (trigger) {
            trigger.click();
        } else {
            openModal(modalId);
        }
    }

    function openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('active');
            modal.setAttribute('aria-hidden', 'false');
            // НЕ блокируем body.overflow - это ломает scroll на iOS

            // Dispatch custom event
            modal.dispatchEvent(new CustomEvent('modalopen'));
        }
    }

    function openVirtualTourModal() {
        // Проверяем, существует ли уже модальное окно
        let modal = document.getElementById('virtualTourModal');

        if (!modal) {
            // Создаём модальное окно
            modal = document.createElement('div');
            modal.id = 'virtualTourModal';
            modal.className = 'virtual-tour-modal';
            modal.innerHTML = `
                <div class="virtual-tour-modal__overlay"></div>
                <div class="virtual-tour-modal__content">
                    <button class="virtual-tour-modal__close" aria-label="Закрыть">
                        <span></span>
                        <span></span>
                    </button>
                    <iframe
                        src="http://tur.pride34.ru/"
                        frameborder="0"
                        allowfullscreen
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    ></iframe>
                </div>
            `;
            document.body.appendChild(modal);

            // Обработчики закрытия
            const closeBtn = modal.querySelector('.virtual-tour-modal__close');
            const overlay = modal.querySelector('.virtual-tour-modal__overlay');

            closeBtn.addEventListener('click', closeVirtualTourModal);
            overlay.addEventListener('click', closeVirtualTourModal);

            document.addEventListener('keydown', function escHandler(e) {
                if (e.key === 'Escape' && modal.classList.contains('active')) {
                    closeVirtualTourModal();
                }
            });
        }

        // Открываем модальное окно
        modal.classList.add('active');
        // НЕ блокируем body.overflow - это ломает scroll на iOS
    }

    function closeVirtualTourModal() {
        const modal = document.getElementById('virtualTourModal');
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

})();
