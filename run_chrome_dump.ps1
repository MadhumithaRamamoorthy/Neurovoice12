$chromePath = 'C:\Program Files\Google\Chrome\Application\chrome.exe'
$targetUrl = 'file:///C:/Users/ELCOT/Downloads/Neuronexus/frontend/index.html'

$proc = Start-Process -FilePath $chromePath -ArgumentList @(
    '--headless=new',
    '--disable-gpu',
    '--dump-dom',
    $targetUrl
) -NoNewWindow -PassThru -RedirectStandardOutput (Join-Path $env:TEMP 'chrome_dump.html')

$proc.WaitForExit(5000)

$content = Get-Content (Join-Path $env:TEMP 'chrome_dump.html')
Write-Host "Chrome dump lines: $($content.Length)"
$content | Select-String "main-content" -Context 0, 10
