Import-Module AzureRM.Profile,AzureRM.Resources
$encyPass="{password}"
$azureuser="{username}"
$secureKey = (33,4,2,3,56,34,254,222,1,1,2,23,42,54,33,233,1,34,2,7,6,5,35,43)
$securepass= ConvertTo-SecureString -String $encyPass -Key $secureKey 

$MyCredential= New-Object -TypeName System.Management.Automation.PSCredential -ArgumentList($azureuser, $securepass)
Login-AzureRmAccount -Credential $MyCredential
Get-AzureRmResourceGroup {resourcegroupname}