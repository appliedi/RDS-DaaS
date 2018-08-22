$disconnect = Get-RDUserSession -ConnectionBroker $ConnectionBroker -CollectionName $CollectionName
$disconnect | ForEach-Object {$_ | Disconnect-RDUser -Force}