# Импорт данных из Google Таблиц обратно в form.json
# Автор: Claude Code
# Дата: 2025-11-05

Write-Host "================================================" -ForegroundColor Cyan
Write-Host "  Импорт данных из Google Таблиц" -ForegroundColor Cyan
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

# Проверяем наличие директории с CSV
if (-not (Test-Path "google_sheets_export")) {
    Write-Host "[ERROR] Папка google_sheets_export не найдена!" -ForegroundColor Red
    Write-Host "Сначала скачайте CSV файлы из Google Таблиц в эту папку" -ForegroundColor Yellow
    pause
    exit 1
}

# Проверяем наличие CSV файлов
$csvFiles = Get-ChildItem -Path "google_sheets_export" -Filter "*.csv"
if ($csvFiles.Count -eq 0) {
    Write-Host "[ERROR] В папке google_sheets_export нет CSV файлов!" -ForegroundColor Red
    Write-Host "Скачайте CSV файлы из Google Таблиц:" -ForegroundColor Yellow
    Write-Host "  Файл → Скачать → CSV (текущий лист)" -ForegroundColor White
    pause
    exit 1
}

Write-Host "[OK] Найдено CSV файлов: $($csvFiles.Count)" -ForegroundColor Green
Write-Host ""

# Предупреждение
Write-Host "ВНИМАНИЕ!" -ForegroundColor Red
Write-Host "Текущий файл form.json будет создан бэкап" -ForegroundColor Yellow
Write-Host "и заменен данными из Google Таблиц" -ForegroundColor Yellow
Write-Host ""

$confirm = Read-Host "Продолжить? (Y/N)"
if ($confirm -ne 'Y' -and $confirm -ne 'y') {
    Write-Host "Импорт отменен" -ForegroundColor Yellow
    pause
    exit 0
}

Write-Host ""
Write-Host "Запуск импорта..." -ForegroundColor Yellow
Write-Host ""

# Запускаем скрипт импорта
python import_from_sheets.py

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "================================================" -ForegroundColor Green
    Write-Host "  Импорт завершен успешно!" -ForegroundColor Green
    Write-Host "================================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "Следующие шаги:" -ForegroundColor Cyan
    Write-Host "1. Проверьте сайт на наличие ошибок" -ForegroundColor White
    Write-Host "2. Если есть проблемы - восстановите из бэкапа" -ForegroundColor White
    Write-Host "3. Обновите сайт на сервере" -ForegroundColor White
    Write-Host ""

    # Предлагаем открыть сайт для проверки
    $openSite = Read-Host "Запустить локальный сервер для проверки? (Y/N)"
    if ($openSite -eq 'Y' -or $openSite -eq 'y') {
        Write-Host "Запуск сервера..." -ForegroundColor Yellow
        & .\run-web.ps1
    }
} else {
    Write-Host ""
    Write-Host "[ERROR] Ошибка при импорте!" -ForegroundColor Red
    Write-Host "form.json не был изменен" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Нажмите любую клавишу для выхода..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
