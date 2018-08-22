#Additional values
if ($EndADisconnectedSession){$break_action = "Logoff"}else{$break_action = "Disconnect"}
$auto_reconnect = $true
$encrypt_level = "High"
$relative_weight = 50
$lba = Get-RDSessionHost -CollectionName $CollectionName -ConnectionBroker $ConnectionBroker | ForEach-Object {New-Object Microsoft.RemoteDesktopServices.Management.RDSessionHostCollectionLoadBalancingInstance -ArgumentList $CollectionName,$relative_weight,$LoadBalancingConcurrentSessionsPerServer,$_.SessionHost}

#Commit settings
Set-RDSessionCollectionConfiguration –ActiveSessionLimitMin $ActiveSessionLmit -AutomaticReconnectionEnabled (-not $EndSession) –BrokenConnectionAction $break_action –ConnectionBroker $ConnectionBroker –CollectionName $CollectionName -DisconnectedSessionLimitMin $DisconnectFromSession -EncryptionLevel $encrypt_level –IdleSessionLimitMin $IdleSessionLimit -LoadBalancing $lba