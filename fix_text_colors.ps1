$files = Get-ChildItem -Path "src\app\admin","src\app\vendedor" -Recurse -Filter "*.tsx"
foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw -Encoding UTF8
    $modified = $content
    $modified = $modified -replace 'text-3xl font-bold text-white', 'text-2xl font-bold text-gray-900'
    $modified = $modified -replace 'text-2xl font-bold text-white', 'text-2xl font-bold text-gray-900'
    $modified = $modified -replace 'text-xl font-semibold text-white', 'text-xl font-semibold text-gray-900'
    $modified = $modified -replace '"text-xl font-semibold text-white mb-2"', '"text-xl font-semibold text-gray-900 mb-2"'
    $modified = $modified -replace '"text-gray-400 mt-1"', '"text-gray-500 mt-0.5"'
    if ($modified -ne $content) {
        Set-Content $file.FullName $modified -Encoding UTF8 -NoNewline
        Write-Host "Fixed: $($file.FullName)"
    }
}
Write-Host "Done"
