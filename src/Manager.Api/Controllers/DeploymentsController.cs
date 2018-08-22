namespace RDSManagerAPI.Controllers
{
    using System.Collections.Generic;
    using System.Web.Http;
    using RDSManagerAPI.Entities;

    public class DeploymentsController : ApiController
    {
        [HttpGet]
        public virtual List<Deployment> GetList(string subscriptionId)
        {
            return ServicesManager.Instance.ExecuteQuery<Deployment>("SELECT * FROM Deployments", (rdr, list) =>
            {
                var deployment = new Deployment();
                deployment.Id = rdr["Id"].ToString();
                deployment.defaultNavigationId = rdr["Id"].ToString();
                deployment.FriendlyName = rdr["Name"].ToString();
                deployment.RDSConnectionBroker = rdr["FQDN"].ToString();
                deployment.name = rdr["FQDN"].ToString();
                deployment.displayName = rdr["FQDN"].ToString();
                list.Add(deployment);
            });
        }
    }
}
