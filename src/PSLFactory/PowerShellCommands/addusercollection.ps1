$UserGroupArray = $UserGroup.Split(",")
$UserGroupArray=$UserGroupArray | %{$_.ToLower()} | select -Unique
$Existingusers = Get-RDSessionCollectionConfiguration -ConnectionBroker $ConnectionBroker -CollectionName $CollectionName -UserGroup
$ExtUniqUsers = $Existingusers.UserGroup 
$usercount=$ExtUniqUsers.Count
$ExtUniqUsers=$ExtUniqUsers | %{$_.ToLower()}| select -Unique
$NewUserArray="";
if($usercount -eq 1)
{
$NewUserArray = New-Object System.Collections.ArrayList
$NewUserArray.Add($ExtUniqUsers)
}
else
{
$NewUserArray = (New-Object System.Collections.ArrayList(, $ExtUniqUsers))
}
foreach($u in $UserGroupArray)
{
$NewUserArray.Add($u)
}
$NewUserArray = $NewUserArray | select -Unique
Set-RDSessionCollectionConfiguration -ConnectionBroker $ConnectionBroker -CollectionName $CollectionName -UserGroup $NewUserArray