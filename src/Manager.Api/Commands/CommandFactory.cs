namespace RDSManagerAPI.Commands
{
    using Controllers;
    using Entities;
    using Newtonsoft.Json.Linq;
    using System;
    using System.Collections.Generic;
    using System.Configuration;
    using System.Net;
    public static class CommandFactory
    {
        public static ICommand GetCommand(Dictionary<string ,object> commandInfo)
        {
            string psl_Script = "";
            var commandName = commandInfo["commandName"].ToString();
            var commandData = ((JObject)commandInfo["data"]).ToObject<Dictionary<string, object>>();
            ICommand command = null;

            switch(commandName)
            {
                case "newdeployment":
                    command = new NewDeploymentCommand();
                    break;
                case "editdepoyment":
                    command = new EditDepoyment();
                    break;
                case "removedeployment":
                    command = new RemoveDeploymentCommand();
                    break;
                case "adminNewdDeployment":
                    command = new AdminNewDeploymentCommand();
                    break;
                case "adminRemovedeployment":
                    command = new AdminRemoveDeploymentCommand();
                    break;
                case "adminEditDeployment":
                    command = new AdminEditDeploymentCommand();
                    break;
                case "adminNewCollection":
                    command = new AdminNewCollectionCommand();
                    break;
                case "adminRemoveCollection":
                    command = new AdminRemoveCollectionCommand();
                    break;
                case "adminEditCollection":
                    command = new AdminEditCollectionCommand();
                    break;
                case "adminEditDeploymentBurstSettings":
                    command = new AdminEditDeploymentBurstCommand();
                    break;
                case "adminEditCollectionConfig":
                    command = new AdminEditCollectionConfigCommand();
                    break;
                case "addusercollection":
                    string psl_path = ConfigurationManager.AppSettings["psl_layer"].ToString() + "/addusercollection.ps1";
                    using (WebClient client = new WebClient())
                    {
                        psl_Script = client.DownloadString(psl_path);
                    }
                    command = new ScriptCommand(psl_Script,
                        new[] { "ConnectionBroker", "CollectionName", "UserGroup" });
                    break;
                case "addbulkusercollection":
                    string psladdbulkusercollection = ConfigurationManager.AppSettings["psl_layer"].ToString() + "/addbulkusercollection.ps1";
                  
                    using (WebClient client = new WebClient())
                    {
                        psl_Script = client.DownloadString(psladdbulkusercollection);
                    }
                    command = new ScriptCommand(psl_Script,
                        new[] { "ConnectionBroker", "CollectionName", "UserGroupsStr" });
                    break;
                case "removeusercollection":
                    string pslremoveusercollection = ConfigurationManager.AppSettings["psl_layer"].ToString() + "/removeusercollection.ps1";
                    using (WebClient client = new WebClient())
                    {
                        psl_Script = client.DownloadString(pslremoveusercollection);
                    }
                    command = new ScriptCommand(psl_Script,
                        new[] { "ConnectionBroker", "CollectionName", "UserGroup" });
                    break;
                case "addwappcollection":
                    string psladdwappcollection = ConfigurationManager.AppSettings["psl_layer"].ToString() + "/addwappcollection.ps1";
                    using (WebClient client = new WebClient())
                    {
                        psl_Script = client.DownloadString(psladdwappcollection);
                    }
                    command = new ScriptCommand(psl_Script,
                        new[] { "ConnectionBroker", "CollectionName", "DisplayName", "FilePath" });
                    break;
                case "editwappcollection":
                    string psleditwappcollection = ConfigurationManager.AppSettings["psl_layer"].ToString() + "/editwappcollection.ps1";
                    using (WebClient client = new WebClient())
                    {
                        psl_Script = client.DownloadString(psleditwappcollection);
                    }
                    command = new ScriptCommand(psl_Script,
                        new[] { "ConnectionBroker", "CollectionName", "ApplicationName", "DisplayName" });
                    break;
                case "addappcollection":
                    string psladdappcollection = ConfigurationManager.AppSettings["psl_layer"].ToString() + "/addappcollection.ps1";
                    using (WebClient client = new WebClient())
                    {
                        psl_Script = client.DownloadString(psladdappcollection);
                    }
                    command = new ScriptCommand(psl_Script,
                        new[] { "ConnectionBroker", "CollectionName", "DisplayName" });
                    break;
                case "publishdesktop":
                    string pslpublishdesktop = ConfigurationManager.AppSettings["psl_layer"].ToString() + "/publishdesktop.ps1";
                    using (WebClient client = new WebClient())
                    {
                        psl_Script = client.DownloadString(pslpublishdesktop);
                    }
                    command = new ScriptCommand(psl_Script,
                        new[] { "ConnectionBroker", "CollectionName"});
                    break;
                case "removeappcollection":
                    string pslremoveappcollection = ConfigurationManager.AppSettings["psl_layer"].ToString() + "/removeappcollection.ps1";
                    using (WebClient client = new WebClient())
                    {
                        psl_Script = client.DownloadString(pslremoveappcollection);
                    }
                    command = new ScriptCommand(psl_Script,
                        new[] { "ConnectionBroker", "CollectionName", "Alias" });
                    break;
                //case "addserver":
                //    command = new ScriptCommand(AdminCommandResource.addserver,
                //        new[] { "ConnectionBroker", "Server"});
                //    break;
                case "addserverimport":
                case "addserver":
                    command = new AdminAddDeploymentServers();
                    break;
                case "removeserver":
                    string pslremoveserver = ConfigurationManager.AppSettings["psl_layer"].ToString() + "/removeserver.ps1";
                    using (WebClient client = new WebClient())
                    {
                        psl_Script = client.DownloadString(pslremoveserver);
                    }
                    command = new ScriptCommand(psl_Script,
                        new[] { "ConnectionBroker", "Server" });
                    break;
                case "getAvailableServers":
                    string pslgetAvailableServers = ConfigurationManager.AppSettings["psl_layer"].ToString() + "/getAvailableServers.ps1";
                    using (WebClient client = new WebClient())
                    {
                        psl_Script = client.DownloadString(pslgetAvailableServers);
                    }
                    command = new ScriptCommand(psl_Script,
                        new[] { "ConnectionBroker"});
                    break;
                case "addCollectionServer":
                    string psladdCollectionServer = ConfigurationManager.AppSettings["psl_layer"].ToString() + "/addCollectionServer.ps1";
                  
            using (WebClient client = new WebClient())
            {
                psl_Script = client.DownloadString(psladdCollectionServer);
            }
            command = new ScriptCommand(psl_Script,
                        new[] { "ConnectionBroker", "CollectionName", "SessionHost" });
                    break;
                case "removeCollectionServer":
                    string pslremoveCollectionServer = ConfigurationManager.AppSettings["psl_layer"].ToString() + "/removeCollectionServer.ps1";
                    using (WebClient client = new WebClient())
                    {
                        psl_Script = client.DownloadString(pslremoveCollectionServer);
                    }
                    command = new ScriptCommand(psl_Script,
                        new[] { "ConnectionBroker","SessionHost" });
                    break;
                case "startserver":
                    string pslstartserver = ConfigurationManager.AppSettings["psl_layer"].ToString() + "/startserver.ps1";
                    using (WebClient client = new WebClient())
                    {
                        psl_Script = client.DownloadString(pslstartserver);
                    }
                    command = new ScriptCommand(psl_Script,
                        new[] { "ConnectionBroker", "SessionHost" });
                    break;
                case "shutdownserveradmin":
                    string pslshutdownserver1 = ConfigurationManager.AppSettings["psl_layer"].ToString() + "/shutdownserver1.ps1";
                    using (WebClient client = new WebClient())
                    {
                        psl_Script = client.DownloadString(pslshutdownserver1);
                    }
                    command = new ScriptCommand(psl_Script,
                        new[] { "ConnectionBroker", "SessionHost" });
                    break;
                case "shutdownserver":

                    string pslshutdownserver = ConfigurationManager.AppSettings["psl_layer"].ToString() + "/shutdownserver.ps1";
                    using (WebClient client = new WebClient())
                    {
                        psl_Script = client.DownloadString(pslshutdownserver);
                    }
                    command = new ScriptCommand(psl_Script,
                        new[] { "ConnectionBroker", "SessionHost" });
                    break;
                case "sendmessageserver":
                    string pslsendmessageserver = ConfigurationManager.AppSettings["psl_layer"].ToString() + "/sendmessageserver.ps1";
                    using (WebClient client = new WebClient())
                    {
                        psl_Script = client.DownloadString(pslsendmessageserver);
                    }
                    command = new ScriptCommand(psl_Script,
                       new[] { "HostServer", "MessageTitle", "MessageBody", "ConnectionBroker" });
                    break;
                case "logOffAllSessions":
                    string psllogOffAllSessions = ConfigurationManager.AppSettings["psl_layer"].ToString() + "/logOffAllSessions.ps1";
                    using (WebClient client = new WebClient())
                    {
                        psl_Script = client.DownloadString(psllogOffAllSessions);
                    }
                    command = new ScriptCommand(psl_Script,
                        new[] { "ConnectionBroker", "CollectionName" });
                    break;
                case "logOffSelectedSession":
                    string psllogOffSelectedSession = ConfigurationManager.AppSettings["psl_layer"].ToString() + "/logOffSelectedSession.ps1";
                    using (WebClient client = new WebClient())
                    {
                        psl_Script = client.DownloadString(psllogOffSelectedSession);
                    }
                    command = new ScriptCommand(psl_Script,
                        new[] { "HostServer", "UnifiedSessionID" });
                    break;
                case "disconnectAllSessions":
                    string psldisconnectAllSessions = ConfigurationManager.AppSettings["psl_layer"].ToString() + "/disconnectAllSessions.ps1";
                    using (WebClient client = new WebClient())
                    {
                        psl_Script = client.DownloadString(psldisconnectAllSessions);
                    }
                    command = new ScriptCommand(psl_Script,
                        new[] { "ConnectionBroker", "CollectionName" });
                    break;
                case "disconnectSelectedSession":
                    string psldisconnectSelectedSession = ConfigurationManager.AppSettings["psl_layer"].ToString() + "/disconnectSelectedSession.ps1";
                    using (WebClient client = new WebClient())
                    {
                        psl_Script = client.DownloadString(psldisconnectSelectedSession);
                    }
                    command = new ScriptCommand(psl_Script,
                        new[] { "HostServer", "UnifiedSessionID" });
                    break;
                case "sendmessagesession":
                    string pslsendmessagesession = ConfigurationManager.AppSettings["psl_layer"].ToString() + "/sendmessagesession.ps1";
                    using (WebClient client = new WebClient())
                    {
                        psl_Script = client.DownloadString(pslsendmessagesession);
                    }
                    command = new ScriptCommand(psl_Script,
                         new[] { "HostServer", "MessageTitle", "MessageBody", "UnifiedSessionID" });
                    break;
                case "getappusercollection":
                    string pslgetappusercollection = ConfigurationManager.AppSettings["psl_layer"].ToString() + "/getappusercollection.ps1";
                    using (WebClient client = new WebClient())
                    {
                        psl_Script = client.DownloadString(pslgetappusercollection);
                    }
                    command = new ScriptCommand(psl_Script,
                        new[] { "ConnectionBroker", "CollectionName", "Alias" });
                    break;
                case "addappusercollection":
                    string psladdappusercollection = ConfigurationManager.AppSettings["psl_layer"].ToString() + "/addappusercollection.ps1";
                    using (WebClient client = new WebClient())
                    {
                        psl_Script = client.DownloadString(psladdappusercollection);
                    }
                    command = new ScriptCommand(psl_Script,
                        new[] { "ConnectionBroker", "CollectionName", "Alias", "UserGroup" });
                    break;
                case "removeappusercollection":
                    string pslremoveappusercollection = ConfigurationManager.AppSettings["psl_layer"].ToString() + "/removeappusercollection.ps1";
                    using (WebClient client = new WebClient())
                    {
                        psl_Script = client.DownloadString(pslremoveappusercollection);
                    }
                    command = new ScriptCommand(psl_Script,
                        new[] { "ConnectionBroker", "CollectionName", "Alias", "UserGroup" });
                    break;
                case "addappbulkusercollection":
                    string psladdappbulkusercollection = ConfigurationManager.AppSettings["psl_layer"].ToString() + "/addappbulkusercollection.ps1";
                    using (WebClient client = new WebClient())
                    {
                        psl_Script = client.DownloadString(psladdappbulkusercollection);
                    }
                    command = new ScriptCommand(psl_Script,
                        new[] { "ConnectionBroker", "CollectionName", "Alias", "UserGroupsStr" });
                    break;
                case "getcollectionconfig":
                    command = new GetCollectionConfigCommand(1);
                    break;
                case "getcollectionconfigForScaleSettings":
                    command = new GetCollectionConfigCommand(2);
                    break;
                case "getcollectionconfigForClientSettings":
                    command = new GetCollectionConfigCommand(3);
                    break;
                case "savecollectionconfig":
                    command = new SaveCollectionConfigCommand(1);
                    break;
                case "savecollectionconfigForScaleSettings":
                    command = new SaveCollectionConfigCommand(2);
                    break;
                case "savecollectionconfigForClientSettings":
                    command = new SaveCollectionConfigCommand(3);
                    break;
                case "getparameters":
                    string pslgetparameters = ConfigurationManager.AppSettings["psl_layer"].ToString() + "/getparameters.ps1";
                    using (WebClient client = new WebClient())
                    {
                        psl_Script = client.DownloadString(pslgetparameters);
                    }
                    command = new ScriptCommand(psl_Script,
                        new[] { "ConnectionBroker", "CollectionName", "Alias" }, (psObject, scriptCommand) =>
                        {
                            var app = new Application();
                            app.Alias = psObject.Alias;
                            app.Name = psObject.DisplayName;
                            app.NavName = ApplicationController.GenNavName(psObject.DisplayName);
                            app.Path = psObject.FilePath;
                            app.FolderPath = psObject.FolderName;
                            app.CommandLineParameters = psObject.RequiredCommandLine;
                            app.Status = "ok";
                            app.Type = "applicationType";
                            scriptCommand.Result = app;
                        });
                    break;
                case "saveparameters":
                    if (!commandData.ContainsKey("RequiredCommandLine") ||
                        string.IsNullOrEmpty(commandData["RequiredCommandLine"] as string))
                    {
                        commandData["RequiredCommandLine"] = string.Empty;
                        commandData["CommandLineSetting"] = "DoNotAllow";
                    }else
                    {
                        commandData["CommandLineSetting"] = "Require";
                    }
                    string pslsaveparameters = ConfigurationManager.AppSettings["psl_layer"].ToString() + "/saveparameters.ps1";
                    using (WebClient client = new WebClient())
                    {
                        psl_Script = client.DownloadString(pslsaveparameters);
                    }
                    command = new ScriptCommand(psl_Script,
                        new[] { "ConnectionBroker", "CollectionName", "Alias",
                            "CommandLineSetting", "RequiredCommandLine", "DisplayName", "FilePath", "FolderPath" });
                    break;
                default:
                    throw new Exception("Unknown operation: " + commandName);
            }

            command.Init(commandData);
            return command;
        }
    }
}