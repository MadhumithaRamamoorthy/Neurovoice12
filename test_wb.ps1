Add-Type -AssemblyName System.Windows.Forms

$files = @(
    'seed-data.js',
    'storage.js',
    'neurolearn.js',
    'charts.js',
    'oscilloscope.js',
    'gamification.js',
    'ai-classroom.js',
    'community-qa.js',
    'faculty.js',
    'eeg-simulator.js',
    'app.js'
)

$base = 'C:\Users\ELCOT\Downloads\Neuronexus\frontend\js\'

$wb = New-Object System.Windows.Forms.WebBrowser
$wb.ScriptErrorsSuppressed = $false

$html = @"
<!DOCTYPE html>
<html>
<head>
</head>
<body>
<div id="main-content"></div>
</body>
</html>
"@

$wb.DocumentText = $html
while ($wb.ReadyState -ne [System.Windows.Forms.WebBrowserReadyState]::Complete) {
    [System.Windows.Forms.Application]::DoEvents()
}

Write-Host "WebBrowser control ready."
