$apps = Get-RDAvailableApp -CollectionName $CollectionName -ConnectionBroker $ConnectionBroker
$wp = $apps | Where-Object {$_.DisplayName -eq $DisplayName}
$wp | New-RDRemoteApp -ConnectionBroker $ConnectionBroker -CollectionName $CollectionName