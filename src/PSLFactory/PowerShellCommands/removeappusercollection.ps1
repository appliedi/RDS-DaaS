$data = Get-RDRemoteApp -ConnectionBroker $ConnectionBroker -CollectionName $CollectionName -Alias $Alias
$data1 = $data.UserGroups | select -Unique
$fullArray = (New-Object System.Collections.ArrayList(, $data1))
$fullArray.Remove($UserGroup)
Set-RDRemoteApp -ConnectionBroker $ConnectionBroker -CollectionName $CollectionName -Alias $Alias -UserGroups $fullArray