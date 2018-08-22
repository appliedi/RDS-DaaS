#$FileServer = "\\UPD-VM\D"
$Result=Test-Path -Path $FileServer
if($Result)
{
[PSCustomObject]@{
'Message'="Success"
}
}
else
{
[PSCustomObject]@{
'Message'="Fail"
}
}
