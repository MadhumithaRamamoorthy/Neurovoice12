$f = 'C:\Users\ELCOT\Downloads\Neuronexus\frontend\js\app.js'
$lines = [System.IO.File]::ReadAllLines($f, [System.Text.Encoding]::UTF8)

# Insert the missing closing at line 1587 (index 1586)
#       </div>
#     `;
#   }

$top = $lines[0..1586]
$closing = @(
    '      </div>',
    '    `;',
    '  }',
    ''
)
$bottom = $lines[1587..($lines.Length - 1)]

$fixed = $top + $closing + $bottom
[System.IO.File]::WriteAllLines($f, $fixed, [System.Text.Encoding]::UTF8)
Write-Host "Inserted renderArenaView closure successfully!"
