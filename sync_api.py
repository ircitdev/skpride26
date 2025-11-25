#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
API сервер для автоматического обновления данных через веб-интерфейс
Запуск: python sync_api.py
"""

from flask import Flask, jsonify, send_file
from flask_cors import CORS
import sys
import os

# Добавляем текущую директорию в путь
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

# Импортируем функцию синхронизации
from sync_from_google_sheets import sync_data

app = Flask(__name__)
CORS(app)  # Разрешаем CORS для локальной разработки


@app.route('/')
def index():
    """Главная страница - панель управления"""
    return send_file('admin-update.html')


@app.route('/api/sync-data', methods=['POST'])
def api_sync_data():
    """API endpoint для синхронизации данных"""
    try:
        # Запускаем синхронизацию
        success = sync_data()

        if success:
            # Читаем обновленный form.json для получения статистики
            import json
            with open('form.json', 'r', encoding='utf-8') as f:
                data = json.load(f)

            # Подсчитываем количество элементов
            def count_items(items):
                count = len(items)
                for item in items:
                    if 'children' in item:
                        count += count_items(item['children'])
                return count

            total_items = count_items(data.get('main', []))

            return jsonify({
                'success': True,
                'message': 'Данные успешно обновлены',
                'count': total_items,
                'categories': len(data.get('main', []))
            })
        else:
            return jsonify({
                'success': False,
                'error': 'Ошибка синхронизации данных'
            }), 500

    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@app.route('/api/status', methods=['GET'])
def api_status():
    """Проверка статуса API"""
    return jsonify({
        'status': 'online',
        'version': '1.0'
    })


if __name__ == '__main__':
    # Настройка кодировки для консоли Windows
    if sys.platform == 'win32':
        sys.stdout.reconfigure(encoding='utf-8')

    print("="*60)
    print("🚀 API Сервер для обновления данных запущен")
    print("="*60)
    print()
    print("📍 Панель управления: http://localhost:5000")
    print("📍 API endpoint: http://localhost:5000/api/sync-data")
    print()
    print("Нажмите Ctrl+C для остановки сервера")
    print("="*60)
    print()

    app.run(debug=True, host='0.0.0.0', port=5000)
