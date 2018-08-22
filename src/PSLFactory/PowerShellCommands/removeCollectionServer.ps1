$ServerList = $SessionHost.Split(",")
Remove-RDSessionHost -ConnectionBroker $ConnectionBroker -SessionHost $ServerList -Force