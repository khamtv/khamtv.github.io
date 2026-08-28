$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:8080/")
$listener.Start()
Write-Host "Server running at http://localhost:8080/"
$root = "d:\Applications\dementiadiagnosis"
$mime = @{".html"="text/html";".css"="text/css";".js"="application/javascript";".json"="application/json";".pdf"="application/pdf";".png"="image/png";".svg"="image/svg+xml"}
while($listener.IsListening){
  $ctx = $listener.GetContext()
  $url = $ctx.Request.Url.LocalPath
  if($url -eq "/") { $url = "/index.html" }
  $file = Join-Path $root $url.Replace("/","\")
  if(Test-Path $file){
    $ext = [System.IO.Path]::GetExtension($file)
    $ct = if($mime.ContainsKey($ext)){$mime[$ext]}else{"application/octet-stream"}
    $ctx.Response.ContentType = $ct
    $bytes = [System.IO.File]::ReadAllBytes($file)
    $ctx.Response.OutputStream.Write($bytes, 0, $bytes.Length)
  } else {
    $ctx.Response.StatusCode = 404
    $bytes = [System.Text.Encoding]::UTF8.GetBytes("Not found")
    $ctx.Response.OutputStream.Write($bytes, 0, $bytes.Length)
  }
  $ctx.Response.Close()
}
