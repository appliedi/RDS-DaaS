namespace RDSManagerAPI.Controllers
{
    using System.Collections.Concurrent;
    using System.Collections.Generic;
    using System.Web.Http;
    using RDSManagerAPI.Entities;
    using System.DirectoryServices.ActiveDirectory;
    using System.DirectoryServices.AccountManagement;
    using Newtonsoft.Json;
    using Newtonsoft.Json.Linq;
    using System.Threading.Tasks;
    using Commands;
    using System.Data;
    using System;
    using PowershellFactory;
    using System.Resources;
    using System.Web;
    using System.Collections;
    using Cryptography;
    using System.Configuration;
    using System.Net;
    public class UserController : ApiController
    {
        private static ConcurrentDictionary<string, PowerShellExecutor<CollectionUser>> executors =
            new ConcurrentDictionary<string, PowerShellExecutor<CollectionUser>>();

        public UserController()
        {
        }

        [HttpGet]
        public List<CollectionUser> GetUser(string subscriptionId, string deploymentName, string collectionName)
        {
            PowerShellExecutor<CollectionUser> executor;
            string key = deploymentName + ":" + collectionName;
            if (!UserController.executors.TryGetValue(key, out executor))
            {
                executor = new PowerShellExecutor<CollectionUser>();
                executor.CmdName = "";
                executor.NewFunc = this.NewFunc;
                executor.Configure = (engine) =>
                {
                    engine.AddCommand("RDSessionCollectionConfiguration");
                    engine.AddParameter("ConnectionBroker", deploymentName);
                    engine.AddParameter("CollectionName", collectionName);
                    engine.AddParameter("UserGroup");
                };
                executor = UserController.executors.GetOrAdd(key, executor);
            }

            var list = executor.GetList();
            return list;
        }

       
        [HttpGet]
        public List<CollectionUser> GetUsersAndGroups(string deploymentName, string collectionName, string type)
        {
            PowerShellExecutor<CollectionUser> executor;
            string key = deploymentName + ":" + collectionName;
            string pslgetusersandgroups = ConfigurationManager.AppSettings["psl_layer"].ToString() + "/getusersandgroups.ps1";
            string psl_Script = "";
            using (WebClient client = new WebClient())
            {
                psl_Script = client.DownloadString(pslgetusersandgroups);
            }
            if (!UserController.executors.TryGetValue(key, out executor))
            {
                executor = new PowerShellExecutor<CollectionUser>();
                executor.CmdName = "";
                executor.NewFunc = this.NewFunc;
                executor.Configure = (engine) =>
                {
                    PowerShellJob.AddVariable(engine, "ConnectionBroker", deploymentName);
                    PowerShellJob.AddVariable(engine, "CollectionName", collectionName);
                    engine.AddScript(psl_Script);
                };
                executor = UserController.executors.GetOrAdd(key, executor);
            }

            var userlist = new List<CollectionUser>();
            var list = executor.GetList();
            if (list != null)
            {
                foreach (var value in list)
                {
                    if ((value.UserType).Equals(type))
                    {
                        userlist.Add(value);
                    }
                }
            }
            return userlist;
        }
        //end

        [HttpPost]
        public async Task<List<CollectionUser>> AuthoriseUser(string subscriptionId)
        {

            string bodyText = await this.Request.Content.ReadAsStringAsync();
            var data = JsonConvert.DeserializeObject<Dictionary<string, object>>(JsonConvert.DeserializeObject(bodyText).ToString());
            var commandData = ((JObject)data["credentials"]).ToObject<Dictionary<string, object>>();
            string fullName = commandData["username"] as string;
            string[] dfName = fullName.Split('\\');
            string domainName = dfName[0];
            string Username = dfName[1];
            string Password = commandData["password"] as string;
          
            string psl_path=ConfigurationManager.AppSettings["psl_layer"].ToString()+ "/userlogin.ps1";
            string psl_Script= "";
            using (WebClient client = new WebClient())
            {
                psl_Script = client.DownloadString(psl_path);
            }

            PowerShellExecutor<CollectionUser> executor;
        
            executor = new PowerShellExecutor<CollectionUser>();
            executor.CmdName = "";
            executor.NewFunc = this.NewFunclogin;
            executor.Configure = (engine) =>
            {
                PowerShellJob.AddVariable(engine, "caUserName", fullName);
                PowerShellJob.AddVariable(engine, "caPassword", Password);
                engine.AddScript(psl_Script);
            };
          
            List<CollectionUser> response = new List<CollectionUser>();
            CollectionUser obj = new CollectionUser();
            var list = executor.GetList();
            string res = list[0].UserType.ToString();
            obj.Name = Username.ToUpper().ToString();
            obj.UserType = res;
            if (res == "CollectionAdmin")
            {
                obj.UserType = "TenantAdmin";
                // List<CollectionUser> list = new List<CollectionUser>();


                obj.ConnectionBroker = list[0].ConnectionBroker.ToString();
            }
            string isAllowed = "Valid";//IsAllowed();
            if(isAllowed.Contains("Valid"))
            {
                obj.IsValid = true;
                obj.Message = "";
                if (isAllowed.Contains("|"))
                {
                    obj.Message = isAllowed.Split('|')[1].ToString();
                }

            }
            else
            {
                obj.IsValid = false;
                obj.Message = "";
            }

            response.Add(obj);

            return response;
        }
        public void NewFuncBroker(dynamic psObject, List<CollectionUser> userList)
        {
            var user1 = new CollectionUser();
            user1.ConnectionBroker = psObject.ConnectionBroker as string;
            userList.Add(user1);
        }       
        public void NewFunclogin(dynamic psObject, List<CollectionUser> userList)
        {
            //var users = psObject.UserGroup as string[];

            var user1 = new CollectionUser();
            user1.UserType = psObject.Status as string;
            user1.ConnectionBroker = psObject.ConnectionBroker as string;
            userList.Add(user1);

        }

        public void NewFunc(dynamic psObject, List<CollectionUser> userList)
        {
            //var users = psObject.UserGroup as string[];

            var user1 = new CollectionUser();
            user1.Name = psObject.Name as string;
            user1.UserType = psObject.Type as string;
            user1.Count = psObject.Count;
            userList.Add(user1);
            /*
                        if (users != null)
                        {
                            foreach (string userName in users)
                            {
                                var user = new CollectionUser();
                                user.Name = userName;
                                //user.Type = "userType";
                                userList.Add(user); ;
                            }
                        }
                        */
        }


        [HttpPost]
        public async Task<List<ErrorLogsMes>> GetErrors(string type)
        {
            List<ErrorLogsMes> list = new List<ErrorLogsMes>();
            try
            {
                string bodyText = await this.Request.Content.ReadAsStringAsync();
                var data = JsonConvert.DeserializeObject<Dictionary<string, object>>(JsonConvert.DeserializeObject(bodyText).ToString());
                var commandData = ((JObject)data["FilterData"]).ToObject<Dictionary<string, object>>();
                string startDate = commandData["StartDate"] as string;
                string endDate = commandData["EndDate"] as string;
                string methodName = commandData["MethodName"] as string;

                string query = @"Select Datetime,Methodname,ErrorMessage from ErrorLogs where Datetime>=@startDate AND Datetime<=@endDate AND Methodname like '%" + methodName + "%' order by Datetime desc";

                DataTable table = DBHelper.ExecuteAndGetDataTable(query, startDate, endDate);
                foreach (DataRow row in table.Rows)
                {
                    ErrorLogsMes obj = new ErrorLogsMes();
                    obj.DateTime = Convert.ToDateTime(row["Datetime"]).ToString();
                    obj.MethodName = row["Methodname"].ToString();
                    obj.Message = row["ErrorMessage"].ToString();
                    list.Add(obj);
                }
            }
            catch (Exception ex)
            {
                //ErrorHelper.SendExcepToDB(ex, " GetErrors");
                throw ex;
            }
            return list;
        }
        private string IsAllowed()
        {
            string result = string.Empty;
            try
            {
                Dictionary<string, string> dict = new Dictionary<string, string>();
                dict = GetProductData();
                ProductMaster prod = new Commands.ProductMaster();
               
                //ErrorHelper.SendExcepToDB(dict["Licensed"].ToString(), "Licensed Name","");
                if (dict["Licensed"].ToString()!="")
                {
                    //License found. check for valid
                    //get mac address
                    string clientID = prod.GetMacAddress();
                    //ErrorHelper.SendExcepToDB(clientID, "Mac name", "");
                    //decrypt license key
                    string availableClientID = dict["Licensed"].ToString().Decrypt("ms1*&tyu1Y5y90o8uiop%@#^!m");
                    //ErrorHelper.SendExcepToDB(availableClientID, "availableClientID", "");
                    availableClientID = availableClientID.Split('_')[1].ToString();
                    if(availableClientID==clientID)
                    {
                        //ErrorHelper.SendExcepToDB("succeed", "matching", "");
                        result = "Valid";
                        int dayExist = 0;

                        string availableExtendedTrial = dict["Licensed"].ToString().Decrypt("ms1*&tyu1Y5y90o8uiop%@#^!m");
                        availableExtendedTrial = availableExtendedTrial.Split('_')[3].ToString();
                        dayExist = dayExist + Convert.ToInt32(availableExtendedTrial);

                        DateTime start = Convert.ToDateTime(dict["FirstLogin"].ToString().Decrypt("ms1*&tyu1Y5y90o8uiop%@#^!m"));
                        DateTime end = DateTime.Now;
                        TimeSpan difference = end - start;
                        if (difference.Days <= dayExist)
                        {
                            if ((dayExist - difference.Days) <= 7)
                            {
                                result += "|Your License is going to be expired in " + (dayExist - difference.Days) + " days.";
                            }
                        }
                    }
                    else
                    {
                        result = "Invalid";
                    }
                }
                if (result == "Invalid" || result==string.Empty)
                {
                    int dayExist = 0;
                    if (dict["BasicTrial"].ToString() != "")
                    {
                        string availableBasicTrial = dict["BasicTrial"].ToString().Decrypt("ms1*&tyu1Y5y90o8uiop%@#^!m");
                        availableBasicTrial = availableBasicTrial.Split('_')[3].ToString();
                        dayExist = Convert.ToInt32(availableBasicTrial);
                    }
                    if (dict["ExtendedTrial"].ToString() != "")
                    {
                        string availableExtendedTrial = dict["ExtendedTrial"].ToString().Decrypt("ms1*&tyu1Y5y90o8uiop%@#^!m");
                        availableExtendedTrial = availableExtendedTrial.Split('_')[3].ToString();
                        dayExist = dayExist + Convert.ToInt32(availableExtendedTrial);
                    }
                    if (dict["FirstLogin"].ToString() != "")
                    {
                        DateTime start = Convert.ToDateTime(dict["FirstLogin"].ToString().Decrypt("ms1*&tyu1Y5y90o8uiop%@#^!m"));
                        DateTime end = DateTime.Now;
                        TimeSpan difference = end - start;
                        if(difference.Days<= dayExist)
                        {
                            result = "Valid";
                            if ((dayExist-difference.Days)<=7)
                            {
                                result += "|Your trial period is going to be expired in "+ (dayExist - difference.Days) + " days.";
                            }
                        }
                        else
                        {
                            result = "Expired";
                        }
                    }
                    else
                    {
                        result = "Expired";
                    }
                }
            }
            catch
            {
                result = "Expired";
            }
            return result;
        }
        private Dictionary<string,string> GetProductData()
        {
            Dictionary<string, string> dict = new Dictionary<string, string>();
            try
            {
                string resourcePath = System.Web.Hosting.HostingEnvironment.MapPath("~/ProductMaster.resx");
                //if (System.IO.File.Exists(resourcePath) == false)
                //{
                //    //Create resource if not exists
                //    using (ResXResourceWriter resxWriter = new ResXResourceWriter(resourcePath))
                //    {
                //        resxWriter.AddResource("FirstLogin", DateTime.Now.ToString().Encrypt("ms1*&tyu1Y5y90o8uiop%@#^!m"));
                //        resxWriter.AddResource("BasicTrial", "TrialPeriod_"+new ProductMaster().GetMacAddress()+"_Of_4_Days".Encrypt("ms1*&tyu1Y5y90o8uiop%@#^!m"));
                //        resxWriter.AddResource("ExtendedTrial", "");
                //        resxWriter.AddResource("Licensed", "");
                //    }
                //}
                //get login time
                ResXResourceReader rsxr = new ResXResourceReader(resourcePath);
                foreach (DictionaryEntry d in rsxr)
                {
                    if (d.Key.ToString() == "FirstLogin")
                    {
                        dict.Add("FirstLogin", d.Value.ToString());
                    }
                    if (d.Key.ToString() == "BasicTrial")
                    {
                        dict.Add("BasicTrial", d.Value.ToString());
                    }
                    if (d.Key.ToString() == "ExtendedTrial")
                    {
                        dict.Add("ExtendedTrial", d.Value.ToString());
                    }
                    if (d.Key.ToString() == "Licensed")
                    {
                        dict.Add("Licensed", d.Value.ToString());
                    }
                }
            }
            catch
            {
                dict = null;
            }
            return dict;
        }
        [HttpGet]
        public async Task<Dictionary<string, string>> GetClientData(string req)
        {
            Dictionary<string, string> clientData = new Dictionary<string, string>();
            try
            {
                ProductMaster prod = new Commands.ProductMaster();
                string cid = prod.GetMacAddress();
                clientData.Add("clientID", cid.Encrypt("ms1*&tyu1Y5y90o8uiop%@#^!m"));
                string resourcePath = System.Web.Hosting.HostingEnvironment.MapPath("~/ProductMaster.resx");
                ResXResourceReader rsxr = new ResXResourceReader(resourcePath);
                foreach (DictionaryEntry d in rsxr)
                {
                    if (d.Key.ToString() == "ExtendedTrial")
                    {
                        clientData.Add("ExtendedTrial", d.Value.ToString());
                    }
                    if (d.Key.ToString() == "Licensed")
                    {
                        clientData.Add("Licensed", d.Value.ToString());
                    }
                }

            }
            catch
            {
                clientData = null;
            }
            return clientData;
        }
        [HttpPost]
        public async Task<string> UpdateProduct(string req)
        {
            string Status = string.Empty;
            try
            {
                string bodyText = await this.Request.Content.ReadAsStringAsync();
                var data = JsonConvert.DeserializeObject<Dictionary<string, object>>(JsonConvert.DeserializeObject(bodyText).ToString());
                var commandData = ((JObject)data["Productstatus"]).ToObject<Dictionary<string, object>>();
                string ExtendedTrialKey = commandData["ExtendedTrialKey"] as string;
                string ExtendedTrialValue = commandData["ExtendedTrialValue"] as string;
                string LicensedKey = commandData["LicensedKey"] as string;
                string LicensedValue = commandData["LicensedValue"] as string;

                string prevLoginTime = "";
                string prevTrial = "";

                string resourcePath = System.Web.Hosting.HostingEnvironment.MapPath("~/ProductMaster.resx");
                ResXResourceReader rsxr = new ResXResourceReader(resourcePath);
                foreach (DictionaryEntry d in rsxr)
                {
                    if (d.Key.ToString() == "FirstLogin")
                    {
                        prevLoginTime = d.Value.ToString();
                    }
                    if (d.Key.ToString() == "BasicTrial")
                    {
                        prevTrial = d.Value.ToString();
                    }
                    using (ResXResourceWriter resxWriter = new ResXResourceWriter(resourcePath))
                    {
                        resxWriter.AddResource("FirstLogin", prevLoginTime);
                        resxWriter.AddResource("BasicTrial", prevTrial);
                        resxWriter.AddResource("ExtendedTrial", ExtendedTrialValue);
                        resxWriter.AddResource("Licensed", LicensedValue);
                    }
                }
                Status = "Success";
            }
            catch (Exception err)
            {
                Status = err.ToString();
            }
            return Status;
        }
    }
}
