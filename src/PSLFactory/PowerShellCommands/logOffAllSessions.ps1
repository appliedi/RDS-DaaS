$disconnect = Get-RDUserSession -ConnectionBroker $ConnectionBroker -CollectionName $CollectionName
$disconnect | ForEach-Object {$_ | Invoke-RDUserLogoff -Force}