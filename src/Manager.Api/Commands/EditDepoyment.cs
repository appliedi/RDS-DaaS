namespace RDSManagerAPI.Commands
{
    using System;
    using System.Collections.Generic;

    public class EditDepoyment : ICommand
    {
        string id;
        string friendlyName;

        public void Init(Dictionary<string, object> data)
        {
            this.id = data["Id"] as string;
            this.friendlyName = data["FriendlyName"] as string;
        }

        public object Result { get; set; }

        public string Execute()
        {
            string stm = "UPDATE Deployments SET Name = @Name WHERE Id = @Id";
            var updateNum = ServicesManager.Instance.ExecuteCommand(stm, friendlyName, id);
            if (updateNum == 0)
            {
                throw new Exception("Error updating deployment.");
            }

            return string.Empty;
        }
    }
}