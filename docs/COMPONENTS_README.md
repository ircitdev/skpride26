# Pride34 Components Collection

Коллекция современных UI компонентов для Pride34, адаптированных под фирменный стиль.

## Структура файлов

### 📄 Страницы StyleGuide

1. **styleguide.html** - Классический StyleGuide
   - Полная палитра цветов
   - Типографическая система
   - Кнопки всех стилей
   - Формы с валидацией
   - Карточки с 3D Tilt и Glass эффектами
   - Анимации (fade, scale, rotate)
   - UI компоненты (badges, alerts, progress bars)

2. **styleguide-v2.html** - Primer Style Guide
   - Минималистичный дизайн в стиле GitHub Primer
   - Боковая навигация
   - Primitives (Colors, Typography, Spacing, Elevation)
   - Components (Button, Card, Forms, Label, Banner)
   - Patterns (Hero, Features, Stats)
   - Светлая/темная тема

3. **font-pairing.html** - Демо сочетаний шрифтов
   - Montserrat + Merriweather
   - Montserrat + Playfair Display
   - Montserrat + Roboto ⭐ (рекомендуется)
   - Montserrat + Lato
   - Montserrat + Dancing Script
   - Сравнительная таблица
   - Рекомендации по использованию

4. **components-collection.html** - Полная коллекция компонентов
   - 2 варианта Hero секций
   - 3 стиля карточек
   - Pricing таблицы
   - Team карточки
   - Testimonials
   - Переключатель стилей (Default, Minimal, Bold, Glass)

## 🎨 Цветовая палитра

```css
--gold: #bd9d5d;           /* Основной акцентный цвет */
--gold-dark: #957a45;      /* Hover и активные состояния */
--gold-light: #e8d4b8;     /* Фоны и акценты */
```

## 📝 Типографика

### Шрифты
- **Заголовки**: Montserrat Bold (700) для H1-H2, Medium (500) для H3-H6
- **Текст**: Roboto Regular (400) для основного контента

### Размеры
```css
H1: 3rem (48px)
H2: 2.5rem (40px)
H3: 2rem (32px)
H4: 1.5rem (24px)
Body: 1rem (16px)
Small: 0.875rem (14px)
```

## 🃏 Компоненты карточек

### 1. Card Hover Lift
```html
<div class="card card-hover-lift">
  <div class="card-image">
    <div class="card-image-placeholder">🏋️</div>
    <span class="card-badge">Популярное</span>
  </div>
  <div class="card-content">
    <h3>Заголовок</h3>
    <p>Описание...</p>
    <button class="btn btn-outline">Подробнее</button>
  </div>
</div>
```
**Эффект**: Приподнимается при наведении с тенью

### 2. Card Flip (3D переворот)
```html
<div class="card-flip">
  <div class="card-flip-inner">
    <div class="card-flip-front">
      <div class="flip-icon">⚡</div>
      <h3>Лицевая сторона</h3>
    </div>
    <div class="card-flip-back">
      <h3>Обратная сторона</h3>
      <p>Дополнительная информация...</p>
    </div>
  </div>
</div>
```
**Эффект**: 3D переворот при наведении

### 3. Card Gradient Border
```html
<div class="card-gradient">
  <div class="card-gradient-content">
    <div class="gradient-icon">🔥</div>
    <h3>Заголовок</h3>
    <p>Описание...</p>
    <ul class="feature-list">
      <li>✓ Особенность 1</li>
      <li>✓ Особенность 2</li>
    </ul>
    <div class="price">2500₽ <span>/мес</span></div>
    <button class="btn btn-primary">Выбрать</button>
  </div>
</div>
```
**Эффект**: Градиентная граница с анимацией

## 🦸 Hero секции

### 1. Hero Gradient with Animation
```html
<section class="hero hero-gradient">
  <div class="hero-background">
    <div class="hero-shapes">
      <div class="shape shape-1"></div>
      <div class="shape shape-2"></div>
      <div class="shape shape-3"></div>
    </div>
  </div>
  <div class="hero-content">
    <h1 class="hero-title animate-fade-in-up">Заголовок</h1>
    <p class="hero-subtitle animate-fade-in-up delay-1">Подзаголовок</p>
    <div class="hero-actions animate-fade-in-up delay-2">
      <button class="btn btn-primary btn-large">CTA</button>
    </div>
  </div>
</section>
```
**Особенности**:
- Анимированные формы на фоне
- Последовательная анимация элементов
- Статистика с счетчиками

