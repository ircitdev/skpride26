#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
Скрипт экспорта данных из form.json в CSV файлы для загрузки в Google Таблицы
Каждая главная категория будет отдельной вкладкой
"""

import json
import csv
import os
from pathlib import Path


def escape_csv(text):
    """Экранирование текста для CSV"""
    if text is None:
        return ""
    text = str(text)
    # Заменяем переводы строк на специальный маркер, который потом восстановим
    text = text.replace('\n', '\\n').replace('\r', '\\r')
    return text


def unescape_csv(text):
    """Восстановление текста из CSV"""
    if not text:
        return ""
    return text.replace('\\n', '\n').replace('\\r', '\r')


def flatten_item(item, level=0, parent_path="", row_id=None):
    """
    Преобразование элемента в плоскую структуру для CSV

    Поля:
    - ID: уникальный идентификатор
    - Родитель: путь к родителю
    - Уровень: глубина вложенности
    - Название (label)
    - Значение (value)
    - Подпись (sub)
    - Иконка (image)
    - Обложка (fimage)
    - Краткое описание (desc)
    - Полное описание (fulldesc)
    - Расписание (timetable)
    - Цена (price)
    """
    current_path = f"{parent_path}/{item['value']}" if parent_path else item['value']

    # Генерируем ID если не задан
    if row_id is None:
        row_id = current_path.replace('/', '_')

    row = {
        'ID': row_id,
        'Родитель': parent_path,
        'Уровень': level,
        'Название': escape_csv(item.get('label', '')),
        'Значение': escape_csv(item.get('value', '')),
        'Подпись': escape_csv(item.get('sub', '')),
        'Иконка': escape_csv(item.get('image', '')),
        'Обложка': escape_csv(item.get('fimage', '')),
        'Краткое описание': escape_csv(item.get('desc', '')),
        'Полное описание': escape_csv(item.get('fulldesc', '')),
        'Расписание': escape_csv(item.get('timetable', '')),
        'Цена': escape_csv(item.get('price', ''))
    }

    rows = [row]

    # Рекурсивно обрабатываем дочерние элементы
    if 'children' in item and item['children']:
        for i, child in enumerate(item['children']):
            child_id = f"{row_id}_{i+1}"
            child_rows = flatten_item(child, level + 1, current_path, child_id)
            rows.extend(child_rows)

    return rows


def export_to_csv(json_file='form.json', output_dir='google_sheets_export'):
    """Экспорт данных в CSV файлы"""

    # Создаем директорию для экспорта
    output_path = Path(output_dir)
    output_path.mkdir(exist_ok=True)

    # Загружаем JSON
    with open(json_file, 'r', encoding='utf-8') as f:
        data = json.load(f)

    # Заголовки для CSV
    headers = [
        'ID', 'Родитель', 'Уровень', 'Название', 'Значение', 'Подпись',
        'Иконка', 'Обложка', 'Краткое описание', 'Полное описание',
        'Расписание', 'Цена'
    ]

    # Создаем общий файл со всеми данными
    all_rows = []

    # Экспортируем каждую главную категорию
    for main_item in data['main']:
        category_name = main_item['value']
        category_label = main_item['label']

        print(f"Экспорт категории: {category_label} ({category_name})")

        # Собираем все строки для этой категории
        rows = flatten_item(main_item)

        # Сохраняем отдельный файл для категории
        csv_file = output_path / f"{category_name}.csv"
        with open(csv_file, 'w', encoding='utf-8-sig', newline='') as f:
            writer = csv.DictWriter(f, fieldnames=headers, delimiter='\t')
            writer.writeheader()
            writer.writerows(rows)

        print(f"  [OK] Сохранено {len(rows)} строк в {csv_file}")

        # Добавляем в общий список
        all_rows.extend(rows)

    # Сохраняем общий файл
    all_csv_file = output_path / "ВСЕ_ДАННЫЕ.csv"
    with open(all_csv_file, 'w', encoding='utf-8-sig', newline='') as f:
        writer = csv.DictWriter(f, fieldnames=headers, delimiter='\t')
        writer.writeheader()
        writer.writerows(all_rows)

    print(f"\n[OK] Общий файл: {all_csv_file} ({len(all_rows)} строк)")

    # Создаем README с инструкциями
    readme_content = f"""# Экспорт данных для Google Таблиц

## Созданные файлы:

1. **ВСЕ_ДАННЫЕ.csv** - все данные в одном файле
2. Отдельные файлы для каждой категории:
"""

    for main_item in data['main']:
        readme_content += f"   - **{main_item['value']}.csv** - {main_item['label']}\n"

    readme_content += """
## Как импортировать в Google Таблицы:

### Вариант 1: Импорт всех данных одним файлом
1. Откройте Google Таблицы
2. Создайте новую таблицу
3. Файл → Импортировать → Загрузить → Выберите ВСЕ_ДАННЫЕ.csv
4. Выберите:
   - Разделитель: Табуляция
   - Кодировка: UTF-8
   - Импортировать в: Новый лист

### Вариант 2: Импорт по категориям (рекомендуется)
1. Откройте Google Таблицы
2. Создайте новую таблицу
3. Для каждого CSV файла:
   - Файл → Импортировать → Загрузить → Выберите файл
   - Выберите "Вставить новые листы"
   - Разделитель: Табуляция
   - Кодировка: UTF-8
4. Переименуйте вкладки в читаемые названия

### Вариант 3: Прямая ссылка (самый простой)
1. Используйте готовый шаблон Google Таблицы (создается автоматически)
2. Скопируйте его себе (Файл → Создать копию)
3. Начните редактирование

## Структура данных:

- **ID** - уникальный идентификатор строки
- **Родитель** - путь к родительскому элементу (пустой для корневых)
- **Уровень** - глубина вложенности (0, 1, 2, 3)
- **Название** - отображаемое название
- **Значение** - уникальное значение (ID в системе)
- **Подпись** - короткая подпись под названием
- **Иконка** - путь к иконке
- **Обложка** - путь к полной картинке
- **Краткое описание** - HTML описание (показывается в карточке)
- **Полное описание** - расширенное HTML описание
- **Расписание** - HTML с расписанием
- **Цена** - HTML с ценами

## Важно:

⚠️ Переводы строк в тексте закодированы как \\n и \\r
⚠️ Не удаляйте колонки ID, Родитель, Уровень, Значение - они нужны для импорта обратно
⚠️ HTML теги можно редактировать прямо в таблице
⚠️ После редактирования используйте скрипт import_from_sheets.py для импорта обратно

## Следующий шаг:

После редактирования в Google Таблицах:
1. Файл → Скачать → CSV (текущий лист) - для каждой вкладки
2. Или используйте Google Sheets API (автоматический импорт)
3. Запустите import_from_sheets.py для обновления form.json
"""

    with open(output_path / 'README.md', 'w', encoding='utf-8') as f:
        f.write(readme_content)

    print(f"\n[OK] Инструкции сохранены в {output_path / 'README.md'}")
    print(f"\n{'='*60}")
    print(f"Экспорт завершен!")
    print(f"Всего категорий: {len(data['main'])}")
    print(f"Всего строк: {len(all_rows)}")
    print(f"Файлы сохранены в: {output_path.absolute()}")
    print(f"{'='*60}")


if __name__ == '__main__':
    export_to_csv()
