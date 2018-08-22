#$str variable value provide through API
Import-module Remotedesktop
#$strbroker = "broker.people.com"
$result = Get-RDServer -ConnectionBroker $strbroker -ErrorAction SilentlyContinue
    if($result)
    {
    [PSCustomObject]@{
    'message'="Success"
    }
    }
    else
    {
    [PSCustomObject]@{
    'message'="Fail"
    }
}