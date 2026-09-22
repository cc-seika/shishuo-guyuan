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
  throw "Python was not found, so the preview server cannot start."
}

Write-Host "Preview server started"
Write-Host "Local URL: http://localhost:4173/web/"
Write-Host "Public sharing: use the GitHub Pages URL documented in README.md"
Write-Host "Press Ctrl+C to stop"

& $python -m http.server 4173 --bind 0.0.0.0 --directory $projectRoot
