﻿//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated by a tool.
//     Runtime Version:4.0.30319.42000
//
//     Changes to this file may cause incorrect behavior and will be lost if
//     the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace RDSManagerAPI
{
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
    internal class CommandResource {
        
        private static global::System.Resources.ResourceManager resourceMan;
        
        private static global::System.Globalization.CultureInfo resourceCulture;
        
        [global::System.Diagnostics.CodeAnalysis.SuppressMessageAttribute("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode")]
        internal CommandResource() {
        }
        
        /// <summary>
        ///   Returns the cached ResourceManager instance used by this class.
        /// </summary>
        [global::System.ComponentModel.EditorBrowsableAttribute(global::System.ComponentModel.EditorBrowsableState.Advanced)]
        internal static global::System.Resources.ResourceManager ResourceManager {
            get {
                if (object.ReferenceEquals(resourceMan, null)) {
                    global::System.Resources.ResourceManager temp = new global::System.Resources.ResourceManager("RDSManagerAPI.CommandResource", typeof(CommandResource).Assembly);
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
        ///   Looks up a localized string similar to $data = Get-RDRemoteApp -ConnectionBroker $ConnectionBroker -CollectionName $CollectionName -Alias $Alias
        ///$UserGroups = $UserGroupsStr.Split(&quot;,&quot;)
        ///$fullArray = [object[]]($data.UserGroup) +$UserGroups
        ///Set-RDRemoteApp -ConnectionBroker $ConnectionBroker -CollectionName $CollectionName -Alias $Alias -UserGroups $fullArray.
        /// </summary>
        internal static string addappbulkusercollection {
            get {
                return ResourceManager.GetString("addappbulkusercollection", resourceCulture);
            }
        }

        /// <summary>
        ///   Looks up a localized string similar to $data = Get-RDRemoteApp -ConnectionBroker $ConnectionBroker -CollectionName $CollectionName -Alias $Alias
        ///$UserGroups = $UserGroupsStr.Split(&quot;,&quot;)
        ///$fullArray = [object[]]($data.UserGroup) +$UserGroups
        ///Set-RDRemoteApp -ConnectionBroker $ConnectionBroker -CollectionName $CollectionName -Alias $Alias -UserGroups $fullArray.
        /// </summary>
        internal static string userlogin
        {
            get
            {
                return ResourceManager.GetString("userlogin", resourceCulture);
            }
        }

        /// <summary>
        ///   Looks up a localized string similar to $apps = Get-RDAvailableApp -CollectionName $CollectionName -ConnectionBroker $ConnectionBroker
        ///$wp = $apps | Where-Object {$_.DisplayName -eq $DisplayName}
        ///$wp | New-RDRemoteApp -ConnectionBroker $ConnectionBroker -CollectionName $CollectionName.
        /// </summary>
        internal static string addappcollection {
            get {
                return ResourceManager.GetString("addappcollection", resourceCulture);
            }
        }

        //Added By shiva to get Collection users and groups
        internal static string getusersandgroups
        {
            get
            {
                return ResourceManager.GetString("getusersandgroups", resourceCulture);
            }
        }
        //end
        //Added to get user Groups
        internal static string getusergroups
        {
            get
            {
                return ResourceManager.GetString("getusergroups", resourceCulture);
            }
        }
        //end
        /// <summary>
        ///   Looks up a localized string similar to $fullArray = $UserGroup.Split(&quot;,&quot;)
        ///Set-RDRemoteApp -ConnectionBroker $ConnectionBroker -CollectionName $CollectionName -Alias $Alias -UserGroups $fullArray.
        /// </summary>
        internal static string addappusercollection {
            get {
                return ResourceManager.GetString("addappusercollection", resourceCulture);
            }
        }
        
        /// <summary>
        ///   Looks up a localized string similar to $data = Get-RDSessionCollectionConfiguration -ConnectionBroker $ConnectionBroker -CollectionName $CollectionName -UserGroup
        ///$UserGroups = $UserGroupsStr.Split(&quot;,&quot;)
        ///$fullArray = [object[]]($data.UserGroup) +$UserGroups
        ///Set-RDSessionCollectionConfiguration -ConnectionBroker $ConnectionBroker -CollectionName $CollectionName -UserGroup $fullArray.
        /// </summary>
        internal static string addbulkusercollection {
            get {
                return ResourceManager.GetString("addbulkusercollection", resourceCulture);
            }
        }
        
        /// <summary>
        ///   Looks up a localized string similar to adduserapp.
        /// </summary>
        internal static string adduserapp {
            get {
                return ResourceManager.GetString("adduserapp", resourceCulture);
            }
        }
        
        /// <summary>
        ///   Looks up a localized string similar to $fullArray = $UserGroup.Split(&quot;,&quot;)
        ///Set-RDSessionCollectionConfiguration -ConnectionBroker $ConnectionBroker -CollectionName $CollectionName -UserGroup $fullArray.
        /// </summary>
        internal static string addusercollection {
            get {
                return ResourceManager.GetString("addusercollection", resourceCulture);
            }
        }
        
        /// <summary>
        ///   Looks up a localized string similar to New-RDRemoteApp -ConnectionBroker $ConnectionBroker -CollectionName $CollectionName -DisplayName $DisplayName -FilePath $FilePath.
        /// </summary>
        internal static string addwappcollection {
            get {
                return ResourceManager.GetString("addwappcollection", resourceCulture);
            }
        }
        
        /// <summary>
        ///   Looks up a localized string similar to configurecollection.
        /// </summary>
        internal static string configurecollection {
            get {
                return ResourceManager.GetString("configurecollection", resourceCulture);
            }
        }
        
        /// <summary>
        ///   Looks up a localized string similar to $disconnect = Get-RDUserSession -ConnectionBroker $ConnectionBroker -CollectionName $CollectionName
        ///$disconnect | ForEach-Object {$_ | Disconnect-RDUser -Force}.
        /// </summary>
        internal static string disconnectAllSessions {
            get {
                return ResourceManager.GetString("disconnectAllSessions", resourceCulture);
            }
        }
        
        /// <summary>
        ///   Looks up a localized string similar to Disconnect-RDUser -HostServer $HostServer -UnifiedSessionID $UnifiedSessionID -Force.
        /// </summary>
        internal static string disconnectSelectedSession {
            get {
                return ResourceManager.GetString("disconnectSelectedSession", resourceCulture);
            }
        }
        
        /// <summary>
        ///   Looks up a localized string similar to Set-RDRemoteApp -ConnectionBroker $ConnectionBroker -CollectionName $CollectionName -Alias $ApplicationName -DisplayName $DisplayName.
        /// </summary>
        internal static string editwappcollection {
            get {
                return ResourceManager.GetString("editwappcollection", resourceCulture);
            }
        }
        
        /// <summary>
        ///   Looks up a localized string similar to Get-RDRemoteApp -ConnectionBroker $ConnectionBroker -CollectionName $CollectionName.
        /// </summary>
        internal static string getappusercollection {
            get {
                return ResourceManager.GetString("getappusercollection", resourceCulture);
            }
        }
        
        /// <summary>
        ///   Looks up a localized string similar to #Input: $CollectionName,$ConnectionBroker
        ///$collection = Get-WmiObject -Namespace &quot;root\cimv2\rdms&quot; -Query &quot;SELECT * FROM Win32_RDSHCollection WHERE Name=&apos;${CollectionName}&apos;&quot; -ComputerName $ConnectionBroker -Authentication PacketPrivacy -ErrorAction Stop
        ///$shost = [Object[]](Get-WmiObject -Namespace &quot;root\cimv2\rdms&quot; -Query &quot;SELECT * FROM Win32_RDSHServer WHERE CollectionAlias=&apos;$($collection.Alias)&apos;&quot; -ComputerName $ConnectionBroker -Authentication PacketPrivacy)
        ///[PSCustomObject] @{
        ///    &quot;CollectionName&quot; =  [rest of string was truncated]&quot;;.
        /// </summary>
        internal static string getcollectionconfig {
            get {
                return ResourceManager.GetString("getcollectionconfig", resourceCulture);
            }
        }
        
        /// <summary>
        ///   Looks up a localized string similar to Get-RDSessionHost -CollectionName $CollectionName -ConnectionBroker $ConnectionBroker.
        /// </summary>
        internal static string getcollectionserver {
            get {
                return ResourceManager.GetString("getcollectionserver", resourceCulture);
            }
        }
        
        /// <summary>
        ///   Looks up a localized string similar to Get-RDRemoteApp -ConnectionBroker $ConnectionBroker -CollectionName $CollectionName -Alias $Alias.
        /// </summary>
        internal static string getparameters {
            get {
                return ResourceManager.GetString("getparameters", resourceCulture);
            }
        }
        
        /// <summary>
        ///   Looks up a localized string similar to $wmidata = Get-WmiObject -Namespace &quot;root\cimv2\rdms&quot; -Query &quot;SELECT * FROM Win32_RDSHCollection&quot; -ComputerName $ConnectionBroker -Authentication PacketPrivacy -ErrorAction SilentlyContinue
        ///$wmidata | ForEach-Object -Process {[PSCustomObject]@{Alias = $_.Alias;Description = $_.Description;Name = $_.Name}}| Write-Output.
        /// </summary>
        internal static string getsessioncollection {
            get {
                return ResourceManager.GetString("getsessioncollection", resourceCulture);
            }
        }
        
        /// <summary>
        ///   Looks up a localized string similar to 
        ///      $TimeoutSeconds = 15;
        ///      $MaxJobCount = 5;
        ///      $where = @{$false = &quot; WHERE CollectionAlias = &apos;${CollectionAlias}&apos;&quot;;$true = &quot;&quot;}[[String]::IsNullOrEmpty($CollectionAlias)]
        ///$h_query = &quot;SELECT * FROM Win32_RDSHServer${where}&quot;;$s_query = &quot;SELECT * FROM Win32_SessionDirectorySessionEx${where}&quot;;$Script:jobdata = @{}
        ///$states = @(&quot;STATE_ACTIVE&quot;,&quot;STATE_DRAIN&quot;,&quot;STATE_ONLINE&quot;,&quot;STATE_UNASSIGNED&quot;)
        ///function ProcessJobs {
        ///    Get-Job -State Completed | ForEach-Object {$d = $Script:jobdata[$_.Id]
        ///        [rest of string was truncated]&quot;;.
        /// </summary>
        internal static string getsessionhost {
            get {
                return ResourceManager.GetString("getsessionhost", resourceCulture);
            }
        }
        
        /// <summary>
        ///   Looks up a localized string similar to $disconnect = Get-RDUserSession -ConnectionBroker $ConnectionBroker -CollectionName $CollectionName
        ///$disconnect | ForEach-Object {$_ | Invoke-RDUserLogoff -Force}.
        /// </summary>
        internal static string logOffAllSessions {
            get {
                return ResourceManager.GetString("logOffAllSessions", resourceCulture);
            }
        }
        
        /// <summary>
        ///   Looks up a localized string similar to Invoke-RDUserLogoff -HostServer $HostServer -UnifiedSessionID $UnifiedSessionID -Force.
        /// </summary>
        internal static string logOffSelectedSession {
            get {
                return ResourceManager.GetString("logOffSelectedSession", resourceCulture);
            }
        }
        
        /// <summary>
        ///   Looks up a localized string similar to  Set-RDRemoteDesktop -CollectionName $CollectionName -ConnectionBroker $ConnectionBroker -ShowInWebAccess $true -Force.
        /// </summary>
        internal static string publishdesktop {
            get {
                return ResourceManager.GetString("publishdesktop", resourceCulture);
            }
        }
        
        /// <summary>
        ///   Looks up a localized string similar to $encyPass=&quot;{password}&quot;
        ///$azureuser=&quot;{username}&quot;
        ///$secureKey = (33,4,2,3,56,34,254,222,1,1,2,23,42,54,33,233,1,34,2,7,6,5,35,43)
        ///$securepass= ConvertTo-SecureString -String $encyPass -Key $secureKey 
        ///
        ///$MyCredential= New-Object -TypeName System.Management.Automation.PSCredential -ArgumentList($azureuser, $securepass)
        ///Login-AzureRmAccount -Credential $MyCredential
        ///Get-AzureRmResourceGroup {resourcegroupname}.
        /// </summary>
        internal static string readEssentialInfo {
            get {
                return ResourceManager.GetString("readEssentialInfo", resourceCulture);
            }
        }
        
        /// <summary>
        ///   Looks up a localized string similar to Remove-RDRemoteApp -ConnectionBroker $ConnectionBroker -CollectionName $CollectionName  -Alias $Alias -Force.
        /// </summary>
        internal static string removeappcollection {
            get {
                return ResourceManager.GetString("removeappcollection", resourceCulture);
            }
        }
        
        /// <summary>
        ///   Looks up a localized string similar to $data = Get-RDRemoteApp -ConnectionBroker $ConnectionBroker -CollectionName $CollectionName -Alias $Alias
        ///$data1 = $data.UserGroups | select -Unique
        ///$fullArray = (New-Object System.Collections.ArrayList(, $data1))
        ///$fullArray.Remove($UserGroup)
        ///Set-RDRemoteApp -ConnectionBroker $ConnectionBroker -CollectionName $CollectionName -Alias $Alias -UserGroups $fullArray.
        /// </summary>
        internal static string removeappusercollection {
            get {
                return ResourceManager.GetString("removeappusercollection", resourceCulture);
            }
        }
        
        /// <summary>
        ///   Looks up a localized string similar to removeuserapp.
        /// </summary>
        internal static string removeuserapp {
            get {
                return ResourceManager.GetString("removeuserapp", resourceCulture);
            }
        }
        
        /// <summary>
        ///   Looks up a localized string similar to $data = Get-RDSessionCollectionConfiguration -ConnectionBroker $ConnectionBroker -CollectionName $CollectionName -UserGroup
        ///$data1 = $data.UserGroup | select -Unique
        ///$fullArray = (New-Object System.Collections.ArrayList(, $data1))
        ///$fullArray.Remove($UserGroup)
        ///Set-RDSessionCollectionConfiguration -ConnectionBroker $ConnectionBroker -CollectionName $CollectionName -UserGroup $fullArray.
        /// </summary>
        internal static string removeusercollection {
            get {
                return ResourceManager.GetString("removeusercollection", resourceCulture);
            }
        }
        
        /// <summary>
        ///   Looks up a localized string similar to #Additional values
        ///if ($EndADisconnectedSession){$break_action = &quot;Logoff&quot;}else{$break_action = &quot;Disconnect&quot;}
        ///$auto_reconnect = $true
        ///$encrypt_level = &quot;High&quot;
        ///$relative_weight = 50
        ///$lba = Get-RDSessionHost -CollectionName $CollectionName -ConnectionBroker $ConnectionBroker | ForEach-Object {New-Object Microsoft.RemoteDesktopServices.Management.RDSessionHostCollectionLoadBalancingInstance -ArgumentList $CollectionName,$relative_weight,$LoadBalancingConcurrentSessionsPerServer,$_.SessionHost}
        ///
        ///#Commit se [rest of string was truncated]&quot;;.
        /// </summary>
        internal static string savecollectionconfig {
            get {
                return ResourceManager.GetString("savecollectionconfig", resourceCulture);
            }
        }
        
        /// <summary>
        ///   Looks up a localized string similar to Set-RDRemoteApp -ConnectionBroker $ConnectionBroker -CollectionName $CollectionName -Alias $Alias -CommandLineSetting $CommandLineSetting -RequiredCommandLine $RequiredCommandLine -DisplayName $DisplayName -FilePath $FilePath -FolderName $FolderPath.
        /// </summary>
        internal static string saveparameters {
            get {
                return ResourceManager.GetString("saveparameters", resourceCulture);
            }
        }
        
        /// <summary>
        ///   Looks up a localized string similar to $where = @(&apos;CollectionAlias&apos;,&apos;DomainName&apos;,&apos;HostServer&apos;,&apos;UserName&apos;,&apos;UnifiedSessionID&apos;) | ForEach-Object -Process {
        ///        $val = Get-Variable -Name $_ -ValueOnly
        ///        if (-Not [String]::IsNullOrEmpty($val)){&quot;${_} = &apos;${val}&apos;&quot;}}
        ///if ($where)
        ///{
        ///    $query = &quot;SELECT * FROM Win32_SessionDirectorySessionEx WHERE $([String]::Join(&quot; AND &quot;,$where))&quot;
        ///}
        ///else
        ///{
        ///    $query = &quot;SELECT * FROM Win32_SessionDirectorySessionEx&quot;
        ///}
        ///Get-WmiObject -Query $query -ComputerName $ConnectionBroker -Authentication PacketPr [rest of string was truncated]&quot;;.
        /// </summary>
        internal static string sendmessage {
            get {
                return ResourceManager.GetString("sendmessage", resourceCulture);
            }
        }
        
        /// <summary>
        ///   Looks up a localized string similar to Get-WmiObject -Query &quot;SELECT * FROM Win32_SessionDirectorySessionEx WHERE HostServer = &apos;${HostServer}&apos;&quot; -ComputerName $ConnectionBroker -Authentication PacketPrivacy -Impersonation Impersonate | ForEach-Object -Process {
        ///    Send-RDUserMessage -HostServer $_.HostServer -MessageTitle $MessageTitle -MessageBody $MessageBody -UnifiedSessionID $_.UnifiedSessionID
        ///}.
        /// </summary>
        internal static string sendmessageserver {
            get {
                return ResourceManager.GetString("sendmessageserver", resourceCulture);
            }
        }
        
        /// <summary>
        ///   Looks up a localized string similar to Send-RDUserMessage -HostServer $HostServer -MessageTitle $MessageTitle -MessageBody $MessageBody -UnifiedSessionID $UnifiedSessionID.
        /// </summary>
        internal static string sendmessagesession {
            get {
                return ResourceManager.GetString("sendmessagesession", resourceCulture);
            }
        }
        
        /// <summary>
        ///   Looks up a localized string similar to if ([String]::IsNullOrEmpty($newconnection)){$newconnection = &apos;NotUntilReboot&apos;}
        ///Set-RDSessionHost -SessionHost $SessionHost -NewConnectionAllowed $newconnection -ConnectionBroker $ConnectionBroker.
        /// </summary>
        internal static string shutdownserver {
            get {
                return ResourceManager.GetString("shutdownserver", resourceCulture);
            }
        }
        internal static string GetConnectionBrokerByUserName
        {
            get
            {
                return ResourceManager.GetString("GetConnectionBrokerByUserName", resourceCulture);
            }
        }
    }
}
