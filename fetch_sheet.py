import gspread
from google.oauth2.service_account import Credentials
import json
import sys

# Настройка кодировки для консоли Windows
if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

# ID таблицы из URL
SPREADSHEET_ID = '1a4ZhAM2GNCxZzKbVgIMkTV4BT2mpmcheA9ejB8t5Sgk'

# Путь к credentials
CREDENTIALS_FILE = 'pride34-d166327454d1.json'

# Настройка авторизации
scopes = [
    'https://www.googleapis.com/auth/spreadsheets.readonly',
    'https://www.googleapis.com/auth/drive.readonly'
]

credentials = Credentials.from_service_account_file(CREDENTIALS_FILE, scopes=scopes)
client = gspread.authorize(credentials)

# Открываем таблицу
spreadsheet = client.open_by_key(SPREADSHEET_ID)

# Получаем все листы
worksheets = spreadsheet.worksheets()

print(f"Найдено листов: {len(worksheets)}\n")

# Читаем данные со всех листов
all_data = {}

for worksheet in worksheets:
    sheet_name = worksheet.title
    print(f"Лист: {sheet_name}")

    # Получаем все данные
    data = worksheet.get_all_values()

    if data:
        print(f"  Строк: {len(data)}")
        print(f"  Столбцов: {len(data[0]) if data else 0}")

        # Сохраняем данные
        all_data[sheet_name] = data

        # Выводим превью данных (безопасно)
        print(f"  Заголовки: {data[0] if data else 'нет данных'}")
        print(f"  Всего строк данных: {len(data) - 1}")
    else:
        print(f"  (пусто)")

    print()

# Сохраняем все данные в JSON файл
with open('sheet_data.json', 'w', encoding='utf-8') as f:
    json.dump(all_data, f, ensure_ascii=False, indent=2)

print("✓ Данные сохранены в sheet_data.json")
