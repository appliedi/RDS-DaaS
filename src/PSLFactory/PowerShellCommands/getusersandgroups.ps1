$collectiondetails = Get-RDSessionCollectionConfiguration -CollectionName $CollectionName -ConnectionBroker $ConnectionBroker -UserGroup
$array = $collectiondetails.UserGroup
#$v =$str.split('\',2)
$users =@()
foreach ($splt in $array)
{
$xyz=$splt.Split('\')
$users+=($xyz[1])
}    

foreach($user in $users){

    #Try getting the user
    $ADUser = Get-ADUser -Filter {SamAccountName -eq $User}
    #Test to see if the user exists
    If($ADUser)
    {
        
        $name = $ADUser.GivenName
        $type = $aduser.ObjectClass
        $count = 1 
       # write-host "$username-$user-$u"
        [PSCustomObject] @{
        "ConnectionBroker"=$ConnectionBroker;
        "CollectionName"=$CollectionName;
        "Name"=$env:USERDOMAIN+"\"+$name;
        "Type"=$type;
        "Count"=$count;
        }
        
    }
   else
   {
    $adgroup =Get-ADGroup -Filter {samaccountname -eq $user}
   if($adgroup)
    {
       
      $name = $adgroup.name 
      $type = $adgroup.ObjectClass
      $count = (Get-ADGroupMember $adgroup.objectguid).count
        if(!$count)
           {
             $count=1
            }
     # write-host "$groupname-$group-$count"
      [PSCustomObject] @{
        "ConnectionBroker"=$ConnectionBroker;
        "CollectionName"=$CollectionName;
        "Name"=$env:USERDOMAIN+"\"+$name;;
        "Type"=$type;
        "Count"=$count;
        }
    }
  }
}