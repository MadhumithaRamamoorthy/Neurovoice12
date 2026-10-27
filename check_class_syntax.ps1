$base = 'C:\Users\ELCOT\Downloads\Neuronexus\frontend\js\'
$appPath = Join-Path $base 'app.js'
$lines = [System.IO.File]::ReadAllLines($appPath, [System.Text.Encoding]::UTF8)

# Check all function / method headers and syntax constructs
# In ES6 class definitions, check that all methods are formatted correctly:
# method(...) { ... }
$classDepth = 0
$braceCount = 0

for ($i = 0; $i -lt $lines.Length; $i++) {
    $line = $lines[$i]
    $t = $line.Trim()
    
    # Check for unexpected semicolons outside statements or invalid keywords
    if ($t -match '^[a-zA-Z0-9_]+\s*\([^)]*\)\s*;\s*$') {
        Write-Host "Warning: method ending with semicolon at line $($i+1): $t"
    }
}
Write-Host "Checked method definitions."
