using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.Store.PartnerCenter;
using Microsoft.Store.PartnerCenter.Extensions;
using Microsoft.IdentityModel.Clients.ActiveDirectory;
using System.Web.Configuration;

namespace RDSProvision.BL
{
    public class SDKConnector
    {
        public static IAggregatePartner AzurePartnerManager { get; set; }
        public static IAggregatePartner PartnerCenterSDK()
        {
            try
            {
                string PartnerServiceApiRoot = WebConfigurationManager.AppSettings["PartnerServiceApiRoot"];
                string Authority = WebConfigurationManager.AppSettings["Authority"];
                string ResourceUrl = WebConfigurationManager.AppSettings["ResourceUrl"]; 
                string ApplicationId = WebConfigurationManager.AppSettings["ApplicationId"]; 
                string ApplicationSecret = WebConfigurationManager.AppSettings["ApplicationSecret"]; 
                string ApplicationDomain = WebConfigurationManager.AppSettings["ApplicationDomain"]; 
                PartnerService.Instance.ApiRootUrl = PartnerServiceApiRoot;
                var partnerCredentials =
                    PartnerCredentials.Instance.GenerateByApplicationCredentials(
                        ApplicationId,
                        ApplicationSecret,
                        ApplicationDomain);
                IAggregatePartner partner = PartnerService.Instance.CreatePartnerOperations(partnerCredentials);
                return partner;
            }
            catch (Exception exception)
            {
                throw exception;
            }
        }
    }
}