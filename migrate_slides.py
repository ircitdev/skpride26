#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
Скрипт миграции слайдов из старой структуры (с HTML) в новую (с простой разметкой)
"""

import json
import re
import sys
from bs4 import BeautifulSoup
import gspread
from google.oauth2.service_account import Credentials

if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

# Конфигурация
SPREADSHEET_ID = '1a4ZhAM2GNCxZzKbVgIMkTV4BT2mpmcheA9ejB8t5Sgk'
CREDENTIALS_FILE = 'pride34-d166327454d1.json'


def html_to_simple_markup(html_text):
    """
    Преобразует HTML разметку в простую разметку

    <strong> → **текст**
    <em> → *текст*
    <span class="slideTextAccent"> → {текст}
    <span class="slideTextAccentWhite"> → {текст}
    <br class="mobile-br"/> → |
    """
    if not html_text:
        return ''

    # Убираем лишние пробелы и переносы в начале/конце
    text = html_text.strip()

    # Убираем \n
    text = text.replace('\\n', ' ')

    # Заменяем <br class="mobile-br"/> на |
    text = re.sub(r'<br\s+class="mobile-br"\s*/>', '|', text)

    # Заменяем комбинированные теги
    # <strong class="slideTextAccent"> → **{текст}**
    text = re.sub(r'<strong\s+class="slideTextAccent">([^<]+)</strong>', r'**{\1}**', text)

    # <em class="slideTextAccent"> → *{текст}*
    text = re.sub(r'<em\s+class="slideTextAccent">([^<]+)</em>', r'*{\1}*', text)

    # Заменяем slideTextAccent и slideTextAccentWhite на {текст}
    text = re.sub(r'<span\s+class="slideTextAccent">([^<]+)</span>', r'{\1}', text)
    text = re.sub(r'<span\s+class="slideTextAccentWhite">([^<]+)</span>', r'{\1}', text)

    # Заменяем простые теги
    text = re.sub(r'<strong>([^<]+)</strong>', r'**\1**', text)
    text = re.sub(r'<em>([^<]+)</em>', r'*\1*', text)

    # Убираем остальные HTML теги
    text = re.sub(r'<[^>]+>', '', text)

    # Убираем лишние пробелы
    text = re.sub(r'\s+', ' ', text)

    # Убираем пробелы вокруг |
    text = re.sub(r'\s*\|\s*', '|', text)

    # Убираем лишние пробелы внутри тегов разметки
    text = re.sub(r'\*\*\s+', '**', text)
    text = re.sub(r'\s+\*\*', '**', text)
    text = re.sub(r'\*\s+', '*', text)
    text = re.sub(r'\s+\*', '*', text)
    text = re.sub(r'\{\s+', '{', text)
    text = re.sub(r'\s+\}', '}', text)

    text = text.strip()

    return text


def extract_headline_from_html(html):
    """Извлекает заголовок из HTML слайда"""
    if not html:
        return ['', '', '']

    # Ищем все text-row
    text_rows = re.findall(r'<span class="text-row"><span>(.+?)</span></span>', html, re.DOTALL)

    # Преобразуем каждую строку
    lines = []
    for row in text_rows[:3]:  # Максимум 3 строки
        clean_text = html_to_simple_markup(row)
        lines.append(clean_text)

    # Дополняем до 3 строк
    while len(lines) < 3:
        lines.append('')

    return lines[:3]


def extract_button_from_html(html):
    """Извлекает первую кнопку из HTML"""
    if not html:
        return '', '#', ''

    # Ищем первую кнопку с id
    button_match = re.search(r'<a[^>]*\sid="([^"]+)"[^>]*><span>([^<]+)</span></a>', html)

    if button_match:
        btn_id = button_match.group(1)
        btn_text = button_match.group(2)
        # Убираем • если есть
        btn_text = btn_text.replace('•', '').strip()
        return btn_text, '#', btn_id

    # Если не нашли с id, ищем любую кнопку
    button_match = re.search(r'<a[^>]*><span>([^<]+)</span></a>', html)
    if button_match:
        btn_text = button_match.group(1)
        btn_text = btn_text.replace('•', '').strip()
        return btn_text, '#', ''

    return '', '#', ''


def extract_theme_from_html(html):
    """Извлекает тему слайда (light/dark)"""
    if not html:
        return 'light'

    if 'dark-slide' in html:
        return 'dark'
    return 'light'


def migrate_slide(old_slide):
    """
    Мигрирует один слайд из старой структуры в новую

    Старая структура:
    ['Номер', 'Название', 'Картинка', 'Кнопки', 'HTML']

    Новая структура:
    ['Номер', 'Заголовок строка 1', 'Заголовок строка 2', 'Заголовок строка 3',
     'Картинка Desktop', 'Картинка Mobile', 'Текст кнопки', 'Ссылка кнопки',
     'ID кнопки', 'Тема слайда']
    """

    number = old_slide[0]
    old_title = old_slide[1]
    old_image = old_slide[2]
    old_buttons = old_slide[3]
    html = old_slide[4]

    # Извлекаем заголовки из HTML
    line1, line2, line3 = extract_headline_from_html(html)

    # Извлекаем кнопку
    btn_text, btn_link, btn_id = extract_button_from_html(html)

    # Если не нашли кнопку в HTML, берем из старого поля "Кнопки"
    if not btn_text and old_buttons:
        # Берем первую кнопку из списка
        first_btn = old_buttons.split(';')[0].strip()
        btn_text = first_btn.replace('•', '').strip()

    # Извлекаем тему
    theme = extract_theme_from_html(html)

    # Картинки (пока одинаковые для Desktop и Mobile)
    img_desktop = old_image
    img_mobile = old_image  # TODO: Можно потом добавить -mobile к имени

    # Создаем новую структуру
    new_slide = [
        number,
        line1,
        line2,
        line3,
        img_desktop,
        img_mobile,
        btn_text,
        btn_link,
        btn_id,
        theme
    ]

    return new_slide


def migrate_all_slides(slides_data):
    """Мигрирует все слайды"""

    print("🔄 Миграция слайдов...")
    print()

    # Первая строка - заголовки старой структуры
    old_headers = slides_data[0]

    # Новые заголовки
    new_headers = [
        'Номер',
        'Заголовок строка 1',
        'Заголовок строка 2',
        'Заголовок строка 3',
        'Картинка Desktop',
        'Картинка Mobile',
        'Текст кнопки',
        'Ссылка кнопки',
        'ID кнопки',
        'Тема слайда'
    ]

    # Мигрируем данные
    new_data = [new_headers]

    for i, old_slide in enumerate(slides_data[1:], 1):
        print(f"📄 Слайд {i}:")
        print(f"   Старое название: {old_slide[1]}")

        new_slide = migrate_slide(old_slide)

        print(f"   Заголовок строка 1: {new_slide[1]}")
        print(f"   Заголовок строка 2: {new_slide[2]}")
        print(f"   Заголовок строка 3: {new_slide[3]}")
        print(f"   Кнопка: {new_slide[6]}")
        print(f"   Тема: {new_slide[9]}")
        print()

        new_data.append(new_slide)

    return new_data


def update_google_sheet(new_data):
    """Обновляет Google Таблицу новыми данными"""

    print("🔌 Подключение к Google Sheets...")

    scopes = [
        'https://www.googleapis.com/auth/spreadsheets',
        'https://www.googleapis.com/auth/drive'
    ]

    credentials = Credentials.from_service_account_file(CREDENTIALS_FILE, scopes=scopes)
    client = gspread.authorize(credentials)
    spreadsheet = client.open_by_key(SPREADSHEET_ID)

    # Находим лист слайдов
    worksheet = spreadsheet.worksheet('01_СЛАЙДЫ.csv')

    print("✓ Подключение установлено")
    print(f"📊 Лист: {worksheet.title}")
    print()

    # Очищаем лист
    print("🗑️  Очистка старых данных...")
    worksheet.clear()

    # Записываем новые данные
    print("📝 Запись новых данных...")
    worksheet.update('A1', new_data)

    print(f"✓ Обновлено строк: {len(new_data)}")
    print()


def main(auto_confirm=False):
    """Главная функция миграции"""

    print("="*70)
    print("🔄 МИГРАЦИЯ СЛАЙДОВ В НОВУЮ СТРУКТУРУ")
    print("="*70)
    print()

    # Читаем текущие данные
    print("📖 Чтение текущих данных...")
    with open('sheet_data.json', 'r', encoding='utf-8') as f:
        data = json.load(f)

    old_slides = data.get('01_СЛАЙДЫ.csv', [])

    if not old_slides:
        print("❌ Данные слайдов не найдены!")
        return False

    print(f"✓ Загружено слайдов: {len(old_slides) - 1}")
    print()

    # Мигрируем
    new_slides = migrate_all_slides(old_slides)

    # Сохраняем в JSON для проверки
    print("💾 Сохранение мигрированных данных...")
    with open('slides_migrated.json', 'w', encoding='utf-8') as f:
        json.dump(new_slides, f, ensure_ascii=False, indent=2)

    print("✓ Сохранено в: slides_migrated.json")
    print()

    # Спрашиваем подтверждение (если не авто-режим)
    if not auto_confirm:
        print("="*70)
        print("⚠️  ВНИМАНИЕ!")
        print("="*70)
        print()
        print("Сейчас будет обновлена Google Таблица.")
        print("Старые данные будут ЗАМЕНЕНЫ новыми!")
        print()
        print("Проверьте файл slides_migrated.json перед продолжением.")
        print()

        response = input("Продолжить миграцию? (да/нет): ").strip().lower()

        if response not in ['да', 'yes', 'y', 'д']:
            print("\n❌ Миграция отменена")
            print("Мигрированные данные сохранены в slides_migrated.json")
            return False

    # Обновляем Google Таблицу
    print()
    update_google_sheet(new_slides)

    print("="*70)
    print("✅ МИГРАЦИЯ ЗАВЕРШЕНА УСПЕШНО!")
    print("="*70)
    print()
    print("Что было сделано:")
    print("✓ Преобразован HTML в простую разметку")
    print("✓ Извлечены заголовки (до 3 строк)")
    print("✓ Извлечены кнопки (первая кнопка)")
    print("✓ Определены темы слайдов (light/dark)")
    print("✓ Обновлена Google Таблица")
    print()
    print("Следующие шаги:")
    print("1. Откройте Google Таблицу и проверьте данные")
    print("2. Добавьте отдельные картинки для Mobile (если нужно)")
    print("3. Запустите ОБНОВИТЬ_ДАННЫЕ.bat → 1 для генерации HTML")
    print()

    return True


if __name__ == '__main__':
    try:
        # Проверяем параметры командной строки
        auto_confirm = '--yes' in sys.argv or '-y' in sys.argv

        success = main(auto_confirm=auto_confirm)
        sys.exit(0 if success else 1)
    except Exception as e:
        print(f"\n❌ Критическая ошибка: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
