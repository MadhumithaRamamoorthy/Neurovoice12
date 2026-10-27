$f = 'C:\Users\ELCOT\Downloads\Neuronexus\frontend\js\app.js'
$lines = [System.IO.File]::ReadAllLines($f, [System.Text.Encoding]::UTF8)

# Let's count open & close curly braces ignoring inside strings/template literals!
$inSingleQuote = $false
$inDoubleQuote = $false
$inBacktick = $false
$escaped = $false
$braceLevel = 0

for ($i = 0; $i -lt $lines.Length; $i++) {
    $line = $lines[$i]
    $chars = $line.ToCharArray()
    for ($j = 0; $j -lt $chars.Length; $j++) {
        $c = $chars[$j]
        
        if ($escaped) {
            $escaped = $false
            continue
        }
        
        if ($c -eq '\') {
            $escaped = $true
            continue
        }
        
        if ($c -eq "'" -and -not $inDoubleQuote -and -not $inBacktick) {
            $inSingleQuote = -not $inSingleQuote
            continue
        }
        if ($c -eq '"' -and -not $inSingleQuote -and -not $inBacktick) {
            $inDoubleQuote = -not $inDoubleQuote
            continue
        }
        if ($c -eq [char]96 -and -not $inSingleQuote -and -not $inDoubleQuote) {
            $inBacktick = -not $inBacktick
            continue
        }
        
        if (-not $inSingleQuote -and -not $inDoubleQuote -and -not $inBacktick) {
            if ($c -eq '{') {
                $braceLevel++
            } elseif ($c -eq '}') {
                $braceLevel--
                if ($braceLevel -lt 0) {
                    Write-Host "NEGATIVE BRACE at line $($i+1): $line"
                }
            }
        }
    }
}

Write-Host "Final Brace Level: $braceLevel"
