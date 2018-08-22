$TimeoutSeconds = 15;
				  $MaxJobCount = 5;
				  function ProcessJobs
			{
				Get-Job -State Completed | ForEach-Object {
					$result = $_ | Receive-Job
        
					if ([String]::IsNullOrEmpty($result.Collection))
					{
					#Added for displying OS Name --Viswa
					   $Type=(Get-CimInstance Win32_OperatingSystem -ComputerName $result.PSComputerName).caption
					#Mofidied by Viswa to display OS Name
					  $result.Input| select server,roles, @{Label="Type"; Expression={$Type}} |  Write-Output

					}
					$_ | Remove-Job -Force
				}
				Get-Job | Where-Object {((Get-Date) - $_.PSBeginTime).TotalSeconds -gt $TimeoutSeconds} | ForEach-Object {$_ | Remove-Job -Force}}
			Get-RDServer -ConnectionBroker $ConnectionBroker -Role RDS-RD-SERVER | ForEach-Object {
				$start_job = $true
				while ($start_job)
				{
					ProcessJobs
					if (([object[]](Get-Job)).Count -lt $MaxJobCount)
					{
						Invoke-Command -AsJob -ComputerName $_.Server -ScriptBlock {
							Param($server)
							$reg = Get-ItemProperty -Path 'HKLM:\SYSTEM\CurrentControlSet\Control\Terminal Server\ClusterSettings' -Name SessionDirectoryClusterName
							[PSCustomObject] @{Collection = $reg.SessionDirectoryClusterName;Input = $server}
						} -ArgumentList $_ | Out-Null
						$start_job = $false
					}
				}
			}
			while (([object[]](Get-Job)).Count -gt 0)
			{
				ProcessJobs
			}
    