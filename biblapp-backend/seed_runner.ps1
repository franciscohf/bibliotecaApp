$ErrorActionPreference = "Stop"
$baseUrl = "http://localhost:8080"

Write-Host "=== 1. INSERTING CATEGORIAS ==="
$catContent = Get-Content -Raw -Encoding UTF8 "testdata/categoria.json" | ConvertFrom-Json
$catIds = @()
foreach ($item in $catContent) {
    $tempFile = [System.IO.Path]::GetTempFileName()
    [System.IO.File]::WriteAllText($tempFile, ($item | ConvertTo-Json -Compress), [System.Text.Encoding]::UTF8)
    $curlOut = & curl.exe -s -i -X POST "$baseUrl/v1/catego" -H "Content-Type: application/json; charset=utf-8" --data-binary "@$tempFile"
    Remove-Item $tempFile -Force
    $locLine = $curlOut | Where-Object { $_ -match "^Location:\s*(.+)$" }
    if ($locLine -match "^Location:\s*(.+)$") {
        $loc = $matches[1].Trim()
        $id = $loc.Split("/")[-1].Trim()
        $catIds += $id
        Write-Host "Created Categoria: '$($item.nombre)' -> Location: $loc (ID: $id)"
    } else {
        Write-Host "Failed to create Categoria '$($item.nombre)'. Response:"
        $curlOut | ForEach-Object { Write-Host $_ }
    }
}

Write-Host "`n=== 2. INSERTING LIBROS ==="
$libroContent = Get-Content -Raw -Encoding UTF8 "testdata/libro.json" | ConvertFrom-Json
$libroIds = @()
for ($i = 0; $i -lt $libroContent.Count; $i++) {
    $item = $libroContent[$i]
    $assignedCatId = [int]$catIds[$i % $catIds.Count]
    $item.categoria.id = $assignedCatId
    $tempFile = [System.IO.Path]::GetTempFileName()
    [System.IO.File]::WriteAllText($tempFile, ($item | ConvertTo-Json -Compress), [System.Text.Encoding]::UTF8)
    $curlOut = & curl.exe -s -i -X POST "$baseUrl/v1/libro" -H "Content-Type: application/json; charset=utf-8" --data-binary "@$tempFile"
    Remove-Item $tempFile -Force
    $locLine = $curlOut | Where-Object { $_ -match "^Location:\s*(.+)$" }
    if ($locLine -match "^Location:\s*(.+)$") {
        $loc = $matches[1].Trim()
        $id = $loc.Split("/")[-1].Trim()
        $libroIds += $id
        Write-Host "Created Libro: '$($item.titulo)' with Categoria ID: $assignedCatId -> Location: $loc (ID: $id)"
    } else {
        Write-Host "Failed to create Libro '$($item.titulo)'. Response:"
        $curlOut | ForEach-Object { Write-Host $_ }
    }
}

Write-Host "`n=== 3. INSERTING CLIENTES ==="
$clienteContent = Get-Content -Raw -Encoding UTF8 "testdata/cliente.json" | ConvertFrom-Json
$clienteIds = @()
foreach ($item in $clienteContent) {
    $tempFile = [System.IO.Path]::GetTempFileName()
    [System.IO.File]::WriteAllText($tempFile, ($item | ConvertTo-Json -Compress), [System.Text.Encoding]::UTF8)
    $curlOut = & curl.exe -s -i -X POST "$baseUrl/v1/cliente" -H "Content-Type: application/json; charset=utf-8" --data-binary "@$tempFile"
    Remove-Item $tempFile -Force
    $locLine = $curlOut | Where-Object { $_ -match "^Location:\s*(.+)$" }
    if ($locLine -match "^Location:\s*(.+)$") {
        $loc = $matches[1].Trim()
        $id = $loc.Split("/")[-1].Trim()
        $clienteIds += $id
        Write-Host "Created Cliente: '$($item.nombres) $($item.apellidos)' -> Location: $loc (ID: $id)"
    } else {
        Write-Host "Failed to create Cliente '$($item.nombres) $($item.apellidos)'. Response:"
        $curlOut | ForEach-Object { Write-Host $_ }
    }
}

Write-Host "`n=== SUMMARY ==="
Write-Host "Categorias created: $($catIds.Count) (IDs: $($catIds -join ', '))"
Write-Host "Libros created: $($libroIds.Count) (IDs: $($libroIds -join ', '))"
Write-Host "Clientes created: $($clienteIds.Count) (IDs: $($clienteIds -join ', '))"
