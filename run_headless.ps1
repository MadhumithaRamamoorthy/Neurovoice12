$edgePath = 'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe'
$targetUrl = 'file:///C:/Users/ELCOT/Downloads/Neuronexus/frontend/index.html'
$tempUserDir = Join-Path $env:TEMP 'edge_test_profile'

if (Test-Path $tempUserDir) {
    Remove-Item -Path $tempUserDir -Recurse -Force -ErrorAction SilentlyContinue
}

$proc = Start-Process -FilePath $edgePath -ArgumentList @(
    '--headless=new',
    '--enable-logging=stderr',
    '--v=1',
    "--user-data-dir=$tempUserDir",
    '--dump-dom',
    $targetUrl
) -NoNewWindow -PassThru -RedirectStandardError (Join-Path $env:TEMP 'edge_err.log') -RedirectStandardOutput (Join-Path $env:TEMP 'edge_out.log')

$proc.WaitForExit(10000)

Write-Host "Exit Code: $($proc.ExitCode)"
Write-Host "--- STDERR / CONSOLE LOGS ---"
Get-Content (Join-Path $env:TEMP 'edge_err.log') -Tail 40
Write-Host "--- STDOUT / DOM DUMP ---"
$out = Get-Content (Join-Path $env:TEMP 'edge_out.log')
Write-Host "DOM lines: $($out.Length)"
$out | Select-String "NEURONEXUS" | Select-Object -First 10
