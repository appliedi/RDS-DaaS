namespace RDSManagerAPI.Controllers
{
    using System;
    using System.Collections.Generic;
    using System.Globalization;
    using System.Linq;
    using System.Web.Http;
    using RDSManagerAPI.Entities;
    using Commands;
    using System.Configuration;
    using Newtonsoft.Json;
    using System.Collections.Concurrent;
    using System.Threading.Tasks;

    public class SubscriptionsController : ApiController
    {
        public static List<Subscription> subscriptions = new List<Subscription>();
        private static ConcurrentDictionary<string, PowerShellExecutor<AzureRDSFarm>> executors =
            new ConcurrentDictionary<string, PowerShellExecutor<AzureRDSFarm>>();
        string ConnectionBroker;
        /// <summary>
        /// Gets a subscription collection.
        /// </summary>
        [HttpGet]
        public List<Subscription> GetSubscriptionList()
        {
            return subscriptions;
        }

        /// <summary>
        /// Updates the subscription. Like suspend/activate 
        /// </summary>
        /// <param name="subscription">The subscription.</param>
        [HttpPut]
        public Subscription UpdateSubscription(Subscription subscription)
        {
           try
            {
                this.ValidateSubscriptionId(subscription);

                var sub = (from s in subscriptions where s.SubscriptionId == subscription.SubscriptionId select s).FirstOrDefault();

                if (sub != null)
                {
                    sub.AdminId = subscription.AdminId;
                    sub.SubscriptionName = subscription.SubscriptionName;
                    sub.CoAdminIds = subscription.CoAdminIds;
                }

                // You can also throw exception if for some reason update subscription violates any business rules.
                // In that case subscription will go out of sync. So ensure your exception having enough information to admin/provider can take decision to fix issue.
                // Admin can issue sync command which will call UpdateSubscription
                return subscription;
            }
            catch (Exception ex)
            {
                ErrorHelper.WriteErrorToEventLog(ex.Message);
                throw ex;
            }
            
        }

        /// <summary>
        /// Creates the subscription.
        /// </summary>
        /// <param name="subscription">The subscription.</param>
        [HttpPost]
        public Subscription AddSubscription(Subscription subscription)
        {
          try
            {
                this.ValidateSubscriptionId(subscription);

                // Add subscription to in memory collection of subscriptions
                // Actual resource provider can save this in their backend store
                subscriptions.Add(new Subscription
                {
                    SubscriptionId = subscription.SubscriptionId,
                    SubscriptionName = subscription.SubscriptionName,
                    AdminId = subscription.AdminId,
                    CoAdminIds = subscription.CoAdminIds
                });

                // You can also throw exception if for some reason update subscription voilates any business rules.
                // In that case subscription will go out of sync. So ensure your exception having enough information to admin/provider can take decision to fix issue.
                // Admin can issue sync command which will call UpdateSubscription
                return subscription;
            }
            catch (Exception ex)
            {
                ErrorHelper.WriteErrorToEventLog(ex.Message);
                throw ex;
            }
        }

        [HttpGet]
        public async Task<List<AzureRDSFarm>> GetResourceGroup(string connectionBrokerFQDN)
        {
            try
            {

                //PowerShellExecutor<AzureRDSFarm> executor;
                //string resourceString = string.Empty;
                List<AzureRDSFarm> list = new List<AzureRDSFarm>();
                //string username = "";
                //string password = "";
                //string resourcegroupname = "";
                string stm = @"SELECT AzureSubscriptionName, ResourceGroupName FROM deploymentburstsettings WHERE DeploymentFQDN=@DeploymentFQDN";
                System.Data.DataTable result = DBHelper.ExecuteAndGetDataTable(stm, connectionBrokerFQDN);
                if (result.Rows.Count > 0)
                {
                    AzureRDSFarm obj = new AzureRDSFarm();
                    obj.SubscriptionID = result.Rows[0]["AzureSubscriptionName"].ToString();
                    obj.ResourceGroupName = result.Rows[0]["ResourceGroupName"].ToString();
                    obj.ClientURL = GetGateWayURL(connectionBrokerFQDN);
                    obj.Location = "Azure RDS";
                    list.Add(obj);
                }
                //string key = "";
                //this.ConnectionBroker = connectionBrokerFQDN;
                ////if (!executors.TryGetValue(key, out executor))
                ////{
                //    executor = new PowerShellExecutor<AzureRDSFarm>();
                //    executor.CmdName = "";
                //    executor.NewFunc = this.NewFunc;
                //    executor.Configure = (engine) =>
                //    {
                //        //engine.AddScript("Import-Module -Name AzureRM.Resources;$temp = Select-AzureRmProfile -Path " + "'" + path + "'" + "; Find-AzureRmResource -ResourceNameContains " + "'" + resourceName + "'" + " -ResourceType " + "'" + resourceType + "'");
                //        string powershellScript = CommandResource.readEssentialInfo;
                //        powershellScript = powershellScript.Replace("{username}", username);
                //        powershellScript = powershellScript.Replace("{password}", password);
                //        powershellScript = powershellScript.Replace("{resourcegroupname}", resourcegroupname);

                //        engine.AddScript(powershellScript);
                //    };
                //    executor = executors.GetOrAdd(key, executor);
                ////}
                //var list = executor.GetList();
                return list;
            }
            catch (Exception ex)
            {
                ErrorHelper.SendExcepToDB(ex, " GetResourceGroup", connectionBrokerFQDN);
                throw ex;
            }
        }
        //End

        /// <summary>
        /// Deletes the subscription.
        /// </summary>
        /// <param name="subscriptionId">The subscription id.</param>
        [HttpDelete]
        public void DeleteSubscription(string subscriptionId)
        {
            try
            {

                this.ValidateSubscriptionId(subscriptionId);

                var sub = subscriptions.FirstOrDefault(x => x.SubscriptionId == subscriptionId);

                if (sub != null)
                {
                    subscriptions.Remove(sub);
                }
            }
            catch (Exception ex)
            {
                ErrorHelper.SendExcepToDB(ex, " DeleteSubscription", subscriptionId);
                throw ex;
            }
        }
        private string GetGateWayURL(string ConnectionBroker)
        {
            try
            {
                // Get the description using powershell
                string Query = "Get-RDDeploymentGatewayConfiguration -ConnectionBroker " + ConnectionBroker;
                PowerShellExecutor<AzureRDSFarm> executor;
                string key = "12";
                if (!executors.TryGetValue(key, out executor))
                {
                    executor = new PowerShellExecutor<AzureRDSFarm>();
                    executor.CmdName = "";
                    executor.NewFunc = this.NewClientFunc;
                    executor.Configure = (engine) =>
                    {
                        engine.AddScript(Query);
                    };
                    executor = executors.GetOrAdd(key, executor);
                }
                List<AzureRDSFarm> list = executor.GetList();
                string clientURL = "https://" + list[0].ClientURL + "/RDWeb";
                return clientURL;
                //return list;
            }
            catch (Exception ex)
            {
                ErrorHelper.SendExcepToDB(ex, " GetGateWayURL", ConnectionBroker);
                throw ex;
            }
        }
        /// <summary>
        /// Validates the subscription id.
        /// </summary>
        /// <param name="subscriptionId">The subscription id.</param>
        /// <returns>Subscription Guid</returns>
        private void ValidateSubscriptionId(Subscription subscription)
        {
            try
            {
                if (subscription == null || string.IsNullOrWhiteSpace(subscription.SubscriptionId))
                {
                    //throw Utility.ThrowResponseException(this.Request, System.Net.HttpStatusCode.BadRequest, ErrorMessages.EmptySubscription);
                }

                Guid id;
                bool parseGuid = Guid.TryParse(subscription.SubscriptionId, out id);

                if (!parseGuid)
                {
                    //string message = string.Format(CultureInfo.CurrentCulture, ErrorMessages.InvalidSubscriptionFormat, subscription.SubscriptionId);
                    // throw Utility.ThrowResponseException(this.Request, System.Net.HttpStatusCode.BadRequest, message);
                }
            }
            catch (Exception ex)
            {
                ErrorHelper.WriteErrorToEventLog(ex.Message);
                throw ex;
            }
        }
        public void NewFunc(dynamic psObject, List<AzureRDSFarm> userList)
        {
            var Resourcegroup = new AzureRDSFarm();
            Resourcegroup.ResourceGroupName = psObject.ResourceGroupName;
            Resourcegroup.Location = psObject.Location;
            Resourcegroup.SubscriptionID = psObject.ResourceId;
            if(Resourcegroup.SubscriptionID!=null)
            {
                string[] breakApart = Resourcegroup.SubscriptionID.Split('/');
                Resourcegroup.SubscriptionID = breakApart[2].ToString();
            }
            Resourcegroup.ClientURL = GetGateWayURL(ConnectionBroker);
            userList.Add(Resourcegroup);

        }
        public void NewClientFunc(dynamic psObject, List<AzureRDSFarm> userList)
        {
            var Resourcegroup = new AzureRDSFarm();
            Resourcegroup.ClientURL = psObject.GatewayExternalFQDN;
            userList.Add(Resourcegroup);

        }
        /// <summary>
        /// Validates the subscription id.
        /// </summary>
        /// <param name="subscriptionId">The subscription id.</param>
        /// <returns>Subscription Guid</returns>
        private void ValidateSubscriptionId(string subscriptionId)
        {
           try
            {
                if (string.IsNullOrWhiteSpace(subscriptionId))
                {
                    // throw Utility.ThrowResponseException(this.Request, System.Net.HttpStatusCode.BadRequest, ErrorMessages.EmptySubscription);
                }

                Guid id;
                bool parseGuid = Guid.TryParse(subscriptionId, out id);

                if (!parseGuid)
                {
                    // string message = string.Format(CultureInfo.CurrentCulture, ErrorMessages.InvalidSubscriptionFormat, subscriptionId);
                    // throw Utility.ThrowResponseException(this.Request, System.Net.HttpStatusCode.BadRequest, message);
                }
            }
            catch (Exception ex)
            {
                ErrorHelper.SendExcepToDB(ex, " ValidateSubscriptionId", subscriptionId);
                throw ex;
            }
        }
        
       
    }
}
