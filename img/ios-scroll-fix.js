/**
 * iOS Safari Scroll Fix
 * Управляет блокировкой прокрутки body при открытых модалках
 */

(function() {
  'use strict';

  // Определяем iOS
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

  if (!isIOS) return; // Фиксы только для iOS

  let scrollPosition = 0;

  // Функция блокировки прокрутки
  function disableBodyScroll() {
    scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
    document.body.classList.add('modal-open');
    document.body.style.top = `-${scrollPosition}px`;
  }

  // Функция разблокировки прокрутки
  function enableBodyScroll() {
    document.body.classList.remove('modal-open');
    document.body.style.top = '';
    window.scrollTo(0, scrollPosition);
  }

  // Отслеживаем открытие всех модальных окон
  const modalSelectors = [
    '#sportModal',
    '#restModal',
    '#kidsModal',
    '#eventsModal',
    '#iceModal',
    '#aboutModal',
    '#pricingModal',
    '#contactsModal',
    '#reviewModal',
    '#planEventModal',
    '#tourModal'
  ];

  // Отслеживаем изменения класса 'active' на модалках
  const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      if (mutation.attributeName === 'class') {
        const target = mutation.target;
        if (target.classList.contains('active')) {
          disableBodyScroll();
        } else {
          // Проверяем, есть ли другие открытые модалки
          const hasOpenModal = modalSelectors.some(selector => {
            const modal = document.querySelector(selector);
            return modal && modal.classList.contains('active');
          });

          if (!hasOpenModal) {
            enableBodyScroll();
          }
        }
      }
    });
  });

  // Начинаем наблюдение за всеми модальными окнами
  document.addEventListener('DOMContentLoaded', function() {
    modalSelectors.forEach(function(selector) {
      const modal = document.querySelector(selector);
      if (modal) {
        observer.observe(modal, {
          attributes: true,
          attributeFilter: ['class']
        });
      }
    });
  });

  // Также отслеживаем боковые панели
  const sidePanelSelectors = [
    '#scheduleModal',
    '#fulldescModal',
    '.slide-selector-panel'
  ];

  sidePanelSelectors.forEach(function(selector) {
    const observerConfig = { attributes: true, attributeFilter: ['class'] };
    const callback = function(mutations) {
      mutations.forEach(function(mutation) {
        const target = mutation.target;
        if (target.classList.contains('active')) {
          disableBodyScroll();
        } else {
          enableBodyScroll();
        }
      });
    };

    setTimeout(function() {
      const panel = document.querySelector(selector);
      if (panel) {
        const panelObserver = new MutationObserver(callback);
        panelObserver.observe(panel, observerConfig);
      }
    }, 1000);
  });

  // Фикс для viewport height на iOS
  function setVH() {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  }

  // Устанавливаем правильную высоту viewport
  setVH();
  window.addEventListener('resize', setVH);
  window.addEventListener('orientationchange', function() {
    setTimeout(setVH, 100);
  });

  console.log('🍎 iOS scroll fixes активированы');
})();
