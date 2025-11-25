#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
Анализ структуры всех вкладок Google Таблицы
Находит дублирование, избыточность и предлагает оптимизацию
"""

import json
import sys
from collections import defaultdict

if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')


def analyze_sheet_structure(sheet_name, data):
    """Анализирует структуру одной вкладки"""

    if not data or len(data) < 1:
        return None

    headers = data[0]
    rows = data[1:] if len(data) > 1 else []

    # Статистика
    stats = {
        'name': sheet_name,
        'columns': len(headers),
        'rows': len(rows),
        'headers': headers,
        'empty_columns': [],
        'duplicate_columns': [],
        'data_types': {},
        'sample_data': rows[:3] if rows else []
    }

    # Проверяем пустые столбцы
    for col_idx, header in enumerate(headers):
        is_empty = True
        for row in rows:
            if col_idx < len(row) and row[col_idx].strip():
                is_empty = False
                break
        if is_empty:
            stats['empty_columns'].append(header)

    # Проверяем дублирующиеся заголовки
    header_counts = defaultdict(int)
    for header in headers:
        header_counts[header] += 1

    for header, count in header_counts.items():
        if count > 1:
            stats['duplicate_columns'].append(header)

    return stats


def categorize_sheets(all_data):
    """Группирует вкладки по типам"""

    categories = {
        'slides': [],
        'sports_categories': [],
        'events': [],
        'promo': [],
        'news': [],
        'other': []
    }

    for sheet_name in all_data.keys():
        if 'СЛАЙД' in sheet_name:
            categories['slides'].append(sheet_name)
        elif 'СОБЫТ' in sheet_name:
            categories['events'].append(sheet_name)
        elif 'АКЦИ' in sheet_name:
            categories['promo'].append(sheet_name)
        elif 'НОВОСТ' in sheet_name:
            categories['news'].append(sheet_name)
        elif any(x in sheet_name for x in ['ТРЕНАЖЕРН', 'ДЕТСК', 'ЕДИНОБОРСТВ', 'ТАНЦ',
                                             'ЖЕНСК', 'ЗИМН', 'МУЖСК', 'ОТДЫХ',
                                             'ОТЕЛЬ', 'РЕСТОРАН', 'ЛЕДОВ', 'ФУТБОЛ']):
            categories['sports_categories'].append(sheet_name)
        else:
            categories['other'].append(sheet_name)

    return categories


def main():
    """Главная функция анализа"""

    print("="*80)
    print("📊 АНАЛИЗ СТРУКТУРЫ GOOGLE ТАБЛИЦ")
    print("="*80)
    print()

    # Читаем данные
    with open('sheet_data.json', 'r', encoding='utf-8') as f:
        all_data = json.load(f)

    print(f"✓ Загружено вкладок: {len(all_data)}")
    print()

    # Группируем по категориям
    categories = categorize_sheets(all_data)

    print("📋 ГРУППИРОВКА ВКЛАДОК:")
    print()
    print(f"🎬 Слайды: {len(categories['slides'])}")
    for sheet in categories['slides']:
        print(f"   - {sheet}")
    print()

    print(f"⚽ Спортивные категории: {len(categories['sports_categories'])}")
    for sheet in categories['sports_categories']:
        rows = len(all_data[sheet]) - 1
        print(f"   - {sheet} ({rows} строк)")
    print()

    print(f"📅 События: {len(categories['events'])}")
    for sheet in categories['events']:
        rows = len(all_data[sheet]) - 1
        print(f"   - {sheet} ({rows} строк)")
    print()

    print(f"🎁 Акции: {len(categories['promo'])}")
    for sheet in categories['promo']:
        rows = len(all_data[sheet]) - 1
        print(f"   - {sheet} ({rows} строк)")
    print()

    print(f"📰 Новости: {len(categories['news'])}")
    for sheet in categories['news']:
        rows = len(all_data[sheet]) - 1
        print(f"   - {sheet} ({rows} строк)")
    print()

    # Анализируем каждую вкладку
    print("="*80)
    print("🔍 ДЕТАЛЬНЫЙ АНАЛИЗ")
    print("="*80)
    print()

    all_stats = []

    for sheet_name, data in all_data.items():
        stats = analyze_sheet_structure(sheet_name, data)
        if stats:
            all_stats.append(stats)

    # Анализируем спортивные категории
    print("⚽ СПОРТИВНЫЕ КАТЕГОРИИ:")
    print()

    sports_sheets = [s for s in all_stats if s['name'] in categories['sports_categories']]

    if sports_sheets:
        # Проверяем единообразие структуры
        first_headers = sports_sheets[0]['headers']
        all_same = all(s['headers'] == first_headers for s in sports_sheets)

        if all_same:
            print("✓ Все спортивные категории имеют ОДИНАКОВУЮ структуру:")
            print(f"  Столбцы ({len(first_headers)}): {', '.join(first_headers)}")
        else:
            print("⚠️  Спортивные категории имеют РАЗНУЮ структуру:")
            for stats in sports_sheets:
                if stats['headers'] != first_headers:
                    print(f"  - {stats['name']}: {len(stats['headers'])} столбцов")
        print()

        # Статистика по данным
        print("📊 Статистика данных:")
        total_rows = sum(s['rows'] for s in sports_sheets)
        print(f"  Всего категорий: {len(sports_sheets)}")
        print(f"  Всего строк данных: {total_rows}")
        print()

        print("  Распределение по категориям:")
        for stats in sorted(sports_sheets, key=lambda x: x['rows'], reverse=True):
            print(f"    {stats['name']:40s} - {stats['rows']:3d} строк")
        print()

    # Анализируем другие вкладки
    print("="*80)
    print("📋 АНАЛИЗ ДРУГИХ ВКЛАДОК:")
    print("="*80)
    print()

    for category_name, sheet_names in categories.items():
        if category_name == 'sports_categories':
            continue

        if not sheet_names:
            continue

        print(f"\n{category_name.upper()}:")
        for sheet_name in sheet_names:
            stats = next((s for s in all_stats if s['name'] == sheet_name), None)
            if stats:
                print(f"\n  📄 {sheet_name}")
                print(f"     Столбцы: {len(stats['headers'])}")
                print(f"     Строки: {stats['rows']}")
                print(f"     Заголовки: {', '.join(stats['headers'])}")

                if stats['empty_columns']:
                    print(f"     ⚠️  Пустые столбцы: {', '.join(stats['empty_columns'])}")

                if stats['sample_data']:
                    print(f"     Пример данных:")
                    for i, row in enumerate(stats['sample_data'][:1], 1):
                        preview = [str(cell)[:30] for cell in row[:3]]
                        print(f"       {i}. {' | '.join(preview)}...")

    print()
    print("="*80)
    print("✅ АНАЛИЗ ЗАВЕРШЕН")
    print("="*80)

    # Сохраняем результаты
    with open('table_analysis.json', 'w', encoding='utf-8') as f:
        json.dump({
            'categories': categories,
            'stats': all_stats
        }, f, ensure_ascii=False, indent=2)

    print()
    print("💾 Детальный анализ сохранен в: table_analysis.json")


if __name__ == '__main__':
    main()
