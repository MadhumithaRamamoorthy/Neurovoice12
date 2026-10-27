$lines = Get-Content "C:\Users\ELCOT\Downloads\Neuronexus\frontend\js\app.js"
$total = $lines.Count
Write-Host "Total lines: $total"

# Find all method declarations (2-space indent then word then open paren)
$methodLines = @()
for ($i = 0; $i -lt $lines.Count; $i++) {
    if ($lines[$i] -match '^\s{2}(\w+)\s*\(') {
        $methodLines += [PSCustomObject]@{ LineNum = $i+1; Text = $lines[$i].Trim() }
    }
}

Write-Host "`n=== Methods found ==="
$methodLines | ForEach-Object { Write-Host "Line $($_.LineNum): $($_.Text)" }

# Find unclosed backtick strings - count per line
$bt = 0
for ($i = 0; $i -lt $lines.Count; $i++) {
    $cnt = ($lines[$i].ToCharArray() | Where-Object { $_ -eq '`' }).Count
    $bt += $cnt
}
Write-Host "`nTotal backticks: $bt (should be even)"
