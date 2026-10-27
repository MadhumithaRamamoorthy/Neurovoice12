$paths = @(
    'C:\Program Files\Google\Chrome\Application\chrome.exe',
    'C:\Program Files (x86)\Google\Chrome\Application\chrome.exe',
    'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe',
    'C:\Program Files\Microsoft\Edge\Application\msedge.exe'
)
for ($i = 0; $i -lt $paths.Length; $i++) {
    if (Test-Path $paths[$i]) {
        Write-Host "FOUND: $($paths[$i])"
    }
}
