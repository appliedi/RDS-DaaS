namespace RDSManagerAPI.Commands
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using RDSManagerAPI.Controllers;
    using System.Configuration;
    using System.Net;

    public class AdminNewCollectionCommand : ICommand
    {
        Guid id;
        Dictionary<string, object> data;
        string brokerFqdn;
        string collectionName;
        string description;
        string[] serverList;
        string[] userList;

        public object Result { get; set; }

        public void Init(Dictionary<string, object> data)
        {
            this.data = data;
            this.brokerFqdn = data["ConnectionBroker"] as string;
            this.collectionName = data["CollectionName"] as string;
            this.description = data["CollectionDescription"] as string;
            this.serverList = (data["SessionHost"] as string).Split(',');
            data["SessionHost"] = this.serverList;
            this.userList = (data["UserGroup"] == null) ? null :
                (data["UserGroup"] as string).Split(',') ;
            data["UserGroup"] = this.userList;
        }

        public string Execute()
        {
            string psl_Script = "";
            string pslnewCollection = ConfigurationManager.AppSettings["psl_layer"].ToString() + "/newCollection.ps1";           
            using (WebClient client = new WebClient())
            {
                psl_Script = client.DownloadString(pslnewCollection);
            }
            // Creating the collection via powershell
            var command = new ScriptCommand(psl_Script,
                new[] { "CollectionName", "SessionHost", "ConnectionBroker", "CollectionDescription" });
            command.Init(data);
            var result = AdminCommandsController.ProccessCommandSub(command);

            // Only add user when the user has entered the user group info
            if (userList!=null && userList.Count()>0)
            {
                string psl_path = ConfigurationManager.AppSettings["psl_layer"].ToString() + "/addusercollection.ps1";
                
                using (WebClient client = new WebClient())
                {
                    psl_Script = client.DownloadString(psl_path);
                }
                command = new ScriptCommand(psl_Script,
                    new[] { "ConnectionBroker", "CollectionName", "UserGroup" });
                command.Init(data);
                result += AdminCommandsController.ProccessCommandSub(command);
            }
            CreateDbCollectionEntry(this.brokerFqdn, this.collectionName);
            return result;
        }

        internal static void CreateDbCollectionEntry(string fqdn, string collectionName, bool isActive = false)
        {

            // Creating the collection in the table "CollectionBurstSettings"
            var stm = "INSERT INTO CollectionBurstSettings(DeploymentFQDN, CollectionName, IsActive, StartTime, EndTime, LogOffWaitTime, SessionThresholdPerCPU, MinServerCount) "
                + "VALUES(@fqdn, @collectionName, @isActive,'0:0:0','0:0:0',0,0,0)";
            if (0 == ServicesManager.Instance.ExecuteCommand(stm, fqdn, collectionName, isActive))
            {
                throw new Exception("Error adding default collection burst settings into CollectionBurstSettings Table in DB");
            }
        }

    }
}