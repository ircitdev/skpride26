#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
Генератор HTML кода слайдов из простой структуры таблицы
Преобразует разметку (**жирный**, *курсив*, [плашка], {акцент}) в HTML
"""

import re
import json
import sys

if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')


def parse_markup(text):
    """
    Преобразует простую разметку в HTML

    Поддерживаемые теги:
    - **текст** -> <strong>текст</strong>
    - *текст* -> <em>текст</em>
    - [текст] -> <span class="slideTextAccent">текст</span> (белая плашка)
    - {текст} -> <span class="slideTextAccentBeige">текст</span> (бежевая плашка)
    - | -> <br class="mobile-br"/> (перенос строки)
    """

    if not text or text.strip() == '':
        return ''

    # Сначала обрабатываем комбинации
    # **_текст_** -> <strong><em>текст</em></strong>
    text = re.sub(r'\*\*_(.+?)_\*\*', r'<strong><em>\1</em></strong>', text)

    # **[текст]** -> <strong><span class="slideTextAccent">текст</span></strong>
    text = re.sub(r'\*\*\[(.+?)\]\*\*', r'<strong><span class="slideTextAccent">\1</span></strong>', text)

    # **{текст}** -> <strong><span class="slideTextAccentBeige">текст</span></strong>
    text = re.sub(r'\*\*\{(.+?)\}\*\*', r'<strong><span class="slideTextAccentBeige">\1</span></strong>', text)

    # *[текст]* -> <em><span class="slideTextAccent">текст</span></em>
    text = re.sub(r'\*\[(.+?)\]\*', r'<em><span class="slideTextAccent">\1</span></em>', text)

    # *{текст}* -> <em><span class="slideTextAccentBeige">текст</span></em>
    text = re.sub(r'\*\{(.+?)\}\*', r'<em><span class="slideTextAccentBeige">\1</span></em>', text)

    # Затем простые теги
    # **текст** -> <strong>текст</strong>
    text = re.sub(r'\*\*(.+?)\*\*', r'<strong>\1</strong>', text)

    # *текст* -> <em>текст</em> (но не затрагиваем уже обработанное)
    text = re.sub(r'(?<!</)(?<!</em>)\*([^*]+?)\*', r'<em>\1</em>', text)

    # [текст] -> <span class="slideTextAccent">текст</span>
    text = re.sub(r'\[(.+?)\]', r'<span class="slideTextAccent">\1</span>', text)

    # {текст} -> <span class="slideTextAccentBeige">текст</span>
    text = re.sub(r'\{(.+?)\}', r'<span class="slideTextAccentBeige">\1</span>', text)

    # | -> <br class="mobile-br"/>
    text = text.replace('|', '<br class="mobile-br"/>')

    return text


def wrap_in_text_row(text):
    """Оборачивает текст в структуру text-row для слайдера"""
    if not text:
        return ''

    return f'<span class="text-row"><span>{text}</span></span>'


def generate_slide_html(slide_data, is_first=False):
    """
    Генерирует HTML код для одного слайда

    slide_data: словарь с данными слайда
    is_first: флаг первого слайда (добавляет класс slide--current)
    """

    # Извлекаем данные
    slide_num = slide_data.get('Номер', '')
    idname = slide_data.get('idname', '')
    line1 = slide_data.get('Заголовок строка 1', '')
    line2 = slide_data.get('Заголовок строка 2', '')
    line3 = slide_data.get('Заголовок строка 3', '')
    img_desktop = slide_data.get('Картинка Desktop', '')
    img_mobile = slide_data.get('Картинка Mobile', '')
    btn_text = slide_data.get('Текст кнопки', '')
    btn_link = slide_data.get('Ссылка кнопки', '#')
    btn_id = slide_data.get('ID кнопки', '')
    theme = slide_data.get('Тема слайда', 'light')

    # Определяем класс темы
    theme_class = 'light-slide' if theme == 'light' else 'dark-slide'

    # Определяем класс слайда
    slide_class = 'slide slide--current' if is_first else 'slide'

    # Выбираем картинку (используем desktop как основную, mobile для адаптива)
    main_img = img_desktop if img_desktop else img_mobile

    # Парсим заголовки
    parsed_line1 = parse_markup(line1)
    parsed_line2 = parse_markup(line2)
    parsed_line3 = parse_markup(line3)

    # Формируем заголовок
    headline_parts = []
    if parsed_line1:
        headline_parts.append(wrap_in_text_row(parsed_line1))
    if parsed_line2:
        headline_parts.append(wrap_in_text_row(parsed_line2))
    if parsed_line3:
        headline_parts.append(wrap_in_text_row(parsed_line3))

    headline_html = '\n'.join(headline_parts)

    # Формируем кнопку
    button_html = ''
    if btn_text and btn_link:
        btn_id_attr = f' id="{btn_id}"' if btn_id else ''
        btn_class = 'sport-btn' if 'записаться' in btn_text.lower() or 'запись' in btn_text.lower() else ''
        button_html = f'<a class="slides__caption-link {btn_class}" href="{btn_link}"{btn_id_attr}><span>{btn_text}</span></a>'

    # Генерируем атрибут id для якорной ссылки (формат: slide_idname)
    id_attr = f' id="slide_{idname}" data-slide-id="{idname}"' if idname else ''

    # Генерируем финальный HTML
    html = f'''<figure class="{slide_class}"{id_attr}>
<div class="slide__img-wrap {theme_class}" data-img="{main_img}">
<div class="slide__img" style="background-image: url({main_img})"></div>
</div>
<figcaption class="slide__caption">
<h2 class="slides__caption-headline">
{headline_html}
</h2>
{button_html}
</figcaption>
</figure>'''

    return html


def generate_slides_from_data(slides_data):
    """
    Генерирует HTML код для всех слайдов

    slides_data: список словарей с данными слайдов
    """

    html_slides = []

    for i, slide in enumerate(slides_data):
        is_first = (i == 0)
        slide_html = generate_slide_html(slide, is_first)
        html_slides.append(slide_html)

    return html_slides


def generate_slides_json(input_file='slides.json', output_file='slides_html.json'):
    """
    Читает слайды из JSON и генерирует HTML версию
    """

    print("="*70)
    print("🎬 ГЕНЕРАТОР HTML СЛАЙДОВ")
    print("="*70)
    print()

    # Читаем исходные данные
    try:
        with open(input_file, 'r', encoding='utf-8') as f:
            slides_data = json.load(f)

        print(f"✓ Загружено слайдов: {len(slides_data)}")
    except FileNotFoundError:
        print(f"✗ Файл {input_file} не найден")
        return False
    except Exception as e:
        print(f"✗ Ошибка чтения файла: {e}")
        return False

    # Генерируем HTML
    print("\n🔨 Генерация HTML...")

    html_slides = generate_slides_from_data(slides_data)

    # Создаем структуру для сохранения
    result = {
        'slides': []
    }

    for i, (data, html) in enumerate(zip(slides_data, html_slides), 1):
        result['slides'].append({
            'number': data.get('Номер', i),
            'idname': data.get('idname', ''),
            'title': f"{data.get('Заголовок строка 1', '')} {data.get('Заголовок строка 2', '')}".strip(),
            'desktop_image': data.get('Картинка Desktop', ''),
            'mobile_image': data.get('Картинка Mobile', ''),
            'button_text': data.get('Текст кнопки', ''),
            'button_id': data.get('ID кнопки', ''),
            'html': html
        })

    # Сохраняем
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(result, f, ensure_ascii=False, indent=2)

    print(f"✓ HTML сгенерирован для {len(html_slides)} слайдов")
    print(f"✓ Сохранено в: {output_file}")

    # Также сохраняем чистый HTML для вставки
    html_output = '\n\n'.join(html_slides)
    html_file = 'slides_output.html'
    with open(html_file, 'w', encoding='utf-8') as f:
        f.write(html_output)

    print(f"✓ Чистый HTML сохранен в: {html_file}")

    print("\n" + "="*70)
    print("✓ ГЕНЕРАЦИЯ ЗАВЕРШЕНА!")
    print("="*70)

    return True


if __name__ == '__main__':
    # Тест парсинга разметки
    if len(sys.argv) > 1 and sys.argv[1] == 'test':
        print("🧪 Тестирование парсера разметки:\n")

        tests = [
            ("**Спорт**", "<strong>Спорт</strong>"),
            ("*и отдых*", "<em>и отдых</em>"),
            ("[всей]", '<span class="slideTextAccent">всей</span>'),
            ("{каждый день}", '<span class="slideTextAccentBeige">каждый день</span>'),
            ("**_семьи_**", "<strong><em>семьи</em></strong>"),
            ("Сила|и движение", 'Сила<br class="mobile-br"/>и движение'),
            ("**Сила** и *движение*", '<strong>Сила</strong> и <em>движение</em>'),
        ]

        for input_text, expected in tests:
            result = parse_markup(input_text)
            status = "✓" if result == expected else "✗"
            print(f"{status} '{input_text}'")
            print(f"   → {result}")
            if result != expected:
                print(f"   Ожидалось: {expected}")
            print()
    else:
        # Генерация HTML из файла
        generate_slides_json()
