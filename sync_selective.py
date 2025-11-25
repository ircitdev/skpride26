#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
Скрипт выборочной синхронизации данных из Google Таблиц
Позволяет обновлять отдельные вкладки
"""

import gspread
from google.oauth2.service_account import Credentials
import json
import sys
from datetime import datetime
from pathlib import Path


# Конфигурация
SPREADSHEET_ID = '1a4ZhAM2GNCxZzKbVgIMkTV4BT2mpmcheA9ejB8t5Sgk'
CREDENTIALS_FILE = 'pride34-d166327454d1.json'
OUTPUT_FILE = 'form.json'

# Настройка кодировки для консоли Windows
if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')


# Определение типов вкладок
SHEET_TYPES = {
    '00_НАСТРОЙКИ': 'settings',
    '01_СЛАЙДЫ.csv': 'slides',
    '02_ТРЕНАЖЕРНЫЙ_ЗАЛ': 'category',
    '03_ДЕТСКИЕ_СЕКЦИИ': 'category',
    '04_ЕДИНОБОРСТВА': 'category',
    '05_ТАНЦЫ': 'category',
    '06_ЖЕНСКИЕ_СЕКЦИИ': 'category',
    '07_ЗИМНИЕ_СЕКЦИИ': 'category',
    '08_МУЖСКИЕ_СЕКЦИИ': 'category',
    '09_ОТДЫХ_И_СПА': 'category',
    '10_ОТЕЛЬ': 'category',
    '11_РЕСТОРАН': 'category',
    '12_ЛЕДОВАЯ_АРЕНА': 'category',
    '13_ФУТБОЛЬНОЕ_ПОЛЕ13_ФУТБОЛЬНОЕ_ПОЛЕ': 'category',
    '14_СОБЫТИЯ': 'events',
    '15_АКЦИИ': 'promo',
    '16_НОВОСТИ': 'news',
    '17_ОРГАНИЗАЦИЯ_ПРАЗДНИКОВ': 'category',
    '17_ОРГАНИЗАЦИЯ_ПРАЗДНИКОВ.csv': 'category'
}


def connect_to_sheets():
    """Подключение к Google Sheets API"""
    scopes = [
        'https://www.googleapis.com/auth/spreadsheets.readonly',
        'https://www.googleapis.com/auth/drive.readonly'
    ]

    credentials = Credentials.from_service_account_file(CREDENTIALS_FILE, scopes=scopes)
    client = gspread.authorize(credentials)
    spreadsheet = client.open_by_key(SPREADSHEET_ID)
    return spreadsheet


def list_sheets(spreadsheet):
    """Показать список всех вкладок"""
    worksheets = spreadsheet.worksheets()

    print("\n" + "="*70)
    print("ДОСТУПНЫЕ ВКЛАДКИ ДЛЯ ОБНОВЛЕНИЯ")
    print("="*70)
    print()

    for i, ws in enumerate(worksheets, 1):
        sheet_type = SHEET_TYPES.get(ws.title, 'unknown')
        type_emoji = {
            'settings': '⚙️',
            'slides': '🎬',
            'category': '📁',
            'events': '📅',
            'promo': '🎁',
            'news': '📰',
            'unknown': '❓'
        }

        emoji = type_emoji.get(sheet_type, '❓')
        print(f"  {i:2}. {emoji} {ws.title}")

    print()
    print("  0. 🔄 Обновить ВСЕ категории (02-13)")
    print("  99. ❌ Отмена")
    print()
    print("="*70)

    return worksheets


def build_tree(rows):
    """Построение древовидной структуры из плоских данных"""
    if not rows or len(rows) < 2:
        return []

    headers = rows[0]
    items_by_id = {}

    for row_data in rows[1:]:
        row = {}
        for i, header in enumerate(headers):
            row[header] = row_data[i] if i < len(row_data) else ""

        if not row.get('ID'):
            continue

        item_id = row['ID']
        parent_path = row.get('Родитель', '')
        level = int(row.get('Уровень', 0))

        item = {
            'label': row.get('Название', ''),
            'value': row.get('Значение', ''),
        }

        if row.get('Подпись'):
            item['sub'] = row['Подпись']
        if row.get('Иконка'):
            item['image'] = row['Иконка']
        if row.get('Обложка'):
            item['fimage'] = row['Обложка']
        if row.get('Краткое описание'):
            item['desc'] = row['Краткое описание']
        if row.get('Полное описание'):
            item['fulldesc'] = row['Полное описание']
        if row.get('Расписание'):
            item['timetable'] = row['Расписание']
        if row.get('Цена'):
            item['price'] = row['Цена']

        items_by_id[item_id] = {
            'item': item,
            'parent': parent_path,
            'level': level,
            'children': []
        }

    root_items = []

    for item_id, data in items_by_id.items():
        parent_path = data['parent']

        if not parent_path:
            root_items.append(data)
        else:
            parent_found = False
            for pid, pdata in items_by_id.items():
                parent_value = pdata['item']['value']
                if parent_path == parent_value or parent_path.endswith(f"/{parent_value}"):
                    pdata['children'].append(data)
                    parent_found = True
                    break

            if not parent_found:
                print(f"⚠️  Предупреждение: не найден родитель '{parent_path}' для '{item_id}'")

    def finalize_item(data):
        item = data['item']
        if data['children']:
            item['children'] = [finalize_item(child) for child in data['children']]
        return item

    return [finalize_item(root) for root in root_items]


def update_slides(worksheet):
    """Обновление слайдов (01_СЛАЙДЫ.csv)"""
    print("\n🎬 Обновление слайдов...")

    data = worksheet.get_all_values()

    if not data or len(data) < 2:
        print("❌ Нет данных для обновления")
        return False

    # Сохраняем в отдельный файл slides.json
    slides_data = []
    headers = data[0]

    for row_data in data[1:]:
        slide = {}
        for i, header in enumerate(headers):
            slide[header] = row_data[i] if i < len(row_data) else ""

        # Фильтрация по колонке "Активен" (показываем только TRUE или если колонки нет)
        active_value = slide.get('Активен', 'TRUE').strip().upper()
        if active_value == 'FALSE':
            print(f"  ⏭️  Слайд {slide.get('Номер', '?')} пропущен (Активен=FALSE)")
            continue

        slides_data.append(slide)

    # Сохраняем исходные данные
    slides_file = 'slides.json'
    with open(slides_file, 'w', encoding='utf-8') as f:
        json.dump(slides_data, f, ensure_ascii=False, indent=2)

    print(f"✓ Слайдов обновлено: {len(slides_data)}")
    print(f"✓ Исходные данные сохранены в: {slides_file}")

    # Проверяем, есть ли готовый HTML в таблице
    has_html_column = any(slide.get('HTML') for slide in slides_data)

    if has_html_column:
        # Используем готовый HTML из таблицы, добавляя idname атрибут
        print("\n🔨 Обработка готового HTML из таблицы...")
        import re

        html_slides = []
        for i, slide in enumerate(slides_data):
            html = slide.get('HTML', '')
            idname = slide.get('idname', '').strip()

            if html and idname:
                # Добавляем id и data-slide-id к первому <figure>
                # Заменяем <figure class="slide... на <figure id="slide_idname" data-slide-id="idname" class="slide...
                html = re.sub(
                    r'<figure(\s+class=")',
                    f'<figure id="slide_{idname}" data-slide-id="{idname}"\\1',
                    html,
                    count=1
                )

            html_slides.append(html)

        print(f"✓ Обработано слайдов с HTML: {len(html_slides)}")

    else:
        # Генерируем HTML через slides_generator
        print("\n🔨 Генерация HTML кода...")
        try:
            from slides_generator import generate_slides_from_data
            html_slides = generate_slides_from_data(slides_data)
            print(f"✓ HTML сгенерирован для {len(html_slides)} слайдов")
        except Exception as e:
            print(f"⚠️  Ошибка генерации HTML: {e}")
            print("   Исходные данные сохранены в slides.json")
            return True

    # Сохраняем HTML версию
    html_output = {
        'slides': []
    }

    for i, (slide_data, html) in enumerate(zip(slides_data, html_slides), 1):
        html_output['slides'].append({
            'number': slide_data.get('Номер', i),
            'idname': slide_data.get('idname', ''),
            'title': slide_data.get('Название', ''),
            'image': slide_data.get('Картинка', ''),
            'buttons': slide_data.get('Кнопки', ''),
            'html': html
        })

    # Сохраняем JSON с HTML
    html_json_file = 'slides_html.json'
    with open(html_json_file, 'w', encoding='utf-8') as f:
        json.dump(html_output, f, ensure_ascii=False, indent=2)

    # Сохраняем чистый HTML для вставки
    html_text = '\n\n'.join(html_slides)
    html_file = 'slides_output.html'
    with open(html_file, 'w', encoding='utf-8') as f:
        f.write(html_text)

    print(f"✓ HTML+JSON сохранен в: {html_json_file}")
    print(f"✓ Чистый HTML сохранен в: {html_file}")

    return True


def update_settings(worksheet):
    """Обновление настроек сайта (00_НАСТРОЙКИ)"""
    print("\n⚙️ Обновление настроек...")

    data = worksheet.get_all_values()

    if not data or len(data) < 2:
        print("❌ Нет данных для обновления")
        return False

    headers = data[0]
    settings = {}

    for row_data in data[1:]:
        row = {}
        for i, header in enumerate(headers):
            row[header] = row_data[i] if i < len(row_data) else ""

        key = row.get('Ключ', '').strip()
        value = row.get('Значение', '').strip()

        if key:
            settings[key] = value

    # Сохраняем настройки
    settings_file = 'settings.json'
    with open(settings_file, 'w', encoding='utf-8') as f:
        json.dump(settings, f, ensure_ascii=False, indent=2)

    print(f"✓ Настроек сохранено: {len(settings)}")
    print(f"✓ Файл: {settings_file}")

    return True


def update_events(worksheet, current_data):
    """Обновление событий (14_СОБЫТИЯ) с фильтрацией по дате и активности"""
    print(f"\n📅 Обновление событий: {worksheet.title}...")

    data = worksheet.get_all_values()

    if not data or len(data) < 2:
        print("❌ Нет данных для обновления")
        return current_data

    headers = data[0]
    today = datetime.now().date()

    # Фильтруем строки
    filtered_rows = [headers]  # Начинаем с заголовков
    skipped_inactive = 0
    skipped_expired = 0

    for row_data in data[1:]:
        row = {}
        for i, header in enumerate(headers):
            row[header] = row_data[i] if i < len(row_data) else ""

        # Проверка колонки "Активен"
        active_value = row.get('Активен', 'TRUE').strip().upper()
        if active_value == 'FALSE':
            skipped_inactive += 1
            print(f"  ⏭️  {row.get('Название', '?')} пропущено (Активен=FALSE)")
            continue

        # Проверка колонки "Показывать ДО"
        show_until = row.get('Показывать ДО', '').strip()
        if show_until:
            try:
                # Парсим дату в формате ДД.ММ.ГГГГ или ГГГГ-ММ-ДД
                if '.' in show_until:
                    parts = show_until.split('.')
                    until_date = datetime(int(parts[2]), int(parts[1]), int(parts[0])).date()
                elif '-' in show_until:
                    parts = show_until.split('-')
                    until_date = datetime(int(parts[0]), int(parts[1]), int(parts[2])).date()
                else:
                    until_date = None

                if until_date and today > until_date:
                    skipped_expired += 1
                    print(f"  ⏭️  {row.get('Название', '?')} пропущено (истекло {show_until})")
                    continue
            except (ValueError, IndexError):
                print(f"  ⚠️  Не удалось распознать дату '{show_until}' для {row.get('Название', '?')}")

        filtered_rows.append(row_data)

    print(f"  📊 Пропущено: {skipped_inactive} неактивных, {skipped_expired} истекших")

    # Строим дерево из отфильтрованных данных
    tree = build_tree(filtered_rows)

    if not tree:
        print("❌ Не удалось построить дерево событий")
        return current_data

    # Находим и заменяем events в текущих данных
    new_main = []
    events_found = False

    for item in current_data.get('main', []):
        if item.get('value') == 'events':
            if tree:
                new_main.append(tree[0])
                events_found = True
                print(f"✓ События обновлены: {len(tree[0].get('children', []))} активных")
        else:
            new_main.append(item)

    if not events_found and tree:
        new_main.append(tree[0])
        print(f"✓ Добавлены события: {len(tree[0].get('children', []))} шт.")

    return {'main': new_main}


def update_single_category(worksheet, current_data):
    """Обновление одной категории с сохранением остальных"""
    print(f"\n📁 Обновление категории: {worksheet.title}...")

    data = worksheet.get_all_values()

    if not data or len(data) < 2:
        print("❌ Нет данных для обновления")
        return current_data

    # Получаем ID первого элемента этой категории
    headers = data[0]
    first_row = data[1] if len(data) > 1 else None

    if not first_row:
        print("❌ Нет данных в листе")
        return current_data

    # Создаем словарь из первой строки
    row_dict = {}
    for i, header in enumerate(headers):
        row_dict[header] = first_row[i] if i < len(first_row) else ""

    category_value = row_dict.get('Значение', '')

    if not category_value:
        print("❌ Не найдено значение категории")
        return current_data

    print(f"📌 ID категории: {category_value}")

    # Строим дерево для новых данных
    new_tree = build_tree(data)

    if not new_tree:
        print("❌ Не удалось построить дерево")
        return current_data

    # Находим и заменяем категорию в текущих данных
    new_main = []
    category_found = False

    for item in current_data.get('main', []):
        if item.get('value') == category_value:
            # Заменяем на новую версию
            new_main.append(new_tree[0])
            category_found = True
            print(f"✓ Категория '{item.get('label')}' обновлена")
        else:
            # Оставляем старую
            new_main.append(item)

    if not category_found:
        # Категория не найдена, добавляем новую
        new_main.append(new_tree[0])
        print(f"✓ Добавлена новая категория")

    return {'main': new_main}


def update_all_categories(spreadsheet, current_data):
    """Обновление всех категорий (02-13)"""
    print("\n🔄 Обновление ВСЕХ категорий...")

    worksheets = spreadsheet.worksheets()
    all_rows = []
    updated_count = 0

    for worksheet in worksheets:
        sheet_type = SHEET_TYPES.get(worksheet.title, 'unknown')

        if sheet_type != 'category':
            continue

        print(f"📄 Обработка: {worksheet.title}")

        try:
            data = worksheet.get_all_values()

            if data and len(data) > 1:
                if not all_rows:
                    all_rows.extend(data)
                else:
                    all_rows.extend(data[1:])

                updated_count += 1
                print(f"  ✓ Добавлено строк: {len(data) - 1}")
        except Exception as e:
            print(f"  ❌ Ошибка: {e}")
            continue

    if not all_rows:
        print("❌ Нет данных для обновления")
        return current_data

    # Строим дерево
    tree = build_tree(all_rows)

    print(f"\n✓ Обновлено категорий: {updated_count}")
    print(f"✓ Всего элементов: {len(all_rows) - 1}")

    return {'main': tree}


def sync_selective(choice=None):
    """Выборочная синхронизация"""
    try:
        # Подключаемся к Google Sheets
        print("🔌 Подключение к Google Sheets...")
        spreadsheet = connect_to_sheets()
        print("✓ Подключение установлено")

        # Получаем список вкладок
        worksheets = spreadsheet.worksheets()

        # Если выбор не указан, показываем меню
        if choice is None:
            list_sheets(spreadsheet)
            choice = input("\nВведите номер вкладки для обновления: ").strip()

        # Обработка выбора
        if choice == '99':
            print("\n❌ Отменено")
            return False

        # Загружаем текущие данные ПЕРЕД созданием бэкапа
        current_data = {}
        if Path(OUTPUT_FILE).exists():
            with open(OUTPUT_FILE, 'r', encoding='utf-8') as f:
                current_data = json.load(f)
            print(f"📄 Загружены текущие данные: {len(current_data.get('main', []))} категорий")

        # Создаем бэкап
        if Path(OUTPUT_FILE).exists():
            backup_file = f"{OUTPUT_FILE}.backup.{datetime.now().strftime('%Y%m%d_%H%M%S')}"
            import shutil
            shutil.copy2(OUTPUT_FILE, backup_file)
            print(f"💾 Создан бэкап: {backup_file}")

        # Выполняем обновление
        if choice == '0':
            # Обновить все категории
            result = update_all_categories(spreadsheet, current_data)
        else:
            # Обновить конкретную вкладку
            try:
                index = int(choice) - 1
                if index < 0 or index >= len(worksheets):
                    print("\n❌ Неверный номер вкладки")
                    return False

                worksheet = worksheets[index]
                sheet_type = SHEET_TYPES.get(worksheet.title, 'unknown')

                if sheet_type == 'settings':
                    # Обновление настроек
                    return update_settings(worksheet)
                elif sheet_type == 'slides':
                    # Обновление слайдов
                    return update_slides(worksheet)
                elif sheet_type == 'category':
                    # Обновление одной категории
                    result = update_single_category(worksheet, current_data)
                elif sheet_type == 'events':
                    # Обновление событий с фильтрацией по дате
                    result = update_events(worksheet, current_data)
                else:
                    print(f"\n⚠️  Обновление вкладки типа '{sheet_type}' пока не реализовано")
                    print("Используйте полную синхронизацию")
                    return False

            except ValueError:
                print("\n❌ Введите число")
                return False

        # Сохраняем результат
        with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
            json.dump(result, f, ensure_ascii=False, indent=2)

        print("\n" + "="*70)
        print("✓ ОБНОВЛЕНИЕ ЗАВЕРШЕНО УСПЕШНО!")
        print(f"📁 Файл сохранен: {OUTPUT_FILE}")
        print(f"⏰ Время: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        print("="*70)

        return True

    except Exception as e:
        print(f"\n❌ Критическая ошибка: {e}")
        import traceback
        traceback.print_exc()
        return False


if __name__ == '__main__':
    print("="*70)
    print("🎯 ВЫБОРОЧНОЕ ОБНОВЛЕНИЕ ДАННЫХ ИЗ GOOGLE SHEETS")
    print("="*70)

    # Проверяем аргументы командной строки
    choice = sys.argv[1] if len(sys.argv) > 1 else None

    success = sync_selective(choice)

    if success:
        print("\n✓ Готово!")
        sys.exit(0)
    else:
        print("\n❌ Обновление завершилось с ошибками")
        sys.exit(1)
