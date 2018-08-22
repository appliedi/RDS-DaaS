$secureKey = ConvertTo-SecureString -String $String
return (ConvertFrom-SecureString -SecureString $SecureString -SecureKey $secureKey)