param(
    [string]$Port = "8000"
)

$CurrentPath = Get-Location
$IndexFile = Join-Path $CurrentPath "index.html"

if (-Not (Test-Path $IndexFile)) {
    Write-Host "❌ Файл index.html не найден в $CurrentPath"
    exit
}

# Убиваем старые джобы Python-сервера, если они есть
Get-Job | Where-Object { $_.Command -like "*http.server*" } | ForEach-Object {
    Stop-Job $_
    Remove-Job $_
}

# Запускаем новый сервер
$job = Start-Job { Set-Location $using:CurrentPath; python -m http.server $using:Port }

Write-Host "♻️  Сервер перезапущен: http://localhost:$Port/index.html"
Start-Process "http://localhost:$Port/index.html"
