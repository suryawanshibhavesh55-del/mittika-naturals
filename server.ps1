# Lightweight PowerShell Static HTTP Server for Mittika Naturals
param(
    [int]$Port = 3000
)

$rootDir = Split-Path -Parent $MyInvocation.MyCommand.Definition
if (-not $rootDir) {
    $rootDir = Get-Location
}

$mimeTypes = @{
    ".html" = "text/html; charset=utf-8"
    ".htm"  = "text/html; charset=utf-8"
    ".css"  = "text/css; charset=utf-8"
    ".js"   = "application/javascript; charset=utf-8"
    ".json" = "application/json; charset=utf-8"
    ".png"  = "image/png"
    ".jpg"  = "image/jpeg"
    ".jpeg" = "image/jpeg"
    ".gif"  = "image/gif"
    ".svg"  = "image/svg+xml"
    ".ico"  = "image/x-icon"
    ".woff" = "font/woff"
    ".woff2"= "font/woff2"
    ".ttf"  = "font/ttf"
}

$listener = New-Object System.Net.HttpListener
$prefix = "http://localhost:$Port/"
$listener.Prefixes.Add($prefix)

try {
    $listener.Start()
    Write-Host "Mittika Naturals local server running at: $prefix"
} catch {
    Write-Error ("Failed to start server on port " + $Port + ": " + $_.Exception.Message)
    exit 1
}

while ($listener.IsListening) {
    try {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response

        $rawUrl = [System.Uri]::UnescapeDataString($request.Url.AbsolutePath)
        $cleanPath = $rawUrl.TrimStart('/')

        $targetFile = $null

        if ($cleanPath -eq "" -or $cleanPath.EndsWith("/")) {
            $candidate = Join-Path $rootDir ($cleanPath + "index.html")
            if (Test-Path $candidate -PathType Leaf) {
                $targetFile = $candidate
            }
        } else {
            $candidate = Join-Path $rootDir $cleanPath
            if (Test-Path $candidate -PathType Leaf) {
                $targetFile = $candidate
            } elseif (Test-Path $candidate -PathType Container) {
                $response.StatusCode = 301
                $response.Headers.Add("Location", "$rawUrl/")
                $response.Close()
                continue
            } else {
                $candidateHtml = $candidate + ".html"
                $candidateIdx = Join-Path $candidate "index.html"
                if (Test-Path $candidateHtml -PathType Leaf) {
                    $targetFile = $candidateHtml
                } elseif (Test-Path $candidateIdx -PathType Leaf) {
                    $targetFile = $candidateIdx
                }
            }
        }

        if ($targetFile -and (Test-Path $targetFile -PathType Leaf)) {
            $ext = [System.IO.Path]::GetExtension($targetFile).ToLower()
            $mime = if ($mimeTypes.ContainsKey($ext)) { $mimeTypes[$ext] } else { "application/octet-stream" }

            $bytes = [System.IO.File]::ReadAllBytes($targetFile)
            $response.StatusCode = 200
            $response.ContentType = $mime
            $response.ContentLength64 = $bytes.Length
            $response.OutputStream.Write($bytes, 0, $bytes.Length)
        } else {
            $notFoundHtml = "<html><body style='font-family:sans-serif;text-align:center;padding:3rem;'><h2>404 - Not Found</h2><p><a href='/'>Return to Mittika Naturals Home</a></p></body></html>"
            $bytes = [System.Text.Encoding]::UTF8.GetBytes($notFoundHtml)
            $response.StatusCode = 404
            $response.ContentType = "text/html; charset=utf-8"
            $response.ContentLength64 = $bytes.Length
            $response.OutputStream.Write($bytes, 0, $bytes.Length)
        }

        $response.Close()
    } catch {
        break
    }
}

if ($listener.IsListening) {
    $listener.Stop()
    $listener.Close()
}
