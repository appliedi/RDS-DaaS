$secureKey = (33,4,2,3,56,34,254,222,1,1,2,23,42,54,33,233,1,34,2,7,6,5,35,43)
return (ConvertFrom-SecureString -SecureString $SecureString -Key $secureKey)