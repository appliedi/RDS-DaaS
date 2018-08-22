$ADGroups=Get-ADGroup -Filter 'GroupCategory -eq "Security" -and GroupScope -ne "DomainLocal"'

foreach($AdGroup in $ADGroups)
{
[PSCustomObject] @{
        "UserGroupName"=$env:USERDOMAIN+"\"+$AdGroup.SamAccountName;
        "Type"=$AdGroup.ObjectClass;
        }
}