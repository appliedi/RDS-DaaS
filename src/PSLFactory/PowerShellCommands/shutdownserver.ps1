if ([String]::IsNullOrEmpty($newconnection)){$newconnection = 'NotUntilReboot'}
Set-RDSessionHost -SessionHost $SessionHost -NewConnectionAllowed $newconnection -ConnectionBroker $ConnectionBroker