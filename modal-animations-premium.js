/**
 * 🎬 ПРЕМИУМ АНИМАЦИИ ДЛЯ МОДАЛЬНЫХ ОКОН
 * СК ПРАЙД - Стильная версия с эффектными переходами
 *
 * Возможности:
 * - Стильное открытие модального окна с scale + fade
 * - Анимация текста с эффектом разделения на слова
 * - Последовательная анимация sport-card элементов
 * - Плавное закрытие модального окна
 * - GPU-ускоренные трансформации
 */

(function() {
  'use strict';

  // ============================================
  // КОНФИГУРАЦИЯ
  // ============================================

  const ANIMATION_CONFIG = {
    // Длительности
    duration: {
      modalOpen: 0.8,           // Открытие модального окна
      modalClose: 0.9,          // Закрытие модального окна (ПЛАВНЕЕ: было 0.5)
      backdrop: 0.6,            // Backdrop fade
      text: 1.2,                // Анимация текста (МЕДЛЕННЕЕ: было 0.7)
      card: 0.6,                // Анимация карточки
      introDisplay: 2.0,        // Время показа статистики и intro (2 секунды)
      introFadeOut: 1.2,        // Время исчезновения intro (ОЧЕНЬ ПЛАВНО: было 0.8)
    },

    // Задержки
    delay: {
      textAfterModal: 0.3,      // Текст после открытия модалки
      cardsAfterText: 0.2,      // Карточки после текста
      cardStagger: 0.15,        // Между каждой карточкой
      wordStagger: 0.05,        // Между словами в тексте (МЕДЛЕННЕЕ: было 0.03)
    },

    // Easing функции
    ease: {
      modalOpen: 'power3.out',       // Плавное замедление
      modalClose: 'power1.inOut',    // ОЧЕНЬ ПЛАВНОЕ исчезновение (было 'power2.in')
      text: 'power1.out',            // ПЛАВНЕЕ: было 'back.out(1.2)' (без отскока)
      card: 'power2.out',            // Стандартное замедление
      backdrop: 'power2.inOut',      // Симметричное
    },

    // Эффекты
    effects: {
      modalScale: 0.9,          // Начальный scale модалки
      textY: 20,                // Сдвиг текста вверх (МЕНЬШЕ: было 30)
      cardY: 50,                // Сдвиг карточек вверх
      cardRotation: 3,          // Легкий поворот карточек
    }
  };

  // ============================================
  // УТИЛИТЫ
  // ============================================

  /**
   * Создает или находит backdrop элемент
   */
  function ensureBackdrop(modal) {
    let backdrop = modal.querySelector('.modal-backdrop-premium');

    if (!backdrop) {
      backdrop = document.createElement('div');
      backdrop.className = 'modal-backdrop-premium';
      modal.insertBefore(backdrop, modal.firstChild);
    }

    return backdrop;
  }

  /**
   * Разбивает текст на слова для анимации
   */
  function splitTextIntoWords(element) {
    const text = element.textContent;
    const words = text.split(' ');

    element.innerHTML = words.map(word =>
      `<span class="word-wrapper"><span class="word-animated">${word}</span></span>`
    ).join(' ');

    return element.querySelectorAll('.word-animated');
  }

  /**
   * Подготавливает элементы к анимации
   */
  function prepareElements(modal, selectors) {
    const elements = {
      backdrop: ensureBackdrop(modal),
      content: modal.querySelector(selectors.content),
      videoBg: modal.querySelector(selectors.videoBg),
      statsSection: modal.querySelector(selectors.stats),
      introText: modal.querySelector(selectors.intro),
      cards: Array.from(modal.querySelectorAll(selectors.cards)),
      headlines: Array.from(modal.querySelectorAll(selectors.headlines)),
    };

    // Собираем все текстовые элементы для анимации слов
    elements.textElements = [];
    if (elements.statsSection) {
      elements.textElements.push(...elements.statsSection.querySelectorAll('span, p'));
    }
    if (elements.introText) {
      elements.textElements.push(elements.introText);
    }

    return elements;
  }

  // ============================================
  // АНИМАЦИЯ ОТКРЫТИЯ
  // ============================================

  /**
   * Создает timeline открытия модального окна
   * НОВАЯ ЛОГИКА: Сначала статистика и текст (5 сек), потом карточки
   */
  function createOpenAnimation(modal, elements) {
    const cfg = ANIMATION_CONFIG;

    // Intro показываем каждый раз при открытии модального окна
    const introKey = `pride_intro_shown_${modal.id}`;
    const introAlreadyShown = false; // Всегда показываем intro

    // Главный timeline
    const masterTL = gsap.timeline({
      onStart: () => {
        modal.classList.add('modal-animating');
        console.log('🎬 Начало анимации открытия:', modal.id);
        console.log('🎥 Intro будет показан');
      },
      onComplete: () => {
        modal.classList.remove('modal-animating');
        console.log('✅ Анимация открытия завершена:', modal.id);
      }
    });

    // ========================================
    // ФАЗА 1: Backdrop + Модальное окно (0s - 0.8s)
    // ========================================

    // Backdrop появляется
    masterTL.fromTo(elements.backdrop,
      {
        opacity: 0,
        visibility: 'hidden',
        backdropFilter: 'blur(0px)',
      },
      {
        opacity: 1,
        visibility: 'visible',
        backdropFilter: 'blur(20px)',
        duration: cfg.duration.backdrop,
        ease: cfg.ease.backdrop,
      },
      0
    );

    // Контент модального окна появляется с масштабированием
    if (elements.content) {
      masterTL.fromTo(elements.content,
        {
          opacity: 0,
          visibility: 'hidden',
          scale: cfg.effects.modalScale,
          y: 30,
        },
        {
          opacity: 1,
          visibility: 'visible',
          scale: 1,
          y: 0,
          duration: cfg.duration.modalOpen,
          ease: cfg.ease.modalOpen,
        },
        0.2 // Небольшая задержка после backdrop
      );
    }

    // Видео-фон плавно проявляется
    if (elements.videoBg) {
      masterTL.fromTo(elements.videoBg,
        { opacity: 0 },
        {
          opacity: 1,
          duration: cfg.duration.backdrop,
          ease: cfg.ease.backdrop,
        },
        0
      );
    }

    // ========================================
    // ФАЗА 2: Статистика и intro текст (0.5s - 1.5s)
    // ПОКАЗЫВАЕМ НА 2 СЕКУНДЫ, ПОТОМ СКРЫВАЕМ
    // ИЛИ ПРОПУСКАЕМ, ЕСЛИ УЖЕ БЫЛ ПОКАЗАН
    // ========================================

    // ОТЛАДКА: Intro всегда показывается
    // if (introAlreadyShown) {
    //   if (elements.statsSection) {
    //     gsap.set(elements.statsSection, { visibility: 'hidden', opacity: 0 });
    //   }
    //   if (elements.introText) {
    //     gsap.set(elements.introText, { visibility: 'hidden', opacity: 0 });
    //   }
    //   modal.classList.add('intro-hidden');
    // }

    const textStartTime = cfg.duration.modalOpen * 0.5;

    // Анимация статистики (только если intro еще не был показан)
    if (elements.statsSection && !introAlreadyShown) {
      // Делаем секцию статистики видимой
      gsap.set(elements.statsSection, { visibility: 'visible' });

      const statItems = elements.statsSection.querySelectorAll('div');

      // Появление статистики
      masterTL.fromTo(statItems,
        {
          opacity: 0,
          scale: 0.8,
          y: 20,
        },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: cfg.duration.text,
          ease: cfg.ease.text,
          stagger: 0.1,
        },
        textStartTime
      );

      // ПАУЗА 5 секунд (держим на экране)
      const hideIntroTime = textStartTime + cfg.duration.text + cfg.duration.introDisplay;

      // ОТЛАДКА: Отключено исчезновение статистики
      // masterTL.to(statItems, {
      //   opacity: 0,
      //   y: -60,
      //   duration: cfg.duration.introFadeOut,
      //   ease: 'power1.inOut',
      //   stagger: 0.05,
      // }, hideIntroTime);
    }

    // Анимация intro текста (только если intro еще не был показан)
    if (elements.introText && !introAlreadyShown) {
      // Делаем intro текст видимым
      gsap.set(elements.introText, { visibility: 'visible' });

      const words = splitTextIntoWords(elements.introText);

      // Появление intro текста
      masterTL.fromTo(words,
        {
          opacity: 0,
          y: cfg.effects.textY,
        },
        {
          opacity: 1,
          y: 0,
          duration: cfg.duration.text,
          ease: cfg.ease.text,
          stagger: cfg.delay.wordStagger,
        },
        textStartTime + 0.2
      );

      // ПАУЗА 5 секунд
      const hideIntroTime = textStartTime + cfg.duration.text + cfg.duration.introDisplay;

      // ОТЛАДКА: Отключено исчезновение intro текста
      // masterTL.to(words, {
      //   opacity: 0,
      //   y: -60,
      //   duration: cfg.duration.introFadeOut,
      //   ease: 'power1.inOut',
      //   stagger: 0.01,
      // }, hideIntroTime);

      // ОТЛАДКА: Отключено скрытие контейнера intro
      // masterTL.to(elements.introText, {
      //   visibility: 'hidden',
      //   duration: 0,
      // }, hideIntroTime + cfg.duration.introFadeOut);
    }

    // ОТЛАДКА: Отключено скрытие статистики и intro-hidden
    // if (elements.statsSection && !introAlreadyShown) {
    //   const hideIntroTime = textStartTime + cfg.duration.text + cfg.duration.introDisplay;
    //   masterTL.to(elements.statsSection, {
    //     visibility: 'hidden',
    //     duration: 0,
    //   }, hideIntroTime + cfg.duration.introFadeOut);
    //
    //   masterTL.call(() => {
    //     modal.classList.add('intro-hidden');
    //     console.log('📦 Intro скрыт, слайдер центрируется');
    //     console.log('✨ Intro завершен');
    //   }, null, hideIntroTime + cfg.duration.introFadeOut);
    // }

    // ========================================
    // ФАЗА 3: Карточки (после исчезновения intro или сразу если intro пропущен)
    // ========================================

    // Карточки появляются:
    // - ПОСЛЕ исчезновения статистики и intro (если intro показан)
    // - СРАЗУ после backdrop (если intro пропущен)
    const cardsStartTime = introAlreadyShown
      ? cfg.duration.modalOpen + 0.3
      : textStartTime + cfg.duration.text + cfg.duration.introDisplay + cfg.duration.introFadeOut + 0.2;

    if (elements.cards.length > 0) {
      elements.cards.forEach((card, index) => {
        // Основная анимация карточки
        const cardTL = gsap.timeline();

        cardTL.fromTo(card,
          {
            opacity: 0,
            visibility: 'hidden',
            y: cfg.effects.cardY,
            rotationY: cfg.effects.cardRotation,
            scale: 0.95,
          },
          {
            opacity: 1,
            visibility: 'visible',
            y: 0,
            rotationY: 0,
            scale: 1,
            duration: cfg.duration.card,
            ease: cfg.ease.card,
          }
        );

        // Анимация содержимого карточки
        const cardImage = card.querySelector('img');
        const cardHeading = card.querySelector('h3');
        const cardText = card.querySelector('p');
        const cardButtons = card.querySelectorAll('.sport-btn, a');

        if (cardImage) {
          cardTL.fromTo(cardImage,
            {
              scale: 1.2,
              opacity: 0,
            },
            {
              scale: 1,
              opacity: 1,
              duration: 0.5,
              ease: 'power2.out',
            },
            0
          );
        }

        if (cardHeading) {
          cardTL.fromTo(cardHeading,
            {
              opacity: 0,
              y: 20,
            },
            {
              opacity: 1,
              y: 0,
              duration: 0.4,
              ease: 'power2.out',
            },
            0.1
          );
        }

        if (cardText) {
          cardTL.fromTo(cardText,
            {
              opacity: 0,
            },
            {
              opacity: 1,
              duration: 0.4,
              ease: 'power2.out',
            },
            0.2
          );
        }

        if (cardButtons.length > 0) {
          cardTL.fromTo(cardButtons,
            {
              opacity: 0,
              y: 10,
            },
            {
              opacity: 1,
              y: 0,
              duration: 0.3,
              ease: 'back.out(1.5)',
              stagger: 0.05,
            },
            0.3
          );
        }

        // Добавляем в основной timeline с задержкой
        masterTL.add(cardTL, cardsStartTime + (index * cfg.delay.cardStagger));
      });
    }

    return masterTL;
  }

  // ============================================
  // АНИМАЦИЯ ЗАКРЫТИЯ
  // ============================================

  /**
   * Создает timeline закрытия модального окна
   */
  function createCloseAnimation(modal, elements) {
    const cfg = ANIMATION_CONFIG;

    const closeTL = gsap.timeline({
      onStart: () => {
        modal.classList.add('modal-closing');
        console.log('🎬 Начало анимации закрытия:', modal.id);
      },
      onComplete: () => {
        modal.classList.remove('modal-closing', 'active');
        console.log('✅ Анимация закрытия завершена:', modal.id);

        // Сбрасываем все элементы к начальному состоянию
        resetModalElements(modal, elements);
      }
    });

    // Карточки исчезают первыми (в обратном порядке) - ВВЕРХ очень плавно
    if (elements.cards.length > 0) {
      closeTL.to(elements.cards.reverse(),
        {
          opacity: 0,
          y: -80,  // Больше движение вверх (было -30)
          scale: 0.95,  // Меньше сжатие для плавности (было 0.9)
          duration: cfg.duration.modalClose,  // Полная длительность (было * 0.8)
          ease: cfg.ease.modalClose,  // power1.inOut - очень плавно
          stagger: 0.05,
        },
        0
      );
    }

    // Текст исчезает - ВВЕРХ очень плавно
    if (elements.content) {
      closeTL.to([elements.statsSection, elements.introText, ...elements.headlines].filter(Boolean),
        {
          opacity: 0,
          y: -60,  // Больше движение вверх (было -20)
          duration: cfg.duration.modalClose,  // Полная длительность (было * 0.6)
          ease: cfg.ease.modalClose,  // power1.inOut - очень плавно
          stagger: 0.03,
        },
        0.1
      );
    }

    // Контент исчезает - ВВЕРХ очень плавно
    closeTL.to(elements.content,
      {
        opacity: 0,
        scale: 0.95,
        y: -40,  // Добавлено движение вверх
        duration: cfg.duration.modalClose,
        ease: cfg.ease.modalClose,
      },
      0.2
    );

    closeTL.to(elements.backdrop,
      {
        opacity: 0,
        backdropFilter: 'blur(0px)',
        duration: cfg.duration.modalClose,
        ease: cfg.ease.modalClose,
      },
      0.2
    );

    if (elements.videoBg) {
      closeTL.to(elements.videoBg,
        {
          opacity: 0,
          duration: cfg.duration.modalClose * 0.8,
          ease: cfg.ease.modalClose,
        },
        0.2
      );
    }

    return closeTL;
  }

  /**
   * Сбрасывает элементы модального окна к начальному состоянию
   */
  function resetModalElements(modal, elements) {
    gsap.set([
      elements.backdrop,
      elements.content,
      elements.videoBg,
      elements.statsSection,
      elements.introText,
      ...elements.cards,
      ...elements.headlines,
    ].filter(Boolean), {
      clearProps: 'all'
    });

    // Восстанавливаем текст (убираем span обертки)
    [...elements.headlines, elements.introText].filter(Boolean).forEach(el => {
      const text = el.textContent;
      el.innerHTML = text;
    });

    // Удаляем класс intro-hidden
    modal.classList.remove('intro-hidden');
  }

  // ============================================
  // СИСТЕМА УПРАВЛЕНИЯ АНИМАЦИЯМИ
  // ============================================

  class ModalAnimationController {
    constructor(modalId, selectors) {
      this.modal = document.getElementById(modalId);
      if (!this.modal) {
        console.warn(`❌ Модальное окно ${modalId} не найдено`);
        return;
      }

      this.selectors = selectors;
      this.elements = null;
      this.openTimeline = null;
      this.closeTimeline = null;
      this.isAnimating = false;

      this.init();
    }

    init() {
      // Подготавливаем элементы
      this.elements = prepareElements(this.modal, this.selectors);

      // Скрываем все элементы изначально
      this.hideAllElements();

      // Отслеживаем открытие модального окна
      this.observeModalState();

      // Добавляем обработчики закрытия
      this.setupCloseHandlers();

      console.log(`✅ Контроллер анимации для ${this.modal.id} инициализирован`);
    }

    hideAllElements() {
      // Скрываем backdrop и контент
      gsap.set([
        this.elements.backdrop,
        this.elements.content,
      ].filter(Boolean), {
        opacity: 0,
        visibility: 'hidden'
      });

      // Скрываем карточки
      gsap.set(this.elements.cards, {
        opacity: 0,
        visibility: 'hidden'
      });

      // ВАЖНО: Скрываем все заголовки, текст и статистику
      const headlines = this.modal.querySelectorAll(this.selectors.headlines);
      const stats = this.modal.querySelector(this.selectors.stats);
      const intro = this.modal.querySelector(this.selectors.intro);

      gsap.set([...headlines, stats, intro].filter(Boolean), {
        opacity: 0,
        visibility: 'hidden'
      });
    }

    observeModalState() {
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.attributeName === 'class') {
            const isActive = this.modal.classList.contains('active');
            const wasActive = mutation.oldValue?.includes('active');

            if (isActive && !wasActive && !this.isAnimating) {
              this.playOpenAnimation();
            }
          }
        });
      });

      observer.observe(this.modal, {
        attributes: true,
        attributeOldValue: true,
        attributeFilter: ['class']
      });
    }

    setupCloseHandlers() {
      // Находим все кнопки закрытия
      const closeButtons = this.modal.querySelectorAll('[id^="close"], .modal-close, .close-btn');

      closeButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          this.playCloseAnimation();
        });
      });

      // ESC key
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && this.modal.classList.contains('active')) {
          this.playCloseAnimation();
        }
      });
    }

    playOpenAnimation() {
      if (this.isAnimating) return;

      this.isAnimating = true;

      // Останавливаем предыдущие анимации
      if (this.openTimeline) this.openTimeline.kill();
      if (this.closeTimeline) this.closeTimeline.kill();

      // Перезагружаем элементы (на случай если структура изменилась)
      this.elements = prepareElements(this.modal, this.selectors);

      // Создаем и запускаем анимацию открытия
      this.openTimeline = createOpenAnimation(this.modal, this.elements);
      this.openTimeline.eventCallback('onComplete', () => {
        this.isAnimating = false;
      });
    }

    playCloseAnimation() {
      if (this.isAnimating) return;

      this.isAnimating = true;

      // Останавливаем предыдущие анимации
      if (this.openTimeline) this.openTimeline.kill();
      if (this.closeTimeline) this.closeTimeline.kill();

      // Создаем и запускаем анимацию закрытия
      this.closeTimeline = createCloseAnimation(this.modal, this.elements);
      this.closeTimeline.eventCallback('onComplete', () => {
        this.isAnimating = false;
      });
    }
  }

  // ============================================
  // ИНИЦИАЛИЗАЦИЯ ВСЕХ МОДАЛЬНЫХ ОКОН
  // ============================================

  function initAllModals() {
    console.log('🎬 Инициализация премиум анимаций модальных окон...');

    // Проверка наличия GSAP
    if (typeof gsap === 'undefined') {
      console.error('❌ GSAP не загружен! Премиум анимации недоступны.');
      return;
    }

    // Настраиваем GSAP по умолчанию
    gsap.defaults({
      overwrite: 'auto',
    });

    // Регистрируем анимации для каждого модального окна
    const modals = [
      {
        id: 'sportModal',
        selectors: {
          content: '#sportContent',
          videoBg: '.sport-bg',
          stats: '.sport-stats',
          intro: '.sport-intro',
          cards: '.sport-card',
          headlines: '.sport-content h1, .sport-content h2',
        }
      },
      {
        id: 'kidsModal',
        selectors: {
          content: '#kidsContent',
          videoBg: '.kids-bg',
          stats: '.kids-stats',
          intro: '.kids-intro',
          cards: '.kids-card',
          headlines: '.kids-content h1, .kids-content h2',
        }
      },
      {
        id: 'restModal',
        selectors: {
          content: '#restContent',
          videoBg: '.rest-bg',
          stats: '.rest-stats',
          intro: '.rest-intro',
          cards: '.rest-card',
          headlines: '.rest-content h1, .rest-content h2',
        }
      },
      {
        id: 'eventsModal',
        selectors: {
          content: '#eventsContent',
          videoBg: '.events-bg',
          stats: '.events-stats',
          intro: '.events-intro',
          cards: '.flip-card-interactive',
          headlines: '.events-content h1, .events-content h2',
        }
      },
      {
        id: 'contactsModal',
        selectors: {
          content: '#contactsContent',
          videoBg: null,
          stats: '.contacts-stats',
          intro: '.contacts-intro',
          cards: '.contact-card, .social-link',
          headlines: '.contacts-content h1, .contacts-content h2',
        }
      }
    ];

    // Создаем контроллеры для каждого модального окна
    const controllers = modals.map(config => new ModalAnimationController(config.id, config.selectors));

    console.log(`✅ Премиум анимации инициализированы для ${controllers.length} модальных окон`);

    // Экспортируем контроллеры
    window.ModalAnimationControllers = controllers;
  }

  // ============================================
  // АВТОЗАПУСК
  // ============================================

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      setTimeout(initAllModals, 1000); // Даем время загрузиться контенту модалок
    });
  } else {
    setTimeout(initAllModals, 1000);
  }

  // ============================================
  // ГЛОБАЛЬНЫЙ API
  // ============================================

  window.PrideModalAnimationsPremium = {
    init: initAllModals,
    config: ANIMATION_CONFIG,
    ModalAnimationController: ModalAnimationController,
  };

  console.log('📦 modal-animations-premium.js загружен');

})();
