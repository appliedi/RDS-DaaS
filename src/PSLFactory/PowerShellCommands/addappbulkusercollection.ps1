$data = Get-RDRemoteApp -ConnectionBroker $ConnectionBroker -CollectionName $CollectionName -Alias $Alias
$UserGroups = $UserGroupsStr.Split(",")
$fullArray = [object[]]($data.UserGroup) +$UserGroups
Set-RDRemoteApp -ConnectionBroker $ConnectionBroker -CollectionName $CollectionName -Alias $Alias -UserGroups $fullArray