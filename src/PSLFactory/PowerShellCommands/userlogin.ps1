$ErrorActionPreference = "SilentlyContinue"
 $UserName = $caUserName
 $Password = $caPassword
 # Get current domain using logged-on user's credentials
 $CurrentDomain = "LDAP://" + ([ADSI]"").distinguishedName
 $domain = New-Object System.DirectoryServices.DirectoryEntry($CurrentDomain,$UserName,$Password)

if ($domain.name -eq $null)
{
 write-host "Authentication failed - please verify your username and password."
[PSCustomObject] @{"Status"="fail";}
}
else
{

 write-host "Successfully authenticated with domain $domain.name"

 $deploymentcheck=Get-ADGroupMember 'DeploymentAdmins' -Server $UserName.Split('\')[0]  |Where-Object { $_.objectClass -eq 'user' } |
 Get-ADUser -Properties SamAccountName |Where-Object { $_.SamAccountName -eq $UserName.Split('\')[1]} | select Name

 $tenantcheck=Get-ADGroupMember 'CollectionAdmins' -Server $UserName.Split('\')[0] |Where-Object { $_.objectClass -eq 'user' } |
 Get-ADUser -Properties SamAccountName |Where-Object { $_.SamAccountName -eq $UserName.Split('\')[1]} | select Name

 if($tenantcheck.Name)
 {
 $dmn = $UserName.Split("\")[0]
#$dmn1 = $env:USERDOMAIN
$cname = Get-ADComputer -Filter 'ObjectClass -eq "Computer"' -Server $dmn | Select -Expand DNSHostName
#Import-Module Remotedesktop

foreach($cbname in $cname)
{
 $cbroker = Get-RDWorkspace -ConnectionBroker $cbname
 $cbrokername = $cbroker.WorkspaceID
 if($cbname -eq $cbrokername)
 {
 [PSCustomObject]@{
 "ConnectionBroker"=$cbroker.WorkspaceID;
 "Status"="CollectionAdmin";
 }
 break
 }
}
 }
 elseif ($deploymentcheck.Name)
 {
 [PSCustomObject] @{"Status"="DeploymentAdmin";}
 }
 else
 {
 [PSCustomObject] @{"Status"="fail";} 
 }
}