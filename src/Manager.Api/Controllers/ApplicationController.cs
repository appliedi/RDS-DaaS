namespace RDSManagerAPI.Controllers
{
    using System;
    using System.Collections.Concurrent;
    using System.Collections.Generic;
    using System.Text;
    using System.Web.Http;
    using RDSManagerAPI.Entities;
    using System.Drawing;
    using System.IO;
    using System.Web;
    using System.Threading.Tasks;
    using Newtonsoft.Json;
    using Newtonsoft.Json.Linq;
    using System.Reflection;

    public class AppDetails
    {
        public string DisplayName { get; set; }

        public string Path { get; set; }

        public string Alias { get; set; }
    }

    public class ApplicationController : ApiController
    {
        private static ConcurrentDictionary<string, PowerShellExecutor<Application>> executors =
            new ConcurrentDictionary<string, PowerShellExecutor<Application>>();

        public ApplicationController()
        {
        }
        public string GetBase64(string path)
        {
            using (Image image = Image.FromFile(path))
            {
                using (MemoryStream m = new MemoryStream())
                {
                    image.Save(m, image.RawFormat);
                    byte[] imageBytes = m.ToArray();

                    // Convert byte[] to Base64 String
                    string base64String = Convert.ToBase64String(imageBytes);
                    return base64String;
                }
            }
        }
      
        [HttpGet]
        public async Task<List<Application>> GetApplication(string subscriptionId, string deploymentName, string collectionName, string collectionType, string type)
        {
           try
            {
                PowerShellExecutor<Application> executor;
                string key = deploymentName + ":" + collectionName + ":" + type;
                if (collectionType.Equals("RemoteDesktop"))
                { return GetDesktopIcon(); }
                else
                {
                    if ("collAppType".Equals(type))
                    {
                        if (!ApplicationController.executors.TryGetValue(key, out executor))
                        {
                            executor = new PowerShellExecutor<Application>();
                            executor.CmdName = "";
                            executor.NewFunc = this.NewFunc;
                            executor.Configure = (engine) =>
                            {
                                engine.AddCommand("Get-RDRemoteApp");
                                engine.AddParameter("ConnectionBroker", deploymentName);
                                engine.AddParameter("CollectionName", collectionName);
                            };
                            executor = ApplicationController.executors.GetOrAdd(key, executor);
                        }

                        return executor.GetList();
                    }
                    else
                    {
                        if (!ApplicationController.executors.TryGetValue(key, out executor))
                        {
                            executor = new PowerShellExecutor<Application>();
                            executor.CmdName = "";
                            executor.NewFunc = this.NewFunc;
                            executor.Configure = (engine) =>
                            {
                                engine.AddCommand("Get-RDAvailableApp");
                                engine.AddParameter("ConnectionBroker", deploymentName);
                                engine.AddParameter("CollectionName", collectionName);
                            };
                            executor = ApplicationController.executors.GetOrAdd(key, executor);
                        }

                        return executor.GetList();
                    }
                }
            }
            catch (Exception ex)
            {
                ErrorHelper.SendExcepToDB(ex, " GetApplication", deploymentName);
                throw ex;
            }
        }
        /// <summary>
        /// For Remote Desktop collection, there's no published applications. The whole desktop is published.
        /// </summary>
        /// <returns></returns>
        private List<Application> GetDesktopIcon()
        {
            string path = HttpContext.Current.Server.MapPath("~\\Images\\Remote_desktop_connection_icon.png");

            var listData = new List<Application>
            {
                new Application
                {
                    NavName = "",
                    Name = "Desktop",
                    Alias = "",
                    Path = "Desktop",
                    Status = "Published",
                    Type = "Remote Desktop",
                    IconContents = GetBase64(path)
                }
            };
            return (listData);
        }

       // [Authorize]
        [HttpPost]
        public async Task<List<AppDetails>> AddApps(string subscriptionId)
        {
            try
            {
                PowerShellExecutor<Application> executor;
                List<AppDetails> list = new List<AppDetails>();
                string bodyText = await this.Request.Content.ReadAsStringAsync();
                var data = JsonConvert.DeserializeObject<Dictionary<string, object>>(JsonConvert.DeserializeObject(bodyText).ToString());
                var commandData = ((JObject)data["AppDetails"]).ToObject<Dictionary<string, object>>();
                string ConnectionBroker = "\"" + commandData["ConnectionBroker"] as string + "\"";
                string collectionName = "\"" + commandData["CollectionName"] as string + "\"";
                string DisplayNames = commandData["DisplayNames"] as string;
                string[] displayNames = DisplayNames.Split(',');
                string Path = commandData["Path"] as string;
                string[] paths = Path.Split(',');
                List<AppDetails> appDetails = new List<Controllers.AppDetails>();
                for (int i = 0; i < displayNames.Length; i++)
                {
                    AppDetails app = new Controllers.AppDetails();
                    app.DisplayName = displayNames[i];
                    app.Path = paths[i];
                    appDetails.Add(app);
                }
                List<AppDetails> outApp = new List<Controllers.AppDetails>();
                foreach (var record in appDetails)
                {
                    string appName = (record.DisplayName).Replace(" ", "");
                    AppDetails app = new Controllers.AppDetails();
                    string dateKey = DateTime.Now.ToString("yyyyMMddTHHmmss");
                    string displayName = "\"" + record.DisplayName + "\"";
                    string Alias = "\"" + appName + dateKey + "\"";
                    string path = "\"" + record.Path + "\"";
                    if (!ApplicationController.executors.TryGetValue(dateKey, out executor))
                    {
                        executor = new PowerShellExecutor<Application>();
                        executor.CmdName = "";
                        executor.NewFunc = this.NewFunc;
                        executor.Configure = (engine) =>
                        {
                            engine.AddScript("New-RDRemoteApp -ConnectionBroker " + ConnectionBroker + " -CollectionName " + collectionName + " -DisplayName " + displayName + " -Alias " + Alias + " -FilePath " + path + "");
                        };
                        executor = ApplicationController.executors.GetOrAdd(dateKey, executor);
                    }
                    executor.GetList();
                    app.Alias = Alias;
                    outApp.Add(app);
                }

                return outApp;
            }
            catch (Exception ex)
            {              
                ErrorHelper.SendExcepToDB(ex, " AddApps", subscriptionId);

                throw ex;
            }
        }


        public void NewFunc(dynamic psObject, List<Application> curList)
        {
            var apps = new Application();
            apps.Alias = psObject.Alias;
            apps.Name = psObject.DisplayName;
            apps.NavName = ApplicationController.GenNavName(psObject.DisplayName);
            apps.Path = psObject.FilePath;
            apps.IconContents = Convert.ToBase64String((byte[])psObject.IconContents);
            apps.Status = "Published";
            apps.Type = "applicationType";
            curList.Add(apps);
        }

        public static string GenNavName(string name)
        {
            StringBuilder builder = new StringBuilder();
            for (int i = 0; i < name.Length; i++)
            {
                if (Char.IsWhiteSpace(name[i]))
                {
                    builder.Append('_');
                }
                else
                {
                    builder.Append(name[i]);
                }
            }

            return builder.ToString();
        }
    }
}
