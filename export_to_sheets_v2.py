#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
Скрипт экспорта данных из form.json в CSV файлы для загрузки в Google Таблицы v2.0
Версия с разделением по логическим вкладкам
"""

import json
import csv
import os
import re
from pathlib import Path
from bs4 import BeautifulSoup


def escape_csv(text):
    """Экранирование текста для CSV"""
    if text is None:
        return ""
    text = str(text)
    text = text.replace('\n', '\\n').replace('\r', '\\r')
    return text


def parse_slide_html(html_file='index.html'):
    """Извлечение данных о слайдах из HTML"""
    with open(html_file, 'r', encoding='utf-8') as f:
        content = f.read()

    soup = BeautifulSoup(content, 'html.parser')
    slides = []

    figures = soup.find_all('figure', class_='slide')
    for idx, figure in enumerate(figures, 1):
        # Извлекаем путь к картинке
        img_wrap = figure.find('div', class_='slide__img-wrap')
        img_path = img_wrap.get('data-img', '') if img_wrap else ''

        # Извлекаем заголовок
        headline = figure.find('h2', class_='slides__caption-headline')
        title = headline.get_text(strip=True) if headline else ''

        # Извлекаем ссылки
        links = figure.find_all('a')
        buttons = []
        for link in links:
            button_text = link.get_text(strip=True)
            button_id = link.get('id', '')
            if button_text:
                buttons.append({'text': button_text, 'id': button_id})

        slides.append({
            'number': idx,
            'image': img_path,
            'title': title,
            'buttons': buttons,
            'html': str(figure)
        })

    return slides


def create_slides_csv(slides, output_dir):
    """Создание CSV для слайдов"""
    headers = ['Номер', 'Название', 'Картинка', 'Кнопки', 'HTML']

    rows = []
    for slide in slides:
        buttons_text = '; '.join([b['text'] for b in slide['buttons']])
        rows.append({
            'Номер': slide['number'],
            'Название': escape_csv(slide['title']),
            'Картинка': slide['image'],
            'Кнопки': escape_csv(buttons_text),
            'HTML': escape_csv(slide['html'])
        })

    csv_file = output_dir / '01_СЛАЙДЫ.csv'
    with open(csv_file, 'w', encoding='utf-8-sig', newline='') as f:
        writer = csv.DictWriter(f, fieldnames=headers, delimiter='\t')
        writer.writeheader()
        writer.writerows(rows)

    return len(rows)


def flatten_item(item, level=0, parent_path="", row_id=None):
    """Преобразование элемента в плоскую структуру"""
    current_path = f"{parent_path}/{item['value']}" if parent_path else item['value']

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

    if 'children' in item and item['children']:
        for i, child in enumerate(item['children']):
            child_id = f"{row_id}_{i+1}"
            child_rows = flatten_item(child, level + 1, current_path, child_id)
            rows.extend(child_rows)

    return rows


def export_category_tabs(data, output_dir):
    """Экспорт по логическим вкладкам"""

    headers = [
        'ID', 'Родитель', 'Уровень', 'Название', 'Значение', 'Подпись',
        'Иконка', 'Обложка', 'Краткое описание', 'Полное описание',
        'Расписание', 'Цена'
    ]

    stats = {}

    # Вкладка 2: Тренажерный зал
    gym = [x for x in data['main'] if x['value'] == 'gym']
    if gym:
        rows = flatten_item(gym[0])
        csv_file = output_dir / '02_ТРЕНАЖЕРНЫЙ_ЗАЛ.csv'
        with open(csv_file, 'w', encoding='utf-8-sig', newline='') as f:
            writer = csv.DictWriter(f, fieldnames=headers, delimiter='\t')
            writer.writeheader()
            writer.writerows(rows)
        stats['Тренажерный зал'] = len(rows)
        print(f"[OK] Тренажерный зал: {len(rows)} строк")

    # Секции - разбиваем по подкатегориям
    section = [x for x in data['main'] if x['value'] == 'section']
    if section and 'children' in section[0]:
        tab_num = 3
        section_mapping = {
            'kids': ('ДЕТСКИЕ_СЕКЦИИ', 'Детские секции'),
            'fight': ('ЕДИНОБОРСТВА', 'Единоборства'),
            'dance': ('ТАНЦЫ', 'Танцы'),
            'women': ('ЖЕНСКИЕ_СЕКЦИИ', 'Женские секции'),
            'winter': ('ЗИМНИЕ_СЕКЦИИ', 'Зимние секции'),
            'men': ('МУЖСКИЕ_СЕКЦИИ', 'Мужские секции')
        }

        for subsection in section[0]['children']:
            value = subsection['value']
            if value in section_mapping:
                filename, label = section_mapping[value]
                rows = flatten_item(subsection)
                csv_file = output_dir / f'{tab_num:02d}_{filename}.csv'
                with open(csv_file, 'w', encoding='utf-8-sig', newline='') as f:
                    writer = csv.DictWriter(f, fieldnames=headers, delimiter='\t')
                    writer.writeheader()
                    writer.writerows(rows)
                stats[label] = len(rows)
                print(f"[OK] {label}: {len(rows)} строк")
                tab_num += 1

    # Вкладка 9: Отдых (relax + massage + solarium)
    rest_categories = ['relax', 'massage', 'solarium']
    rest_rows = []
    for cat_value in rest_categories:
        cat = [x for x in data['main'] if x['value'] == cat_value]
        if cat:
            rest_rows.extend(flatten_item(cat[0]))

    if rest_rows:
        csv_file = output_dir / '09_ОТДЫХ_И_СПА.csv'
        with open(csv_file, 'w', encoding='utf-8-sig', newline='') as f:
            writer = csv.DictWriter(f, fieldnames=headers, delimiter='\t')
            writer.writeheader()
            writer.writerows(rest_rows)
        stats['Отдых и СПА'] = len(rest_rows)
        print(f"[OK] Отдых и СПА: {len(rest_rows)} строк")

    # Вкладка 10: Отель
    hotel = [x for x in data['main'] if x['value'] == 'hotel']
    if hotel:
        rows = flatten_item(hotel[0])
        csv_file = output_dir / '10_ОТЕЛЬ.csv'
        with open(csv_file, 'w', encoding='utf-8-sig', newline='') as f:
            writer = csv.DictWriter(f, fieldnames=headers, delimiter='\t')
            writer.writeheader()
            writer.writerows(rows)
        stats['Отель'] = len(rows)
        print(f"[OK] Отель: {len(rows)} строк")

    # Вкладка 11: Ресторан
    restaurant = [x for x in data['main'] if x['value'] == 'restaurant']
    if restaurant:
        rows = flatten_item(restaurant[0])
        csv_file = output_dir / '11_РЕСТОРАН.csv'
        with open(csv_file, 'w', encoding='utf-8-sig', newline='') as f:
            writer = csv.DictWriter(f, fieldnames=headers, delimiter='\t')
            writer.writeheader()
            writer.writerows(rows)
        stats['Ресторан'] = len(rows)
        print(f"[OK] Ресторан: {len(rows)} строк")

    # Вкладка 12: Ледовая арена
    arena = [x for x in data['main'] if x['value'] == 'arena']
    if arena:
        rows = flatten_item(arena[0])
        csv_file = output_dir / '12_ЛЕДОВАЯ_АРЕНА.csv'
        with open(csv_file, 'w', encoding='utf-8-sig', newline='') as f:
            writer = csv.DictWriter(f, fieldnames=headers, delimiter='\t')
            writer.writeheader()
            writer.writerows(rows)
        stats['Ледовая арена'] = len(rows)
        print(f"[OK] Ледовая арена: {len(rows)} строк")

    # Вкладка 13: Футбольное поле
    field = [x for x in data['main'] if x['value'] == 'field']
    if field:
        rows = flatten_item(field[0])
        csv_file = output_dir / '13_ФУТБОЛЬНОЕ_ПОЛЕ.csv'
        with open(csv_file, 'w', encoding='utf-8-sig', newline='') as f:
            writer = csv.DictWriter(f, fieldnames=headers, delimiter='\t')
            writer.writeheader()
            writer.writerows(rows)
        stats['Футбольное поле'] = len(rows)
        print(f"[OK] Футбольное поле: {len(rows)} строк")

    # Вкладка 14: События (events + event)
    event_categories = ['events', 'event']
    event_rows = []
    for cat_value in event_categories:
        cat = [x for x in data['main'] if x['value'] == cat_value]
        if cat:
            event_rows.extend(flatten_item(cat[0]))

    if event_rows:
        csv_file = output_dir / '14_СОБЫТИЯ.csv'
        with open(csv_file, 'w', encoding='utf-8-sig', newline='') as f:
            writer = csv.DictWriter(f, fieldnames=headers, delimiter='\t')
            writer.writeheader()
            writer.writerows(event_rows)
        stats['События'] = len(event_rows)
        print(f"[OK] События: {len(event_rows)} строк")

    return stats


def create_promo_templates(output_dir):
    """Создание шаблонов для акций и новостей"""

    # Вкладка 15: Акции
    promo_headers = ['ID', 'Название', 'Описание', 'Срок действия', 'Картинка', 'Активна']
    promo_rows = [
        {
            'ID': 'promo_001',
            'Название': 'Осенний марафон',
            'Описание': 'Годовой абонемент за 9000 ₽',
            'Срок действия': 'До 31 декабря 2025',
            'Картинка': 'img/promo1.jpg',
            'Активна': 'Да'
        },
        {
            'ID': 'promo_002',
            'Название': 'Пример акции',
            'Описание': 'Описание акции...',
            'Срок действия': '',
            'Картинка': '',
            'Активна': 'Нет'
        }
    ]

    csv_file = output_dir / '15_АКЦИИ.csv'
    with open(csv_file, 'w', encoding='utf-8-sig', newline='') as f:
        writer = csv.DictWriter(f, fieldnames=promo_headers, delimiter='\t')
        writer.writeheader()
        writer.writerows(promo_rows)
    print(f"[OK] Акции: {len(promo_rows)} строк (шаблон)")

    # Вкладка 16: Новости
    news_headers = ['ID', 'Дата', 'Заголовок', 'Краткое описание', 'Полный текст', 'Картинка', 'Опубликована']
    news_rows = [
        {
            'ID': 'news_001',
            'Дата': '2025-10-10',
            'Заголовок': 'Мастер-класс: Готовим бургер',
            'Краткое описание': 'Приглашаем детей 4+ на кулинарный мастер-класс',
            'Полный текст': 'Подробное описание мероприятия...',
            'Картинка': 'img/50.jpg',
            'Опубликована': 'Да'
        },
        {
            'ID': 'news_002',
            'Дата': '2025-10-20',
            'Заголовок': 'Рисуем вином',
            'Краткое описание': 'Творческий вечер для взрослых',
            'Полный текст': 'Описание события...',
            'Картинка': 'img/51.jpg',
            'Опубликована': 'Да'
        },
        {
            'ID': 'news_003',
            'Дата': '',
            'Заголовок': 'Пример новости',
            'Краткое описание': '',
            'Полный текст': '',
            'Картинка': '',
            'Опубликована': 'Нет'
        }
    ]

    csv_file = output_dir / '16_НОВОСТИ.csv'
    with open(csv_file, 'w', encoding='utf-8-sig', newline='') as f:
        writer = csv.DictWriter(f, fieldnames=news_headers, delimiter='\t')
        writer.writeheader()
        writer.writerows(news_rows)
    print(f"[OK] Новости: {len(news_rows)} строк (шаблон)")

    return {'Акции': len(promo_rows), 'Новости': len(news_rows)}


def export_to_csv_v2(json_file='form.json', html_file='index.html', output_dir='google_sheets_tabs'):
    """Главная функция экспорта v2"""

    output_path = Path(output_dir)
    output_path.mkdir(exist_ok=True)

    print("="*60)
    print("  Экспорт данных в Google Таблицы v2.0")
    print("  С разделением по логическим вкладкам")
    print("="*60)
    print()

    stats = {}

    # 1. Экспорт слайдов
    print("Экспорт слайдов...")
    try:
        slides = parse_slide_html(html_file)
        slides_count = create_slides_csv(slides, output_path)
        stats['Слайды'] = slides_count
        print(f"[OK] Слайды: {slides_count} строк")
    except Exception as e:
        print(f"[WARNING] Ошибка экспорта слайдов: {e}")
        print("Продолжаем без слайдов...")

    print()

    # 2. Экспорт категорий
    print("Экспорт категорий контента...")
    with open(json_file, 'r', encoding='utf-8') as f:
        data = json.load(f)

    category_stats = export_category_tabs(data, output_path)
    stats.update(category_stats)

    print()

    # 3. Создание шаблонов акций и новостей
    print("Создание шаблонов...")
    promo_stats = create_promo_templates(output_path)
    stats.update(promo_stats)

    print()
    print("="*60)
    print("Экспорт завершен!")
    print(f"Всего вкладок: {len(stats)}")
    print(f"Файлы сохранены в: {output_path.absolute()}")
    print("="*60)
    print()
    print("Статистика по вкладкам:")
    for name, count in stats.items():
        print(f"  {name}: {count} строк")
    print()

    return stats


if __name__ == '__main__':
    try:
        from bs4 import BeautifulSoup
    except ImportError:
        print("[ERROR] Требуется установить библиотеку BeautifulSoup4")
        print("Запустите: pip install beautifulsoup4")
        print()
        print("Продолжаем экспорт без слайдов...")
        print()

    export_to_csv_v2()
