param(
    [string]$MirrorRoot = "..\amazonselfebookpublishers.com",
    [string]$PublicRoot = ".\public",
    [string]$SourceOrigin = $env:ASSET_SOURCE_ORIGIN
)

$ErrorActionPreference = "Stop"
if ([string]::IsNullOrWhiteSpace($SourceOrigin)) {
    throw "Set ASSET_SOURCE_ORIGIN to the authorized asset source before running recovery."
}
$baseUrl = $SourceOrigin.TrimEnd('/') + '/'
$mirror = (Resolve-Path -LiteralPath $MirrorRoot).Path
$public = [IO.Path]::GetFullPath((Join-Path (Get-Location) $PublicRoot))
$assetTarget = Join-Path $public "assets"

New-Item -ItemType Directory -Path $public -Force | Out-Null
New-Item -ItemType Directory -Path $assetTarget -Force | Out-Null
Copy-Item -Path (Join-Path $mirror "assets\*") -Destination $assetTarget -Recurse -Force
Copy-Item -LiteralPath (Join-Path $mirror "loader.gif") -Destination (Join-Path $public "loader.gif") -Force

$cssTarget = Join-Path $assetTarget "css\style.css"
& curl.exe -sS -L --fail --retry 3 --max-time 60 --output $cssTarget ($baseUrl + "assets/css/style.css")
if ($LASTEXITCODE -ne 0) {
    throw "Unable to download the live stylesheet."
}

$references = [System.Collections.Generic.HashSet[string]]::new([System.StringComparer]::OrdinalIgnoreCase)
$sourceFiles = @(
    Get-ChildItem -LiteralPath $mirror -File -Filter "*.html"
    Get-ChildItem -LiteralPath (Join-Path $mirror "assets\js") -File -Filter "*.js"
    Get-Item -LiteralPath $cssTarget
)

foreach ($sourceFile in $sourceFiles) {
    $text = Get-Content -LiteralPath $sourceFile.FullName -Raw
    if ([string]::IsNullOrWhiteSpace($text)) { continue }

    foreach ($match in [regex]::Matches($text, '(?:src|href|data-imgurl)\s*=\s*["'']([^"'']+)["'']', 'IgnoreCase')) {
        $value = [Net.WebUtility]::HtmlDecode($match.Groups[1].Value)
        if ($value -match '^(?:/)?(?:assets/|loader\.gif)') {
            $clean = ($value -split '[?#]')[0].TrimStart('/')
            if ($clean -notmatch '\.html$') { [void]$references.Add($clean) }
        }
    }

    if ($sourceFile.FullName -eq $cssTarget) {
        foreach ($match in [regex]::Matches($text, 'url\(\s*["'']?([^\)"'']+)', 'IgnoreCase')) {
            $value = ($match.Groups[1].Value -split '[?#]')[0]
            if ($value -match '^\.\./') {
                $clean = "assets/" + ($value -replace '^\.\./', '')
                [void]$references.Add($clean)
            } elseif ($value -match '^/assets/') {
                [void]$references.Add($value.TrimStart('/'))
            }
        }
    }
}

$downloaded = 0
$failed = [System.Collections.Generic.List[string]]::new()

foreach ($reference in ($references | Sort-Object)) {
    $relativePath = $reference -replace '/', [IO.Path]::DirectorySeparatorChar
    $destination = Join-Path $public $relativePath
    if ((Test-Path -LiteralPath $destination -PathType Leaf) -and (Get-Item -LiteralPath $destination).Length -gt 0) {
        continue
    }

    New-Item -ItemType Directory -Path (Split-Path -Parent $destination) -Force | Out-Null
    $encodedReference = ($reference -split '/' | ForEach-Object { [Uri]::EscapeDataString($_) }) -join '/'
    & curl.exe -sS -L --fail --retry 4 --retry-delay 1 --max-time 60 --output $destination ($baseUrl + $encodedReference)
    if ($LASTEXITCODE -eq 0 -and (Test-Path -LiteralPath $destination) -and (Get-Item -LiteralPath $destination).Length -gt 0) {
        $downloaded++
    } else {
        if (Test-Path -LiteralPath $destination) { Remove-Item -LiteralPath $destination -Force }
        $failed.Add($reference)
    }
}

Write-Output "Asset references discovered: $($references.Count)"
Write-Output "Assets downloaded: $downloaded"
Write-Output "Assets still unavailable: $($failed.Count)"
$failed | ForEach-Object { Write-Output "FAILED $_" }
