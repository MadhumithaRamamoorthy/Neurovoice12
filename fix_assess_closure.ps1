$f = 'C:\Users\ELCOT\Downloads\Neuronexus\frontend\js\app.js'
$lines = [System.IO.File]::ReadAllLines($f, [System.Text.Encoding]::UTF8)

# Insert the missing closing at line 734 (index 733)
#       </div>
#     `;
#   }

$top = $lines[0..733]
$closing = @(
    '      </div>',
    '    `;',
    '  }',
    ''
)
$bottom = $lines[734..($lines.Length - 1)]

$fixed = $top + $closing + $bottom
[System.IO.File]::WriteAllLines($f, $fixed, [System.Text.Encoding]::UTF8)
Write-Host "Inserted renderAssessQuizUI closure successfully!"
