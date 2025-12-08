// ===== StyleGuide JavaScript =====

document.addEventListener('DOMContentLoaded', function() {
    // Инициализация переключателя темы
    initThemeToggle();

    // Плавная прокрутка для навигации
    initSmoothScroll();

    // Автоматический перезапуск анимаций
    initAnimationRestart();

    // Инициализация 3D Tilt эффекта
    initTiltEffect();
});

// ===== Переключатель темы =====
function initThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    const body = document.body;

    // Проверка сохраненной темы
    const savedTheme = localStorage.getItem('styleguide-theme');
    if (savedTheme === 'light') {
        body.classList.add('light-theme');
    }

    // Обработчик переключения
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            body.classList.toggle('light-theme');

            // Сохранение выбора
            if (body.classList.contains('light-theme')) {
                localStorage.setItem('styleguide-theme', 'light');
            } else {
                localStorage.setItem('styleguide-theme', 'dark');
            }
        });
    }
}

// ===== Плавная прокрутка =====
function initSmoothScroll() {
    const navLinks = document.querySelectorAll('.sg-nav a');

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                const headerHeight = 160; // Высота шапки и навигации
                const targetPosition = targetSection.offsetTop - headerHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ===== Перезапуск анимаций =====
function initAnimationRestart() {
    const animationBoxes = document.querySelectorAll('.animation-box');

    animationBoxes.forEach(box => {
        box.addEventListener('click', function() {
            // Удаляем и добавляем класс для перезапуска анимации
            const animationClass = Array.from(this.classList).find(cls =>
                cls !== 'animation-box'
            );

            if (animationClass) {
                this.classList.remove(animationClass);

                // Небольшая задержка для перезапуска
                setTimeout(() => {
                    this.classList.add(animationClass);
                }, 10);
            }
        });
    });
}

// ===== Копирование кода цвета при клике =====
document.addEventListener('click', function(e) {
    if (e.target.closest('.color-card')) {
        const colorCard = e.target.closest('.color-card');
        const colorValue = colorCard.querySelector('.color-value');

        if (colorValue) {
            const textToCopy = colorValue.textContent;

            // Копирование в буфер обмена
            navigator.clipboard.writeText(textToCopy).then(() => {
                // Показываем уведомление
                showNotification('Цвет скопирован: ' + textToCopy);
            }).catch(err => {
                console.error('Ошибка копирования:', err);
            });
        }
    }
});

// ===== Уведомления =====
function showNotification(message) {
    // Создаем элемент уведомления
    const notification = document.createElement('div');
    notification.className = 'sg-notification';
    notification.textContent = message;

    // Добавляем стили
    notification.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        background: var(--sg-primary);
        color: #fff;
        padding: 16px 24px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        z-index: 10000;
        animation: slideInRight 0.3s ease-out;
        font-weight: 600;
    `;

    document.body.appendChild(notification);

    // Удаляем через 3 секунды
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Добавляем анимации для уведомлений
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ===== Интерактивные табы =====
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('tab')) {
        const tabContainer = e.target.closest('.tabs');
        const tabs = tabContainer.querySelectorAll('.tab');

        // Убираем активный класс со всех табов
        tabs.forEach(tab => {
            tab.classList.remove('tab-active');
        });

        // Добавляем активный класс к выбранному табу
        e.target.classList.add('tab-active');
    }
});

// ===== Копирование примеров кода =====
function copyCode(code) {
    navigator.clipboard.writeText(code).then(() => {
        showNotification('Код скопирован!');
    }).catch(err => {
        console.error('Ошибка копирования:', err);
    });
}

// ===== Инициализация Progress Bar анимации =====
window.addEventListener('load', function() {
    const progressBars = document.querySelectorAll('.progress-bar');

    progressBars.forEach((bar, index) => {
        const targetWidth = bar.style.width;
        bar.style.width = '0%';

        setTimeout(() => {
            bar.style.width = targetWidth;
        }, 500 + (index * 200));
    });
});

// ===== Инициализация 3D Tilt эффекта =====
function initTiltEffect() {
    // Проверяем наличие библиотеки VanillaTilt
    if (typeof VanillaTilt === 'undefined') {
        console.warn('VanillaTilt library not loaded');
        return;
    }

    // Инициализация для всех элементов с data-tilt
    const tiltElements = document.querySelectorAll('[data-tilt]');

    if (tiltElements.length > 0) {
        VanillaTilt.init(tiltElements, {
            // Настройки по умолчанию (могут быть переопределены data-атрибутами)
            max: 15,
            speed: 400,
            glare: false,
            'max-glare': 0.3,
            scale: 1.05
        });

        console.log(`3D Tilt initialized for ${tiltElements.length} elements ✓`);
    }
}

// ===== Дебаг информация =====
console.log('%c StyleGuide loaded! ', 'background: #bd9d5d; color: #fff; font-weight: bold; padding: 4px 8px; border-radius: 4px;');
console.log('Theme toggle: ✓');
console.log('Smooth scroll: ✓');
console.log('Animations: ✓');
console.log('Interactive elements: ✓');
console.log('3D Tilt effect: ✓');
console.log('Glass morphism: ✓');
