$fullArray = $UserGroup.Split(",")
Set-RDRemoteApp -ConnectionBroker $ConnectionBroker -CollectionName $CollectionName -Alias $Alias -UserGroups $fullArray