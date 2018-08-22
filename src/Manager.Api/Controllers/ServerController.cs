namespace RDSManagerAPI.Controllers
{
    using Commands;
    using System.Collections.Concurrent;
    using System.Collections.Generic;
    using System.Web.Http;
    using RDSManagerAPI.Entities;
    using System.Threading.Tasks;
    using Newtonsoft.Json;
    using Newtonsoft.Json.Linq;
    using System;
    using System.Xml;
    using System.Web;
    using System.Data.SqlClient;
    using System.IO;
    using System.Data;
    using System.Globalization;
    using PowershellFactory;
    using System.Configuration;
    using System.Net;

    public class ServerController : ApiController
    {
        private static ConcurrentDictionary<string, PowerShellExecutor<Server>> executors =
            new ConcurrentDictionary<string, PowerShellExecutor<Server>>();

        public ServerController()
        {
        }

        [HttpGet]
        public List<Server> GetServer(string subscriptionId, string deploymentName, string collectionName)
        {
            PowerShellExecutor<Server> executor;
            string key = deploymentName + ":" + collectionName;
            string pslgetsessionhost = ConfigurationManager.AppSettings["psl_layer"].ToString() + "/getsessionhost.ps1";
            string psl_Script = "";
            using (WebClient client = new WebClient())
            {
                psl_Script = client.DownloadString(pslgetsessionhost);
            }
            if (!ServerController.executors.TryGetValue(key, out executor))
            {
                executor = new PowerShellExecutor<Server>();
                executor.CmdName = "";
                executor.NewFunc = this.NewFunc;
                executor.Configure = (engine) =>
                {
                    PowerShellJob.AddVariable(engine, "ConnectionBroker", deploymentName);
                    PowerShellJob.AddVariable(engine, "CollectionAlias", collectionName);
                    engine.AddScript(psl_Script);
                };
                executor = ServerController.executors.GetOrAdd(key, executor);
            }

            var list = executor.GetList();
            return list;
        }

        [HttpGet]
        public async Task<List<Server>> GetServer(string deploymentName, string collectionName)
        {
            string pslgetcollectionserver = ConfigurationManager.AppSettings["psl_layer"].ToString() + "/getcollectionserver.ps1";
            string psl_Script = "";
            using (WebClient client = new WebClient())
            {
                psl_Script = client.DownloadString(pslgetcollectionserver);
            }
            var command = new ScriptCommand(psl_Script, new[] { "ConnectionBroker", "CollectionName" },
                (psObject, scriptCommand) =>
                {
                    if (scriptCommand.Result == null)
                    {
                        scriptCommand.Result = new List<Server>();
                    }
                    var server = new Server { Name = psObject.SessionHost };
                    var servers = (List<Server>)scriptCommand.Result;
                    servers.Add(server);
                });
            var data = new Dictionary<string, object> { { "ConnectionBroker", deploymentName }, { "CollectionName", collectionName } };
            command.Init(data);
            command.Execute();
            return (List<Server>)command.Result ?? new List<Server>();
        }
        [HttpPost]
        public async Task<string> AddServers(string subscriptionId)
        {
            string server = string.Empty;
            try
            {
                string psladdserver = ConfigurationManager.AppSettings["psl_layer"].ToString() + "/addserver.ps1";
                string psl_Script = "";
                using (WebClient client = new WebClient())
                {
                    psl_Script = client.DownloadString(psladdserver);
                }
                List<string> list = new List<string>();
                string bodyText = await this.Request.Content.ReadAsStringAsync();
                var data = JsonConvert.DeserializeObject<Dictionary<string, object>>(JsonConvert.DeserializeObject(bodyText).ToString());
                var commandData = ((JObject)data["ServerDetails"]).ToObject<Dictionary<string, object>>();
                string ConnectionBroker = commandData["ConnectionBroker"] as string;
                string serverNames = commandData["ServerNames"] as string;
                string[] ServerNames = serverNames.Split(',');

                for (int i = 0; i < ServerNames.Length; i++)
                {
                    list.Add(ServerNames[i]);
                }
                string rawData = string.Empty;
                foreach (var servername in ServerNames)
                {
                    string key = ConnectionBroker + ":" + servername;
                    var dict = new Dictionary<string, object> { { "ConnectionBroker", ConnectionBroker }, { "Server", servername } };
                    var command = new ScriptCommand(psl_Script,
                    new[] { "ConnectionBroker", "Server" });
                    command.Init(dict);
                    server = AdminCommandsController.ProccessCommandSub(command);
                }
            }
            catch (Exception ex)
            {
                //ErrorHelper.WriteErrorToEventLog(ex.Message);
                ErrorHelper.SendExcepToDB(ex, " AddServers",subscriptionId);
                throw ex;
            }

            return server;
        }


        [HttpPost]
        public async Task<string> SendMessageToServers(string subscriptionId, string brokerName, string collectionName, string type)
        {
            string server = string.Empty;
            try
            {
                List<string> list = new List<string>();
                string bodyText = await this.Request.Content.ReadAsStringAsync();
                var data = JsonConvert.DeserializeObject<Dictionary<string, object>>(JsonConvert.DeserializeObject(bodyText).ToString());
                var commandData = ((JObject)data["MessageToServer"]).ToObject<Dictionary<string, object>>();
                string connectionBroker = "\"" + brokerName + "\"";
                string messageBody = "\"" + commandData["MessageBody"] as string + "\"";
                string messageTitle = "\"" + commandData["MessageTitle"] as string + "\"";
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
                    rawData = "{commandName:" + @"""sendmessageserver""" + ",data:{HostServer:" + serverna + ",MessageTitle:" + messageTitle + ",MessageBody:" + messageBody + ",ConnectionBroker:" + connectionBroker + "  }";
                    var data1 = JsonConvert.DeserializeObject<Dictionary<string, object>>(JsonConvert.DeserializeObject(rawData).ToString());
                    var command = Commands.CommandFactory.GetCommand(data1);
                    command.Execute();
                }
            }
            catch (Exception ex)
            {
                ErrorHelper.SendExcepToDB(ex, "SendMessageToServers",brokerName);
                throw ex;
            }

            return server;
        }
        public void NewFunc(dynamic psObject, List<Server> serverList)
        {
            var server = new Server();
            server.Name = psObject.Name;
            server.Status = psObject.Status;
            server.Sessions = psObject.Sessions;
            server.Type = psObject.Type[0] + " RDSH";
            serverList.Add(server);
        }

        [HttpPost]
        public async Task<string> UpdateDBCredentials(string subID)
        {
            string resultResponse = string.Empty;
            try
            {
                string bodyText = await this.Request.Content.ReadAsStringAsync();
                var data = JsonConvert.DeserializeObject<Dictionary<string, object>>(JsonConvert.DeserializeObject(bodyText).ToString());
                var commandData = ((JObject)data["Credential"]).ToObject<Dictionary<string, object>>();
                string serverName =commandData["serverName"] as string;
                string dbName = commandData["dbName"] as string;
                string userId = commandData["userId"] as string;
                string password = commandData["password"] as string;
                string domainName = commandData["domainName"] as string;

                //Test Connection
                bool result = false;
                string cs = "Initial Catalog=" + dbName + ";Server=" + serverName + ";Password=" + password + ";User Id=" + userId + ";";
                using (SqlConnection connection = new SqlConnection(cs))
                {
                    try{connection.Open();result = true;}
                    catch{result= false; }
                }
                //End testing connection
                if(result==true)
                {
                    string filePath = HttpContext.Current.Server.MapPath("~/Settings/DBServerCredentials.xml");
                    XmlDocument doc = new XmlDocument();
                    doc.Load(filePath);
                    XmlNode root = doc.DocumentElement;
                    XmlNode myNodeServer = root.SelectSingleNode("Server");
                    myNodeServer.InnerText = serverName;
                    XmlNode myNodeDatabase = root.SelectSingleNode("Database");
                    myNodeDatabase.InnerText = dbName;
                    XmlNode myNodeUserID = root.SelectSingleNode("UserID");
                    myNodeUserID.InnerText = userId;
                    XmlNode myNodePassword = root.SelectSingleNode("Password");
                    myNodePassword.InnerText = password;
                    if(domainName.Trim()!="")
                    {
                        XmlNode myNodeDomainName = root.SelectSingleNode("DomainName");
                        myNodeDomainName.InnerText = domainName;
                    }
                    doc.Save(filePath);
                    resultResponse = "Success";
                }
                else
                {
                    resultResponse = "Could not update ! Invalid server credentials .";
                }
            }
            catch (Exception ex)
            {
                //ErrorHelper.WriteErrorToEventLog(ex.Message);
                ErrorHelper.SendExcepToDB(ex, "UpdateDBCredentials",subID);
                throw ex;
            }
            return resultResponse;
        }
        [HttpGet]
        public async Task<Dictionary<string, string>> GetDBCredentials()
        {
            Dictionary<string, string> credentialList = new Dictionary<string, string>();
            try
            {
                XmlDataDocument xmldoc = new XmlDataDocument();
                XmlNodeList xmlnode;
                string serverName = null;
                string dbName = null;
                string userId = null;
                string filePath = HttpContext.Current.Server.MapPath("~/Settings/DBServerCredentials.xml");
                FileStream fs = new FileStream(filePath, FileMode.Open, FileAccess.Read);
                xmldoc.Load(fs);
                xmlnode = xmldoc.GetElementsByTagName("Credentials");
                for (int i = 0; i <= xmlnode.Count - 1; i++)
                {
                    credentialList.Add("serverName", xmlnode[i].ChildNodes.Item(0).InnerText.Trim());
                    credentialList.Add("dbName", xmlnode[i].ChildNodes.Item(1).InnerText.Trim());
                    credentialList.Add("userId", xmlnode[i].ChildNodes.Item(2).InnerText.Trim());
                    credentialList.Add("password", xmlnode[i].ChildNodes.Item(3).InnerText.Trim());
                }
                fs.Close();
                fs.Dispose();
            }
            catch { }
            return credentialList;
        }

        [HttpGet]
        public async Task<List<DiagnosticData>> GetDiagnosticData(string vm, string FromDate, string ToDate, string type)
        {
            string fromDate = FromDate.Replace("_", " ").Replace("!", ":");
            string toDate = ToDate.Replace("_", " ").Replace("!", ":");
            List<DiagnosticData> result = new List<DiagnosticData>();

            if (type == "CPU")
            {
                try
                {
                    string stm = @"SELECT InstanceDateTime,CPUUsagePercentage FROM TBL_ServersMonitoring WHERE ServerName='" + vm + "' AND InstanceDateTime>='" + fromDate + "' AND InstanceDateTime<='" + toDate + "' ORDER BY InstanceDateTime ASC";
                    System.Data.DataTable response = DBHelper.ExecuteAndGetDataTable(stm);
                    DateTime todat = Convert.ToDateTime(toDate);
                    decimal prevVal = 0;
                    for (DateTime date = Convert.ToDateTime(fromDate); date <= todat; date = date.AddMinutes(1))
                    {
                        if (date.Date == DateTime.MaxValue.Date)
                        {
                            break;
                        }
                        DiagnosticData obj = new DiagnosticData();
                        DateTime dateTime = date;
                        obj.Time = dateTime.Day.ToString() + " " + CultureInfo.CurrentCulture.DateTimeFormat.GetMonthName(dateTime.Month).Substring(0, 3) + " " + dateTime.ToShortTimeString();
                        DataRow[] rowInd= response.Select("InstanceDateTime='"+ date + "'");
                        obj.Data = prevVal;
                        foreach (DataRow row in rowInd)
                        {
                            obj.Data = Convert.ToDecimal(row["CPUUsagePercentage"]);
                            prevVal = obj.Data;
                            break;
                        }
                        result.Add(obj);
                    }

                }
                catch { }
                var list = result;
                return list;
            }
            else if (type == "DISK")
            {
                try
                {
                    string stm = @"SELECT InstanceDateTime,DiskReadBytes,DiskWriteBytes FROM TBL_ServersMonitoring WHERE ServerName='" + vm + "' AND InstanceDateTime>='" + fromDate + "' AND InstanceDateTime<='" + toDate + "' ORDER BY InstanceDateTime ASC";
                    System.Data.DataTable response = DBHelper.ExecuteAndGetDataTable(stm);
                    DateTime todat = Convert.ToDateTime(toDate);
                    decimal prevValR = 0;
                    decimal prevValW = 0;
                    for (DateTime date = Convert.ToDateTime(fromDate); date <= todat; date = date.AddMinutes(1))
                    {
                        if (date.Date == DateTime.MaxValue.Date)
                        {
                            break;
                        }
                        DiagnosticData obj = new DiagnosticData();
                        DateTime dateTime = date;
                        obj.Time = dateTime.Day.ToString() + " " + CultureInfo.CurrentCulture.DateTimeFormat.GetMonthName(dateTime.Month).Substring(0, 3) + " " + dateTime.ToShortTimeString();
                        DataRow[] rowInd = response.Select("InstanceDateTime='" + date + "'");
                        obj.Read = prevValR;
                        obj.Write = prevValW;
                        foreach (DataRow row in rowInd)
                        {
                            obj.Read = Convert.ToDecimal(row["DiskReadBytes"]);
                            obj.Write = Convert.ToDecimal(row["DiskWriteBytes"]);
                            prevValR = obj.Read;
                            prevValW = obj.Write;
                            break;
                        }
                        result.Add(obj);
                    }
                }
                catch { }

                var list = result;
                return list;
            }
            else if (type == "NETWORK")
            {
                try
                {
                    string stm = @"SELECT InstanceDateTime,NetworkINBytes,NetworkOutBytes FROM TBL_ServersMonitoring WHERE ServerName='" + vm + "' AND InstanceDateTime>='" + fromDate + "' AND InstanceDateTime<='" + toDate + "' ORDER BY InstanceDateTime ASC";
                    System.Data.DataTable response = DBHelper.ExecuteAndGetDataTable(stm);
                    DateTime todat = Convert.ToDateTime(toDate);
                    decimal prevValI = 0;
                    decimal prevValO = 0;
                    for (DateTime date = Convert.ToDateTime(fromDate); date <= todat; date = date.AddMinutes(1))
                    {
                        if (date.Date == DateTime.MaxValue.Date)
                        {
                            break;
                        }
                        DiagnosticData obj = new DiagnosticData();
                        DateTime dateTime = date;
                        obj.Time = dateTime.Day.ToString() + " " + CultureInfo.CurrentCulture.DateTimeFormat.GetMonthName(dateTime.Month).Substring(0, 3) + " " + dateTime.ToShortTimeString();
                        DataRow[] rowInd = response.Select("InstanceDateTime='" + date + "'");
                        obj.In = prevValI;
                        obj.Out = prevValO;
                        foreach (DataRow row in rowInd)
                        {
                            obj.In = Convert.ToDecimal(row["NetworkINBytes"]);
                            obj.Out = Convert.ToDecimal(row["NetworkOutBytes"]);
                            prevValI = obj.In;
                            prevValO = obj.Out;
                            break;
                        }
                        result.Add(obj);
                    }
                }
                catch { }

                var list = result;
                return list;
            }
            else if (type == "SHSSESSION")
            {
                try
                {
                    //string stm = @"SELECT SessionDateTime,Count(SessionDateTime) as Count FROM TBL_TrackingSessions WHERE HostServer='" + vm + "' AND SessionState='ACTIVE' AND SessionDateTime>='" + fromDate + "' AND SessionDateTime<='" + toDate + "' GROUP BY SessionDateTime,UserName ORDER BY SessionDateTime ASC";
                    string stm = "exec SessionOnlyDateTimeCount '" + vm + "','" + fromDate + "','" + toDate + "'";
                    System.Data.DataTable response = DBHelper.ExecuteAndGetDataTable(stm);
                    DateTime todat = Convert.ToDateTime(toDate);
                    int prevVal = 0;
                    for (DateTime date = Convert.ToDateTime(fromDate); date <= todat; date = date.AddMinutes(1))
                    {
                        if (date.Date == DateTime.MaxValue.Date)
                        {
                            break;
                        }
                        DiagnosticData obj = new DiagnosticData();
                        DateTime dateTime = date;
                        obj.Time = dateTime.Day.ToString() + " " + CultureInfo.CurrentCulture.DateTimeFormat.GetMonthName(dateTime.Month).Substring(0, 3) + " " + dateTime.ToShortTimeString();
                        DataRow[] rowInd = response.Select("SessionDateTime='" + date + "'");
                        obj.ActiveSessions = prevVal;
                        foreach (DataRow row in rowInd)
                        {
                            obj.ActiveSessions = Convert.ToInt32(row["Count"]);
                            prevVal = obj.ActiveSessions;
                            break;
                        }
                        result.Add(obj);
                    }

                    //if (response.Rows.Count > 0)
                    //{
                    //    for (int i = 0; i < response.Rows.Count; i++)
                    //    {
                    //        DiagnosticData obj = new DiagnosticData();
                    //        DateTime dateTime = Convert.ToDateTime(response.Rows[i]["SessionDateTime"].ToString());
                    //        obj.Time = dateTime.Day.ToString() + " " + CultureInfo.CurrentCulture.DateTimeFormat.GetMonthName(dateTime.Month).Substring(0, 3) + " " + dateTime.ToShortTimeString();
                    //        obj.ActiveSessions = Convert.ToInt32(response.Rows[i]["Count"]);
                    //        result.Add(obj);
                    //    }
                    //}
                    //else
                    //{
                    //    for (DateTime date = Convert.ToDateTime(fromDate); date.Date <= Convert.ToDateTime(toDate).Date; date = date.AddMinutes(5))
                    //    {
                    //        if (date.Date == DateTime.MaxValue.Date)
                    //        {
                    //            break;
                    //        }
                    //        DiagnosticData obj = new DiagnosticData();
                    //        DateTime dateTime = date;
                    //        obj.Time = dateTime.Day.ToString() + " " + CultureInfo.CurrentCulture.DateTimeFormat.GetMonthName(dateTime.Month).Substring(0, 3) + " " + dateTime.ToShortTimeString();
                    //        obj.ActiveSessions = 0;
                    //        result.Add(obj);
                    //    }
                    //}
                }
                catch { }

                var list = result;
                return list;
            }
            else if (type == "COLLECTIONSHS")
            {
                try
                {
                    //string stm = @"SELECT SessionDateTime,Count(SessionDateTime) as Count FROM TBL_TrackingSessions WHERE CollectionName='" + vm + "' AND SessionState='ACTIVE' AND SessionDateTime>='" + fromDate + "' AND SessionDateTime<='" + toDate + "' GROUP BY HostServer,SessionDateTime ORDER BY SessionDateTime ASC";
                    string stm = "exec SessionDateTimeCount '"+vm+"','"+ fromDate + "','"+toDate+"'";
                    System.Data.DataSet response = DBHelper.ExecuteAndGetDataSet(stm);
                    DateTime todat = Convert.ToDateTime(toDate);
                    int prevValSES = 0;
                    int prevValSHS = 0;

                    for (DateTime date = Convert.ToDateTime(fromDate); date <= todat; date = date.AddMinutes(1))
                    {
                        if (date.Date == DateTime.MaxValue.Date)
                        {
                            break;
                        }
                        DiagnosticData obj = new DiagnosticData();
                        DateTime dateTime = date;
                        obj.Time = dateTime.Day.ToString() + " " + CultureInfo.CurrentCulture.DateTimeFormat.GetMonthName(dateTime.Month).Substring(0, 3) + " " + dateTime.ToShortTimeString();
                        DataRow[] rowInd = response.Tables[0].Select("SessionDateTime='" + date + "'");
                        obj.ActiveSHS = prevValSHS;
                        foreach (DataRow row in rowInd)
                        {
                            obj.ActiveSHS = Convert.ToInt32(row["Count"]);
                            prevValSHS = obj.ActiveSHS;
                            break;
                        }
                        DataRow[] rowIndSes = response.Tables[1].Select("SessionDateTime='" + date + "'");
                        obj.ActiveSessions = prevValSES;
                        foreach (DataRow row in rowIndSes)
                        {
                            obj.ActiveSessions = Convert.ToInt32(row["Count"]);
                            prevValSES = obj.ActiveSessions;
                            break;
                        }
                        result.Add(obj);
                    }

                    //if (response.Tables[0].Rows.Count > 0)
                    //{
                    //    for (int i = 0; i < response.Tables[0].Rows.Count; i++)
                    //    {
                    //        DiagnosticData obj = new DiagnosticData();
                    //        DateTime dateTime = Convert.ToDateTime(response.Tables[0].Rows[i]["SessionDateTime"].ToString());
                    //        obj.Time = dateTime.Day.ToString() + " " + CultureInfo.CurrentCulture.DateTimeFormat.GetMonthName(dateTime.Month).Substring(0, 3) + " " + dateTime.ToShortTimeString();
                    //        obj.ActiveSHS = Convert.ToInt32(response.Tables[0].Rows[i]["Count"]);
                    //        if(i> response.Tables[1].Rows.Count)
                    //        {
                    //            obj.ActiveSessions = 0;
                    //        }
                    //        else
                    //        {
                    //            obj.ActiveSessions = Convert.ToInt32(response.Tables[1].Rows[i]["Count"]);
                    //        }
                    //        result.Add(obj);
                    //    }
                    //}
                    //else
                    //{
                    //    for (DateTime date = Convert.ToDateTime(fromDate); date.Date <= Convert.ToDateTime(toDate).Date; date = date.AddMinutes(5))
                    //    {
                    //        if (date.Date == DateTime.MaxValue.Date)
                    //        {
                    //            break;
                    //        }
                    //        DiagnosticData obj = new DiagnosticData();
                    //        DateTime dateTime = date;
                    //        obj.Time = dateTime.Day.ToString() + " " + CultureInfo.CurrentCulture.DateTimeFormat.GetMonthName(dateTime.Month).Substring(0, 3) + " " + dateTime.ToShortTimeString();
                    //        obj.ActiveSessions = 0;
                    //        result.Add(obj);
                    //    }
                    //}
                }
                catch { }

                var list = result;
                return list;
            }
            else
            {
                return null;
            }
        }

        public class DiagnosticData
        {
            public string Time { get; set; }
            public decimal Data { get; set; }
            public decimal Read { get; set; }
            public decimal Write { get; set; }
            public decimal In { get; set; }
            public decimal Out { get; set; }
            public int ActiveSHS { get; set; }
            public int ActiveSessions { get; set; }
        }
    }
}
