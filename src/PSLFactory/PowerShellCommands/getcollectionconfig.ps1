#Input: $CollectionName,$ConnectionBroker
$collection = Get-WmiObject -Namespace "root\cimv2\rdms" -Query "SELECT * FROM Win32_RDSHCollection WHERE Name='${CollectionName}'" -ComputerName $ConnectionBroker -Authentication PacketPrivacy -ErrorAction Stop
$shost = [Object[]](Get-WmiObject -Namespace "root\cimv2\rdms" -Query "SELECT * FROM Win32_RDSHServer WHERE CollectionAlias='$($collection.Alias)'" -ComputerName $ConnectionBroker -Authentication PacketPrivacy)
[PSCustomObject] @{
    "CollectionName" = $collection.Name;
    "DisconnectedSessionLimitMin" = ($collection.GetInt32Property("DisconnectedSessionLimit").Value / 60000);
    "BrokenConnectionAction" = [Microsoft.RemoteDesktopServices.Management.RDBrokenConnectionAction]$collection.GetInt32Property("BrokenConnectionAction").Value;
    "TemporaryFoldersDeletedOnExit" = [System.Boolean]$collection.GetInt32Property("DeleteTempFoldersOnExit").Value;
    "AutomaticReconnectionEnabled" = [System.Boolean]$collection.GetInt32Property("EnableAutomaticReconnection").Value;
    "ActiveSessionLimitMin" = $collection.GetInt32Property("ActiveSessionLimit").Value / 60000;
    "IdleSessionLimitMin" = $collection.GetInt32Property("IdleSessionLimit").Value / 60000}
if ($shost.Count -gt 0) {[PSCustomObject] @{
        "CollectionName" = $collection.Name;
        "RelativeWeight" = $shost[0].GetInt32Property("RelativeWeight").Value;
        "SessionLimit" = $shost[0].GetInt32Property("SessionLimit").Value;
        "SessionHost" = $shost[0].Name}}
else {[PSCustomObject] @{
        "CollectionName" = $collection.Name;
        "RelativeWeight" = 0;
        "SessionLimit" = 0;
        "SessionHost" = ""}} 
