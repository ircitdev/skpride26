#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
Скрипт импорта данных из CSV файлов (экспортированных из Google Таблиц) обратно в form.json
"""

import json
import csv
import os
from pathlib import Path
from datetime import datetime


def unescape_csv(text):
    """Восстановление текста из CSV"""
    if not text:
        return ""
    return text.replace('\\n', '\n').replace('\\r', '\r')


def build_tree(rows):
    """
    Построение древовидной структуры из плоских данных

    rows: список словарей с данными из CSV
    возвращает: список элементов верхнего уровня
    """
    # Индекс всех элементов по ID
    items_by_id = {}

    # Сначала создаем все элементы
    for row in rows:
        item_id = row['ID']
        parent_path = row['Родитель']
        level = int(row['Уровень'])

        # Создаем элемент
        item = {
            'label': unescape_csv(row['Название']),
            'value': unescape_csv(row['Значение']),
        }

        # Добавляем опциональные поля только если они не пустые
        if row['Подпись']:
            item['sub'] = unescape_csv(row['Подпись'])
        if row['Иконка']:
            item['image'] = unescape_csv(row['Иконка'])
        if row['Обложка']:
            item['fimage'] = unescape_csv(row['Обложка'])
        if row['Краткое описание']:
            item['desc'] = unescape_csv(row['Краткое описание'])
        if row['Полное описание']:
            item['fulldesc'] = unescape_csv(row['Полное описание'])
        if row['Расписание']:
            item['timetable'] = unescape_csv(row['Расписание'])
        if row['Цена']:
            item['price'] = unescape_csv(row['Цена'])

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
                if parent_path == f"{pdata['parent']}/{pdata['item']['value']}" if pdata['parent'] else parent_path == pdata['item']['value']:
                    pdata['children'].append(data)
                    parent_found = True
                    break

            if not parent_found:
                print(f"[WARNING] Предупреждение: не найден родитель '{parent_path}' для элемента '{item_id}'")

    # Рекурсивно добавляем children к элементам
    def finalize_item(data):
        item = data['item']
        if data['children']:
            item['children'] = [finalize_item(child) for child in data['children']]
        return item

    return [finalize_item(root) for root in root_items]


def import_from_csv(input_dir='google_sheets_export', output_file='form.json'):
    """Импорт данных из CSV файлов обратно в JSON"""

    input_path = Path(input_dir)

    if not input_path.exists():
        print(f"[ERROR] Ошибка: директория {input_path} не существует")
        print(f"   Сначала запустите export_to_sheets.py")
        return

    # Создаем бэкап существующего файла
    if Path(output_file).exists():
        backup_file = f"{output_file}.backup.{datetime.now().strftime('%Y%m%d_%H%M%S')}"
        Path(output_file).rename(backup_file)
        print(f"[OK] Создан бэкап: {backup_file}")

    # Ищем общий файл или собираем из отдельных
    all_data_file = input_path / "ВСЕ_ДАННЫЕ.csv"

    if all_data_file.exists():
        print(f"Импорт из общего файла: {all_data_file}")
        csv_files = [all_data_file]
    else:
        # Ищем все CSV файлы
        csv_files = list(input_path.glob("*.csv"))
        if not csv_files:
            print(f"[ERROR] Ошибка: в {input_path} не найдено CSV файлов")
            return
        print(f"Найдено CSV файлов: {len(csv_files)}")

    # Читаем все строки
    all_rows = []

    for csv_file in csv_files:
        print(f"Чтение: {csv_file.name}")

        try:
            with open(csv_file, 'r', encoding='utf-8-sig', newline='') as f:
                reader = csv.DictReader(f, delimiter='\t')
                rows = list(reader)
                all_rows.extend(rows)
                print(f"  [OK] Прочитано строк: {len(rows)}")
        except Exception as e:
            print(f"  [ERROR] Ошибка чтения {csv_file.name}: {e}")
            continue

    if not all_rows:
        print("[ERROR] Ошибка: нет данных для импорта")
        return

    print(f"\nВсего строк для импорта: {len(all_rows)}")

    # Если читали из нескольких файлов, нужно удалить дубликаты
    if len(csv_files) > 1:
        seen_ids = set()
        unique_rows = []
        for row in all_rows:
            if row['ID'] not in seen_ids:
                seen_ids.add(row['ID'])
                unique_rows.append(row)
        all_rows = unique_rows
        print(f"После удаления дубликатов: {len(all_rows)} строк")

    # Строим дерево
    print("\nПостроение древовидной структуры...")
    tree = build_tree(all_rows)

    # Создаем финальную структуру
    result = {
        'main': tree
    }

    # Сохраняем в JSON
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(result, f, ensure_ascii=False, indent=2)

    print(f"\n{'='*60}")
    print(f"[OK] Импорт завершен!")
    print(f"Файл сохранен: {output_file}")
    print(f"Элементов верхнего уровня: {len(tree)}")
    print(f"Всего элементов: {len(all_rows)}")
    print(f"{'='*60}")

    # Проверка валидности
    print("\nПроверка валидности JSON...")
    try:
        with open(output_file, 'r', encoding='utf-8') as f:
            check_data = json.load(f)
        print("[OK] JSON валиден")
        print(f"[OK] Главных категорий: {len(check_data['main'])}")

        # Выводим названия категорий
        print("\nГлавные категории:")
        for i, item in enumerate(check_data['main'], 1):
            children_count = len(item.get('children', []))
            print(f"  {i}. {item['label']} ({item['value']}) - {children_count} подкатегорий")

    except Exception as e:
        print(f"[ERROR] Ошибка валидации: {e}")


if __name__ == '__main__':
    import sys

    if len(sys.argv) > 1:
        # Если передан аргумент - это директория с CSV
        import_from_csv(sys.argv[1])
    else:
        import_from_csv()
