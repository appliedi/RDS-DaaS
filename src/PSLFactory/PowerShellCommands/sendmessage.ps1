$where = @('CollectionAlias','DomainName','HostServer','UserName','UnifiedSessionID') | ForEach-Object -Process {
        $val = Get-Variable -Name $_ -ValueOnly
        if (-Not [String]::IsNullOrEmpty($val)){"${_} = '${val}'"}}
if ($where)
{
    $query = "SELECT * FROM Win32_SessionDirectorySessionEx WHERE $([String]::Join(" AND ",$where))"
}
else
{
    $query = "SELECT * FROM Win32_SessionDirectorySessionEx"
}
Get-WmiObject -Query $query -ComputerName $ConnectionBroker -Authentication PacketPrivacy -Impersonation Impersonate | ForEach-Object -Process {
    Send-RDUserMessage -HostServer $_.HostServer -MessageTitle $MessageTitle -MessageBody $MessageBody -UnifiedSessionID $_.UnifiedSessionID
}