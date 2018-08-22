$ServerList = $SessionHost.Split(",")
Add-RDSessionHost -CollectionName $CollectionName -SessionHost $ServerList  -ConnectionBroker $ConnectionBroker