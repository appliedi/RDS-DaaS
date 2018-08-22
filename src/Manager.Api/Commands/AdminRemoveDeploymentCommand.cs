using System;
using System.Collections.Generic;

namespace RDSManagerAPI.Commands
{
    public class AdminRemoveDeploymentCommand : ICommand
    {
        string id;
        string brokerFqdn;
        bool containsFqdn;

        public void Init(Dictionary<string, object> data)
        {
            this.id = data["Id"] as string;
            this.containsFqdn = data.ContainsKey("RDSConnectionBroker");
            this.brokerFqdn = containsFqdn ? data["RDSConnectionBroker"] as string : string.Empty;
        }

        public object Result { get; set; }

        public string Execute()
        {
            // Delete from the Deployments Table. Db will delete all entries related to this deployment automatically
            var stm = containsFqdn ? "DELETE Deployments WHERE FQDN = @FQDN" : "DELETE FROM Deployments WHERE Id = @Id";
            var result = containsFqdn 
                ? ServicesManager.Instance.ExecuteCommand(stm, this.brokerFqdn)
                : ServicesManager.Instance.ExecuteCommand(stm, this.id);
            if (0 == result)
            {
                throw new Exception("Error deleting deployment: Failed to delete this deployment from Deployments table.");
            }

            return string.Empty;
        }
    }
}