### 2. Hero Split Screen
```html
<section class="hero hero-split">
  <div class="hero-split-content">
    <h1 class="hero-title">Заголовок</h1>
    <p class="hero-text">Текст...</p>
    <button class="btn btn-primary btn-large">CTA</button>
  </div>
  <div class="hero-split-image">
    <div class="hero-image-placeholder">Изображение</div>
  </div>
</section>
```
**Особенности**:
- Разделенный экран 50/50
- Текст слева, изображение справа
- Список особенностей

## 💰 Pricing карточки

```html
<div class="pricing-card pricing-card-featured">
  <div class="pricing-badge">Лучшее предложение</div>
  <div class="pricing-header">
    <h3>Годовой</h3>
    <div class="pricing-price">
      <span class="price-amount">1800</span>
      <span class="price-currency">₽</span>
      <span class="price-period">/мес</span>
    </div>
    <div class="pricing-save">Экономия 8400₽</div>
  </div>
  <ul class="pricing-features">
    <li>✓ Особенность 1</li>
    <li>✓ Особенность 2</li>
  </ul>
  <button class="btn btn-primary btn-block">Купить</button>
</div>
```

## 👥 Team карточки

```html
<div class="team-card">
  <div class="team-image">
    <div class="team-image-placeholder">АИ</div>
    <div class="team-overlay">
      <div class="team-social">
        <a href="#" class="social-link">📷</a>
        <a href="#" class="social-link">📱</a>
      </div>
    </div>
  </div>
  <div class="team-info">
    <h3>Алексей Иванов</h3>
    <p class="team-role">Мастер-тренер</p>
    <p class="team-desc">Описание...</p>
  </div>
</div>
```

## 💬 Testimonials

```html
<div class="testimonial-card">
  <div class="testimonial-stars">★★★★★</div>
  <p class="testimonial-text">"Отличный отзыв..."</p>
  <div class="testimonial-author">
    <div class="author-avatar">АК</div>
    <div class="author-info">
      <div class="author-name">Андрей Кузнецов</div>
      <div class="author-meta">Клиент 6 месяцев</div>
    </div>
  </div>
</div>
```

## 🎭 Переключатель стилей

4 варианта стилей:

1. **Default** - Стандартный стиль с тенями и скруглениями
2. **Minimal** - Минималистичный с границами вместо теней
3. **Bold** - Жирный и контрастный с острыми углами
4. **Glass** - Glassmorphism эффект

```javascript
// Переключение через JavaScript
document.body.classList.add('style-minimal');
document.body.classList.add('style-bold');
document.body.classList.add('style-glass');
```

## 🎬 Анимации

### Fade анимации
```css
.animate-fade-in-up      /* Появление снизу вверх */
.delay-1                 /* Задержка 0.2s */
.delay-2                 /* Задержка 0.4s */
.delay-3                 /* Задержка 0.6s */
```

### Scroll анимации
Автоматически применяются ко всем карточкам при прокрутке

## 📱 Адаптивность

Все компоненты полностью адаптивны:

- **Desktop**: ≥ 1024px - полная раскладка
- **Tablet**: 768px - 1023px - адаптированная сетка
- **Mobile**: < 768px - одноколоночная раскладка

## 🚀 Как использовать

### 1. Подключите стили
```html
<link rel="stylesheet" href="components-collection.css">
```

### 2. Подключите скрипты
```html
<script src="vanilla-tilt.min.js"></script>
<script src="components-collection.js"></script>
```

### 3. Скопируйте нужный компонент
Откройте `components-collection.html` и скопируйте HTML нужного компонента

### 4. Добавьте на свою страницу
Вставьте HTML и при необходимости адаптируйте контент

## 💡 Рекомендации

### Для Pride34 рекомендуем:

1. **Hero**: Hero Gradient with Animation - для главной страницы
2. **Cards**: Card Hover Lift - для направлений тренировок
3. **Pricing**: Featured pricing card - для тарифов
4. **Team**: Team cards with overlay - для тренеров
5. **Style**: Default или Glass - в зависимости от секции

### Цветовая схема:
- Используйте `--gold` (#bd9d5d) как основной акцентный цвет
- Применяйте градиенты для Hero и важных CTA
- Сохраняйте достаточный контраст для читаемости

### Типографика:
- Montserrat Bold для крупных заголовков
- Montserrat Medium для подзаголовков
- Roboto Regular для текста
- Минимальный размер текста 16px

## 🔗 Навигация

- [StyleGuide v1](styleguide.html) - Классический с эффектами
- [StyleGuide v2](styleguide-v2.html) - Primer стиль
- [Font Pairing](font-pairing.html) - Сочетания шрифтов
- [Components Collection](components-collection.html) - Полная коллекция

## 📄 Лицензия

Все компоненты созданы специально для Pride34 и могут использоваться в рамках проекта.

---

**Создано с ❤️ для Pride34**
