namespace RDSManagerAPI.Controllers
{
    using Commands;
    using System;
    using System.Collections.Concurrent;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading;
    using System.Web.Http;
    using RDSManagerAPI.Entities;
    using Newtonsoft.Json;
    using Newtonsoft.Json.Linq;
    using System.Threading.Tasks;
    using PowershellFactory;
    using System.Configuration;
    using System.Net;
    public class RDServerController : ApiController
    {
        private static ConcurrentDictionary<string, PowerShellExecutor<RDServer>> executors =
            new ConcurrentDictionary<string, PowerShellExecutor<RDServer>>();

        public RDServerController()
        {
        }
        /// <summary>
        /// Get a list of RD Servers by their role if specified under specified Deployment FQDN
        /// </summary>
        /// <param name="deploymentName">Deployment Name/FQDN</param>
        /// <param name="role">a role filter by RDS ROLES. "FREE-RDS-RD-SERVER" is a customed role type 
        /// where only RDS-RD-SERVER which belongs to no collections will be returned</param>
        /// <returns>List of RD-Servers for certain roles if specified</returns>
        [HttpGet]
        public async Task<List<RDServer>> GetServer(string deploymentName,string role="")
        {
           try
            {
                if (role == "FREE-RDS-RD-SERVER") { return GetFreeSessionHostServers(deploymentName); }
                if (role == "STATUS-RDS-RD-SERVER") { return GetStatusSessionHostServers(deploymentName); }

                PowerShellExecutor<RDServer> executor;
                string key = deploymentName + role;
                if (!RDServerController.executors.TryGetValue(key, out executor))
                {
                    executor = new PowerShellExecutor<RDServer>();
                    executor.CmdName = "";
                    executor.NewFunc = this.NewFunc;
                    executor.Configure = (engine) =>
                    {
                        engine.AddCommand("Get-RDServer");
                        engine.AddParameter("ConnectionBroker", deploymentName);
                        if (!string.Equals(role, string.Empty))
                        {
                            engine.AddParameter("Role", role);
                        }
                    };
                    executor = RDServerController.executors.GetOrAdd(key, executor);
                }

                var list = executor.GetList();
                return list;
            }
            catch (Exception ex)
            {
                ErrorHelper.SendExcepToDB(ex, "GetServer", deploymentName);
                throw ex;
            }
        }

