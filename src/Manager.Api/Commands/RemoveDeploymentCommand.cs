namespace RDSManagerAPI.Commands
{
    using System;
    using System.Collections.Generic;

    public class RemoveDeploymentCommand : ICommand
    {
        string id;
        
        public void Init(Dictionary<string, object> data)
        {
            this.id = data["Id"] as string;
        }

        public object Result { get; set; }

        public string Execute()
        {
            string stm = "DELETE FROM Deployments WHERE Id = @Id";
            var updateNum = ServicesManager.Instance.ExecuteCommand(stm, this.id);
            if (updateNum == 0)
            {
                throw new Exception("Error deleting deployment.");
            }

            return string.Empty;
        }
    }
}