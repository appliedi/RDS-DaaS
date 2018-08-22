namespace RDSManagerAPI.Commands
{
    using Controllers;
    using System;
    using System.Collections.Generic;
    using System.Configuration;
    using System.Net;
    using System.Security;

    public class NewDeploymentCommand : ICommand
    {
        string id;
        string friendlyName;
        string brokerfqdn;
        string AzureLoginName;
        string AzurePassword;
        string AzureResourceGroup;
        string AzureSubscriptionID;

        public void Init(Dictionary<string, object> data)
        {
            this.id = data["Id"] as string;
            this.friendlyName = data["FriendlyName"] as string;
            this.brokerfqdn = data["RDSConnectionBroker"] as string;
            this.AzureLoginName = data["AzureLoginName"] as string;
            this.AzurePassword = data["AzurePassword"] as string;
            this.AzureResourceGroup = data["AzureResourceGroup"] as string;
            this.AzureSubscriptionID = data["AzureSubscriptionID"] as string;
        }

        public object Result { get; set; }

        public string Execute()
        {
            string res = "";
            string psl_Script = "";
            string validatebroker = string.Empty;
            string pslvalidateconnectionbroker = ConfigurationManager.AppSettings["psl_layer"].ToString() + "/validateconnectionbroker.ps1";

            using (WebClient client = new WebClient())
            {
                psl_Script = client.DownloadString(pslvalidateconnectionbroker);
            }
            var commands = new ScriptCommand(psl_Script, new[] { "strbroker" },
                   (psObject, scriptCommand) =>
                   {
                       validatebroker = (psObject.message as string);
                   });
            var vdata = new Dictionary<string, object> { { "strbroker", brokerfqdn } };
            commands.Init(vdata);
            commands.Execute();

            if (validatebroker == "Success")
            {
                string validateAzurecredentials = string.Empty;
                string pslvalidateAzurecredentials = ConfigurationManager.AppSettings["psl_layer"].ToString() + "/azureloginvalidation.ps1";

                using (WebClient client = new WebClient())
                {
                    psl_Script = client.DownloadString(pslvalidateAzurecredentials);
                }
                var aCommand = new ScriptCommand(psl_Script, new[] { "Auname", "Apassword", "subid", "ResourceGroupPassed" },
                       (psObject, scriptCommand) =>
                       {
                           validateAzurecredentials = (psObject.message as string);
                       });
                var vadata = new Dictionary<string, object> { { "Auname", AzureLoginName }, { "Apassword", AzurePassword }, { "subid", AzureSubscriptionID }, { "ResourceGroupPassed" , AzureResourceGroup } };
                aCommand.Init(vadata);
                aCommand.Execute();
                if (validateAzurecredentials == "Success")
                {
                    string pslencryptString = ConfigurationManager.AppSettings["psl_layer"].ToString() + "/encryptString.ps1";
                    using (WebClient client = new WebClient())
                    {
                        psl_Script = client.DownloadString(pslencryptString);
                    }
                    string stm = "INSERT INTO Deployments(Id, Name, FQDN) VALUES(@Id, @Name, @FQDN)";
                    var updateNum = ServicesManager.Instance.ExecuteCommand(stm, this.id, this.friendlyName, this.brokerfqdn);
                    if (updateNum == 0)
                    {
                        res = "Error adding deployment.";
                    }
                    else
                    {
                        string encryptedPassword = string.Empty;
                        if (!string.IsNullOrEmpty(AzurePassword))
                        {
                            // Encrypt the password before saving it in the DB
                            var command = new ScriptCommand(psl_Script, new[] { "String", "SecureString" },
                                (psObject, scriptCommand) =>
                                {
                                    encryptedPassword = psObject.ToString();
                                });
                            var data = new Dictionary<string, object> { { "String", "1234" }, { "SecureString", GetSecureString(AzurePassword) } };
                            command.Init(data);
                            command.Execute();
                        }
                        // Adding a deployment burst settings to this new deployment in the DeploymentBurstSettings Table
                        stm = "INSERT INTO DeploymentBurstSettings(DeploymentFQDN, IsActive, PublishUserName, PublishPassword,"
                              + " AzureSubscriptionName, ResourceGroupName, CreatedDate, LastModifiedDate)"
                              + " VALUES(@DeploymentFQDN, 0,@AzureLoginName,@AzurePassword,@AzureSubscriptionID,@AzureResourceGroup,@CreatedDate, @LastModifiedDate)";
                        if (0 == ServicesManager.Instance.ExecuteCommand(stm, brokerfqdn, AzureLoginName, encryptedPassword, AzureSubscriptionID, AzureResourceGroup, DateTime.Now, DateTime.Now))
                        {
                            res = "Error adding burst settings to DeploymentBurstSettings Table for deployment " + brokerfqdn;
                        }
                        else
                        {
                            res = "Success";
                        }
                    }
                }
                else
                {
                    res = validateAzurecredentials;
                }
            }
            else
            {
                res = "Invalid connection broker " + brokerfqdn;
            }
            this.Result = res;
            return res;
        }
        static private SecureString GetSecureString(string input)
        {
            var secure = new SecureString();
            foreach (char c in input)
            {
                secure.AppendChar(c);
            }
            return secure;
        }
    }
}