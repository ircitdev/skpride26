/**
 * 🎯 УПРАВЛЕНИЕ ХЭШАМИ ДЛЯ СЛАЙДОВ В МОДАЛЬНЫХ ОКНАХ
 * СК ПРАЙД
 *
 * Возможности:
 * - Обновление URL при переключении слайдов
 * - Открытие конкретного слайда по хэшу
 * - Поддержка формата: #sport/fight, #kids/first-steps
 */

(function() {
  'use strict';

  console.log('📦 modal-slide-hash.js загружен');

  // ============================================
  // КОНФИГУРАЦИЯ
  // ============================================

  const CONFIG = {
    // Селекторы слайдеров для каждого модального окна
    sliders: {
      'sportModal': {
        sliderId: 'sportSlider',
        cardClass: 'sport-card'
      },
      'kidsModal': {
        sliderId: 'kidsSlider',
        cardClass: 'kids-card'
      },
      'restModal': {
        sliderId: 'restSlider',
        cardClass: 'rest-card'
      },
      'eventsModal': {
        sliderId: 'eventsSlider',
        cardClass: 'events-card'
      }
    },

    // Задержка перед обновлением хэша после прокрутки (мс)
    scrollDebounceDelay: 300
  };

  // ============================================
  // УТИЛИТЫ
  // ============================================

  /**
   * Debounce функция
   */
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  /**
   * Получает активную карточку в слайдере
   */
  function getActiveCard(slider, cardClass) {
    if (!slider) return null;

    const cards = slider.querySelectorAll(`.${cardClass}`);
    const sliderRect = slider.getBoundingClientRect();
    const sliderCenter = sliderRect.left + sliderRect.width / 2;

    let closestCard = null;
    let closestDistance = Infinity;

    cards.forEach(card => {
      const cardRect = card.getBoundingClientRect();
      const cardCenter = cardRect.left + cardRect.width / 2;
      const distance = Math.abs(cardCenter - sliderCenter);

      if (distance < closestDistance) {
        closestDistance = distance;
        closestCard = card;
      }
    });

    return closestCard;
  }

  /**
   * Получает modalId из хэша (например, из #sport/fight возвращает sport)
   */
  function getModalIdFromHash(hash) {
    const cleanHash = hash.replace('#', '');
    const parts = cleanHash.split('/');

    // Маппинг хэша на modalId
    const hashToModalId = {
      'sport': 'sportModal',
      'kids': 'kidsModal',
      'rest': 'restModal',
      'events': 'eventsModal'
    };

    return hashToModalId[parts[0]] || null;
  }

  /**
   * Получает slideId из хэша (например, из #sport/fight возвращает fight)
   */
  function getSlideIdFromHash(hash) {
    const cleanHash = hash.replace('#', '');
    const parts = cleanHash.split('/');
    return parts[1] || null;
  }

  /**
   * Создает хэш из modalId и slideId
   */
  function createHash(modalId, slideId) {
    // Маппинг modalId на короткий хэш
    const modalIdToHash = {
      'sportModal': 'sport',
      'kidsModal': 'kids',
      'restModal': 'rest',
      'eventsModal': 'events'
    };

    const modalHash = modalIdToHash[modalId];
    if (!modalHash) return null;

    if (slideId) {
      return `#${modalHash}/${slideId}`;
    }

    return `#${modalHash}`;
  }

  // ============================================
  // УПРАВЛЕНИЕ ХЭШАМИ
  // ============================================

  /**
   * Обновляет хэш при прокрутке слайдера
   */
  function updateHashFromSlider(modalId) {
    const config = CONFIG.sliders[modalId];
    if (!config) return;

    const slider = document.getElementById(config.sliderId);
    if (!slider) return;

    const activeCard = getActiveCard(slider, config.cardClass);
    if (!activeCard) return;

    const slideId = activeCard.getAttribute('data-slide-id');
    if (!slideId) return;

    const newHash = createHash(modalId, slideId);
    if (newHash && window.location.hash !== newHash) {
      history.replaceState(null, null, newHash);
      console.log(`🔗 Хэш обновлен: ${newHash}`);
    }
  }

  /**
   * Прокручивает к конкретному слайду
   */
  function scrollToSlide(modalId, slideId) {
    const config = CONFIG.sliders[modalId];
    if (!config) {
      console.warn(`⚠️ Конфигурация для ${modalId} не найдена`);
      return false;
    }

    const slider = document.getElementById(config.sliderId);
    if (!slider) {
      console.warn(`⚠️ Слайдер ${config.sliderId} не найден`);
      return false;
    }

    const targetCard = slider.querySelector(`[data-slide-id="${slideId}"]`);
    if (!targetCard) {
      console.warn(`⚠️ Карточка с ID "${slideId}" не найдена`);
      return false;
    }

    // Прокручиваем к карточке
    targetCard.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'center'
    });

    console.log(`🎯 Прокрутка к слайду: ${modalId}/${slideId}`);
    return true;
  }

  /**
   * Обрабатывает изменение хэша
   */
  function handleHashChange() {
    const hash = window.location.hash;
    if (!hash || !hash.includes('/')) return;

    const modalId = getModalIdFromHash(hash);
    const slideId = getSlideIdFromHash(hash);

    if (!modalId || !slideId) return;

    // Проверяем, открыто ли модальное окно
    const modal = document.getElementById(modalId);
    if (!modal || !modal.classList.contains('active')) {
      return; // Модальное окно еще не открыто, обработаем позже
    }

    // Прокручиваем к слайду
    setTimeout(() => {
      scrollToSlide(modalId, slideId);
    }, 100);
  }

  // ============================================
  // ИНИЦИАЛИЗАЦИЯ СЛАЙДЕРА
  // ============================================

  /**
   * Инициализирует отслеживание слайдера
   */
  function initSliderTracking(modalId) {
    const config = CONFIG.sliders[modalId];
    if (!config) return;

    const slider = document.getElementById(config.sliderId);
    if (!slider) return;

    // Отслеживаем прокрутку с debounce
    const debouncedUpdate = debounce(() => {
      updateHashFromSlider(modalId);
    }, CONFIG.scrollDebounceDelay);

    slider.addEventListener('scroll', debouncedUpdate);

    console.log(`✅ Отслеживание слайдера ${modalId} инициализировано`);

    // Если в хэше есть slideId, прокручиваем к нему
    const hash = window.location.hash;
    if (hash && hash.includes('/')) {
      const hashModalId = getModalIdFromHash(hash);
      const slideId = getSlideIdFromHash(hash);

      if (hashModalId === modalId && slideId) {
        setTimeout(() => {
          scrollToSlide(modalId, slideId);
        }, 500); // Даем время на загрузку контента
      }
    }
  }

  /**
   * Инициализирует все слайдеры при открытии модального окна
   */
  function initModalSliders(modalId) {
    // Небольшая задержка, чтобы контент успел загрузиться
    setTimeout(() => {
      initSliderTracking(modalId);
    }, 100);
  }

  // ============================================
  // ИНИЦИАЛИЗАЦИЯ
  // ============================================

  /**
   * Инициализирует систему управления хэшами
   */
  function init() {
    console.log('🎬 Инициализация управления хэшами слайдов...');

    // Отслеживаем изменение хэша
    window.addEventListener('hashchange', handleHashChange);

    // Отслеживаем открытие модальных окон
    Object.keys(CONFIG.sliders).forEach(modalId => {
      const modal = document.getElementById(modalId);
      if (!modal) return;

      // Используем MutationObserver для отслеживания добавления класса 'active'
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.attributeName === 'class') {
            if (modal.classList.contains('active')) {
              initModalSliders(modalId);
            }
          }
        });
      });

      observer.observe(modal, {
        attributes: true,
        attributeFilter: ['class']
      });

      // Также слушаем кастомное событие modalopen
      modal.addEventListener('modalopen', () => {
        initModalSliders(modalId);
      });
    });

    // Если модальное окно уже открыто при загрузке страницы
    setTimeout(() => {
      Object.keys(CONFIG.sliders).forEach(modalId => {
        const modal = document.getElementById(modalId);
        if (modal && modal.classList.contains('active')) {
          initModalSliders(modalId);
        }
      });
    }, 1500);

    console.log('✅ Управление хэшами слайдов инициализировано');
  }

  // Экспортируем API
  window.PrideSlideHash = {
    init: init,
    scrollToSlide: scrollToSlide,
    updateHashFromSlider: updateHashFromSlider
  };

  // Автоматическая инициализация при загрузке
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
