/**
 * 🔗 ОБРАБОТЧИК URL И UTM МЕТОК ДЛЯ МОДАЛЬНЫХ ОКОН
 * СК ПРАЙД
 *
 * Возможности:
 * - Открытие модальных окон через URL hash (#sport, #kids, и т.д.)
 * - Сохранение UTM меток из URL
 * - Автоматическое добавление UTM меток к формам
 */

(function() {
  'use strict';

  console.log('📦 modal-url-handler.js загружен');

  // ============================================
  // СОХРАНЕНИЕ UTM МЕТОК
  // ============================================

  /**
   * Извлекает UTM метки из URL и сохраняет в sessionStorage
   */
  function saveUTMParams() {
    const urlParams = new URLSearchParams(window.location.search);
    const utmParams = {};

    // Список всех возможных UTM параметров
    const utmKeys = [
      'utm_source',
      'utm_medium',
      'utm_campaign',
      'utm_term',
      'utm_content',
      'utm_id',
      'gclid',  // Google Ads
      'fbclid', // Facebook Ads
      'yclid'   // Yandex Direct
    ];

    utmKeys.forEach(key => {
      const value = urlParams.get(key);
      if (value) {
        utmParams[key] = value;
        sessionStorage.setItem(key, value);
      }
    });

    if (Object.keys(utmParams).length > 0) {
      console.log('📊 UTM метки сохранены:', utmParams);
      return utmParams;
    }

    return null;
  }

  /**
   * Получает сохраненные UTM метки из sessionStorage
   */
  function getSavedUTMParams() {
    const utmParams = {};
    const utmKeys = [
      'utm_source',
      'utm_medium',
      'utm_campaign',
      'utm_term',
      'utm_content',
      'utm_id',
      'gclid',
      'fbclid',
      'yclid'
    ];

    utmKeys.forEach(key => {
      const value = sessionStorage.getItem(key);
      if (value) {
        utmParams[key] = value;
      }
    });

    return utmParams;
  }

  /**
   * Добавляет UTM метки к форме как скрытые поля
   */
  function addUTMToForm(form) {
    const utmParams = getSavedUTMParams();

    if (Object.keys(utmParams).length === 0) {
      return;
    }

    Object.keys(utmParams).forEach(key => {
      // Проверяем, нет ли уже такого поля
      let input = form.querySelector(`input[name="${key}"]`);

      if (!input) {
        // Создаем скрытое поле
        input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = utmParams[key];
        form.appendChild(input);
        console.log(`📝 Добавлено UTM поле в форму: ${key}=${utmParams[key]}`);
      } else {
        // Обновляем значение
        input.value = utmParams[key];
      }
    });
  }

  /**
   * Инициализирует обработку форм - добавляет UTM метки ко всем формам
   */
  function initFormHandlers() {
    const forms = document.querySelectorAll('form');

    forms.forEach(form => {
      addUTMToForm(form);

      // Добавляем UTM метки перед отправкой формы (на всякий случай)
      form.addEventListener('submit', function(e) {
        addUTMToForm(form);
      });
    });

    console.log(`✅ UTM метки добавлены к ${forms.length} формам`);
  }

  // ============================================
  // ОБРАБОТКА URL HASH ДЛЯ ОТКРЫТИЯ МОДАЛЬНЫХ ОКОН
  // ============================================

  /**
   * Маппинг hash -> ID модального окна
   */
  const MODAL_HASH_MAP = {
    'sport': 'sportModal',
    'kids': 'kidsModal',
    'rest': 'restModal',
    'events': 'eventsModal',
    'contacts': 'contactsModal',
    'about': 'aboutModal',
    'vesotdyh': 'relaxModal',
    'ice': 'iceModal',
    'pricing': 'pricingModal',
    'review': 'reviewModal',
    'leave-review': 'reviewFormModal',
    'plan-event': 'planEventModal'
  };

  /**
   * Открывает модальное окно по hash
   */
  function openModalByHash(hash) {
    // Убираем # из hash
    const cleanHash = hash.replace('#', '');

    if (!cleanHash) {
      return;
    }

    // Извлекаем базовый hash (первая часть до "/")
    // Например: "about/trainer-ivanov" -> "about"
    const baseHash = cleanHash.split('/')[0];

    // Получаем ID модального окна
    const modalId = MODAL_HASH_MAP[baseHash];

    if (!modalId) {
      console.warn(`⚠️ Неизвестный hash: ${baseHash}`);
      return;
    }

    // Ищем модальное окно
    const modal = document.getElementById(modalId);

    if (!modal) {
      console.warn(`⚠️ Модальное окно не найдено: ${modalId}`);
      return;
    }

    console.log(`🔗 Открытие модального окна по hash: ${baseHash} -> ${modalId}`);

    // Открываем модальное окно через задержку,
    // чтобы премиум анимации успели инициализироваться (они инициализируются через 1000ms)
    setTimeout(() => {
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';

      // Триггерим событие для премиум анимаций и aboutModal
      modal.dispatchEvent(new Event('modalopen'));
    }, 1200);  // Увеличено с 300ms до 1200ms, чтобы премиум анимации успели загрузиться
  }

  /**
   * Обрабатывает изменение hash в URL
   */
  function handleHashChange() {
    const hash = window.location.hash;
    if (hash) {
      openModalByHash(hash);
    }
  }

  /**
   * Обновляет hash в URL при открытии модального окна
   */
  function updateHashOnModalOpen(modalId) {
    // Находим соответствующий hash для modalId
    const hash = Object.keys(MODAL_HASH_MAP).find(
      key => MODAL_HASH_MAP[key] === modalId
    );

    if (hash) {
      // Обновляем hash - это триггерит событие hashchange
      window.location.hash = `#${hash}`;
      console.log(`🔗 Hash обновлен: #${hash}`);
    }
  }

  /**
   * Очищает hash при закрытии модального окна
   */
  function clearHashOnModalClose() {
    if (window.location.hash) {
      // Очищаем hash без перезагрузки страницы
      history.pushState(null, null, window.location.pathname + window.location.search);
      console.log('🔗 Hash очищен');
    }
  }

  // ============================================
  // ИНИЦИАЛИЗАЦИЯ
  // ============================================

  /**
   * Инициализирует обработчик URL и UTM меток
   */
  function init() {
    console.log('🎬 Инициализация обработчика URL и UTM меток...');

    // Сохраняем UTM метки при загрузке страницы
    saveUTMParams();

    // Обрабатываем изменение hash
    window.addEventListener('hashchange', handleHashChange);

    // Проверяем hash при загрузке страницы
    if (window.location.hash) {
      handleHashChange();
    }

    // Используем делегирование событий для кнопок открытия модальных окон
    // Это работает даже для кнопок, загруженных динамически через fetch
    document.addEventListener('click', function(e) {
      const button = e.target.closest('[data-modal]');
      if (button) {
        e.preventDefault(); // Предотвращаем переход по ссылке
        const modalId = button.getAttribute('data-modal');
        if (modalId) {
          updateHashOnModalOpen(modalId);
        }
      }
    });

    // Добавляем обработчики для кнопок закрытия модальных окон
    const closeButtons = document.querySelectorAll('[id^="close"], .modal-close, .close-btn');
    closeButtons.forEach(button => {
      button.addEventListener('click', function() {
        clearHashOnModalClose();
      });
    });

    // Добавляем обработчик для закрытия по overlay
    const modals = document.querySelectorAll('.sport-modal, .kids-modal, .rest-modal, .events-modal, .contacts-modal, .about-modal, .relax-modal, .pricing-modal');
    modals.forEach(modal => {
      modal.addEventListener('click', function(e) {
        if (e.target === this) {
          clearHashOnModalClose();
        }
      });
    });

    // Инициализируем обработку форм после загрузки DOM
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initFormHandlers);
    } else {
      initFormHandlers();
    }

    // Переинициализируем формы при открытии модальных окон
    // (на случай если формы загружаются динамически)
    modals.forEach(modal => {
      modal.addEventListener('modalopen', function() {
        const forms = this.querySelectorAll('form');
        forms.forEach(form => addUTMToForm(form));
      });
    });

    console.log('✅ Обработчик URL и UTM меток инициализирован');
  }

  // Экспортируем API
  window.PrideURLHandler = {
    init: init,
    saveUTMParams: saveUTMParams,
    getSavedUTMParams: getSavedUTMParams,
    addUTMToForm: addUTMToForm,
    openModalByHash: openModalByHash,
    updateHashOnModalOpen: updateHashOnModalOpen,
    clearHashOnModalClose: clearHashOnModalClose
  };

  // Автоматическая инициализация при загрузке
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
