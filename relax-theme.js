/**
 * 🌓 ПЕРЕКЛЮЧАТЕЛЬ ТЕМ ДЛЯ МОДАЛЬНОГО ОКНА "RELAX"
 * СК ПРАЙД
 */

(function() {
  'use strict';

  console.log('📦 relax-theme.js загружен');

  // Ключ для localStorage
  const THEME_KEY = 'relaxModalTheme';

  // Получаем сохраненную тему или используем светлую по умолчанию
  function getSavedTheme() {
    return localStorage.getItem(THEME_KEY) || 'light';
  }

  // Сохраняем тему
  function saveTheme(theme) {
    localStorage.setItem(THEME_KEY, theme);
  }

  // Применяем тему
  function applyTheme(theme) {
    const modal = document.getElementById('relaxModal');
    if (!modal) return;

    if (theme === 'dark') {
      modal.classList.add('theme-dark');
      console.log('🌙 Применена темная тема');
    } else {
      modal.classList.remove('theme-dark');
      console.log('☀️ Применена светлая тема');
    }
  }

  // Переключаем тему
  function toggleTheme() {
    const currentTheme = getSavedTheme();
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';

    saveTheme(newTheme);
    applyTheme(newTheme);
  }

  // Инициализация
  function init() {
    console.log('🎬 Инициализация переключателя тем...');

    // Применяем сохраненную тему при загрузке
    const savedTheme = getSavedTheme();
    applyTheme(savedTheme);

    // Находим кнопку переключения
    const toggleButton = document.getElementById('relaxThemeToggle');
    if (toggleButton) {
      toggleButton.addEventListener('click', toggleTheme);
      console.log('✅ Кнопка переключения темы подключена');
    }

    // Применяем тему при открытии модального окна
    const modal = document.getElementById('relaxModal');
    if (modal) {
      modal.addEventListener('modalopen', () => {
        applyTheme(getSavedTheme());
      });
    }

    console.log('✅ Переключатель тем инициализирован');
  }

  // Автоматическая инициализация при загрузке
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Экспортируем API
  window.RelaxTheme = {
    toggle: toggleTheme,
    apply: applyTheme,
    get: getSavedTheme
  };

})();
