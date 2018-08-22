using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Threading.Tasks;
using RDSManagerAPI.Controllers;
using System.Configuration;
using System.Net;
namespace RDSManagerAPI.Commands
{
    public class AdminAddDeploymentServers :ICommand
    {
        static ConcurrentDictionary<string, Tuple<string, DateTime?, bool>> openCommands =
            new ConcurrentDictionary<string, Tuple<string, DateTime?, bool>>();

        Dictionary<string, object> data;
        string brokerFqdn;
        string[] Servers;
        string coorelationId;

        public void Init(Dictionary<string, object> data)
        {
            this.data = data;
            this.coorelationId = data["CoorelationId"] as string;
            this.brokerFqdn = data["ConnectionBroker"] as string;
            this.Servers = (data["Server"] as string).Split(',');
        }

        public object Result { get; set; }

        public string Execute()
        {
            try
            {
                string psladdserver = ConfigurationManager.AppSettings["psl_layer"].ToString() + "/addserver.ps1";
                
                string psl_Script = "";
                using (WebClient client = new WebClient())
                {
                    psl_Script = client.DownloadString(psladdserver);
                }
                var s = string.Empty;
                if (this.coorelationId == null)
                {
                    this.coorelationId = Guid.NewGuid().ToString();

                    s = "{\"status\": \"executing\",\"coorelationId\":\""
                           + this.coorelationId + "\"}";
                    this.Result = s;

                    if (openCommands.TryAdd(coorelationId,
                        new Tuple<string, DateTime?, bool>(null, DateTime.UtcNow, false)))
                    {
                        System.Threading.ThreadPool.QueueUserWorkItem((state) =>
                        {
                            Parallel.ForEach(this.Servers, server =>
                            {
                                var data = new Dictionary<string, object> { { "ConnectionBroker", brokerFqdn }, { "Server", server } };
                                var command = new ScriptCommand(psl_Script,
                                new[] { "ConnectionBroker", "Server" });
                                command.Init(data);
                                s += AdminCommandsController.ProccessCommandSub(command);
                            });

                            var val = new Tuple<string, DateTime?, bool>(s, DateTime.UtcNow, true);
                            openCommands.AddOrUpdate(this.coorelationId, val, (x, y) =>
                            {
                                return val;
                            });

                            this.PurgeCache();

                        });

                        //s = "{\"status\": \"unable to execute\"}";
                    }
                    else
                    {
                        s = "{\"status\": \"executing\",\"coorelationId\":\""
                            + this.coorelationId + "\"}";
                        this.Result = s;
                    }
                }
                else
                {

                    Tuple<string, DateTime?, bool> current = null;
                    if (!openCommands.TryGetValue(this.coorelationId, out current))
                    {
                        s = "{\"status\": \"coorelation id not found\"}";
                    }
                    else if (current.Item3)
                    {
                        openCommands.TryRemove(this.coorelationId, out current);
                        s = current.Item1;
                    }
                    else
                    {
                        s = @"{""status"": ""executing"",""coorelationId"": """ + this.coorelationId + @"""}";
                    }
                }

                this.Result = s;
                return s;
            }
            catch (Exception ex)
            {
                ErrorHelper.WriteErrorToEventLog(ex.Message);
                throw ex;
            }
        }

        private void PurgeCache()
        {
            var delIfBefore = DateTime.UtcNow.Subtract(new TimeSpan(2));
            var keys = new string[openCommands.Keys.Count];
            openCommands.Keys.CopyTo(keys, 0);
            for (int i = 0; i < keys.Length; i++)
            {
                Tuple<string, DateTime?, bool> delCurrent = null;
                if (openCommands.TryGetValue(keys[i], out delCurrent))
                {
                    if (delCurrent.Item2 == null ||
                        delIfBefore > delCurrent.Item2)
                    {
                        openCommands.TryRemove(keys[i], out delCurrent);
                    }
                }
            }
        }
    }
}