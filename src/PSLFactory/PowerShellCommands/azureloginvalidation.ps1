#Declare Variables
Set-ExecutionPolicy RemoteSigned -Force
Import-Module -Name AzureRM.Profile -Force
$pass = ConvertTo-SecureString $Apassword -AsPlainText –Force
$cred = New-Object -TypeName System.Management.Automation.PSCredential -ArgumentList($Auname, $pass) 
$login=Login-AzureRmAccount -Credential $cred -SubscriptionId $subid -ErrorVariable myerror -ErrorAction SilentlyContinue

if($login)
{
   $rg=AzureRmResourceGroup -Name $ResourceGroupPassed -ErrorVariable myerror_rg -ErrorAction SilentlyContinue
   
   if($rg)
   {
      [PSCustomObject]@{
        "message" = "Success"
        }
       
   }
   else
   
   {
   $err=$myerror_rg[0].Exception.Message | out-string
   [PSCustomObject]@{
    "message" = "$err"
    }
   
   }
   
}
else
{
   $err1=$myerror[0].Exception.Message | out-string
    [PSCustomObject]@{
    "message" = "$err1"
    }
}

