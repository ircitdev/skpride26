/**
 * ПРЕМИАЛЬНЫЕ АНИМАЦИИ для СК ПРАЙД
 * Полный набор GSAP плагинов (теперь БЕСПЛАТНО!)
 *
 * Требует подключения:
 * - gsap.min.js
 * - ScrollTrigger.min.js
 * - ScrollSmoother.min.js
 * - SplitText.min.js
 * - Flip.min.js
 * - Draggable.min.js
 * - DrawSVGPlugin.min.js
 * - ScrambleTextPlugin.min.js
 * - MorphSVGPlugin.min.js
 * - Observer.min.js
 *
 * @version 2.0 - Все плагины БЕСПЛАТНЫ!
 * @date 2025-11-05
 */

// ============================================
// РЕГИСТРАЦИЯ ВСЕХ ПЛАГИНОВ
// ============================================

gsap.registerPlugin(
  ScrollTrigger,
  ScrollSmoother,
  SplitText,
  Flip,
  Draggable,
  DrawSVGPlugin,
  ScrambleTextPlugin,
  MorphSVGPlugin,
  Observer
);

console.log('🎉 Все GSAP плагины зарегистрированы (БЕСПЛАТНО!)');

// ============================================
// 1. ПЛАВНАЯ ПРОКРУТКА (ScrollSmoother)
// ============================================

let smoother;

function initSmoothScrolling() {
  // НЕ используем ScrollSmoother на мобильных - ломает прокрутку
  const isMobile = window.innerWidth <= 768 || 'ontouchstart' in window;
  if (isMobile) {
    console.log('📱 ScrollSmoother отключен на мобильном устройстве');
    return;
  }

  // Оборачиваем контент для ScrollSmoother
  if (!document.getElementById('smooth-wrapper')) {
    const wrapper = document.createElement('div');
    wrapper.id = 'smooth-wrapper';
    const content = document.createElement('div');
    content.id = 'smooth-content';

    // Перемещаем весь body контент в wrapper
    while (document.body.firstChild) {
      content.appendChild(document.body.firstChild);
    }
    wrapper.appendChild(content);
    document.body.appendChild(wrapper);
  }

  smoother = ScrollSmoother.create({
    wrapper: '#smooth-wrapper',
    content: '#smooth-content',
    smooth: 1.5,              // плавность (0-3)
    effects: true,            // data-speed атрибуты
    smoothTouch: false,       // отключено на тач устройствах
    normalizeScroll: false    // отключено - ломает мобильный скролл
  });

  console.log('✅ ScrollSmoother активирован - бархатная прокрутка (только десктоп)');
}

// ============================================
// 2. АНИМАЦИЯ ТЕКСТА С РАЗБИВКОЙ (SplitText)
// ============================================

function animateHeadlinesAdvanced() {
  // ВАЖНО: НЕ трогаем заголовки главных слайдов!
  // Анимируем только заголовки в модальных окнах
  const headlines = document.querySelectorAll('.sport-modal h1, .sport-modal h2, .kids-modal h1, .kids-modal h2, .rest-modal h1, .rest-modal h2, .events-modal h1, .events-modal h2');

  headlines.forEach((headline, index) => {
    // Разбиваем на chars, words, lines
    const split = new SplitText(headline, {
      type: 'chars, words, lines',
      charsClass: 'char',
      wordsClass: 'word',
      linesClass: 'line'
    });

    // Wrap lines для clip-path эффекта
    split.lines.forEach(line => {
      const wrapper = document.createElement('div');
      wrapper.style.overflow = 'hidden';
      line.parentNode.insertBefore(wrapper, line);
      wrapper.appendChild(line);
    });

    // Создаем timeline анимации
    const tl = gsap.timeline({ paused: true });

    // Вариант 1: Эффект "прилета" с вращением
    tl.from(split.chars, {
      opacity: 0,
      y: 100,
      rotationX: -90,
      transformOrigin: '0% 50% -50',
      stagger: 0.02,
      duration: 0.8,
      ease: 'back.out(1.7)'
    }, 0);

    // Вариант 2: Эффект "волны"
    // tl.from(split.chars, {
    //   opacity: 0,
    //   y: 50,
    //   rotationY: 90,
    //   stagger: {
    //     each: 0.02,
    //     from: 'center'
    //   },
    //   duration: 1,
    //   ease: 'elastic.out(1, 0.3)'
    // }, 0);

    // Вариант 3: Эффект "печатной машинки" с ScrambleText
    // tl.from(split.chars, {
    //   scrambleText: {
    //     text: '{original}',
    //     chars: 'АБВГДЕЖЗИКЛМНОПРСТУФХЦЧШЩЭЮЯ',
    //     speed: 0.3
    //   },
    //   stagger: 0.05
    // }, 0);

    // Сохраняем анимацию
    headline.animationTimeline = tl;
  });

  console.log('✅ SplitText анимации с продвинутыми эффектами');
}

