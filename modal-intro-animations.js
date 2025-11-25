/**
 * АНИМАЦИИ INTRO ДЛЯ МОДАЛЬНЫХ ОКОН
 * СК ПРАЙД - Плавные анимации текста как на главном слайдере
 *
 * Функции:
 * - Анимация появления текста (title, subtitle, scroll-hint)
 * - Клик по "Прокрутите вниз" скроллит на 1 экран
 * - Поддержка темной/светлой темы
 */

(function() {
  'use strict';

  // ============================================
  // КОНФИГУРАЦИЯ
  // ============================================

  const INTRO_CONFIG = {
    // Селекторы intro секций
    selectors: {
      introSections: [
        '.relax-intro-section',
        '.ice-intro-section',
        '.about-intro-section'
      ],
      title: [
        '.relax-main-title',
        '.ice-main-title',
        '.about-main-title'
      ],
      subtitle: [
        '.relax-main-subtitle',
        '.ice-main-subtitle',
        '.about-main-subtitle'
      ],
      scrollHint: [
        '.relax-scroll-hint',
        '.ice-scroll-hint',
        '.about-scroll-hint'
      ],
      scroller: [
        '.relax-scroller',
        '.ice-scroller',
        '.about-scroller'
      ],
      themeToggle: [
        '.relax-theme-toggle',
        '.ice-theme-toggle',
        '.about-theme-toggle'
      ]
    },

    // Анимация
    animation: {
      titleDuration: 1.2,
      subtitleDuration: 1.0,
      hintDuration: 0.8,
      titleDelay: 0.3,
      subtitleDelay: 0.8,
      hintDelay: 1.4,
      stagger: 0.05,
      ease: 'power2.out'
    }
  };

  // ============================================
  // АНИМАЦИЯ ТЕКСТА INTRO
  // ============================================

  /**
   * Анимирует intro секцию модального окна
   */
  function animateIntroSection(modal) {
    if (!modal) return;

    const modalId = modal.id || modal.className;
    console.log('🎬 Animating intro for:', modalId);

    // Находим элементы intro
    const title = modal.querySelector('[class*="-main-title"]');
    const subtitle = modal.querySelector('[class*="-main-subtitle"]');
    const scrollHint = modal.querySelector('[class*="-scroll-hint"]');

    if (!title && !subtitle) {
      console.log('⚠️ No intro elements found');
      return;
    }

    // Создаем timeline
    const tl = gsap.timeline({
      onStart: () => console.log('▶️ Intro animation started'),
      onComplete: () => {
        console.log('✅ Intro animation complete');
        // Убираем inline стили после анимации
        if (title) gsap.set(title, { clearProps: 'all' });
        if (subtitle) gsap.set(subtitle, { clearProps: 'all' });
        if (scrollHint) gsap.set(scrollHint, { clearProps: 'all' });
      }
    });

    // Анимация заголовка
    if (title) {
      tl.fromTo(title,
        { opacity: 0, y: 50, scale: 0.9 },
        { opacity: 1, y: 0, scale: 1, duration: 1, ease: 'power2.out' },
        0.2
      );
    }

    // Анимация подзаголовка
    if (subtitle) {
      tl.fromTo(subtitle,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' },
        0.5
      );
    }

    // Анимация подсказки прокрутки
    if (scrollHint) {
      tl.fromTo(scrollHint,
        { opacity: 0, y: 20 },
        {
          opacity: 1, y: 0, duration: 0.6, ease: 'back.out(1.5)',
          onComplete: () => scrollHint.classList.add('animated')
        },
        0.9
      );
    }

    return tl;
  }

  // ============================================
  // SCROLL HINT - КЛИК ДЛЯ ПРОКРУТКИ
  // ============================================

  /**
   * Добавляет обработчик клика для scroll hints
   */
  function initScrollHints() {
    const scrollHints = document.querySelectorAll(
      '.relax-scroll-hint, .ice-scroll-hint, .about-scroll-hint'
    );

    scrollHints.forEach(hint => {
      // Делаем кликабельным
      hint.style.cursor = 'pointer';

      hint.addEventListener('click', function(e) {
        e.preventDefault();

        // Находим scroller контейнер
        const modal = hint.closest('[class*="-modal"]');
        if (!modal) return;

        const scroller = modal.querySelector('[class*="-scroller"]');
        if (!scroller) return;

        // Прокручиваем на высоту viewport
        const scrollDistance = window.innerHeight;

        gsap.to(scroller, {
          scrollTop: scrollDistance,
          duration: 1.2,
          ease: 'power2.inOut'
        });

        console.log('📜 Scrolling down by:', scrollDistance);
      });
    });

    console.log('✅ Scroll hints initialized:', scrollHints.length);
  }

  // ============================================
  // ПОДДЕРЖКА ТЕМ (СВЕТЛАЯ/ТЕМНАЯ)
  // ============================================

  /**
   * Сохраняет выбранную тему
   */
  function saveTheme(modalId, isDark) {
    localStorage.setItem(`pride_theme_${modalId}`, isDark ? 'dark' : 'light');
  }

  /**
   * Загружает сохраненную тему
   */
  function loadTheme(modalId) {
    return localStorage.getItem(`pride_theme_${modalId}`) || 'light';
  }

  /**
   * Применяет тему к модальному окну
   */
  function applyTheme(modal, theme) {
    if (theme === 'dark') {
      modal.classList.add('theme-dark');
    } else {
      modal.classList.remove('theme-dark');
    }
  }

  /**
   * Инициализирует переключатели тем
   */
  function initThemeToggles() {
    const modals = document.querySelectorAll(
      '.relax-modal, .ice-modal, .about-modal'
    );

    modals.forEach(modal => {
      const modalId = modal.id || modal.className.split(' ')[0];

      // Загружаем сохраненную тему
      const savedTheme = loadTheme(modalId);
      applyTheme(modal, savedTheme);

      // Находим переключатель
      const toggle = modal.querySelector('[class*="-theme-toggle"]');
      if (!toggle) return;

      toggle.addEventListener('click', function() {
        const isDark = modal.classList.contains('theme-dark');
        const newTheme = isDark ? 'light' : 'dark';

        applyTheme(modal, newTheme);
        saveTheme(modalId, newTheme === 'dark');

        console.log('🎨 Theme changed to:', newTheme);
      });
    });

    console.log('✅ Theme toggles initialized');
  }

  // ============================================
  // НАБЛЮДАТЕЛЬ ЗА ОТКРЫТИЕМ МОДАЛЬНЫХ ОКОН
  // ============================================

  /**
   * Следит за открытием модальных окон и запускает анимации
   */
  function initModalObserver() {
    const modals = document.querySelectorAll(
      '.relax-modal, .ice-modal, .about-modal'
    );

    const observer = new MutationObserver((mutations) => {
      mutations.forEach(mutation => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
          const modal = mutation.target;

          // Проверяем добавился ли класс active
          if (modal.classList.contains('active') && !modal.dataset.introAnimated) {
            // Небольшая задержка для синхронизации с основной анимацией открытия
            setTimeout(() => {
              animateIntroSection(modal);
              modal.dataset.introAnimated = 'true';
            }, 500);
          }

          // Сбрасываем флаг при закрытии
          if (!modal.classList.contains('active')) {
            modal.dataset.introAnimated = '';
          }
        }
      });
    });

    modals.forEach(modal => {
      observer.observe(modal, { attributes: true });
    });

    console.log('✅ Modal observer initialized');
  }

  // ============================================
  // ГЛОБАЛЬНАЯ СИНХРОНИЗАЦИЯ ТЕМ
  // ============================================

  /**
   * Синхронизирует тему между всеми модальными окнами
   */
  function initGlobalThemeSync() {
    // Слушаем изменения в localStorage
    window.addEventListener('storage', (e) => {
      if (e.key && e.key.startsWith('pride_theme_')) {
        const modalId = e.key.replace('pride_theme_', '');
        const modal = document.getElementById(modalId) ||
                      document.querySelector(`.${modalId}`);

        if (modal && e.newValue) {
          applyTheme(modal, e.newValue);
        }
      }
    });
  }

  // ============================================
  // ИНИЦИАЛИЗАЦИЯ
  // ============================================

  function init() {
    console.log('🚀 Modal Intro Animations: Initializing...');

    // Ждем загрузки DOM
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', onReady);
    } else {
      onReady();
    }
  }

  function onReady() {
    // Инициализируем все компоненты
    initScrollHints();
    initThemeToggles();
    initModalObserver();  // Включено - запускает анимацию при открытии модалки
    initGlobalThemeSync();

    console.log('✅ Modal Intro Animations: Ready!');
  }

  // Запускаем
  init();

  // Экспортируем для внешнего использования
  window.PrideModalIntro = {
    animateIntro: animateIntroSection,
    applyTheme: applyTheme,
    saveTheme: saveTheme
  };

})();
