using System;
using System.Collections.Generic;
using RDSManagerAPI.Controllers;
using System.Configuration;
using System.Net;
namespace RDSManagerAPI.Commands
{
    public class AdminEditCollectionCommand : ICommand
    {
        Dictionary<string, object> data;
        Guid id;
        string collectionName;
        string brokerFqdn;
        string newCollectionName;
        string collectionDescription;

        public void Init(Dictionary<string, object> data)
        {
            this.data = data;
            this.brokerFqdn = data["ConnectionBroker"] as string;
            this.collectionName = data["CollectionName"] as string;
            this.newCollectionName = data["NewCollectionName"] as string;
            this.collectionDescription = data["CollectionDescription"] as string;
        }

        public object Result { get; set; }

        public string Execute()
        {
            string psleditCollectionDescription = ConfigurationManager.AppSettings["psl_layer"].ToString() + "/editCollectionDescription.ps1";

            string psl_Script = "";
            using (WebClient client = new WebClient())
            {
                psl_Script = client.DownloadString(psleditCollectionDescription);
            }
            // Change the description using powershell
            var command = new ScriptCommand(psl_Script,
                new[] { "CollectionName", "CollectionDescription", "ConnectionBroker" });
            command.Init(data);

            return AdminCommandsController.ProccessCommandSub(command);
        }
    }
}