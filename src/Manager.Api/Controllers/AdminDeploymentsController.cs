namespace RDSManagerAPI.Controllers
{
    using System.Collections.Generic;
    using System.Web.Http;
    using RDSManagerAPI.Entities;
    using System.Linq;
    using Commands;
    using System;

    public class AdminDeploymentsController : ApiController
    {
        /// <summary>
        /// Get the total list of all deployments
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        public virtual List<AdminDeployment> GetList(string subscriptionId = "")
        {

            return ServicesManager.Instance.ExecuteQuery<AdminDeployment>("SELECT * FROM Deployments", (rdr, list) =>
            {
                var deployment = new AdminDeployment();
                deployment.Id = rdr["Id"].ToString();
                deployment.defaultNavigationId = rdr["Id"].ToString();
                deployment.FriendlyName = rdr["Name"].ToString();
                deployment.RDSConnectionBroker = rdr["FQDN"].ToString();
                deployment.Description = rdr["Description"] == null ? string.Empty : rdr["Description"].ToString();
                deployment.name = rdr["FQDN"].ToString();
                deployment.displayName = rdr["FQDN"].ToString();
                deployment.status = "Available";
                list.Add(deployment);
            });
        }

        /// <summary>
        /// Get the deployment properties given a deployment guid
        /// </summary>
        /// <param name="deploymentId"></param>
        /// <returns></returns>
        [HttpGet]
        public virtual AdminDeployment GetDeployment(string deploymentId)
        {
           try
            {
                string stm = string.Format("SELECT * FROM Deployments WHERE Id ='{0}'", deploymentId);
                var broker = ServicesManager.Instance.ExecuteQuery<AdminDeployment>(stm, (rdr, list) =>
                {
                    AdminDeployment deployment = new AdminDeployment
                    {
                        FriendlyName = rdr["Name"].ToString(),
                        Id = rdr["Id"].ToString(),
                        RDSConnectionBroker = rdr["FQDN"].ToString(),
                        name = rdr["FQDN"].ToString(),
                        displayName = rdr["FQDN"].ToString(),
                        status = "Available",
                        Description = rdr["Description"] == null ? string.Empty : rdr["Description"].ToString()
                    };
                    list.Add(deployment);
                }).FirstOrDefault();

                // Get Audit location
                broker.AuditLocation = string.Empty;    // TODO: populate real data when this feature is ready

                return broker;
            }
            catch (Exception ex)
            {
                ErrorHelper.SendExcepToDB(ex, " GetDeployment", deploymentId);
                throw ex;
            }
        }
        public static bool GetBurst(string SubscriptionID, string DeploymentFQDN, string CollectionName)
        {
           try
            {
                bool burstFlag;
                string stm = string.Format("SELECT IsActive FROM CollectionBurstSettings WHERE DeploymentFQDN = '{0}' AND CollectionName = '{1}'",
                    DeploymentFQDN, CollectionName);
                var burstStatus = ServicesManager.Instance.ExecuteQuery<bool>(stm, (rdr, list) =>
                {
                    var isActive = (bool)rdr["IsActive"];
                    list.Add(isActive);
                });

                // If cannot find the entry from DB, return default value false
                burstFlag = (burstStatus == null || burstStatus.Count < 1) ? false : burstStatus[0];
                return burstFlag;
            }
            catch (Exception ex)
            {
                ErrorHelper.SendExcepToDB(ex, " GetBurst", DeploymentFQDN);
                throw ex;
            }
        }

        /// <summary>
        /// Get the Client Redirection Settings via ScriptCommand/Powershell
        /// </summary>
        [HttpGet]
        public bool GetCollectionBurstStatus(string SubscriptionID, string DeploymentFQDN, string CollectionName)
        {
            return GetBurst(SubscriptionID, DeploymentFQDN, CollectionName);
        }
    }
}
