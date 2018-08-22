using System;
using System.Collections.Generic;

namespace RDSManagerAPI.Commands
{
    public class AdminEditDeploymentCommand : ICommand
    {
        string id;
        string friendlyName;
        string description;
        bool updateDescription;

        public void Init(Dictionary<string, object> data)
        {
            this.id = data["Id"] as string;
            this.friendlyName = data["FriendlyName"] as string;
            this.updateDescription = data.ContainsKey("Description") && data["Description"] != null;
            this.description = updateDescription ? data["Description"] as string :string.Empty;
        }
        public object Result { get; set; }

        public string Execute()
        {
            string stm = updateDescription
                ? "UPDATE Deployments SET Name = @Name, Description= @Description WHERE Id = @Id"
                : "UPDATE Deployments SET Name = @Name WHERE Id = @Id";
            var updateNum = updateDescription
                ? ServicesManager.Instance.ExecuteCommand(stm, friendlyName, description, id)
                : ServicesManager.Instance.ExecuteCommand(stm, friendlyName, id);
            if (updateNum == 0)
            {
                throw new Exception("Error updating deployment.");
            }

            return string.Empty;
        }
    }
}