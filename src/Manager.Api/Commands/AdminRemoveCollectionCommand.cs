using System;
using System.Collections.Generic;
using RDSManagerAPI.Controllers;
using System.Configuration;
using System.Net;

namespace RDSManagerAPI.Commands
{
    public class AdminRemoveCollectionCommand : ICommand
    {
        Dictionary<string, object> data;
        Guid id;
        string brokerId;
        string collectionName;
        string brokerFqdn;

        public void Init(Dictionary<string, object> data)
        {
            this.data = data;
            this.brokerFqdn = data["ConnectionBroker"] as string;
            this.collectionName = data["CollectionName"] as string;
        }
        public object Result { get; set; }

        public string Execute()
        {
            string pslremoveCollection = ConfigurationManager.AppSettings["psl_layer"].ToString() + "/removeCollection.ps1";
            string psl_Script = "";
            using (WebClient client = new WebClient())
            {
                psl_Script = client.DownloadString(pslremoveCollection);
            }
            // Removing the collection via powershell
            var command = new ScriptCommand(psl_Script,
                new[] { "ConnectionBroker", "CollectionName" });
            command.Init(data);
            var result = command.Execute();

            // Removing the collection and its collection burst settings in the DB
            string stm = "DELETE CollectionBurstSettings WHERE DeploymentFQDN = @fqdn AND CollectionName = @name";
            var test = ServicesManager.Instance.ExecuteCommand(stm, this.brokerFqdn, this.collectionName);
            return result;
        }
    }
}