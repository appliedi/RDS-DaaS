
      $TimeoutSeconds = 15;
      $MaxJobCount = 5;
      $where = @{$false = " WHERE CollectionAlias = '${CollectionAlias}'";$true = ""}[[String]::IsNullOrEmpty($CollectionAlias)]
$h_query = "SELECT * FROM Win32_RDSHServer${where}";$s_query = "SELECT * FROM Win32_SessionDirectorySessionEx${where}";$Script:jobdata = @{}
$states = @("STATE_ACTIVE","STATE_DRAIN","STATE_ONLINE","STATE_UNASSIGNED")
function ProcessJobs {
    Get-Job -State Completed | ForEach-Object {$d = $Script:jobdata[$_.Id]
        Add-Member -InputObject $d -MemberType NoteProperty -Name Status -PassThru -Value $states[$d.Stat]
        $_ | Remove-Job -Force}
    Get-Job | Where-Object {((Get-Date) - $_.PSBeginTime).TotalSeconds -gt $TimeoutSeconds} | ForEach-Object {$d = $Script:jobdata[$_.Id]
        Add-Member -InputObject $d -MemberType NoteProperty -Name Status -PassThru -Value "STATE_OFFLINE"
        $_ | Remove-Job -Force}}
$user_sessions = [System.Object[]](Get-WmiObject -ComputerName $ConnectionBroker -Authentication PacketPrivacy -Query $s_query)

Get-WmiObject -Namespace "root\cimv2\rdms" -Query $h_query -ComputerName $ConnectionBroker -Authentication PacketPrivacy | ForEach-Object {
    $start_job = $true
    while ($start_job){ProcessJobs;if (([object[]](Get-Job)).Count -lt $MaxJobCount){
        $newjob = Invoke-Command -AsJob -ComputerName $_.Name -ScriptBlock {$True}
        #Added for displying OS Name --Viswa
        $d = [PSCustomObject] @{Collection=$_.CollectionAlias;Name=$_.Name;Sessions=([object[]]($user_sessions|Where-Object HostServer -IEQ $_.Name)).Count;Type=([Object[]](Get-CimInstance Win32_OperatingSystem -ComputerName $_.Name).caption)}
        if ([String]::IsNullOrEmpty($_.CollectionAlias)){Add-Member -InputObject $d -MemberType NoteProperty -Name Stat -Value 3}else{
            switch ([int]$_.GetInt32Property("DrainMode").Value){
                0 {Add-Member -InputObject $d -MemberType NoteProperty -Name Stat -Value 0;break;}#Yes
                1 {Add-Member -InputObject $d -MemberType NoteProperty -Name Stat -Value 1;break;}#NotUntilReboot
                2 {Add-Member -InputObject $d -MemberType NoteProperty -Name Stat -Value 1;break;}#No
                default {Add-Member -InputObject $d -MemberType NoteProperty -Name Stat -Value 2;break;}}}
        $Script:jobdata[$newjob.Id] = $d;$start_job = $false}}}
while (([object[]](Get-Job)).Count -gt 0) {ProcessJobs}
