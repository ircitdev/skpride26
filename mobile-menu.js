/**
 * 📱 Мобильное гамбургер меню с CSS transitions
 * СК ПРАЙД
 */

(function() {
  'use strict';

  // Ждем загрузки DOM
  document.addEventListener('DOMContentLoaded', initMobileMenu);

  function initMobileMenu() {
    const hamburger = document.getElementById('hamburger-menu');
    const mobileNav = document.getElementById('mobile-nav');

    if (!hamburger || !mobileNav) {
      console.log('Mobile menu elements not found');
      return;
    }

    let isOpen = false;

    // Клик по гамбургеру - используем CSS transitions вместо GSAP
    hamburger.addEventListener('click', () => {
      if (isOpen) {
        mobileNav.classList.remove('active');
        hamburger.classList.remove('menu-open');
        document.body.classList.remove('mobile-menu-open');
      } else {
        mobileNav.classList.add('active');
        hamburger.classList.add('menu-open');
        document.body.classList.add('mobile-menu-open');
      }
      isOpen = !isOpen;
    });

    // Закрытие меню по клику на ссылку
    const menuLinks = mobileNav.querySelectorAll('a');
    menuLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');

        // Если это модальное окно - обрабатываем специально
        if (link.dataset.modal) {
          e.preventDefault();
          closeMenu();

          // Открываем модальное окно с небольшой задержкой
          setTimeout(() => {
            const modalId = link.dataset.modal;
            const modal = document.getElementById(modalId);
            if (modal) {
              modal.classList.add('active');
              document.body.classList.add('modal-open');
            }
          }, 400);
        } else if (href && href !== '#') {
          closeMenu();
        } else {
          e.preventDefault();
          closeMenu();
        }
      });
    });

    // Функция закрытия меню
    function closeMenu() {
      if (isOpen) {
        mobileNav.classList.remove('active');
        hamburger.classList.remove('menu-open');
        document.body.classList.remove('mobile-menu-open');
        isOpen = false;
      }
    }

    // Закрытие по клику на кнопку X
    const closeBtn = document.getElementById('mobile-nav-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', closeMenu);
    }

    // Закрытие по ESC
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && isOpen) {
        closeMenu();
      }
    });

    // Обработка кликов для открытия модальных окон
    setupModalTriggers();
  }

  function setupModalTriggers() {
    // Тренажерный зал -> sportModal
    const gymLink = document.querySelector('#mobile-nav a[data-action="gym"]');
    if (gymLink) {
      gymLink.addEventListener('click', (e) => {
        e.preventDefault();
        triggerClick('sportBtn');
      });
    }

    // Релакс-зона -> restModal
    const relaxLink = document.querySelector('#mobile-nav a[data-action="relax"]');
    if (relaxLink) {
      relaxLink.addEventListener('click', (e) => {
        e.preventDefault();
        triggerClick('restBtn');
      });
    }

    // Ледовая арена -> iceModal (открываем напрямую)
    const iceLink = document.querySelector('#mobile-nav a[data-action="ice"]');
    if (iceLink) {
      iceLink.addEventListener('click', (e) => {
        e.preventDefault();
        openModal('iceModal');
      });
    }

    // Цены -> pricingModal
    const pricingLink = document.querySelector('#mobile-nav a[data-action="pricing"]');
    if (pricingLink) {
      pricingLink.addEventListener('click', (e) => {
        e.preventDefault();
        openModal('pricingModal');
      });
    }
  }

  function triggerClick(btnId) {
    const btn = document.getElementById(btnId);
    if (btn) {
      btn.click();
    }
  }

  function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      // Карта модальных окон и их HTML файлов
      const modalFiles = {
        'iceModal': 'iceModal.html',
        'pricingModal': 'pricingModal.html',
        'relaxModal': 'relaxModal.html'
      };

      // Загружаем контент если нужно
      if (modalFiles[modalId] && modal.children.length <= 1) {
        fetch(modalFiles[modalId])
          .then(res => res.text())
          .then(html => {
            modal.innerHTML = html;
            modal.classList.add('active');
            document.body.classList.add('modal-open');
            // Обновляем URL хэш
            if (window.PrideURLHandler) {
              window.PrideURLHandler.updateHashOnModalOpen(modalId);
            }
          })
          .catch(err => {
            console.error('Error loading modal content:', err);
          });
      } else {
        modal.classList.add('active');
        document.body.classList.add('modal-open');
        if (window.PrideURLHandler) {
          window.PrideURLHandler.updateHashOnModalOpen(modalId);
        }
      }
    }
  }

})();