// ============================================
// 3. АНИМАЦИЯ АКЦИЙ С SCRAMBLE TEXT
// ============================================

function animatePromoText() {
  const promoTexts = document.querySelectorAll('.promo-text, .discount-label');

  promoTexts.forEach(text => {
    const originalText = text.textContent;

    gsap.to(text, {
      scrollTrigger: {
        trigger: text,
        start: 'top 80%',
        once: true
      },
      duration: 1.5,
      scrambleText: {
        text: originalText,
        chars: '01АБВГДЕЖ%₽$#',
        revealDelay: 0.3,
        speed: 0.4,
        tweenLength: false
      }
    });
  });

  console.log('✅ ScrambleText для акций активирован');
}

// ============================================
// 4. АНИМАЦИЯ SVG ИКОНОК (DrawSVG)
// ============================================

function animateSVGIcons() {
  // Анимация рисования логотипа
  const logoPaths = document.querySelectorAll('.logo svg path');

  if (logoPaths.length > 0) {
    gsap.from(logoPaths, {
      drawSVG: 0,
      duration: 2,
      stagger: 0.2,
      ease: 'power2.inOut',
      delay: 0.5
    });
  }

  // Анимация иконок при наведении
  const icons = document.querySelectorAll('.icon svg path');

  icons.forEach(icon => {
    const parent = icon.closest('.icon');
    if (!parent) return;

    parent.addEventListener('mouseenter', () => {
      gsap.fromTo(icon, {
        drawSVG: '0% 0%'
      }, {
        drawSVG: '0% 100%',
        duration: 0.6,
        ease: 'power2.out'
      });
    });
  });

  console.log('✅ DrawSVG анимации для иконок');
}

// ============================================
// 5. МОРФИНГ ФОРМ (MorphSVG)
// ============================================

function setupMorphingShapes() {
  // Пример: кнопка "записаться" меняет форму при клике
  const morphButtons = document.querySelectorAll('[data-morph]');

  morphButtons.forEach(button => {
    const svg = button.querySelector('svg');
    if (!svg) return;

    const shape1 = svg.querySelector('#shape1');
    const shape2 = svg.querySelector('#shape2');

    if (shape1 && shape2) {
      button.addEventListener('click', function() {
        gsap.to(shape1, {
          morphSVG: shape2,
          duration: 0.8,
          ease: 'power2.inOut'
        });
      });
    }
  });

  console.log('✅ MorphSVG для интерактивных элементов');
}

// ============================================
// 6. DRAGGABLE КАРУСЕЛИ
// ============================================

function setupDraggableCarousels() {
  const carousels = document.querySelectorAll('.horizontal-scroll');

  carousels.forEach(carousel => {
    const cards = carousel.querySelectorAll('.card');
    const cardWidth = cards[0]?.offsetWidth || 300;

    Draggable.create(carousel, {
      type: 'x',
      edgeResistance: 0.65,
      bounds: {
        minX: -(cards.length * cardWidth - carousel.offsetWidth),
        maxX: 0
      },
      inertia: true,
      snap: {
        x: endValue => Math.round(endValue / cardWidth) * cardWidth
      },
      onDrag: function() {
        // Масштабируем карточки в зависимости от позиции
        cards.forEach((card, i) => {
          const cardCenter = card.offsetLeft + cardWidth / 2;
          const carouselCenter = -this.x + carousel.offsetWidth / 2;
          const distance = Math.abs(cardCenter - carouselCenter);
          const scale = Math.max(0.8, 1 - distance / 1000);

          gsap.to(card, {
            scale: scale,
            duration: 0.3
          });
        });
      }
    });
  });

  console.log('✅ Draggable карусели активированы');
}

// ============================================
// 7. OBSERVER ДЛЯ TOUCH НАВИГАЦИИ
// ============================================

let currentSlide = 0;
const totalSlides = 10;

