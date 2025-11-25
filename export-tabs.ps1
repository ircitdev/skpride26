# Экспорт данных в Google Таблицы v2.0 - С ВКЛАДКАМИ
# Автор: Claude Code
# Дата: 2025-11-05

Write-Host "================================================" -ForegroundColor Cyan
Write-Host "  Экспорт в Google Таблицы v2.0" -ForegroundColor Cyan
Write-Host "  С разделением по вкладкам" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

# Проверяем наличие Python
try {
    $pythonVersion = python --version 2>&1
    Write-Host "[OK] Python найден: $pythonVersion" -ForegroundColor Green
} catch {
    Write-Host "[ERROR] Python не найден!" -ForegroundColor Red
    Write-Host "Установите Python с https://www.python.org/" -ForegroundColor Yellow
    pause
    exit 1
}

# Проверяем наличие BeautifulSoup4
Write-Host "[INFO] Проверка зависимостей..." -ForegroundColor Yellow
python -c "import bs4" 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "[WARNING] Библиотека BeautifulSoup4 не найдена" -ForegroundColor Yellow
    Write-Host "Устанавливаю..." -ForegroundColor Yellow
    pip install beautifulsoup4 -q
    if ($LASTEXITCODE -eq 0) {
        Write-Host "[OK] BeautifulSoup4 установлен" -ForegroundColor Green
    } else {
        Write-Host "[WARNING] Не удалось установить BeautifulSoup4" -ForegroundColor Yellow
        Write-Host "Слайды не будут экспортированы, но остальное работает" -ForegroundColor Yellow
    }
}

Write-Host ""

# Проверяем наличие файлов
if (-not (Test-Path "form.json")) {
    Write-Host "[ERROR] Файл form.json не найден!" -ForegroundColor Red
    pause
    exit 1
}

if (-not (Test-Path "index.html")) {
    Write-Host "[WARNING] Файл index.html не найден!" -ForegroundColor Yellow
    Write-Host "Слайды не будут экспортированы" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Запуск экспорта с разделением по вкладкам..." -ForegroundColor Yellow
Write-Host ""

# Запускаем скрипт экспорта v2
python export_to_sheets_v2.py

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "================================================" -ForegroundColor Green
    Write-Host "  Экспорт завершен успешно!" -ForegroundColor Green
    Write-Host "================================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "Создано 16 вкладок:" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "  СПОРТ:" -ForegroundColor Yellow
    Write-Host "    01. Слайды (10 слайдов)" -ForegroundColor White
    Write-Host "    02. Тренажерный зал" -ForegroundColor White
    Write-Host "    03. Детские секции" -ForegroundColor White
    Write-Host "    04. Единоборства" -ForegroundColor White
    Write-Host "    05. Танцы" -ForegroundColor White
    Write-Host "    06. Женские секции" -ForegroundColor White
    Write-Host "    07. Зимние секции" -ForegroundColor White
    Write-Host "    08. Мужские секции" -ForegroundColor White
    Write-Host ""
    Write-Host "  ОТДЫХ:" -ForegroundColor Yellow
    Write-Host "    09. Отдых и СПА" -ForegroundColor White
    Write-Host "    10. Отель" -ForegroundColor White
    Write-Host "    11. Ресторан" -ForegroundColor White
    Write-Host ""
    Write-Host "  ПРОЧЕЕ:" -ForegroundColor Yellow
    Write-Host "    12. Ледовая арена" -ForegroundColor White
    Write-Host "    13. Футбольное поле" -ForegroundColor White
    Write-Host "    14. События" -ForegroundColor White
    Write-Host "    15. Акции (шаблон)" -ForegroundColor White
    Write-Host "    16. Новости (шаблон)" -ForegroundColor White
    Write-Host ""
    Write-Host "Следующие шаги:" -ForegroundColor Cyan
    Write-Host "1. Откройте папку google_sheets_tabs" -ForegroundColor White
    Write-Host "2. Загрузите КАЖДЫЙ файл как отдельную вкладку в Google Таблицы" -ForegroundColor White
    Write-Host "3. Или используйте Google Apps Script для массового импорта" -ForegroundColor White
    Write-Host ""
    Write-Host "Подробная инструкция: TABS_GUIDE.md" -ForegroundColor Yellow
    Write-Host ""

    # Предлагаем открыть папку
    $openFolder = Read-Host "Открыть папку с экспортом? (Y/N)"
    if ($openFolder -eq 'Y' -or $openFolder -eq 'y') {
        Start-Process explorer "google_sheets_tabs"
    }
} else {
    Write-Host ""
    Write-Host "[ERROR] Ошибка при экспорте!" -ForegroundColor Red
}

Write-Host ""
Write-Host "Нажмите любую клавишу для выхода..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
