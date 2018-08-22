namespace RDSManagerAPI.Controllers
{
    using System.Collections.Concurrent;
    using System.Collections.Generic;
    using System.Web.Http;
    using RDSManagerAPI.Entities;
    using System.Threading.Tasks;

    public class CollectionsController : ApiController
    {
        private static ConcurrentDictionary<string, PowerShellExecutor<Collection>> executors =
            new ConcurrentDictionary<string, PowerShellExecutor<Collection>>();
        string ConnectionBroker, SubscriptionID;

        public CollectionsController()
        {
        }

        [HttpGet]
        public async Task<List<Collection>> GetCollections(string subscriptionId, string deploymentName)
        {
            PowerShellExecutor<Collection> executor;
            this.SubscriptionID = subscriptionId;
            this.ConnectionBroker = deploymentName;
            if (!CollectionsController.executors.TryGetValue(deploymentName, out executor))
            {
                executor = new PowerShellExecutor<Collection>();
                executor.CmdName = "";
                executor.NewFunc = this.NewFunc;
                executor.Configure = (engine) =>
                {
                    engine.AddCommand("Get-RDSessionCollection");
                    engine.AddParameter("ConnectionBroker", deploymentName);
                };
                executor = CollectionsController.executors.GetOrAdd(deploymentName, executor);
            }

            var list = executor.GetList();
            return list;
        }

        public void NewFunc(dynamic psObject, List<Collection> collList)
        {
            var collection = new Collection();
            collection.Name = psObject.CollectionName;
            //collection.NavName = ApplicationController.GenNavName(psObject.CollectionName);
            collection.NavName = psObject.CollectionAlias ?? ApplicationController.GenNavName(psObject.CollectionName);
            collection.Description = psObject.CollectionDescription;
            double used = 0;
            if (psObject.Size != null)
            {
                double.TryParse(psObject.Size.ToString(), out used);
            }
            collection.Size = (int)used;
            collection.Status = "Unknown";
            collection.Burst = AdminDeploymentsController.GetBurst(SubscriptionID, ConnectionBroker, collection.Name);
            collection.ResourceType = psObject.ResourceType.ToString();
            collList.Add(collection);
        }
    }
}
