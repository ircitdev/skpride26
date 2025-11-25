# Автоматическое обновление расписания

Скрипты для автоматического обновления расписания единоборств из сайта pride34.ru.

## Использование

### PowerShell (Windows)

```powershell
# Запуск скрипта
.\update-schedule.ps1

# Или с параметрами
.\update-schedule.ps1 -Url "https://pride34.ru/timetable/#fights" -OutputFile "schedule-fight.html"
```

### Python (Кросс-платформенный)

```bash
# Установка зависимостей (первый раз)
pip install requests

# Запуск скрипта
python update-schedule.py
```

## Что делает скрипт

1. Загружает актуальное расписание с https://pride34.ru/timetable/#fights
2. Извлекает таблицу расписания единоборств
3. Преобразует ссылки в интерактивные элементы с `data-class` атрибутами
4. Адаптирует стили под дизайн проекта
5. Сохраняет результат в `schedule-fight.html`

## Маппинг секций

Скрипт автоматически преобразует названия секций в data-class атрибуты:

- **Самбо** → `sambo`
- **Джиу-джитсу** → `jiu-jitsu`
- **Кикбоксинг** → `kickboxing`
- **Тхэквондо** → `taekwondo`
- **ММА** / **Смешанное единоборство ММА** → `mma`
- **Греко-римская борьба** → `greco`
- **Рукопашный бой** → `rukopash`
- **Борьба дзюдо** → `judo`
- **Бокс** → `boxing`
- **Панкратион** → `pankration`

## Автоматизация

### Windows Task Scheduler

1. Откройте "Планировщик заданий"
2. Создайте новое задание
3. Триггер: Ежедневно в 6:00
4. Действие: Запуск программы
   - Программа: `powershell.exe`
   - Аргументы: `-File "K:\scripts\pride\slide6\update-schedule.ps1"`

### Cron (Linux/macOS)

```bash
# Редактировать crontab
crontab -e

# Добавить строку (обновление каждый день в 6:00)
0 6 * * * cd /path/to/slide6 && python3 update-schedule.py
```

### GitHub Actions (если проект в репозитории)

Создайте `.github/workflows/update-schedule.yml`:

```yaml
name: Update Schedule

on:
  schedule:
    - cron: '0 6 * * *'  # Каждый день в 6:00 UTC
  workflow_dispatch:  # Ручной запуск

jobs:
  update:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-python@v4
        with:
          python-version: '3.x'
      - run: pip install requests
      - run: python update-schedule.py
      - uses: stefanzweifel/git-auto-commit-action@v4
        with:
          commit_message: 'Auto-update schedule'
          file_pattern: 'schedule-fight.html'
```

## Требования

### PowerShell
- PowerShell 5.1+ (встроен в Windows 10/11)
- Или PowerShell Core 7+ (кросс-платформенный)

### Python
- Python 3.6+
- Модуль `requests`: `pip install requests`

## Устранение неполадок

### PowerShell: "Не удается запустить скрипт"

Разрешите выполнение скриптов:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Python: "ModuleNotFoundError: No module named 'requests'"

Установите зависимости:
```bash
pip install requests
```

### "Не удалось найти таблицу расписания"

Проверьте, что сайт доступен и структура HTML не изменилась.

## Примечания

- Скрипт сохраняет только таблицу с расписанием, заголовок и стили остаются неизменными
- При изменении структуры сайта может потребоваться обновление регулярных выражений
- Рекомендуется запускать скрипт ночью, когда расписание обновляется на сайте
