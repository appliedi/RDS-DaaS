﻿//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated by a tool.
//     Runtime Version:4.0.30319.42000
//
//     Changes to this file may cause incorrect behavior and will be lost if
//     the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace RDSManagerAPI {
    using System;
    
    
    /// <summary>
    ///   A strongly-typed resource class, for looking up localized strings, etc.
    /// </summary>
    // This class was auto-generated by the StronglyTypedResourceBuilder
    // class via a tool like ResGen or Visual Studio.
    // To add or remove a member, edit your .ResX file then rerun ResGen
    // with the /str option, or rebuild your VS project.
    [global::System.CodeDom.Compiler.GeneratedCodeAttribute("System.Resources.Tools.StronglyTypedResourceBuilder", "4.0.0.0")]
    [global::System.Diagnostics.DebuggerNonUserCodeAttribute()]
    [global::System.Runtime.CompilerServices.CompilerGeneratedAttribute()]
    internal class AdminCommandResource {
        
        private static global::System.Resources.ResourceManager resourceMan;
        
        private static global::System.Globalization.CultureInfo resourceCulture;
        
        [global::System.Diagnostics.CodeAnalysis.SuppressMessageAttribute("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode")]
        internal AdminCommandResource() {
        }
        
        /// <summary>
        ///   Returns the cached ResourceManager instance used by this class.
        /// </summary>
        [global::System.ComponentModel.EditorBrowsableAttribute(global::System.ComponentModel.EditorBrowsableState.Advanced)]
        internal static global::System.Resources.ResourceManager ResourceManager {
            get {
                if (object.ReferenceEquals(resourceMan, null)) {
                    global::System.Resources.ResourceManager temp = new global::System.Resources.ResourceManager("RDSManagerAPI.AdminCommandResource", typeof(AdminCommandResource).Assembly);
                    resourceMan = temp;
                }
                return resourceMan;
            }
        }
        
        /// <summary>
        ///   Overrides the current thread's CurrentUICulture property for all
        ///   resource lookups using this strongly typed resource class.
        /// </summary>
        [global::System.ComponentModel.EditorBrowsableAttribute(global::System.ComponentModel.EditorBrowsableState.Advanced)]
        internal static global::System.Globalization.CultureInfo Culture {
            get {
                return resourceCulture;
            }
            set {
                resourceCulture = value;
            }
        }
        
        /// <summary>
        ///   Looks up a localized string similar to $ServerList = $SessionHost.Split(&quot;,&quot;)
        ///Add-RDSessionHost -CollectionName $CollectionName -SessionHost $ServerList  -ConnectionBroker $ConnectionBroker.
        /// </summary>
        internal static string addCollectionServer {
            get {
                return ResourceManager.GetString("addCollectionServer", resourceCulture);
            }
        }

        /// <summary>
        ///   Looks up a localized string similar to $ServerList = $SessionHost.Split(&quot;,&quot;)
        ///Add-RDSessionHost -CollectionName $CollectionName -SessionHost $ServerList  -ConnectionBroker $ConnectionBroker.
        /// </summary>
        internal static string addCollectionAdmin
        {
            get
            {
                return ResourceManager.GetString("addCollectionAdmin", resourceCulture);
            }
        }


        /// <summary>
        ///   Looks up a localized string similar to Add-RDServer -Server $Server -ConnectionBroker $ConnectionBroker -Role &quot;RDS-RD-SERVER&quot;.
        /// </summary>
        internal static string addserver {
            get {
                return ResourceManager.GetString("addserver", resourceCulture);
            }
        }
        
        /// <summary>
        ///   Looks up a localized string similar to Set-RDSessionCollectionConfiguration -CollectionName $CollectionName -ConnectionBroker $ConnectionBroker  -DisableUserProfileDisk.
        /// </summary>
        internal static string disableUserProfileDisk {
            get {
                return ResourceManager.GetString("disableUserProfileDisk", resourceCulture);
            }
        }
        
        /// <summary>
        ///   Looks up a localized string similar to Set-RDSessionCollectionConfiguration -CollectionName $CollectionName -CollectionDescription $CollectionDescription -ConnectionBroker $ConnectionBroker.
        /// </summary>
        internal static string editCollectionDescription {
            get {
                return ResourceManager.GetString("editCollectionDescription", resourceCulture);
            }
        }
        
        /// <summary>
        ///   Looks up a localized string similar to Set-RDSessionCollectionConfiguration -CollectionName $CollectionName -ConnectionBroker $ConnectionBroker  -EnableUserProfileDisk -DiskPath $DiskPath -MaxUserProfileDiskSizeGB $MaxUserProfileDiskSizeGB.
        /// </summary>
        internal static string enableUserProfileDisk {
            get {
                return ResourceManager.GetString("enableUserProfileDisk", resourceCulture);
            }
        }
        
        /// <summary>
        ///   Looks up a localized string similar to $secureKey = (33,4,2,3,56,34,254,222,1,1,2,23,42,54,33,233,1,34,2,7,6,5,35,43)
        ///return (ConvertFrom-SecureString -SecureString $SecureString -Key $secureKey).
        /// </summary>
        internal static string encryptString {
            get {
                return ResourceManager.GetString("encryptString", resourceCulture);
            }
        }
        
        /// <summary>
        ///   Looks up a localized string similar to $secureKey = ConvertTo-SecureString -String $String
        ///return (ConvertFrom-SecureString -SecureString $SecureString -SecureKey $secureKey).
        /// </summary>
        internal static string encryptString_original {
            get {
                return ResourceManager.GetString("encryptString_original", resourceCulture);
            }
        }
        
        /// <summary>
        ///   Looks up a localized string similar to $TimeoutSeconds = 15;
        ///				  $MaxJobCount = 5;
        ///				  function ProcessJobs
        ///			{
        ///				Get-Job -State Completed | ForEach-Object {
        ///					$result = $_ | Receive-Job
        ///        
        ///					if ([String]::IsNullOrEmpty($result.Collection))
        ///					{
        ///					#Added for displying OS Name --Viswa
        ///					   $Type=(Get-CimInstance Win32_OperatingSystem -ComputerName $result.PSComputerName).caption
        ///					#Mofidied by Viswa to display OS Name
        ///					  $result.Input| select server,roles, @{Label=&quot;Type&quot;; Expression={$Type}} |  Write- [rest of string was truncated]&quot;;.
        /// </summary>
        internal static string getAvailableServers {
            get {
                return ResourceManager.GetString("getAvailableServers", resourceCulture);
            }
        }
        
        /// <summary>
        ///   Looks up a localized string similar to Get-RDSessionCollectionConfiguration -CollectionName $CollectionName -ConnectionBroker $ConnectionBroker -Client.
        /// </summary>
        internal static string getClientRediretionSettings {
            get {
                return ResourceManager.GetString("getClientRediretionSettings", resourceCulture);
            }
        }
        
        /// <summary>
        ///   Looks up a localized string similar to Get-RDSessionCollection -ConnectionBroker $ConnectionBroker -CollectionName $CollectionName.
        /// </summary>
        internal static string getCollection {
            get {
                return ResourceManager.GetString("getCollection", resourceCulture);
            }
        }
        
        /// <summary>
        ///   Looks up a localized string similar to $TimeoutSeconds = 15;
        ///    $MaxJobCount = 5;
        ///    $Script:jobdata = @{}
        ///$states = @(&quot;STATE_ACTIVE&quot;,&quot;STATE_DRAIN&quot;,&quot;STATE_ONLINE&quot;,&quot;STATE_UNASSIGNED&quot;)
        ///function ProcessJobs {
        ///    Get-Job -State Completed | ForEach-Object {$d = $Script:jobdata[$_.Id]
        ///        Add-Member -InputObject $d -MemberType NoteProperty -Name Status -PassThru -Value $states[$d.Stat]
        ///        $_ | Remove-Job -Force}
        ///    Get-Job | Where-Object {((Get-Date) - $_.PSBeginTime).TotalSeconds -gt $TimeoutSeconds} | ForEach-Object {$d = $Scrip [rest of string was truncated]&quot;;.
        /// </summary>
        internal static string getSessionHostServerStatus {
            get {
                return ResourceManager.GetString("getSessionHostServerStatus", resourceCulture);
            }
        }
        
        /// <summary>
        ///   Looks up a localized string similar to Get-RDSessionCollectionConfiguration -CollectionName $CollectionName -ConnectionBroker $ConnectionBroker -UserProfileDisk.
        /// </summary>
        internal static string getUserProfileDiskSettings {
            get {
                return ResourceManager.GetString("getUserProfileDiskSettings", resourceCulture);
            }
        }
        
        /// <summary>
        ///   Looks up a localized string similar to New-RDSessionCollection -CollectionName $CollectionName -SessionHost $SessionHost -CollectionDescription $CollectionDescription -ConnectionBroker $ConnectionBroker.
        /// </summary>
        internal static string newCollection {
            get {
                return ResourceManager.GetString("newCollection", resourceCulture);
            }
        }
        
        /// <summary>
        ///   Looks up a localized string similar to Remove-RDSessionCollection -CollectionName $CollectionName -ConnectionBroker $ConnectionBroker -Force.
        /// </summary>
        internal static string removeCollection {
            get {
                return ResourceManager.GetString("removeCollection", resourceCulture);
            }
        }
        
        /// <summary>
        ///   Looks up a localized string similar to $ServerList = $SessionHost.Split(&quot;,&quot;)
        ///Remove-RDSessionHost -ConnectionBroker $ConnectionBroker -SessionHost $ServerList -Force.
        /// </summary>
        internal static string removeCollectionServer {
            get {
                return ResourceManager.GetString("removeCollectionServer", resourceCulture);
            }
        }
        
        /// <summary>
        ///   Looks up a localized string similar to Remove-RDServer -Server $Server -ConnectionBroker $ConnectionBroker -Role &quot;RDS-RD-SERVER&quot; -Force.
        /// </summary>
        internal static string removeserver {
            get {
                return ResourceManager.GetString("removeserver", resourceCulture);
            }
        }
        
        /// <summary>
        ///   Looks up a localized string similar to Set-RDSessionCollectionConfiguration -CollectionName $CollectionName -ConnectionBroker $ConnectionBroker -ClientDeviceRedirectionOptions $ClientDeviceRedirectionOptions -ClientPrinterRedirected $ClientPrinterRedirected -ClientPrinterAsDefault $ClientPrinterAsDefault -RDEasyPrintDriverEnabled $RDEasyPrintDriverEnabled -MaxRedirectedMonitors $MaxRedirectedMonitors.
        /// </summary>
        internal static string setClientRedirectionSettings {
            get {
                return ResourceManager.GetString("setClientRedirectionSettings", resourceCulture);
            }
        }
        
        /// <summary>
        ///   Looks up a localized string similar to Set-RDSessionHost -SessionHost $SessionHost -NewConnectionAllowed &quot;No&quot; -ConnectionBroker $ConnectionBroker.
        /// </summary>
        internal static string shutdownserver {
            get {
                return ResourceManager.GetString("shutdownserver", resourceCulture);
            }
        }
        
        /// <summary>
        ///   Looks up a localized string similar to Set-RDSessionHost -SessionHost $SessionHost -NewConnectionAllowed &quot;Yes&quot; -ConnectionBroker $ConnectionBroker.
        /// </summary>
        internal static string startserver {
            get {
                return ResourceManager.GetString("startserver", resourceCulture);
            }
        }
    }
}