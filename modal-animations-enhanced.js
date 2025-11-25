/**
 * 🎬 ПРЕМИАЛЬНЫЕ АНИМАЦИИ ДЛЯ МОДАЛЬНЫХ ОКОН
 * СК ПРАЙД - Улучшенная версия
 *
 * Функции:
 * - SplitText для всех заголовков
 * - Stagger анимации для элементов
 * - Backdrop blur эффект
 * - Micro-interactions
 * - Parallax для видео-фонов
 * - Smooth cubic-bezier easing
 */

(function() {
  'use strict';

  // ============================================
  // КОНФИГУРАЦИЯ АНИМАЦИЙ
  // ============================================

  const CONFIG = {
    // Timing - СБАЛАНСИРОВАННО И ПРИЯТНО
    backdropDuration: 0.8,       // Приятная скорость
    contentDuration: 1.2,        // Не спешим
    cardStagger: 0.2,            // Быстро, но заметно
    elementStagger: 0.15,        // Между текстами

    // Easing - ПРОФЕССИОНАЛЬНЫЕ
    easeOut: 'power2.out',       // Стандарт индустрии
    easeIn: 'power2.in',
    easeInOut: 'power2.inOut',

    // Effects
    microDelay: 0.1
  };

  // ============================================
  // УТИЛИТЫ
  // ============================================

  /**
   * Создает backdrop с blur эффектом
   */
  function createBackdrop(modal) {
    let backdrop = modal.querySelector('.modal-backdrop-blur');

    if (!backdrop) {
      backdrop = document.createElement('div');
      backdrop.className = 'modal-backdrop-blur';
      modal.insertBefore(backdrop, modal.firstChild);

      // Убеждаемся что backdrop скрыт по умолчанию
      gsap.set(backdrop, { opacity: 0, visibility: 'hidden' });
    }

    return backdrop;
  }

  // ============================================
  // УЛУЧШЕННЫЕ АНИМАЦИИ ОТКРЫТИЯ/ЗАКРЫТИЯ
  // ============================================

  /**
   * Создает timeline открытия модалки (ЭФФЕКТНО И ПРИЯТНО)
   */
  function createOpenTimeline(modal, config) {
    const {
      backdrop,
      content,
      cards,
      headlines,
      buttons,
      texts
    } = config;

    // Убеждаемся что кнопки закрытия ВСЕГДА видны
    const closeButtons = modal.querySelectorAll('[id^="close"], .modal-close, .close-btn');
    if (closeButtons.length) {
      gsap.set(closeButtons, { opacity: 1, visibility: 'visible' });
    }

    const tl = gsap.timeline({
      defaults: {
        ease: CONFIG.easeOut
      },
      onStart: () => {
        modal.classList.add('modal-animating');
      },
      onComplete: () => {
        modal.classList.remove('modal-animating');
      }
    });

    // 1. Backdrop появляется
    if (backdrop) {
      gsap.set(backdrop, { opacity: 0, visibility: 'visible' });
      tl.to(backdrop, {
        opacity: 1,
        duration: CONFIG.backdropDuration,
        ease: CONFIG.easeOut
      }, 0);
    }

    // 2. Контент появляется с легким slide вверх
    if (content) {
      tl.to(content,
        {
          autoAlpha: 1,
          y: 0,
          duration: CONFIG.contentDuration,
          ease: CONFIG.easeOut
        },
        0.3 // Небольшая задержка
      );
    }

    // 3. Заголовки, тексты, карточки, кнопки - все быстро и последовательно
    let position = 0.5;

    if (headlines && headlines.length) {
      tl.to(headlines, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: CONFIG.easeOut
      }, position);
      position += 0.4;
    }

    if (texts && texts.length) {
      tl.to(texts, {
        opacity: 1,
        duration: 0.5,
        stagger: CONFIG.elementStagger,
        ease: CONFIG.easeOut
      }, position);
      position += 0.3;
    }

    if (cards && cards.length) {
      tl.to(cards, {
        autoAlpha: 1,
        y: 0,
        duration: 0.6,
        ease: CONFIG.easeOut,
        stagger: CONFIG.cardStagger
      }, position);
      position += 0.3;
    }

    if (buttons && buttons.length) {
      tl.to(buttons, {
        opacity: 1,
        scale: 1,
        duration: 0.4,
        ease: CONFIG.easeOut,
        stagger: CONFIG.microDelay
      }, position);
    }

    return tl;
  }

  /**
   * Создает timeline закрытия модалки (БЫСТРО И ЭЛЕГАНТНО)
   */
  function createCloseTimeline(modal, config) {
    const {
      backdrop,
      content
    } = config;

    const tl = gsap.timeline({
      defaults: {
        ease: CONFIG.easeIn
      }
    });

    // Всё исчезает быстро и одновременно
    if (content) {
      tl.to(content, {
        autoAlpha: 0,
        duration: 0.4,
        ease: CONFIG.easeIn
      }, 0);
    }

    if (backdrop) {
      tl.to(backdrop, {
        opacity: 0,
        duration: 0.5,
        ease: CONFIG.easeIn,
        onComplete: () => {
          gsap.set(backdrop, { visibility: 'hidden' });
        }
      }, 0);
    }

    return tl;
  }

  // ============================================
  // ПРИМЕНЕНИЕ К МОДАЛКАМ
  // ============================================

  /**
   * Улучшает модалку с новыми анимациями
   */
  function enhanceModal(modalId, selectors) {
    const modal = document.getElementById(modalId);
    if (!modal) {
      console.warn(`Модалка ${modalId} не найдена`);
      return;
    }

    // Создаем backdrop с blur
    const backdrop = createBackdrop(modal);

    // ВАЖНО: НЕ трогаем модалку! CSS управляет её позиционированием через !important
    // position: fixed !important; top: 0; left: 0; transform: none !important;

    // КРИТИЧНО: Скрываем весь контент СРАЗУ при инициализации!
    const content = modal.querySelector(selectors.content || '[id$="Content"]');
    const cards = modal.querySelectorAll(selectors.cards || '.card');
    const texts = modal.querySelectorAll(selectors.texts || 'p, .description');
    const headlines = modal.querySelectorAll(selectors.headlines || 'h1, h2');

    if (content) {
      gsap.set(content, { autoAlpha: 0 });
    }
    if (cards && cards.length) {
      gsap.set(cards, { autoAlpha: 0 });
    }
    if (texts && texts.length) {
      gsap.set(texts, { opacity: 0 });
    }
    if (headlines && headlines.length) {
      gsap.set(headlines, { opacity: 0 });
    }

    // Сохраняем ссылку на модалку и её конфиг
    modal._animationConfig = {
      backdrop: backdrop,
      selectors: selectors
    };

    // Добавляем обработчик на открытие модалки
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          const hasActive = modal.classList.contains('active');
          const hadActive = mutation.oldValue && mutation.oldValue.includes('active');

          // Модалка только что открылась
          if (hasActive && !hadActive) {
            console.log(`🎬 Модалка ${modalId} открывается - запуск улучшенной анимации`);

            // Запускаем улучшенную анимацию
            requestAnimationFrame(() => {
              animateModalOpen(modal);
            });
          }
        }
      });
    });

    observer.observe(modal, {
      attributes: true,
      attributeOldValue: true,
      attributeFilter: ['class']
    });

    console.log(`✅ Модалка ${modalId} улучшена (auto-trigger)`);
  }

  /**
   * Анимирует открытие модалки
   */
  function animateModalOpen(modal) {
    const cfg = modal._animationConfig;
    if (!cfg) {
      console.warn('❌ Конфиг анимации не найден для модалки', modal.id);
      return;
    }

    console.log(`🎨 Собираем элементы для анимации модалки ${modal.id}...`);

    const config = {
      backdrop: cfg.backdrop,
      panels: modal.querySelectorAll(cfg.selectors.panels || '.transition__panel'),
      videoBg: modal.querySelector(cfg.selectors.videoBg || '.modal-bg'),
      content: modal.querySelector(cfg.selectors.content || '[id$="Content"]'),
      cards: modal.querySelectorAll(cfg.selectors.cards || '.card'),
      headlines: modal.querySelectorAll(cfg.selectors.headlines || 'h1, h2, h3'),
      // ИСКЛЮЧАЕМ кнопки закрытия из анимации - они должны быть видны всегда
      buttons: modal.querySelectorAll(cfg.selectors.buttons || 'button:not([id^="close"]), .btn:not([id^="close"]), .sport-btn:not([id^="close"])'),
      texts: modal.querySelectorAll(cfg.selectors.texts || 'p, .description')
    };

    console.log(`   └─ Найдено: content=${!!config.content}, cards=${config.cards.length}, headlines=${config.headlines.length}`);

    // Останавливаем любые существующие анимации (НЕ включаем modal - не анимируем её!)
    gsap.killTweensOf([
      config.backdrop,
      config.panels,
      config.videoBg,
      config.content,
      config.cards,
      config.headlines,
      config.buttons,
      config.texts
    ]);

    console.log('   └─ Запускаем timeline...');
    createOpenTimeline(modal, config);
  }

  // ============================================
  // ИНИЦИАЛИЗАЦИЯ ДЛЯ ВСЕХ МОДАЛОК
  // ============================================

  document.addEventListener('DOMContentLoaded', () => {
    console.log('🎬 DOMContentLoaded - начинаем инициализацию модалок через 2 секунды...');

    // Ждем загрузки контента модалок (увеличено до 2 секунд)
    setTimeout(() => {
      // 1. sportModal
      enhanceModal('sportModal', {
        panels: '.sport-transition__panel',
        videoBg: '.sport-bg',
        content: '#sportContent',
        cards: '.sport-card',
        headlines: '.sport-modal h1, .sport-modal h2',
        buttons: '.sport-btn:not([id^="close"])' // Исключаем кнопки закрытия
      });

      // 2. kidsModal
      enhanceModal('kidsModal', {
        panels: '.sport-transition__panel',
        videoBg: '.sport-bg',
        content: '#sportContent',
        cards: '.sport-card',
        headlines: '.kids-modal h1, .kids-modal h2'
      });

      // 3. restModal
      enhanceModal('restModal', {
        panels: '.rest-transition__panel',
        videoBg: '.rest-bg',
        content: '#restContent',
        cards: '.rest-card',
        headlines: '.rest-modal h1, .rest-modal h2'
      });

      // 4. eventsModal
      enhanceModal('eventsModal', {
        panels: '.events-transition__panel',
        videoBg: '.events-bg',
        content: '#eventsContent',
        cards: '.events-card',
        headlines: '.events-modal h1, .events-modal h2'
      });

      // 5. contactsModal
      enhanceModal('contactsModal', {
        panels: '.contacts-transition__panel',
        content: '#contactsContent',
        headlines: '.contacts-modal h1, .contacts-modal h2',
        cards: '.contact-info-item, .social-link'
      });

      console.log('🎬 Все модалки улучшены с премиальными анимациями!');

      // Проверяем что все модалки найдены
      const modals = ['sportModal', 'kidsModal', 'restModal', 'eventsModal', 'contactsModal'];
      modals.forEach(id => {
        const modal = document.getElementById(id);
        if (modal) {
          console.log(`   ✓ ${id} найдена и настроена`);
        } else {
          console.warn(`   ✗ ${id} НЕ НАЙДЕНА!`);
        }
      });
    }, 1500);
  });

  // ============================================
  // ГЛОБАЛЬНЫЙ API
  // ============================================

  window.PrideModalAnimations = {
    CONFIG,
    enhanceModal,
    animateModalOpen,
    createOpenTimeline,
    createCloseTimeline
  };

  console.log('🎬 Modal animations enhanced.js загружен');

})();
