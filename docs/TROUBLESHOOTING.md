# 🔧 Устранение проблем - Liquid Slider

## Проблема: Текст со слайдов не показывается

### Причины и решения:

### 1️⃣ ES Modules требуют HTTP сервер

**Проблема**: JavaScript использует `import` (ES modules) и не работает при открытии через `file://`

**Решение**:
```bash
# Вариант 1: Запустить готовый .bat файл
Двойной клик на START_SERVER.bat

# Вариант 2: Вручную запустить Python сервер
cd K:\scripts\pride\slide7
python -m http.server 8000

# Затем открыть в браузере:
http://localhost:8000/liquid-slider-demo.html
# или
http://localhost:8000/index.html
```

### 2️⃣ Проверить консоль браузера

Откройте DevTools (F12) и проверьте Console:

**Должны увидеть**:
```
🌊 Liquid Slider: Script loaded!
✅ Three.js imported: Success
🚀 Window loaded, initializing liquid slider...
📝 Updating caption for slide 0: Has content
✅ Caption updated successfully
✅ Liquid slider initialization complete!
```

**Если видите ошибки**:
- `CORS error` → Нужен HTTP сервер (см. пункт 1)
- `Failed to load module` → Проверьте интернет соединение (Three.js грузится с esm.sh)
- `liquidSlideCaption element not found` → Проверьте HTML (должен быть элемент с id="liquidSlideCaption")

### 3️⃣ CSS конфликты

**Проблема**: Стили из `style.css` скрывают caption (`.slide__caption { opacity: 0; }`)

**Уже исправлено в `liquid-slider.css`**:
```css
#liquidSlideCaption.slide__caption {
  opacity: 1 !important;
  transform: translateY(0) !important;
  padding: 0 !important;
}
```

Если текст все равно не виден:
1. Откройте DevTools → Elements
2. Найдите `<figcaption id="liquidSlideCaption">`
3. Проверьте:
   - `opacity: 1` ✅
   - `z-index: 10` ✅
   - Есть ли контент внутри ✅

### 4️⃣ JavaScript не обновляет caption

**Проверка**:
```javascript
// В консоли браузера введите:
document.getElementById('liquidSlideCaption').innerHTML

// Должны увидеть HTML с текстом слайда
```

**Если пусто**:
1. Проверьте что `liquid-slider.js` загружен (Network tab в DevTools)
2. Проверьте console на ошибки
3. Убедитесь что используете HTTP сервер

### 5️⃣ Canvas перекрывает текст

**Уже исправлено**:
```css
.liquid-slider-wrapper {
  z-index: 1;
  pointer-events: none;
}
.liquid-slider-canvas {
  pointer-events: auto;
}
#liquidSlideCaption.slide__caption {
  z-index: 10;  /* Выше canvas */
}
```

## Быстрая диагностика

### Шаг 1: Запустите demo
```bash
# 1. Запустить сервер
START_SERVER.bat

# 2. Открыть
http://localhost:8000/liquid-slider-demo.html

# 3. Проверить:
✅ Видны изображения?
✅ Виден текст "Спорт и отдых для всей семьи"?
✅ Видны кнопки "Я хочу спорт"?
✅ Работает liquid glass эффект?
```

### Шаг 2: Откройте консоль (F12)

**Хорошо** ✅:
```
🌊 Liquid Slider: Script loaded!
✅ Three.js imported: Success
🚀 Window loaded, initializing liquid slider...
📝 Updating caption for slide 0: Has content
✅ Caption updated successfully
```

**Плохо** ❌:
```
CORS policy blocked...
Failed to load module...
```
→ Запустите через HTTP сервер!

### Шаг 3: Проверьте Elements

1. Откройте DevTools → Elements
2. Найдите `<figcaption id="liquidSlideCaption">`
3. Должно быть заполнено:
```html
<figcaption class="slide__caption" id="liquidSlideCaption">
  <h2 class="slides__caption-headline">
    <span class="text-row">
      <span>
        <span class="slideTextAccent">Спорт</span>
        <br class="mobile-br">
        <em>и отдых</em>
      </span>
    </span>
    ...
  </h2>
  <div class="slides__caption-link">
    <a href="#" id="wantSportBtn">...</a>
    ...
  </div>
</figcaption>
```

## Контрольный список

- [ ] Запущен HTTP сервер (`START_SERVER.bat` или `python -m http.server 8000`)
- [ ] Открыт через `http://localhost:8000/...` (НЕ `file://...`)
- [ ] В консоли нет ошибок
- [ ] В консоли есть `✅ Caption updated successfully`
- [ ] В Elements видно что `#liquidSlideCaption` заполнен HTML
- [ ] `opacity: 1` на caption элементе
- [ ] `z-index: 10` на caption элементе

## Все еще не работает?

1. **Перезагрузите страницу** (Ctrl+F5 - hard reload)
2. **Очистите кеш браузера**
3. **Проверьте файлы**:
   ```
   K:\scripts\pride\slide7\
   ├── index.html              ✅ обновлен
   ├── liquid-slider.js        ✅ со всем контентом
   ├── liquid-slider.css       ✅ с !important стилями
   └── START_SERVER.bat        ✅ для запуска
   ```

4. **Откройте demo версию** сначала:
   - `http://localhost:8000/liquid-slider-demo.html`
   - Она точно должна работать
   - Если demo работает, но index.html нет → проверьте что замена slideshow прошла успешно

## Полезные команды консоли

```javascript
// Проверить существует ли элемент
document.getElementById('liquidSlideCaption')

// Проверить контент
document.getElementById('liquidSlideCaption').innerHTML

// Проверить стили
getComputedStyle(document.getElementById('liquidSlideCaption')).opacity
getComputedStyle(document.getElementById('liquidSlideCaption')).zIndex

// Вручную обновить caption (для теста)
document.getElementById('liquidSlideCaption').innerHTML = '<h2>TEST</h2>'
```

## Успех! 🎉

Если все работает, вы должны видеть:
- ✅ WebGL canvas с изображением
- ✅ Liquid glass эффект при переходе
- ✅ Текст поверх изображения
- ✅ Кликабельные кнопки
- ✅ Автоплей через 5 секунд
- ✅ Прогресс-бары внизу
