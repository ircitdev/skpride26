#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
Скрипт автоматической синхронизации данных из Google Таблиц в form.json
Используется для обновления контента сайта через Google Sheets
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


def connect_to_sheets():
    """Подключение к Google Sheets API"""
    print("🔌 Подключение к Google Sheets...")

    scopes = [
        'https://www.googleapis.com/auth/spreadsheets.readonly',
        'https://www.googleapis.com/auth/drive.readonly'
    ]

    credentials = Credentials.from_service_account_file(CREDENTIALS_FILE, scopes=scopes)
    client = gspread.authorize(credentials)
    spreadsheet = client.open_by_key(SPREADSHEET_ID)

    print("✓ Подключение установлено")
    return spreadsheet


def build_tree(rows):
    """
    Построение древовидной структуры из плоских данных

    rows: список списков с данными из Google Sheets
    возвращает: список элементов верхнего уровня
    """
    if not rows or len(rows) < 2:
        return []

    # Первая строка - заголовки
    headers = rows[0]

    # Индекс всех элементов по ID
    items_by_id = {}

    # Обрабатываем все строки (пропускаем заголовок)
    for row_data in rows[1:]:
        # Создаем словарь из строки
        row = {}
        for i, header in enumerate(headers):
            row[header] = row_data[i] if i < len(row_data) else ""

        if not row.get('ID'):
            continue

        item_id = row['ID']
        parent_path = row.get('Родитель', '')
        level = int(row.get('Уровень', 0))

        # Создаем элемент
        item = {
            'label': row.get('Название', ''),
            'value': row.get('Значение', ''),
        }

        # Добавляем опциональные поля только если они не пустые
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

        # Сохраняем в индекс
        items_by_id[item_id] = {
            'item': item,
            'parent': parent_path,
            'level': level,
            'children': []
        }

    # Теперь строим дерево
    root_items = []

    for item_id, data in items_by_id.items():
        parent_path = data['parent']

        if not parent_path:
            # Это элемент верхнего уровня
            root_items.append(data)
        else:
            # Ищем родителя
            parent_found = False
            for pid, pdata in items_by_id.items():
                # Проверяем, является ли этот элемент родителем
                parent_value = pdata['item']['value']
                if parent_path == parent_value or parent_path.endswith(f"/{parent_value}"):
                    pdata['children'].append(data)
                    parent_found = True
                    break

            if not parent_found:
                print(f"⚠️  Предупреждение: не найден родитель '{parent_path}' для элемента '{item_id}'")

    # Рекурсивно добавляем children к элементам
    def finalize_item(data):
        item = data['item']
        if data['children']:
            item['children'] = [finalize_item(child) for child in data['children']]
        return item

    return [finalize_item(root) for root in root_items]


def sync_data():
    """Основная функция синхронизации"""
    try:
        # Подключаемся к Google Sheets
        spreadsheet = connect_to_sheets()

        # Получаем все листы
        worksheets = spreadsheet.worksheets()
        print(f"\n📊 Найдено листов: {len(worksheets)}")

        # Создаем бэкап существующего файла
        if Path(OUTPUT_FILE).exists():
            backup_file = f"{OUTPUT_FILE}.backup.{datetime.now().strftime('%Y%m%d_%H%M%S')}"
            Path(OUTPUT_FILE).rename(backup_file)
            print(f"💾 Создан бэкап: {backup_file}")

        # Собираем данные из листов с категориями (02-13)
        all_rows = []
        category_sheets = []

        for worksheet in worksheets:
            sheet_name = worksheet.title

            # Пропускаем слайды, события, акции и новости
            if any(skip in sheet_name for skip in ['СЛАЙДЫ', 'СОБЫТИЯ', 'АКЦИИ', 'НОВОСТИ']):
                continue

            print(f"📄 Обработка листа: {sheet_name}")

            try:
                data = worksheet.get_all_values()

                if data and len(data) > 1:
                    # Добавляем строки (пропуская заголовок у всех кроме первого)
                    if not all_rows:
                        all_rows.extend(data)  # Первый лист - с заголовком
                    else:
                        all_rows.extend(data[1:])  # Остальные - без заголовка

                    category_sheets.append(sheet_name)
                    print(f"  ✓ Добавлено строк: {len(data) - 1}")
                else:
                    print(f"  ⊘ Лист пуст")

            except Exception as e:
                print(f"  ✗ Ошибка чтения листа: {e}")
                continue

        if not all_rows:
            print("\n✗ Ошибка: нет данных для импорта")
            return False

        print(f"\n🔨 Всего строк для обработки: {len(all_rows) - 1}")
        print(f"📁 Обработано листов: {len(category_sheets)}")

        # Строим дерево
        print("\n🌳 Построение древовидной структуры...")
        tree = build_tree(all_rows)

        # Создаем финальную структуру
        result = {
            'main': tree
        }

        # Сохраняем в JSON
        with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
            json.dump(result, f, ensure_ascii=False, indent=2)

        print(f"\n{'='*60}")
        print(f"✓ Синхронизация завершена успешно!")
        print(f"📁 Файл сохранен: {OUTPUT_FILE}")
        print(f"📊 Элементов верхнего уровня: {len(tree)}")
        print(f"📝 Всего элементов: {len(all_rows) - 1}")
        print(f"⏰ Время: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        print(f"{'='*60}")

        # Проверка валидности
        print("\n🔍 Проверка валидности JSON...")
        try:
            with open(OUTPUT_FILE, 'r', encoding='utf-8') as f:
                check_data = json.load(f)
            print("✓ JSON валиден")
            print(f"✓ Главных категорий: {len(check_data['main'])}")

            # Выводим названия категорий
            print("\n📋 Главные категории:")
            for i, item in enumerate(check_data['main'], 1):
                children_count = len(item.get('children', []))
                print(f"  {i}. {item['label']} ({item['value']}) - {children_count} подкатегорий")

            return True

        except Exception as e:
            print(f"✗ Ошибка валидации: {e}")
            return False

    except Exception as e:
        print(f"\n✗ Критическая ошибка: {e}")
        import traceback
        traceback.print_exc()
        return False


if __name__ == '__main__':
    print("="*60)
    print("🔄 СИНХРОНИЗАЦИЯ ДАННЫХ ИЗ GOOGLE SHEETS")
    print("="*60)
    print()

    success = sync_data()

    if success:
        print("\n✓ Данные успешно обновлены!")
        print("Теперь сайт использует актуальную информацию из Google Таблиц.")
        sys.exit(0)
    else:
        print("\n✗ Синхронизация завершилась с ошибками")
        sys.exit(1)
