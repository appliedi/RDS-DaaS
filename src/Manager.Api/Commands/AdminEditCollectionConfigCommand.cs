namespace RDSManagerAPI.Commands
{
    using Newtonsoft.Json.Linq;
    using RDSManagerAPI.Controllers;
    using System;
    using System.Collections.Generic;
    using System.Configuration;
    using System.Net;
    public class AdminEditCollectionConfigCommand : ICommand
    {
        string DeploymentFqdn;
        string CollectionName;
        bool IsBurstActive;
        bool EnableUserProfileDisks;
        string UserProfileDisksLocation;
        int UserProfileDisksMaxSizeGB;

        public void Init(Dictionary<string, object> data)
        {
            var settings = ((JObject)data["CollectionConfigSettings"]).ToObject<Dictionary<string, object>>();
            this.DeploymentFqdn = settings["DeploymentFqdn"] as string;
            this.CollectionName = settings["CollectionName"] as string;
            //this.IsBurstActive = (bool)settings["IsBurstActive"];
            var configSettings = ((JObject)settings["ClientSettings"]).ToObject<Dictionary<string, object>>();

            this.EnableUserProfileDisks = (bool)configSettings["EnableUserProfileDisks"]; //-EnableUserProfileDisk
            this.UserProfileDisksLocation = configSettings["UserProfileDisksLocation"] as string;    //-DiskPath
            this.UserProfileDisksMaxSizeGB = int.Parse(configSettings["UserProfileDisksMaxSize"].ToString()); //-MaxUserProfileDiskSizeGB
        }

        public object Result { get; set; }


        public string Execute()
        {
            ScriptCommand command;
            Dictionary<string, object> data;
            string msg = string.Empty;
            string psl_Script = "";          
            try
            {
                // Saving User Profile Disk Settings
                if (EnableUserProfileDisks)
                {
                    string Validatesharedfileloc = string.Empty;
                    string pslValidatesharedfileloc = ConfigurationManager.AppSettings["psl_layer"].ToString() + "/Validatesharedfileloc.ps1";
                    using (WebClient client = new WebClient())
                    {
                        psl_Script = client.DownloadString(pslValidatesharedfileloc);
                    }
                    var aCommand = new ScriptCommand(psl_Script, new[] { "FileServer" },
                           (psObject, scriptCommand) =>
                           {
                               Validatesharedfileloc = (psObject.message as string);
                           });
                    var vadata = new Dictionary<string, object> { { "FileServer", UserProfileDisksLocation } };
                    aCommand.Init(vadata);
                    aCommand.Execute();
                    if (Validatesharedfileloc == "Success")
                    {
                        string pslenableUserProfileDisk = ConfigurationManager.AppSettings["psl_layer"].ToString() + "/enableUserProfileDisk.ps1";

                        using (WebClient client = new WebClient())
                        {
                            psl_Script = client.DownloadString(pslenableUserProfileDisk);
                        }
                        command = new ScriptCommand(psl_Script,
                            new[] { "ConnectionBroker", "CollectionName", "DiskPath", "MaxUserProfileDiskSizeGB" });
                        data = new Dictionary<string, object> { { "ConnectionBroker", DeploymentFqdn }, { "CollectionName", CollectionName },
                       { "DiskPath",  UserProfileDisksLocation}, { "MaxUserProfileDiskSizeGB",  UserProfileDisksMaxSizeGB}};
                        command.Init(data);
                        var result = AdminCommandsController.ProccessCommandSub(command);
                        msg = "Success";
                    }
                    else
                    {
                        msg = "Invalid User Profile Disks Location";
                    }
                }
                else
                {
                    string psldisableUserProfileDisk = ConfigurationManager.AppSettings["psl_layer"].ToString() + "/disableUserProfileDisk.ps1";
                    using (WebClient client = new WebClient())
                    {
                        psl_Script = client.DownloadString(psldisableUserProfileDisk);
                    }
                    command = new ScriptCommand(psl_Script,
                    new[] { "ConnectionBroker", "CollectionName" });
                    data = new Dictionary<string, object> { { "ConnectionBroker", DeploymentFqdn }, { "CollectionName", CollectionName } };
                    command.Init(data);
                    var result = AdminCommandsController.ProccessCommandSub(command);
                    msg = "Success";
                }
                //// Try update Collection Burst IsActive field in the databsae, if not, create corresponding entries in the DB
                //string stm = @"UPDATE CollectionBurstSettings SET IsActive = @IsActive
                //              WHERE DeploymentFQDN=@DeploymentFQDN AND CollectionName=@Name";
                //if (0 == DBHelper.ExecuteCommand(stm, IsBurstActive, this.DeploymentFqdn, this.CollectionName))
                //{
                //    AdminNewCollectionCommand.CreateDbCollectionEntry(this.DeploymentFqdn, this.CollectionName, IsBurstActive);
                //}
            }
            catch (Exception ex)
            {
                ErrorHelper.WriteErrorToEventLog(ex.Message);
                //ErrorHelper.SendExcepToDB(ex, "Execute", DeploymentFqdn);
                msg = ex.Message;
            }
            this.Result = msg;
            return msg;
        }

    }
}