        /// <summary>
        /// Get a list of available Session Host Servers that are not a part of any collections under the given deployment name
        /// </summary>
        /// <param name="deploymentName">Deployment FQDN name</param>
        /// <returns>List of available Session Host Servers that are not a part of any collections under the given deployment name</returns>
        private List<RDServer> GetFreeSessionHostServers(string deploymentName)
        {
            try
            {
                string pslgetAvailableServers = ConfigurationManager.AppSettings["psl_layer"].ToString() + "/getAvailableServers.ps1";
                string psl_Script = "";
                using (WebClient client = new WebClient())
                {
                    psl_Script = client.DownloadString(pslgetAvailableServers);
                }
                // Get the available Session Host Servers via ScriptCommand/Powershell
                var command = new ScriptCommand(psl_Script, new[] { "ConnectionBroker" }, (psObject, scriptCommand) =>
                {
                    if (scriptCommand.Result == null) { scriptCommand.Result = new List<RDServer>(); }
                    var server = new RDServer { Name = psObject.Server, Type = psObject.Type + " RDSH" };
                    var servers = (List<RDServer>)scriptCommand.Result;
                    servers.Add(server);
                });
                var data = new Dictionary<string, object> { { "ConnectionBroker", deploymentName } };
                command.Init(data);
                command.Execute();

                return (List<RDServer>)command.Result ?? new List<RDServer>();
            }
            catch (Exception ex)
            {
                ErrorHelper.SendExcepToDB(ex, " GetFreeSessionHostServers", deploymentName);
                throw ex;
            }
        }
        [HttpPost]
        public async Task<string> AddCollectionServers(string subscriptionId, string brokerName, string collectionName)
        {
            string server = string.Empty;
            try
            {                
                List<string> list = new List<string>();
                string bodyText = await this.Request.Content.ReadAsStringAsync();
                var data = JsonConvert.DeserializeObject<Dictionary<string, object>>(JsonConvert.DeserializeObject(bodyText).ToString());
                var commandData = ((JObject)data["ServerDetails"]).ToObject<Dictionary<string, object>>();
                string ConnectionBroker = "\"" + brokerName + "\"";
                collectionName = "\"" + collectionName + "\"";
                string serverNames = commandData["ServerNames"] as string;
                string[] ServerNames = serverNames.Split(',');

                for (int i = 0; i < ServerNames.Length; i++)
                {
                    list.Add(ServerNames[i]);
                }
                string rawData = string.Empty;
                foreach (var servername in ServerNames)
                {
                    string serverna = "\"" + servername + "\"";
                    rawData = "{commandName:" + @"""addCollectionServer""" + ",data:{CollectionName:" + collectionName + ",ConnectionBroker:" + ConnectionBroker + ",SessionHost:" + serverna + " }}";
                    var data1 = JsonConvert.DeserializeObject<Dictionary<string, object>>(JsonConvert.DeserializeObject(rawData).ToString());
                    var command = Commands.CommandFactory.GetCommand(data1);
                    command.Execute();
                }
            }
            catch (Exception ex)
            {
                //ErrorHelper.WriteErrorToEventLog(ex.Message);
                ErrorHelper.SendExcepToDB(ex, "AddCollectionServers",brokerName);
                throw ex;
            }

            return server;
        }
        /// <summary>
        /// Get Session Host Servers with their status with a given Deployment FQDN name
        /// </summary>
        /// <param name="deploymentName">Deployment FQDN name</param>
        /// <returns>List of Session Host Servers with their status under the given deployment name</returns>
        private List<RDServer> GetStatusSessionHostServers(string deploymentName)
        {
            try
            {

                string pslgetSessionHostServerStatus = ConfigurationManager.AppSettings["psl_layer"].ToString() + "/getSessionHostServerStatus.ps1";
                string psl_Script = "";
                using (WebClient client = new WebClient())
                {
                    psl_Script = client.DownloadString(pslgetSessionHostServerStatus);
                }
                // Get the available Session Host Servers via ScriptCommand/Powershell
                string role = "STATUS-RDS-RD-SERVER";
                PowerShellExecutor<RDServer> executor;
                string key = deploymentName + ":" + role;

                if (!RDServerController.executors.TryGetValue(key, out executor))
                {
                    executor = new PowerShellExecutor<RDServer>();
                    executor.CmdName = "";
                    executor.NewFunc = this.NewRDFunc;
                    executor.Configure = (engine) =>
                    {
                        PowerShellJob.AddVariable(engine, "ConnectionBroker", deploymentName);
                        engine.AddScript(psl_Script);
                    };
                    executor = RDServerController.executors.GetOrAdd(key, executor);
                }

                var list = executor.GetList();

                return list;
            }
            catch (Exception ex)
            {
                ErrorHelper.SendExcepToDB(ex, " GetStatusSessionHostServers", deploymentName);
                throw ex;
            }
        }

        public void NewFunc(dynamic psObject, List<RDServer> serverList)
        {
            var server = new RDServer();
            server.Name = psObject.Server;
            server.Status = psObject.Status;
            server.Roles = new List<string>(psObject.Roles).Aggregate((inProgress, next) => inProgress + ", " + next);
            server.Status = "Unknown";
            serverList.Add(server);
        }

        public void NewRDFunc(dynamic psObject, List<RDServer> serverList)
        {
            var server = new RDServer();
            server.Name = psObject.Name;
            server.Status = psObject.Status;
            server.Collection = psObject.Collection;
            server.Type = psObject.Type[0] + " RDSH";
            serverList.Add(server);
        }

    }
}
