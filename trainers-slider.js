/**
 * СЛАЙДЕР ТРЕНЕРОВ И OFFCANVAS ПАНЕЛЬ
 * СК ПРАЙД
 */

(function() {
  'use strict';

  console.log('📦 trainers-slider.js загружен');

  // ============================================
  // ДАННЫЕ О ТРЕНЕРАХ
  // ============================================

  // Маппинг ID тренеров из слайдера к значениям в form.json
  const TRAINERS_DATA = {
    'ivanov': {
      name: 'Иванов Сергей',
      specialty: 'Фитнес-тренер',
      photo: 'img/trainers/sergey.png',
      formValue: 'ivanov' // соответствует form.json
    },
    'bogachev': {
      name: 'Андрей Богачев',
      specialty: 'Тренер по функциональному тренингу',
      photo: 'img/trainers/bogachev.png',
      formValue: 'bogachev'
    },
    'brunina': {
      name: 'Елена Брюнина',
      specialty: 'Фитнес-тренер',
      photo: 'img/trainers/brunina.png',
      formValue: 'brunina'
    },
    'yagunova': {
      name: 'Марина Ягунова',
      specialty: 'Сертифицированный фитнес-инструктор',
      photo: 'img/trainers/gorsheneva.png',
      formValue: 'yagunova'
    },
    'murashkin': {
      name: 'Антон Мурашкин',
      specialty: 'Фитнес-тренер',
      photo: 'img/trainers/murashkin.png',
      formValue: 'murashkin'
    },
    'savkin': {
      name: 'Алексей Савкин',
      specialty: 'Фитнес-тренер',
      photo: 'img/trainers/savkin.png',
      formValue: 'savkin'
    },
    'tatarenko': {
      name: 'Наталья Татаренко',
      specialty: 'Персональный тренер по фитнесу',
      photo: 'img/trainers/tatarenko.png',
      formValue: 'tatarenko'
    }
  };

  // ============================================
  // УПРАВЛЕНИЕ СЛАЙДЕРОМ
  // ============================================

  function initTrainersSlider() {
    const slider = document.getElementById('trainersSlider');
    const prevBtn = document.querySelector('.trainers-nav-prev');
    const nextBtn = document.querySelector('.trainers-nav-next');

    if (!slider || !prevBtn || !nextBtn) return;

    const scrollStep = 320; // Ширина карточки + gap

    prevBtn.addEventListener('click', () => {
      slider.scrollBy({
        left: -scrollStep,
        behavior: 'smooth'
      });
    });

    nextBtn.addEventListener('click', () => {
      slider.scrollBy({
        left: scrollStep,
        behavior: 'smooth'
      });
    });

    console.log('✅ Слайдер тренеров инициализирован');
  }

  // ============================================
  // ОТКРЫТИЕ ФОРМЫ ЗАПИСИ
  // ============================================

  let currentTrainerId = null;

  function openBookingForTrainer(trainerId) {
    currentTrainerId = trainerId;
    const trainer = TRAINERS_DATA[trainerId];

    if (!trainer) {
      console.error(`Тренер с ID ${trainerId} не найден`);
      return;
    }

    // Открываем существующую панель записи
    const bookingPanel = document.getElementById('bookingPanel');
    const backdrop = document.getElementById('offcanvasBackdrop');

    if (!bookingPanel || !backdrop) {
      console.error('bookingPanel или offcanvasBackdrop не найдены');
      return;
    }

    bookingPanel.classList.add('active');
    backdrop.classList.add('show');
    // НЕ блокируем body.overflow - это ломает scroll на iOS

    // Загружаем форму если функция доступна
    if (typeof loadFormConfig === 'function') {
      loadFormConfig().then(() => {
        // Выбираем "Запись в зал"
        const gymOption = document.querySelector('[data-value="gym"]');
        if (gymOption) {
          gymOption.click();

          // После выбора зала, выбираем "Запись к тренеру"
          setTimeout(() => {
            const trainerOption = document.querySelector('[data-value="trainer"]');
            if (trainerOption) {
              trainerOption.click();

              // Выбираем конкретного тренера
              setTimeout(() => {
                const specificTrainerOption = document.querySelector(`[data-value="${trainer.formValue}"]`);
                if (specificTrainerOption) {
                  specificTrainerOption.click();
                  console.log(`✅ Выбран тренер: ${trainer.name}`);
                } else {
                  console.warn(`⚠️ Не найден тренер с value="${trainer.formValue}"`);
                }

                // Обновляем hash
                updateHashForTrainer(trainerId);

                console.log(`✅ Открыта форма записи к тренеру: ${trainer.name}`);
              }, 150);
            }
          }, 100);
        }
      });
    }
  }

  // ============================================
  // УПРАВЛЕНИЕ ХЭШАМИ
  // ============================================

  function updateHashForTrainer(trainerId) {
    const newHash = `#about/trainer-${trainerId}`;
    if (window.location.hash !== newHash) {
      history.pushState(null, null, newHash);
      console.log(`🔗 Hash обновлен: ${newHash}`);
    }
  }

  function handleTrainerHashChange() {
    const hash = window.location.hash;

    // Проверяем, есть ли trainer в хэше
    if (hash.includes('/trainer-')) {
      const trainerId = hash.split('/trainer-')[1];
      if (TRAINERS_DATA[trainerId]) {
        // Даем время на загрузку модального окна спорта
        setTimeout(() => {
          openBookingForTrainer(trainerId);
        }, 1500);
      }
    }
  }

  // ============================================
  // ИНИЦИАЛИЗАЦИЯ
  // ============================================

  function init() {
    console.log('🎬 Инициализация слайдера тренеров...');

    // Инициализируем слайдер при открытии модального окна "О нас"
    const aboutModal = document.getElementById('aboutModal');
    if (aboutModal) {
      // Используем MutationObserver для отслеживания открытия модального окна
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.attributeName === 'class') {
            if (aboutModal.classList.contains('active')) {
              // Даем время на загрузку контента
              setTimeout(() => {
                initTrainersSlider();
                initTrainerCards();
              }, 100);
            }
          }
        });
      });

      observer.observe(aboutModal, {
        attributes: true,
        attributeFilter: ['class']
      });

      // Также слушаем событие modalopen
      aboutModal.addEventListener('modalopen', () => {
        setTimeout(() => {
          initTrainersSlider();
          initTrainerCards();
        }, 100);
      });
    }

    // Обрабатываем hashchange
    window.addEventListener('hashchange', handleTrainerHashChange);

    // Проверяем hash при загрузке
    if (window.location.hash.includes('/trainer-')) {
      handleTrainerHashChange();
    }

    console.log('✅ Слайдер тренеров готов к работе');
  }

  function initTrainerCards() {
    const trainerCards = document.querySelectorAll('.trainer-card');

    trainerCards.forEach(card => {
      const bookBtn = card.querySelector('.trainer-book-btn');
      if (!bookBtn) return;

      // Убираем старые обработчики
      const newBookBtn = bookBtn.cloneNode(true);
      bookBtn.parentNode.replaceChild(newBookBtn, bookBtn);

      newBookBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const trainerId = card.getAttribute('data-trainer-id');
        if (trainerId) {
          openBookingForTrainer(trainerId);
        }
      });
    });

    console.log(`✅ Инициализировано ${trainerCards.length} карточек тренеров`);
  }

  // Экспортируем API
  window.PrideTrainersSlider = {
    init: init,
    openTrainer: openBookingForTrainer
  };

  // Автоматическая инициализация при загрузке
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
