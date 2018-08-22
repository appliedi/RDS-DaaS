$data = Get-RDSessionCollectionConfiguration -ConnectionBroker $ConnectionBroker -CollectionName $CollectionName -UserGroup
$UserGroups = $UserGroupsStr.Split(",")
$fullArray = [object[]]($data.UserGroup) +$UserGroups
Set-RDSessionCollectionConfiguration -ConnectionBroker $ConnectionBroker -CollectionName $CollectionName -UserGroup $fullArray