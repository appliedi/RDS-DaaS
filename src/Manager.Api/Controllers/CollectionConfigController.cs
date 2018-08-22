namespace RDSManagerAPI.Controllers
{
    using Commands;
    using System.Collections.Concurrent;
    using System.Collections.Generic;
    using System.Web.Http;
    using RDSManagerAPI.Entities;
    using System;
    using System.Configuration;
    using System.Net;

    /// <summary>
    /// Collection Configure settings 
    /// </summary>
    public class CollectionConfigController : ApiController
    {
        public CollectionConfigController()
        {
        }
        string DeploymentFQDN;
        string CollectionName;
        Dictionary<string, object> Data;
        const string Param1 = "ConnectionBroker";
        const string Param2 = "CollectionName";
        CollectionDashboardConfig Result = new CollectionDashboardConfig();
        /// <summary>
        /// Get Collection Dashboard Configure Settings for a particular colection
        /// </summary>
        /// <param name="deploymentFqdn">Deployment Name/FQDN</param>
        /// <param name="collectionName">Collection Name</param>
        /// <returns>Collection Dashboard Configure Settings</returns>
        [HttpGet]
        public CollectionDashboardConfig GetUserProfileDisk(string deploymentFqdn, string collectionName)
        {
           try
            {
                this.DeploymentFQDN = deploymentFqdn;
                this.CollectionName = collectionName;
                this.Data = new Dictionary<string, object> { { Param1, DeploymentFQDN }, { Param2, CollectionName } };

                // Query DB to get the Collection Burst status
                GetCollectionBurstStatus();

                // Get the User Profile Disk Settings via ScriptCommand/Powershell
                GetUserProfileDiskSettings();
                Result.ConnectionBroker = this.DeploymentFQDN;
                Result.CollectionName = this.CollectionName;
                return this.Result;
            }
            catch (Exception ex)
            {
                ErrorHelper.SendExcepToDB(ex, " GetUserProfileDisk", deploymentFqdn);
                throw ex;
            }
        }

        /// <summary>
        /// Get the Client Redirection Settings via ScriptCommand/Powershell
        /// </summary>
        /// <returns></returns>
        private void GetCollectionBurstStatus()
        {
            string stm = string.Format("SELECT IsActive FROM CollectionBurstSettings WHERE DeploymentFQDN = '{0}' AND CollectionName = '{1}'",
                this.DeploymentFQDN, this.CollectionName);
            var burstStatus = ServicesManager.Instance.ExecuteQuery<bool>(stm, (rdr, list) =>
            {
                var isActive = (bool)rdr["IsActive"];
                list.Add(isActive);
            });

            // If cannot find the entry from DB, return default value false
            this.Result.BurstActive = (burstStatus == null || burstStatus.Count < 1) ? false : burstStatus[0];
        }

        private void GetUserProfileDiskSettings()
        {
            string pslgetUserProfileDiskSettings = ConfigurationManager.AppSettings["psl_layer"].ToString() + "/getUserProfileDiskSettings.ps1";
            string psl_Script = "";
            using (WebClient client = new WebClient())
            {
                psl_Script = client.DownloadString(pslgetUserProfileDiskSettings);
            }
            var command = new ScriptCommand(psl_Script,
                new[] { Param1, Param2 }, (psObject, scriptCommand) =>
                {
                    var settings = new CollectionDashboardConfig
                    {
                        EnableUserProfileDisk = psObject.EnableUserProfileDisk,
                        DiskPath = psObject.DiskPath,
                        MaxUserProfileDiskSizeGB = psObject.MaxUserProfileDiskSizeGB
                    };
                    scriptCommand.Result = settings;
                });

            command.Init(Data);
            command.Execute();

            var result = (CollectionDashboardConfig)command.Result;

            this.Result.EnableUserProfileDisk = result.EnableUserProfileDisk;
            this.Result.DiskPath = result.DiskPath;
            this.Result.MaxUserProfileDiskSizeGB = result.MaxUserProfileDiskSizeGB;
        }

    }
}
