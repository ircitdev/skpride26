// Patch для правильного отображения fulldesc на мобильных
document.addEventListener('DOMContentLoaded', () => {
  // Сохраняем оригинальную функцию
  const originalOpenFulldescModal = window.openFulldescModal;

  // Функция для обработки контента trainer-info
  function processTrainerInfo(content) {
    // Создаем временный элемент для парсинга HTML
    const temp = document.createElement('div');
    temp.innerHTML = content;

    // Ищем блок trainer-info
    const trainerInfo = temp.querySelector('.trainer-info');

    if (trainerInfo) {
      // Находим все h3 заголовки
      const allH3 = Array.from(trainerInfo.querySelectorAll('h3'));

      // Находим индексы нужных заголовков
      let startH3 = null;
      let endH3 = null;

      allH3.forEach(h3 => {
        if (h3.textContent.trim() === 'Описание направления') {
          startH3 = h3;
        }
        if (h3.textContent.trim() === 'Расписание') {
          endH3 = h3;
        }
      });

      if (startH3 && endH3) {
        // Создаем новый блок с нужным контентом
        const newTrainerInfo = document.createElement('div');
        newTrainerInfo.className = 'trainer-info';

        // Собираем контент между двумя заголовками
        let currentElement = startH3;
        while (currentElement && currentElement !== endH3) {
          newTrainerInfo.appendChild(currentElement.cloneNode(true));
          currentElement = currentElement.nextElementSibling;
        }

        // Заменяем старый блок на новый
        trainerInfo.parentNode.replaceChild(newTrainerInfo, trainerInfo);
      }
    }

    return temp.innerHTML;
  }

  // Переопределяем функцию
  window.openFulldescModal = function(content, opt) {
    // Если передан объект opt, формируем правильный контент для мобильных
    if (opt && window.innerWidth <= 768) {
      // Обрабатываем fulldesc для удаления дублирующегося контента
      let processedFulldesc = opt.fulldesc || content;
      processedFulldesc = processTrainerInfo(processedFulldesc);

      const mobileContent = `
        ${opt.label ? `<h1>${opt.label}</h1>` : ''}
        ${opt.sub ? `<p class="fulldesc-sub">${opt.sub}</p>` : ''}
        ${opt.fimage ? `<img src="${opt.fimage}" alt="${opt.label || ''}" class="fulldesc-image">` : ''}
        ${opt.price ? `<div class="fulldesc-price"><strong>💰 Стоимость:</strong> ${opt.price}</div>` : ''}
        ${opt.timetable ? `<div class="fulldesc-timetable"><strong>📅 Расписание:</strong> ${opt.timetable}</div>` : ''}
        ${processedFulldesc}
      `;

      originalOpenFulldescModal.call(this, mobileContent);
    } else {
      // Для десктопа используем оригинальный контент
      originalOpenFulldescModal.call(this, content);
    }
  };

  // Переопределяем вызов из showFinalFields
  const originalShowFinalFields = window.showFinalFields;

  if (originalShowFinalFields) {
    window.showFinalFields = function(opt) {
      originalShowFinalFields.call(this, opt);

      // Переопределяем обработчик кнопки "Подробнее"
      setTimeout(() => {
        const finalFields = document.getElementById("finalFields");
        const fulldescBtn = finalFields?.querySelector(".show-fulldesc-btn");

        if (fulldescBtn && opt?.fulldesc) {
          // Удаляем старый обработчик
          const newBtn = fulldescBtn.cloneNode(true);
          fulldescBtn.parentNode.replaceChild(newBtn, fulldescBtn);

          // Добавляем новый с передачей объекта opt
          newBtn.addEventListener("click", () => {
            window.openFulldescModal(opt.fulldesc, opt);
          });
        }
      }, 100);
    };
  }
});
