# Экспорт данных из form.json в CSV для Google Таблиц
# Автор: Claude Code
# Дата: 2025-11-05

Write-Host "================================================" -ForegroundColor Cyan
Write-Host "  Экспорт данных в Google Таблицы" -ForegroundColor Cyan
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

# Проверяем наличие form.json
if (-not (Test-Path "form.json")) {
    Write-Host "[ERROR] Файл form.json не найден!" -ForegroundColor Red
    pause
    exit 1
}

Write-Host ""
Write-Host "Запуск экспорта..." -ForegroundColor Yellow
Write-Host ""

# Запускаем скрипт экспорта
python export_to_sheets.py

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "================================================" -ForegroundColor Green
    Write-Host "  Экспорт завершен успешно!" -ForegroundColor Green
    Write-Host "================================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "Следующие шаги:" -ForegroundColor Cyan
    Write-Host "1. Откройте папку google_sheets_export" -ForegroundColor White
    Write-Host "2. Загрузите файлы в Google Таблицы" -ForegroundColor White
    Write-Host "3. Или используйте файл ВСЕ_ДАННЫЕ.csv для импорта всех данных сразу" -ForegroundColor White
    Write-Host ""
    Write-Host "Инструкции: google_sheets_export\README.md" -ForegroundColor Yellow
    Write-Host ""

    # Предлагаем открыть папку
    $openFolder = Read-Host "Открыть папку с экспортом? (Y/N)"
    if ($openFolder -eq 'Y' -or $openFolder -eq 'y') {
        Start-Process explorer "google_sheets_export"
    }
} else {
    Write-Host ""
    Write-Host "[ERROR] Ошибка при экспорте!" -ForegroundColor Red
}

Write-Host ""
Write-Host "Нажмите любую клавишу для выхода..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
