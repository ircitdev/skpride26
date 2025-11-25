#!/usr/bin/env pwsh
# Скрипт для обновления расписания единоборств из pride34.ru

param(
    [string]$Url = "https://pride34.ru/timetable/#fights",
    [string]$OutputFile = "schedule-fight.html"
)

Write-Host "🔄 Загрузка расписания с $Url..." -ForegroundColor Cyan

try {
    # Загружаем HTML страницу
    $response = Invoke-WebRequest -Uri $Url -UseBasicParsing -ErrorAction Stop
    $html = $response.Content

    # Извлекаем таблицу расписания единоборств
    if ($html -match '<table class="timetable">(.*?)</table>') {
        $tableContent = $Matches[1]

        Write-Host "✅ Таблица найдена, обрабатываем..." -ForegroundColor Green

        # Маппинг названий секций на data-class атрибуты
        $classMapping = @{
            'Самбо' = 'sambo'
            'Джиу-джитсу' = 'jiu-jitsu'
            'Кикбоксинг' = 'kickboxing'
            'Тхэквондо' = 'taekwondo'
            'ММА' = 'mma'
            'Смешанное единоборство ММА' = 'mma'
            'Греко-римская борьба' = 'greco'
            'Рукопашный бой' = 'rukopash'
            'Борьба дзюдо' = 'judo'
            'Бокс' = 'boxing'
            'Панкратион' = 'pankration'
        }

        # Заменяем ссылки на data-class атрибуты
        foreach ($className in $classMapping.Keys) {
            $dataClass = $classMapping[$className]
            # Заменяем href на data-class и добавляем класс class-link
            $tableContent = $tableContent -replace "<a\s+(?:style=""[^""]*""\s+)?href=""[^""]*""\s+title=""$className"">", "<a href=`"#`" data-class=`"$dataClass`" class=`"class-link`">"
            $tableContent = $tableContent -replace "<a\s+href=""[^""]*""\s+(?:style=""[^""]*""\s+)?title=""$className"">", "<a href=`"#`" data-class=`"$dataClass`" class=`"class-link`">"
        }

        # Заменяем классы для стилей
        $tableContent = $tableContent -replace 'class="class-trainers"', 'class="trainer"'
        $tableContent = $tableContent -replace 'class="before-hour-text"', 'class="age"'
        $tableContent = $tableContent -replace 'class="after-hour-text"', 'class="age"'
        $tableContent = $tableContent -replace '<div class="hours">', '<div class="hours">'

        # Заменяем row_N классы на более простые
        $tableContent = $tableContent -replace 'class="row_\d+\s+row-gray"', 'class="row-gray"'
        $tableContent = $tableContent -replace 'class="row_\d+"', ''

        # Добавляем класс time-cell для первой колонки с временем
        $tableContent = $tableContent -replace '<td>\s*([\d:]+\s*-\s*[\d:]+)\s*</td>', '<td class="time-cell">$1</td>'

        # Заменяем длинные названия дней на короткие
        $tableContent = $tableContent -replace '<th>Понедельник</th>', '<th>Пн</th>'
        $tableContent = $tableContent -replace '<th>Вторник</th>', '<th>Вт</th>'
        $tableContent = $tableContent -replace '<th>Среда</th>', '<th>Ср</th>'
        $tableContent = $tableContent -replace '<th>Четверг</th>', '<th>Чт</th>'
        $tableContent = $tableContent -replace '<th>Пятница</th>', '<th>Пт</th>'
        $tableContent = $tableContent -replace '<th>Суббота</th>', '<th>Сб</th>'
        $tableContent = $tableContent -replace '<th>Воскресенье</th>', '<th>Вс</th>'

        # Первая колонка - "Время"
        $tableContent = $tableContent -replace '<th></th>', '<th>Время</th>'

        # Заменяем <br> на разделители
        $tableContent = $tableContent -replace '<br>', '<hr>'

        # Формируем финальный HTML
        $finalHtml = @"
<div class="schedule-header">
	<h2>Расписание единоборств</h2>
	<button class="schedule-close" id="closeSchedule">×</button>
</div>

<div class="schedule-content">
	<table class="timetable">
$tableContent
	</table>
</div>
"@

        # Сохраняем в файл
        $outputPath = Join-Path $PSScriptRoot $OutputFile
        $finalHtml | Out-File -FilePath $outputPath -Encoding UTF8 -Force

        Write-Host "✅ Расписание успешно обновлено: $outputPath" -ForegroundColor Green
        Write-Host "📊 Размер файла: $([Math]::Round((Get-Item $outputPath).Length / 1KB, 2)) KB" -ForegroundColor Cyan

    } else {
        Write-Host "❌ Не удалось найти таблицу расписания на странице" -ForegroundColor Red
        exit 1
    }

} catch {
    Write-Host "❌ Ошибка при загрузке расписания: $_" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    exit 1
}

Write-Host "`n✨ Готово! Обновите страницу в браузере для просмотра изменений." -ForegroundColor Green
