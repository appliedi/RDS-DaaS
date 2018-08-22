namespace RDSManagerAPI.Controllers
{
    using System.Collections.Concurrent;
    using System.Collections.Generic;
    using System.Web.Http;
    using RDSManagerAPI.Entities;
    using System.Configuration;
    using System.Xml;
    using System.IO;
    using System.Web;
    using System;

    public class AppUserController : ApiController
    {
        private static ConcurrentDictionary<string, PowerShellExecutor<CollectionUser>> executors =
            new ConcurrentDictionary<string, PowerShellExecutor<CollectionUser>>();

        public AppUserController()
        {
        }

        [HttpGet]
        public List<CollectionUser> GetUser(string subscriptionId, string deploymentName, string collectionName, string alias)
        {
           try
            {
                PowerShellExecutor<CollectionUser> executor;
                string key = deploymentName + ":" + collectionName + ":" + alias;
                if (!AppUserController.executors.TryGetValue(key, out executor))
                {
                    executor = new PowerShellExecutor<CollectionUser>();
                    executor.CmdName = "";
                    executor.NewFunc = this.NewFunc;
                    executor.Configure = (engine) =>
                    {
                        engine.AddCommand("Get-RDRemoteApp");
                        engine.AddParameter("ConnectionBroker", deploymentName);
                        engine.AddParameter("CollectionName", collectionName);
                        engine.AddParameter("Alias", alias);
                    };
                    executor = AppUserController.executors.GetOrAdd(key, executor);
                }

                var list = executor.GetList();
                return list;
            }
            catch (Exception ex)
            {
                ErrorHelper.SendExcepToDB(ex, " GetDeployment", deploymentName);
                throw ex;
            }
        }

        [HttpGet]
        public List<CollectionUser> GetADUser(string subscriptionId,string DeployName)
        {
           try
            {
                PowerShellExecutor<CollectionUser> executor;
                string domainName = DeployName.Split('.')[1] +"."+ DeployName.Split('.')[2];//ConfigurationManager.AppSettings["DomainName"];
                string filename = "'*@" + "" + domainName + "'";
                string key = subscriptionId;
                if (!AppUserController.executors.TryGetValue(key, out executor))
                {
                    executor = new PowerShellExecutor<CollectionUser>();
                    executor.CmdName = "";
                    executor.NewFunc = this.NewFunc;
                    executor.Configure = (engine) =>
                    {
                        //engine.AddScript("Get-ADUser -Filter {UserPrincipalName -Like " + filename + "} ");
                        engine.AddScript("Get-ADUser -Filter {UserPrincipalName -Like " + filename + "} | select userprincipalname");
                    };
                    executor = AppUserController.executors.GetOrAdd(key, executor);
                }

                var list = executor.GetList();
                return list;
            }
            catch (Exception ex)
            {
                ErrorHelper.SendExcepToDB(ex, " GetADUser", subscriptionId);
                throw ex;
            }
        }

        public void NewFunc(dynamic psObject, List<CollectionUser> userList)
        {
            var users = new CollectionUser();
            users.Name = psObject.UserPrincipalName;
            userList.Add(users);
            
        }
        public static string GetDomainName()
        {
            string domainName = "";
            try
            {
                XmlDataDocument xmldoc = new XmlDataDocument();
                XmlNodeList xmlnode;
                string filePath = HttpContext.Current.Server.MapPath("~/Settings/DBServerCredentials.xml");
                FileStream fs = new FileStream(filePath, FileMode.Open, FileAccess.Read);
                xmldoc.Load(fs);
                xmlnode = xmldoc.GetElementsByTagName("Credentials");
                for (int i = 0; i <= xmlnode.Count - 1; i++)
                {
                    domainName = xmlnode[i].ChildNodes.Item(4).InnerText.Trim();
                }
                fs.Close();
                fs.Dispose();
            }
            catch { }
            return domainName;
        }
    }
}
