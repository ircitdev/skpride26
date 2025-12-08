/**
 * Custom Cursor - СК ПРАЙД
 * Двойной курсор с магнитным эффектом
 */

(function() {
    'use strict';

    // Не инициализируем на touch устройствах
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
        document.body.classList.add('touch-device');
        return;
    }

    // Проверяем ширину экрана
    if (window.innerWidth <= 768) {
        return;
    }

    // Создаём элементы курсора
    const cursorOuter = document.createElement('div');
    cursorOuter.className = 'cursor__outer';

    const cursorInner = document.createElement('div');
    cursorInner.className = 'cursor__inner';

    document.body.appendChild(cursorOuter);
    document.body.appendChild(cursorInner);

    // Позиция курсора
    let mouseX = 0;
    let mouseY = 0;
    let outerX = 0;
    let outerY = 0;
    let innerX = 0;
    let innerY = 0;

    // Магнитный эффект
    let magneticTarget = null;
    let magneticX = 0;
    let magneticY = 0;

    // Скорость следования (0-1, меньше = медленнее)
    const outerSpeed = 0.15;
    const innerSpeed = 0.35;

    // Отслеживание позиции мыши
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;

        // Магнитный эффект для кнопок
        if (magneticTarget) {
            const rect = magneticTarget.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;

            // Притягиваем к центру кнопки
            magneticX = centerX + (mouseX - centerX) * 0.3;
            magneticY = centerY + (mouseY - centerY) * 0.3;
        } else {
            magneticX = mouseX;
            magneticY = mouseY;
        }
    });

    // Анимация курсора
    function animate() {
        // Плавное следование внешнего круга
        outerX += (magneticX - outerX) * outerSpeed;
        outerY += (magneticY - outerY) * outerSpeed;

        // Плавное следование внутренней точки
        innerX += (mouseX - innerX) * innerSpeed;
        innerY += (mouseY - innerY) * innerSpeed;

        cursorOuter.style.left = outerX + 'px';
        cursorOuter.style.top = outerY + 'px';

        cursorInner.style.left = innerX + 'px';
        cursorInner.style.top = innerY + 'px';

        requestAnimationFrame(animate);
    }
    animate();

    // Интерактивные элементы
    const interactiveSelectors = [
        'a',
        'button',
        '[role="button"]',
        '.sport-btn',
        '.slides-nav__button',
        '.slide-selector-item',
        '.offcanvas__close',
        '.modal-close',
        '.sport-close',
        '[data-cursor="hover"]'
    ].join(', ');

    // Магнитные элементы (кнопки)
    const magneticSelectors = [
        '.slides-nav__button',
        '.sport-btn',
        '.virtual-tour-btn',
        '[data-cursor="magnetic"]'
    ].join(', ');

    // Текстовые поля
    const textSelectors = 'input[type="text"], input[type="email"], input[type="tel"], textarea';

    // Hover эффект
    document.addEventListener('mouseover', (e) => {
        const target = e.target.closest(interactiveSelectors);
        if (target) {
            cursorOuter.classList.add('cursor--hover');
            cursorInner.classList.add('cursor--hover');

            // Магнитный эффект
            if (target.matches(magneticSelectors)) {
                magneticTarget = target;
                cursorOuter.classList.add('cursor--magnetic');
            }
        }

        // Текстовые поля
        if (e.target.matches(textSelectors)) {
            cursorOuter.classList.add('cursor--text');
            cursorInner.classList.add('cursor--text');
        }
    });

    document.addEventListener('mouseout', (e) => {
        const target = e.target.closest(interactiveSelectors);
        if (target) {
            cursorOuter.classList.remove('cursor--hover', 'cursor--magnetic');
            cursorInner.classList.remove('cursor--hover');
            magneticTarget = null;
        }

        if (e.target.matches(textSelectors)) {
            cursorOuter.classList.remove('cursor--text');
            cursorInner.classList.remove('cursor--text');
        }
    });

    // Клик эффект
    document.addEventListener('mousedown', () => {
        cursorOuter.classList.add('cursor--click');
        cursorInner.classList.add('cursor--click');
    });

    document.addEventListener('mouseup', () => {
        cursorOuter.classList.remove('cursor--click');
        cursorInner.classList.remove('cursor--click');
    });

    // Скрытие при выходе за пределы окна
    document.addEventListener('mouseleave', () => {
        cursorOuter.classList.add('cursor--hidden');
        cursorInner.classList.add('cursor--hidden');
    });

    document.addEventListener('mouseenter', () => {
        cursorOuter.classList.remove('cursor--hidden');
        cursorInner.classList.remove('cursor--hidden');
    });

    // При изменении размера окна
    window.addEventListener('resize', () => {
        if (window.innerWidth <= 768) {
            cursorOuter.style.display = 'none';
            cursorInner.style.display = 'none';
        } else {
            cursorOuter.style.display = '';
            cursorInner.style.display = '';
        }
    });

    console.log('✅ Custom cursor initialized');
})();
