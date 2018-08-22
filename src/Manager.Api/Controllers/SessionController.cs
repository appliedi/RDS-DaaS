namespace RDSManagerAPI.Controllers
{
    using System;
    using System.Collections.Concurrent;
    using System.Collections.Generic;
    using System.Linq;
    using System.Reflection;
    using System.Web.Http;
    using System.Configuration;
    using RDSManagerAPI.Entities;
    using System.Threading.Tasks;
    using Newtonsoft.Json;
    using Newtonsoft.Json.Linq;
    using PowershellFactory;

    public class SessionData
    {
        public string HostServer { get; set; }

        public string unifiedSessionID { get; set; }
    }
    public class SessionController : ApiController
    {
        private static ConcurrentDictionary<string, PowerShellExecutor<Session>> executors =
                new ConcurrentDictionary<string, PowerShellExecutor<Session>>();
        private static List<Session> testList = new List<Session>();
        private static bool testMode;
        private static int testSessionSize;
        long top;
        long skip;
        string searchText;
        string columnMap;

        static SessionController()
        {
            try
            {
                var validSize = int.TryParse(ConfigurationManager.AppSettings["SessionTestSessions"], out testSessionSize);
                bool.TryParse(ConfigurationManager.AppSettings["SessionTestMode"], out testMode);
                if (testMode && validSize)
                {
                    initializeSessions();
                }
            }
            catch (Exception ex)
            {
                ErrorHelper.WriteErrorToEventLog("Failed to parse/initialize session test mode " + ex.Message);
                //ErrorHelper.SendExcepToDB(ex, " SessionController","");
            }
        }

        /// <summary>
        ///
        /// </summary>
        /// <param name="subscriptionId"></param>
        /// <param name="usrlData"></param>
        /// <returns></returns>
        [HttpGet]
        public async Task<List<Session>> GetSessionTest(string subscriptionId, string deploymentInfo, string collectionName)
        {
            //var bytes = System.Convert.FromBase64String(usrlData);
            //var data = System.Text.Encoding.ASCII.GetString(bytes);
            //var inData = Newtonsoft.Json.JsonConvert.DeserializeObject<Dictionary<string, object>>(data);
            top = 25;
            skip = 0;
            searchText = "";
            columnMap = "";
            var checkQuery = false;
            List<Session> list;

            if (testMode)
            {
                list = testList;
            }
            else
            {
                PowerShellExecutor<Session> executor;
                string key = deploymentInfo + ":" + collectionName;
                if (!SessionController.executors.TryGetValue(key, out executor))
                {
                    executor = new PowerShellExecutor<Session>();
                    executor.CmdName = "";
                    executor.NewFunc = this.NewFunc;
                    executor.Configure = (engine) =>
                    {
                        PowerShellJob.AddVariable(engine, "ConnectionBroker", deploymentInfo as string);
                        PowerShellJob.AddVariable(engine, "CollectionName", collectionName as string);
                        engine.AddScript("Get-RDUserSession -ConnectionBroker $ConnectionBroker -CollectionName $CollectionName");
                    };
                    executor = SessionController.executors.GetOrAdd(key, executor);
                }

                list = executor.GetList();
            }
            if (list != null && top > 0 && skip >= 0)
            {
                if (!string.IsNullOrWhiteSpace(searchText))
                {
                    try
                    {
                        var colsMap = Newtonsoft.Json.JsonConvert.DeserializeObject<Dictionary<string, object>>(columnMap.ToLower());
                        list = SessionController.DoQuery<Session>(searchText, list, colsMap, checkQuery);
                    }
                    catch (Exception ex)
                    {
                        ErrorHelper.SendExcepToDB(ex, " GetSessionTest", deploymentInfo);
                        throw ex;
                    }
                }

            }

            return list;
        }

        static void initializeSessions()
        {
            DateTime time = DateTime.Now;
            for (int i = 0; i < testSessionSize; i++)
            {
                var session = new Session();
                session.HostServer = "hostServer" + i;
                session.IdleTime = (i % 2 == 0) ? 0 : i;
                session.LogonTime = time.AddMinutes(-i).ToString();
                session.SessionState = (i % 2 == 0) ? "STATE_ACTIVE" : "STATE_DISCONNECTED";
                session.UserName = "userName" + i;
                session.UnifiedSessionID = (uint)i;
                testList.Add(session);
            }
        }

        public SessionController()
        {
        }

        [HttpGet]
        public List<Session> GetSession(string subscriptionId, string usrlData)
        {
            var bytes = System.Convert.FromBase64String(usrlData);
            var data = System.Text.Encoding.ASCII.GetString(bytes);
            var inData = Newtonsoft.Json.JsonConvert.DeserializeObject<Dictionary<string, object>>(data);
            top = (long)inData["top"];
            skip = (long)inData["localSkip"];
            searchText = inData["searchText"] as string;
            columnMap = inData["columnMap"] as string;
            var checkQuery = (bool)inData["checkQuery"];
            List<Session> list;

            if (testMode)
            {
                list = testList;
            }
            else
            {
                PowerShellExecutor<Session> executor;
                string key = inData["deploymentInfo"] + ":" + inData["collectionName"];
                if (!SessionController.executors.TryGetValue(key, out executor))
                {
                    executor = new PowerShellExecutor<Session>();
                    executor.CmdName = "";
                    executor.NewFunc = this.NewFunc;
                    executor.Configure = (engine) =>
                    {
                        PowerShellJob.AddVariable(engine, "ConnectionBroker", inData["deploymentInfo"] as string);
                        PowerShellJob.AddVariable(engine, "CollectionName", inData["collectionName"] as string);
                        engine.AddScript("Get-RDUserSession -ConnectionBroker $ConnectionBroker -CollectionName $CollectionName");
                    };
                    executor = SessionController.executors.GetOrAdd(key, executor);
                }

                list = executor.GetList();
            }
            if (list != null && top > 0 && skip >= 0)
            {
                if (!string.IsNullOrWhiteSpace(searchText))
                {
                    try
                    {
                        var colsMap = Newtonsoft.Json.JsonConvert.DeserializeObject<Dictionary<string, object>>(columnMap.ToLower());
                        list = SessionController.DoQuery<Session>(searchText, list, colsMap, checkQuery);
                    }
                    catch (Exception ex)
                    {
                        ErrorHelper.SendExcepToDB(ex, " GetSession", subscriptionId);
                        throw ex;
                    }
                }

            }

            return list;
        }

        [HttpPost]
        public async Task<string> SendMessageToSessions(string subscriptionId)
        {
            string server = string.Empty;
            try
            {

                List<SessionData> sessionData = new List<SessionData>();
                string bodyText = await this.Request.Content.ReadAsStringAsync();
                var data = JsonConvert.DeserializeObject<Dictionary<string, object>>(JsonConvert.DeserializeObject(bodyText).ToString());
                var commandData = ((JObject)data["MessageToSesions"]).ToObject<Dictionary<string, object>>();
                string messageBody = "\"" + commandData["MessageBody"] as string + "\"";
                string messageTitle = "\"" + commandData["MessageTitle"] as string + "\"";
                string hostServersList = commandData["HostServer"] as string;
                string[] hostServers = hostServersList.Split(',');
                string sessionIDList = commandData["UnifiedSessionID"] as string;
                string[] SessionIDs = sessionIDList.Split(',');

                for (int i = 0; i < hostServers.Length; i++)
                {
                    SessionData session = new Controllers.SessionData();
                    session.HostServer = hostServers[i];
                    session.unifiedSessionID = SessionIDs[i];
                    sessionData.Add(session);
                }
                string rawData = string.Empty;
                foreach (var Session in sessionData)
                {
                    string SessionID = "\"" + Session.unifiedSessionID + "\"";
                    string hostServer = "\"" + Session.HostServer + "\"";
                    rawData = "{commandName:" + @"""sendmessagesession""" + ",data:{HostServer:" + hostServer + ",MessageTitle:" + messageTitle + ",MessageBody:" + messageBody + ",UnifiedSessionID:" + SessionID + "  }";
                    var data1 = JsonConvert.DeserializeObject<Dictionary<string, object>>(JsonConvert.DeserializeObject(rawData).ToString());
                    var command = Commands.CommandFactory.GetCommand(data1);
                    command.Execute();
                }
            }
            catch (Exception ex)
            {
                ErrorHelper.SendExcepToDB(ex, "SendMessageToSessions",subscriptionId);
                throw ex;
            }

            return server;
        }
        public void NewFunc(dynamic psObject, List<Session> sessionList)
        {
            var session = new Session();
            session.HostServer = psObject.HostServer;
            session.IdleTime = (int)(psObject.IdleTime / 60000);
            session.LogonTime = psObject.CreateTime + "";
            session.SessionState = psObject.SessionState + "";
            session.UserName = psObject.UserName;
            session.UnifiedSessionID = psObject.UnifiedSessionID;
            sessionList.Add(session);
        }

        private static List<T> DoQuery<T>(string query, List<T> data, Dictionary<string, object> colsMap, bool checkQuery)
        {
            var queryParts = GetQueryParts(query);
            if (checkQuery)
            {
                if (queryParts.Count != 3)
                {
                    throw new Exception("Query syntax is incorrect.");
                }

                data = new List<T>();

            }

            if (queryParts.Count == 3)
            {
                try
                {
                    return SessionController.SearchData<T>(data,
                        colsMap[queryParts[0]] as string,
                        queryParts[1],
                        queryParts[2]);
                }
                catch (Exception ex)
                {
                    if (checkQuery)
                    {
                        throw new Exception("Query error");
                    }
                    else
                    {
                        throw ex;
                    }
                }
            }

            return data;
        }

        private static List<string> GetQueryParts(string val)
        {
            var queryParts = new List<String>();
            var regex = new System.Text.RegularExpressions.Regex("==|<=|>=|!=|<|>");
            var match = regex.Match(val);
            if (match != null && match.Index > 0)
            {
                var startIndex = match.Index;
                var length = match.Length;
                queryParts.Add(val.Substring(0, startIndex).Trim().ToLower());
                queryParts.Add(val.Substring(startIndex, length).Trim());
                queryParts.Add(val.Substring(startIndex + length).Trim());
            }

            return queryParts;
        }

        private static List<T> SearchData<T>(List<T> data, string propName, string op, string searchVal)
        {
            var outputList = new List<T>();
            var prop = SessionController.GetProperty<T>(propName);
            if (prop != null)
            {
                var query = data.Where((item) =>
                {
                    Type t = prop.PropertyType;
                    var val = prop.GetValue(item);
                    if (val == null)
                    {
                        return false;
                    }

                    if (propName.Equals("LogonTime", StringComparison.OrdinalIgnoreCase))
                    {
                        DateTime dateVal = DateTime.Parse(val.ToString());
                        DateTime searchDate = DateTime.Parse(searchVal.ToString());
                        if (op == "==")
                        {
                            return dateVal == searchDate;
                        }
                        if (op == "!=")
                        {
                            return dateVal != searchDate;
                        }
                        else if (op == ">")
                        {
                            return dateVal > searchDate;
                        }
                        else if (op == "<")
                        {
                            return dateVal < searchDate;
                        }
                        else if (op == ">=")
                        {
                            return dateVal >= searchDate;
                        }
                        else if (op == "<=")
                        {
                            return dateVal <= searchDate;
                        }
                    }
                    else if (t == typeof(int) ||
                        t == typeof(float) ||
                        t == typeof(long) ||
                        t == typeof(double))
                    {
                        var numVal = double.Parse(searchVal);
                        var checkVal = double.Parse(val.ToString());
                        if (op == "==")
                        {
                            return numVal == checkVal;
                        }
                        if (op == "!=")
                        {
                            return numVal != checkVal;
                        }
                        else if (op == ">")
                        {
                            return checkVal > numVal;
                        }
                        else if (op == "<")
                        {
                            return checkVal < numVal;
                        }
                        else if (op == ">=")
                        {
                            return checkVal >= numVal;
                        }
                        else if (op == "<=")
                        {
                            return checkVal <= numVal;
                        }
                    }
                    else if (propName.Equals("SessionState", StringComparison.OrdinalIgnoreCase))
                    {
                        var valStr = val.ToString();
                        if (op == "==")
                        {
                            return valStr.Equals("STATE_" + searchVal.ToString().ToUpper());
                        }
                        if (op == "!=")
                        {
                            return !valStr.Equals("STATE_" + searchVal.ToString().ToUpper());
                        }
                    }
                    else
                    {
                        var valStr = val.ToString();
                        if (op == "==")
                        {
                            return valStr.Equals(searchVal);
                        }
                        else if (op == "!=")
                        {
                            return !valStr.Equals(searchVal);
                        }
                    }

                    return false;
                });

                return query.ToList();
            }

            return outputList;
        }

        public static PropertyInfo GetProperty<T>(string name)
        {
            name = name.Replace(" ", "").ToLower();
            Type t = typeof(T);
            foreach (var prop in t.GetProperties())
            {
                if (name == prop.Name.ToLower())
                {
                    return prop;
                }
            }

            return null;
        }
    }
}
