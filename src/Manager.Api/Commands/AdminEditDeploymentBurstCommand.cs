namespace RDSManagerAPI.Commands
{
    using Newtonsoft.Json.Linq;
    using System;
    using System.Collections.Generic;
    using System.Configuration;
    using System.Net;
    using System.Security;
    public class AdminEditDeploymentBurstCommand : ICommand
    {
        string DeploymentFQDN;
        bool IsActive;
        string PublishUserName;
        string PublishPassword;
        string AzureSubscriptionName;
        string ResourceGroupName;
        DateTime LastModifiedDate;
        string encryptionKey = ConfigurationManager.AppSettings["Burst"];

        public void Init(Dictionary<string, object> data)
        {
            var burstSettings = ((JObject)data["AdminBurstSettings"]).ToObject<Dictionary<string, object>>();
            this.DeploymentFQDN = burstSettings["DeploymentFQDN"] as string;
            this.PublishUserName = burstSettings["PublishUserName"] as string;
            this.PublishPassword = burstSettings["PublishPassword"] as string;
            this.AzureSubscriptionName = burstSettings["AzureSubscriptionName"] as string;
            this.ResourceGroupName = burstSettings["ResourceGroupName"] as string;
            this.IsActive = (bool)burstSettings["IsActive"];
        }

        public object Result { get; set; }

        public string Execute()
        {
            string res = "";
            string psl_Script = "";
            string validateAzurecredentials = string.Empty;
            if (IsActive)
            {
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
                var vadata = new Dictionary<string, object> { { "Auname", PublishUserName }, { "Apassword", PublishPassword }, { "subid", AzureSubscriptionName }, { "ResourceGroupPassed", ResourceGroupName } };
                aCommand.Init(vadata);
                aCommand.Execute();
            }
            else
            {
                validateAzurecredentials = "Success";
            }
            if (validateAzurecredentials == "Success")
            {
                string pslencryptString = ConfigurationManager.AppSettings["psl_layer"].ToString() + "/encryptString.ps1";
                using (WebClient client = new WebClient())
                {
                    psl_Script = client.DownloadString(pslencryptString);
                }
                string encryptedPassword = string.Empty;
                if (!string.IsNullOrEmpty(PublishPassword))
                {
                    // Encrypt the password before saving it in the DB
                    var command = new ScriptCommand(psl_Script, new[] { "String", "SecureString" },
                        (psObject, scriptCommand) =>
                        {
                            encryptedPassword = psObject.ToString();
                        });
                    var data = new Dictionary<string, object> { { "String", encryptionKey }, { "SecureString", GetSecureString(PublishPassword) } };
                    command.Init(data);
                    command.Execute();
                }

                // Update deployment burst settings in database & propogate the status to collections burst settings
                this.LastModifiedDate = DateTime.Now;
                if (!IsActive)
                {
                    var inactive = @"UPDATE DeploymentBurstSettings SET IsActive = 0, LastModifiedDate = @LastModifiedDate WHERE DeploymentFQDN = @DeploymentFQDN";
                    if (0 >= ServicesManager.Instance.ExecuteCommand(inactive, LastModifiedDate, DeploymentFQDN))
                    {
                        res = "Error updating deployment burst settings.";
                    }
                    else
                    {
                        res = "Success";
                    }
                }
                else
                {
                    string stm = @"UPDATE DeploymentBurstSettings 
                              SET IsActive = 1,
                                  PublishUserName = @PublishUserName,
                                  PublishPassword = @PublishPassword,
                                  AzureSubscriptionName = @AzureSubscriptionName,
                                  ResourceGroupName = @ResourceGroupName,
                                  LastModifiedDate = @LastModifiedDate
                              WHERE DeploymentFQDN = @DeploymentFQDN";
                    if (0 >= ServicesManager.Instance.ExecuteCommand(stm, PublishUserName, encryptedPassword, AzureSubscriptionName,
                                                            ResourceGroupName, LastModifiedDate, DeploymentFQDN))
                    {
                        res = "Error updating deployment burst settings.";
                    }
                    else { res = "Success"; }
                }
            }
            else
            {
                res = validateAzurecredentials;
            }
            this.Result = res;
            return res;
        }

        /// <summary>
        /// Get the secure string for the given string
        /// </summary>
        /// <param name="input">target string to be transformed into secure string</param>
        /// <returns>secure string of the input string</returns>
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