using System;
using System.Collections.Generic;

namespace RDSManagerAPI.Commands
{
    public class AdminNewDeploymentCommand : ICommand
    {
        string id;
        string friendlyName;
        string brokerfqdn;
        string description;
        bool addDescription;

        public void Init(Dictionary<string, object> data)
        {
            this.id = data["Id"] as string;
            this.friendlyName = data["FriendlyName"] as string;
            this.brokerfqdn = (data["RDSConnectionBroker"] as string).ToUpper(); // to avoid duplication issues
            this.addDescription = data.ContainsKey("Description") && data["Description"] != null;
            this.description = addDescription ? data["Description"] as string : string.Empty;
        }

        public object Result { get; set; }

        public string Execute()
        {
            // Adding this new deployment to the Deployments Table
            string stm = addDescription
                ? "INSERT INTO Deployments(Id, Name, FQDN, Description) VALUES(@Id, @Name, @FQDN, @Description)"
                : "INSERT INTO Deployments(Id, Name, FQDN) VALUES(@Id, @Name, @FQDN)";

            var updateNum = addDescription
                ? ServicesManager.Instance.ExecuteCommand(stm, id, friendlyName, brokerfqdn, description)
                : ServicesManager.Instance.ExecuteCommand(stm, id, friendlyName, brokerfqdn);

            if (updateNum == 0)
            {
                throw new Exception("Error Adding deployment to Deployments Table.");
            }

            // Adding a deployment burst settings to this new deployment in the DeploymentBurstSettings Table
            stm = "INSERT INTO DeploymentBurstSettings(DeploymentFQDN, IsActive, PublishUserName, PublishPassword,"
                  + " AzureSubscriptionName, ResourceGroupName, CreatedDate, LastModifiedDate)"
                  + " VALUES(@DeploymentFQDN, 0,'','','','', @CreatedDate, @LastModifiedDate)";
            if (0 == ServicesManager.Instance.ExecuteCommand(stm, brokerfqdn, DateTime.Now, DateTime.Now))
            {
                throw new Exception("Error adding burst settings to DeploymentBurstSettings Table for deployment " + brokerfqdn);
            }
            return string.Empty;
        }
    }
}