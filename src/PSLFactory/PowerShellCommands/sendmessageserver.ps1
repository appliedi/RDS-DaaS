Get-WmiObject -Query "SELECT * FROM Win32_SessionDirectorySessionEx WHERE HostServer = '${HostServer}'" -ComputerName $ConnectionBroker -Authentication PacketPrivacy -Impersonation Impersonate | ForEach-Object -Process {
    Send-RDUserMessage -HostServer $_.HostServer -MessageTitle $MessageTitle -MessageBody $MessageBody -UnifiedSessionID $_.UnifiedSessionID
}