function setupTouchNavigation() {
  Observer.create({
    target: window,
    type: 'wheel,touch',
    onLeft: () => {
      if (currentSlide < totalSlides - 1) {
        currentSlide++;
        navigateToSlide(currentSlide);
      }
    },
    onRight: () => {
      if (currentSlide > 0) {
        currentSlide--;
        navigateToSlide(currentSlide);
      }
    },
    tolerance: 10,
    preventDefault: true
  });

  console.log('✅ Observer для touch навигации');
}

function navigateToSlide(index) {
  const slides = document.querySelectorAll('.slide');
  const targetSlide = slides[index];

  if (!targetSlide) return;

  // Анимация перехода
  gsap.to(window, {
    scrollTo: {
      y: targetSlide,
      offsetY: 0
    },
    duration: 1,
    ease: 'power2.inOut'
  });

  // ОТКЛЮЧЕНО: Не анимируем заголовки слайдов (они анимируются отдельной системой)
  // const headline = targetSlide.querySelector('.slides__caption-headline');
  // if (headline && headline.animationTimeline) {
  //   headline.animationTimeline.restart();
  // }
}

// ============================================
// 8. PARALLAX С DATA-АТРИБУТАМИ
// ============================================

function setupAdvancedParallax() {
  // Элементы с data-speed будут двигаться с разной скоростью
  gsap.utils.toArray('[data-speed]').forEach(element => {
    const speed = parseFloat(element.getAttribute('data-speed'));

    gsap.to(element, {
      y: (i, target) => -ScrollTrigger.maxScroll(window) * speed,
      ease: 'none',
      scrollTrigger: {
        start: 0,
        end: 'max',
        invalidateOnRefresh: true,
        scrub: 0
      }
    });
  });

  console.log('✅ Продвинутый параллакс с data-speed');
}

// ============================================
// 9. FLIP АНИМАЦИИ ДЛЯ МОДАЛЬНЫХ ОКОН
// ============================================

function setupAdvancedModals() {
  const modalTriggers = document.querySelectorAll('[data-modal]');

  modalTriggers.forEach(trigger => {
    trigger.addEventListener('click', function(e) {
      e.preventDefault();

      const modalId = this.getAttribute('data-modal');
      const modal = document.getElementById(modalId);

      if (!modal) return;

      // Сохраняем состояние до изменения
      const state = Flip.getState([this, modal]);

      // Изменяем состояние
      modal.classList.add('active');
      this.style.opacity = 0;

      // Анимируем переход
      Flip.from(state, {
        duration: 0.7,
        ease: 'power3.inOut',
        scale: true,
        absolute: true,
        onComplete: () => {
          this.style.opacity = 1;
        }
      });
    });
  });

  console.log('✅ Flip анимации для модальных окон');
}

// ============================================
// 10. ПРОДВИНУТЫЕ ЭФФЕКТЫ ПРИ ПРОКРУТКЕ
// ============================================

function setupScrollEffects() {
  // Эффект "reveal" для изображений
  gsap.utils.toArray('.reveal-image').forEach(image => {
    const overlay = document.createElement('div');
    overlay.className = 'image-overlay';
    image.parentNode.insertBefore(overlay, image);
    image.parentNode.style.position = 'relative';
    image.parentNode.style.overflow = 'hidden';

    overlay.style.position = 'absolute';
    overlay.style.top = 0;
    overlay.style.left = 0;
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.background = 'var(--color-accent, #FF6B35)';
    overlay.style.zIndex = 10;

    gsap.timeline({
      scrollTrigger: {
        trigger: image,
        start: 'top 80%',
        end: 'top 20%',
        once: true
      }
    })
    .to(overlay, {
      xPercent: 100,
      duration: 1,
      ease: 'power3.inOut'
    })
    .from(image, {
      scale: 1.3,
      duration: 1,
      ease: 'power3.out'
    }, 0);
  });

  // Эффект "slide in" для текстовых блоков
  gsap.utils.toArray('.slide-in').forEach(element => {
    gsap.from(element, {
      scrollTrigger: {
        trigger: element,
        start: 'top 85%',
        end: 'top 15%'
      },
      x: element.classList.contains('from-left') ? -100 : 100,
      opacity: 0,
      duration: 1,
      ease: 'power3.out'
    });
  });

  // Эффект "fade in scale" для карточек
  gsap.utils.toArray('.fade-in-scale').forEach((element, i) => {
    gsap.from(element, {
      scrollTrigger: {
        trigger: element,
        start: 'top 80%'
      },
      opacity: 0,
      scale: 0.8,
      duration: 0.8,
      delay: i * 0.1,
      ease: 'back.out(1.7)'
    });
  });

  console.log('✅ Продвинутые scroll эффекты активированы');
}

