$sname = $RDSConnectionBroker.split(".")
$servername = $sname[1]+"."+$sname[2]
$pwd = ConvertTo-SecureString $CollectionAdminPassword -AsPlainText -Force
New-ADUser -Name $CollectionAdminUsername -GivenName $CollectionAdminUsername -AccountPassword $pwd -UserPrincipalName (“{0}@{1}” -f "$CollectionAdminUsername",$servername) -Server $servername -Enabled $true
Get-ADGroup -Identity "CollectionAdmins" -Server $servername 
if($?)
{
Add-ADGroupMember -Identity "CollectionAdmins" $CollectionAdminUsername -Server $servername
}
else
{
New-ADGroup -Name "CollectionAdmins" -GroupScope Global -Server $servername
Add-ADGroupMember -Identity "CollectionAdmins" $CollectionAdminUsername -Server $servername
}