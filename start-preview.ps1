$ErrorActionPreference = "Stop"

$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$bundledPython = "C:\Users\17933\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe"

if (Test-Path -LiteralPath $bundledPython) {
  $python = $bundledPython
} elseif (Get-Command py -ErrorAction SilentlyContinue) {
  $python = "py"
} elseif (Get-Command python -ErrorAction SilentlyContinue) {
  $python = "python"
} else {
  throw "未找到 Python，无法启动本地预览服务器。"
}

Write-Host "师说古渊预览服务已启动"
Write-Host "电脑访问：http://localhost:4173/web/"
Write-Host "手机访问：http://192.168.124.101:4173/web/（需同一 Wi-Fi）"
Write-Host "按 Ctrl+C 停止服务"

& $python -m http.server 4173 --bind 0.0.0.0 --directory $projectRoot
