#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Скрипт для обновления расписания единоборств из pride34.ru
"""

import re
import sys
import requests
from pathlib import Path

URL = "https://pride34.ru/timetable/#fights"
OUTPUT_FILE = "schedule-fight.html"

# Маппинг названий секций на data-class атрибуты
CLASS_MAPPING = {
    'Самбо': 'sambo',
    'Джиу-джитсу': 'jiu-jitsu',
    'Кикбоксинг': 'kickboxing',
    'Тхэквондо': 'taekwondo',
    'ММА': 'mma',
    'Смешанное единоборство ММА': 'mma',
    'Греко-римская борьба': 'greco',
    'Рукопашный бой': 'rukopash',
    'Борьба дзюдо': 'judo',
    'Бокс': 'boxing',
    'Панкратион': 'pankration',
}

def main():
    print(f"🔄 Загрузка расписания с {URL}...")

    try:
        # Загружаем HTML страницу
        response = requests.get(URL, timeout=10)
        response.raise_for_status()
        response.encoding = 'utf-8'
        html = response.text

        # Извлекаем таблицу расписания
        match = re.search(r'<table class="timetable">(.*?)</table>', html, re.DOTALL)

        if not match:
            print("❌ Не удалось найти таблицу расписания на странице")
            sys.exit(1)

        table_content = match.group(1)
        print("✅ Таблица найдена, обрабатываем...")

        # Заменяем ссылки на data-class атрибуты
        for class_name, data_class in CLASS_MAPPING.items():
            # Обрабатываем различные варианты ссылок
            patterns = [
                rf'<a\s+(?:style="[^"]*"\s+)?href="[^"]*"\s+title="{class_name}">',
                rf'<a\s+href="[^"]*"\s+(?:style="[^"]*"\s+)?title="{class_name}">',
            ]

            for pattern in patterns:
                table_content = re.sub(
                    pattern,
                    f'<a href="#" data-class="{data_class}" class="class-link">',
                    table_content
                )

        # Заменяем классы для стилей
        replacements = {
            'class="class-trainers"': 'class="trainer"',
            'class="before-hour-text"': 'class="age"',
            'class="after-hour-text"': 'class="age"',
        }

        for old, new in replacements.items():
            table_content = table_content.replace(old, new)

        # Заменяем row_N классы
        table_content = re.sub(r'class="row_\d+\s+row-gray"', 'class="row-gray"', table_content)
        table_content = re.sub(r'class="row_\d+"', '', table_content)

        # Добавляем класс time-cell для первой колонки с временем
        table_content = re.sub(
            r'<td>\s*([\d:]+\s*-\s*[\d:]+)\s*</td>',
            r'<td class="time-cell">\1</td>',
            table_content
        )

        # Заменяем длинные названия дней на короткие
        day_replacements = {
            '<th>Понедельник</th>': '<th>Пн</th>',
            '<th>Вторник</th>': '<th>Вт</th>',
            '<th>Среда</th>': '<th>Ср</th>',
            '<th>Четверг</th>': '<th>Чт</th>',
            '<th>Пятница</th>': '<th>Пт</th>',
            '<th>Суббота</th>': '<th>Сб</th>',
            '<th>Воскресенье</th>': '<th>Вс</th>',
            '<th></th>': '<th>Время</th>',
        }

        for old, new in day_replacements.items():
            table_content = table_content.replace(old, new)

        # Заменяем <br> на разделители
        table_content = table_content.replace('<br>', '<hr>')

        # Формируем финальный HTML
        final_html = f'''<div class="schedule-header">
\t<h2>Расписание единоборств</h2>
\t<button class="schedule-close" id="closeSchedule">×</button>
</div>

<div class="schedule-content">
\t<table class="timetable">
{table_content}
\t</table>
</div>
'''

        # Сохраняем в файл
        output_path = Path(__file__).parent / OUTPUT_FILE
        output_path.write_text(final_html, encoding='utf-8')

        file_size = output_path.stat().st_size / 1024
        print(f"✅ Расписание успешно обновлено: {output_path}")
        print(f"📊 Размер файла: {file_size:.2f} KB")
        print("\n✨ Готово! Обновите страницу в браузере для просмотра изменений.")

    except requests.RequestException as e:
        print(f"❌ Ошибка при загрузке расписания: {e}")
        sys.exit(1)
    except Exception as e:
        print(f"❌ Неожиданная ошибка: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
