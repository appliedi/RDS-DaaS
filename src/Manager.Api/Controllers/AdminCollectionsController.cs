namespace RDSManagerAPI.Controllers
{
    using System;
    using System.Collections.Generic;
    using System.Collections.Concurrent;
    using System.Threading;
    using System.Linq;
    using System.Web.Http;
    using RDSManagerAPI.Entities;
    using Commands;
    using System.Threading.Tasks;
    using System.Configuration;
    using System.Net;

    //[Authorize]
    public class AdminCollectionsController : ApiController
    {
        private static ConcurrentDictionary<string, PowerShellExecutor<AdminCollection>> executors =
            new ConcurrentDictionary<string, PowerShellExecutor<AdminCollection>>();

        public AdminCollectionsController()
        {
        }

        [HttpGet]
        public async Task<List<AdminCollection>> GetCollections(string subscriptionId, string deploymentName)
        {
            return  GetCollectionsByDeploymentName(deploymentName);
        }

        [HttpGet]
        public async Task<List<AdminCollection>> GetCollections(string deploymentName)
        {
            return GetCollectionsByDeploymentName(deploymentName);
        }
        [HttpGet]
        public String UpdateScale(string deploymentName, string collectionName, bool isBurstActive)
        {
            try
            {
                string scale = string.Empty;
                // Try update Collection Burst IsActive field in the databsae, if not, create corresponding entries in the DB
                string stm = @"UPDATE CollectionBurstSettings SET IsActive = @IsActive
                              WHERE DeploymentFQDN=@DeploymentFQDN AND CollectionName=@Name";
                if (0 == DBHelper.ExecuteCommand(stm, isBurstActive, deploymentName, collectionName))
                {
                    AdminNewCollectionCommand.CreateDbCollectionEntry(deploymentName, collectionName, isBurstActive);
                }
                return scale;
            }
            catch (Exception ex)
            {
                ErrorHelper.SendExcepToDB(ex, " UpdateScale", deploymentName);
                throw ex;
            }
            
        }
        
        [HttpGet]
        public AdminCollection GetCollectionProperty(string deploymentName, string collectionName)
        {
            try
            {
                string pslgetCollection = ConfigurationManager.AppSettings["psl_layer"].ToString() + "/getCollection.ps1";
                string psl_Script = "";
                using (WebClient client = new WebClient())
                {
                    psl_Script = client.DownloadString(pslgetCollection);
                }
                AdminCollection result = new AdminCollection();

                // Get Audit location
                result.AuditLocation = string.Empty;    // TODO: populate real data when this feature is ready

                // Get the description using powershell
                var command = new ScriptCommand(psl_Script,
                    new[] { "CollectionName", "ConnectionBroker" }, (psObject, scriptCommand) =>
                    {
                        result.Name = psObject.CollectionName;
                        result.Size = psObject.Size;
                        result.CollectionType = psObject.ResourceType;
                        result.Description = psObject.CollectionDescription;
                    });
                var data = new Dictionary<string, object> { { "ConnectionBroker", deploymentName }, { "CollectionName", collectionName } };
                command.Init(data);

                command.Execute();
                return result;
            }
            catch (Exception ex)
            {
                ErrorHelper.SendExcepToDB(ex, "GetCollectionProperty", deploymentName);
                throw ex;
            }

        }

        private List<AdminCollection> GetCollectionsByDeploymentName(string deploymentName)
        {
            try
            {
                PowerShellExecutor<AdminCollection> executor;

                if (!AdminCollectionsController.executors.TryGetValue(deploymentName, out executor))
                {
                    executor = new PowerShellExecutor<AdminCollection>();
                    executor.CmdName = "";
                    executor.NewFunc = this.NewFunc;
                    executor.Configure = (engine) =>
                    {
                        engine.AddCommand("Get-RDSessionCollection");
                        engine.AddParameter("ConnectionBroker", deploymentName);
                    };
                    executor = AdminCollectionsController.executors.GetOrAdd(deploymentName, executor);
                }

                var list = executor.GetList();
                if (list == null || list.Count() == 0) return list;

                // Get the Collection Burst settings/ Collection Guids/ Audit files from the Database before returning the list
                var query = string.Format("SELECT CollectionName, IsActive FROM CollectionBurstSettings WHERE DeploymentFQDN ='{0}'", deploymentName);

                var queryResults = ServicesManager.Instance.ExecuteQuery<AdminCollection>(query, (rdr, results) =>
                {
                    var collection = new AdminCollection();
                    collection.Name = rdr["CollectionName"].ToString();
                    collection.Burst = (bool)rdr["IsActive"];
                    results.Add(collection);
                });

                if (queryResults != null)
                {
                    queryResults.ForEach(r =>
                    {
                        var collection = list.Where(i => i.Name == r.Name).FirstOrDefault();
                        if (collection != null) // populate the information before returning the list back
                        {
                            collection.Burst = r.Burst;
                        }
                    });
                }

                return list;
            }
            catch (Exception ex)
            {
                ErrorHelper.SendExcepToDB(ex, "GetCollectionsByDeploymentName", deploymentName);
                throw ex;
            }

        }

        public void NewFunc(dynamic psObject, List<AdminCollection> collList)
        {
            var collection = new AdminCollection();
            collection.Name = psObject.CollectionName;
            collection.NavName = ApplicationController.GenNavName(psObject.CollectionName);
            collection.Description = psObject.CollectionDescription;
            collection.CollectionType = psObject.ResourceType;
            double used = 0;
            if (psObject.Size != null)
            {
                double.TryParse(psObject.Size.ToString(), out used);
            }
            collection.Size = (int)used;
            collection.Burst = false;
            collList.Add(collection);
        }
    }
}