// ============================================
// 11. ИНТЕРАКТИВНЫЕ КНОПКИ
// ============================================

function setupInteractiveButtons() {
  const buttons = document.querySelectorAll('.animated-button');

  buttons.forEach(button => {
    // Магнитный эффект
    button.addEventListener('mousemove', function(e) {
      const rect = this.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      gsap.to(this, {
        x: x * 0.3,
        y: y * 0.3,
        duration: 0.3,
        ease: 'power2.out'
      });
    });

    button.addEventListener('mouseleave', function() {
      gsap.to(this, {
        x: 0,
        y: 0,
        duration: 0.5,
        ease: 'elastic.out(1, 0.3)'
      });
    });

    // Ripple эффект при клике
    button.addEventListener('click', function(e) {
      const ripple = document.createElement('span');
      ripple.classList.add('ripple');
      this.appendChild(ripple);

      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;

      gsap.set(ripple, {
        width: size,
        height: size,
        left: x,
        top: y
      });

      gsap.to(ripple, {
        scale: 4,
        opacity: 0,
        duration: 0.8,
        ease: 'power2.out',
        onComplete: () => ripple.remove()
      });
    });
  });

  console.log('✅ Интерактивные кнопки с магнитным эффектом');
}

// ============================================
// 12. СЧЕТЧИКИ С АНИМАЦИЕЙ
// ============================================

function animateStatsCounters() {
  const counters = document.querySelectorAll('[data-counter]');

  counters.forEach(counter => {
    const target = parseInt(counter.getAttribute('data-counter'));
    const suffix = counter.getAttribute('data-suffix') || '';
    const prefix = counter.getAttribute('data-prefix') || '';

    gsap.to({ val: 0 }, {
      val: target,
      scrollTrigger: {
        trigger: counter,
        start: 'top 80%',
        once: true
      },
      duration: 2,
      ease: 'power2.out',
      onUpdate: function() {
        const current = Math.round(this.targets()[0].val);
        counter.textContent = prefix + current.toLocaleString() + suffix;
      }
    });
  });

  console.log('✅ Анимация счетчиков активирована');
}

// ============================================
// ГЛАВНАЯ ИНИЦИАЛИЗАЦИЯ
// ============================================

function initPremiumAnimations() {
  console.log('🎬 Инициализация ПРЕМИАЛЬНЫХ анимаций...');
  console.log('🎉 Все GSAP плагины теперь БЕСПЛАТНЫ!');

  // Проверка загрузки GSAP
  if (typeof gsap === 'undefined') {
    console.error('❌ GSAP не загружен!');
    return;
  }

  // Порядок важен!
  try {
    // 1. Плавная прокрутка (первым делом)
    if (typeof ScrollSmoother !== 'undefined') {
      initSmoothScrolling();
    }

    // 2. Текстовые анимации
    if (typeof SplitText !== 'undefined') {
      animateHeadlinesAdvanced();
    }

    if (typeof ScrambleTextPlugin !== 'undefined') {
      animatePromoText();
    }

    // 3. SVG анимации
    if (typeof DrawSVGPlugin !== 'undefined') {
      animateSVGIcons();
    }

    if (typeof MorphSVGPlugin !== 'undefined') {
      setupMorphingShapes();
    }

    // 4. Интерактивность
    if (typeof Draggable !== 'undefined') {
      setupDraggableCarousels();
    }

    if (typeof Observer !== 'undefined') {
      setupTouchNavigation();
    }

    if (typeof Flip !== 'undefined') {
      setupAdvancedModals();
    }

    // 5. Scroll эффекты
    if (typeof ScrollTrigger !== 'undefined') {
      setupAdvancedParallax();
      setupScrollEffects();
      animateStatsCounters();
    }

    // 6. UI эффекты
    setupInteractiveButtons();

    console.log('✅ ВСЕ ПРЕМИАЛЬНЫЕ АНИМАЦИИ АКТИВИРОВАНЫ!');
    console.log('💎 Ваш сайт теперь выглядит на миллион!');

  } catch (error) {
    console.error('❌ Ошибка инициализации:', error);
  }
}

// ============================================
// АВТОЗАПУСК
// ============================================

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initPremiumAnimations);
} else {
  initPremiumAnimations();
}

// Экспорт функций
window.prideAnimationsPremium = {
  init: initPremiumAnimations,
  navigateToSlide: navigateToSlide,
  smoother: smoother
};

console.log('📦 Премиальные анимации загружены (БЕСПЛАТНО! 🎉)');
