using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Http;
using System.Web.Http.Filters;

namespace RDSManagerAPI
{
    public static class WebApiConfig
    {

        public static void Register(HttpConfiguration config)
        {

            config.Routes.MapHttpRoute(
              name: "AdminDeploymentBurst1",
              routeTemplate: "admin/GetConfig/{brokerName}",
              defaults: new { controller = "DeploymentBurst" });

            config.Routes.MapHttpRoute(
              name: "AdminGetDeploymentBurst1",
              routeTemplate: "admin/GetDeploymentBurstSettings/{deploymentFQDN}",
              defaults: new { controller = "DeploymentBurst" });

            config.Routes.MapHttpRoute(
             name: "GetUserGroups",
             routeTemplate: "admin/GetUserGroups/{subscriptionId}",
             defaults: new { controller = "UserGroup" });

            config.Routes.MapHttpRoute(
             name: "GetUsersFromUserGroups",
             routeTemplate: "admin/GetUsersFromUserGroups/{subscriptionId}/{UserGroupName}",
             defaults: new { controller = "UserGroup" });

            config.Routes.MapHttpRoute(
              name: "AdminGetScale",
              routeTemplate: "admin/GetCollectionBurstStatus/{SubscriptionID}/{DeploymentFQDN}/{CollectionName}",
              defaults: new { controller = "AdminDeployments" });

            config.Routes.MapHttpRoute(
              name: "AdminScaleSettings",
              routeTemplate: "admin/UpdateScale/{deploymentName}/{collectionName}/{isBurstActive}",
              defaults: new { controller = "AdminCollections" });

            config.Routes.MapHttpRoute(
               name: "AddServers",
               routeTemplate: "admin/AddServers/{subscriptionId}",
               defaults: new { controller = "Server" });

            config.Routes.MapHttpRoute(
               name: "AddCollectionServers",
               routeTemplate: "admin/AddCollectionServers/{subscriptionId}/{brokerName}/{collectionName}",
               defaults: new { controller = "RDServer" });

            config.Routes.MapHttpRoute(
              name: "MessageServers",
              routeTemplate: "admin/SendMessageToServers/{subscriptionId}/{brokerName}/{collectionName}/{type}",
              defaults: new { controller = "Server" });

            config.Routes.MapHttpRoute(
              name: "MessageSessions",
              routeTemplate: "admin/SendMessageToSessions/{subscriptionId}",
              defaults: new { controller = "Session" });

            //Added API for Publishing multiple apps at one go
            config.Routes.MapHttpRoute(
                name: "AddApps",
                routeTemplate: "admin/AddApps/{subscriptionId}",
                defaults: new { controller = "Application" });

            config.Routes.MapHttpRoute(
                name: "AdminProcesses",
                routeTemplate: "subscriptions/ProcessCommand/{subscriptionId}",
                defaults: new { controller = "Processes" });

            config.Routes.MapHttpRoute(
                name: "TenantDeployments",
                    routeTemplate: "subscriptions/GetList/{subscriptionId}",
                defaults: new { controller = "Deployments" });

            config.Routes.MapHttpRoute(
                name: "TenantCollections",
                routeTemplate: "subscriptions/GetCollections/{subscriptionId}/{deploymentName}",
                defaults: new { controller = "Collections" });

            config.Routes.MapHttpRoute(
                name: "TenantApplication",
                routeTemplate: "subscriptions/GetApplication/{subscriptionId}/{deploymentName}/{collectionName}/{collectionType}/{type}",
                defaults: new { controller = "Application" });

            config.Routes.MapHttpRoute(
                name: "TenantServer",
                routeTemplate: "subscriptions/GetServer/{subscriptionId}/{deploymentName}/{collectionName}",
                defaults: new { controller = "Server" });

            config.Routes.MapHttpRoute(
                name: "TenantSession",
                routeTemplate: "subscriptions/{subscriptionId}/sessions",
                defaults: new { controller = "Session" });
            config.Routes.MapHttpRoute(
                name: "getsession",
                routeTemplate: "subscriptions/GetSessionTest/{subscriptionId}/{deploymentInfo}/{collectionName}",
                defaults: new { controller = "Session" });
           
            config.Routes.MapHttpRoute(
               name: "Subscription1",
               routeTemplate: "admin/GetResourceGroup/{connectionBrokerFQDN}",
               defaults: new { controller = "Subscriptions" });

            config.Routes.MapHttpRoute(
               name: "TenantUser1",
               routeTemplate: "AuthoriseUser/{Username}/{Password}",
               defaults: new { controller = "User" });

            config.Routes.MapHttpRoute(
                name: "TenantUser",
                routeTemplate: "subscriptions/GetUser/{subscriptionId}/{deploymentName}/{collectionName}",
                defaults: new { controller = "User" });
            //added to get collection users and groups
            config.Routes.MapHttpRoute(
                name: "GetUsersAndGroups",
                routeTemplate: "subscriptions/GetUsersAndGroups/{deploymentName}/{collectionName}/{type}",
                defaults: new { controller = "User" });
            //end


            config.Routes.MapHttpRoute(
                name: "AppUser",
                routeTemplate: "subscriptions/GetUser/{subscriptionId}/{deploymentName}/{collectionName}/{alias}",
                defaults: new { controller = "AppUser" });

            config.Routes.MapHttpRoute(
               name: "ADUser",
               routeTemplate: "subscriptions/GetADUser/{subscriptionId}/{DeployName}",
               defaults: new { controller = "AppUser" });

            config.Routes.MapHttpRoute(
               name: "Subscription",
               routeTemplate: "admin/subscriptions/{subscriptionId}",
               defaults: new { controller = "Subscriptions", subscriptionId = RouteParameter.Optional });

            config.Routes.MapHttpRoute(
               name: "AuthUser",
               routeTemplate: "subscriptions/AuthoriseUser/{subscriptionId}",
               defaults: new { controller = "User" });

            config.Routes.MapHttpRoute(
                 name: "UpdateSqlDB",
               routeTemplate: "admin/UpdateDBCredentials/{subID}",
               defaults: new { controller = "Server" });

            config.Routes.MapHttpRoute(
                name: "GetSqlDB",
              routeTemplate: "admin/GetDBCredentials",
              defaults: new { controller = "Server" });

            config.Routes.MapHttpRoute(
              name: "GetCPU",
               routeTemplate: "admin/GetDiagnosticData/{vm}/{FromDate}/{ToDate}/{type}",
               defaults: new { controller = "Server" });


            #region wap admin
            config.Routes.MapHttpRoute(
                name: "WapAdminProcesses",
                routeTemplate: "admin/ProcessCommand",
                defaults: new { controller = "AdminCommands" });

            config.Routes.MapHttpRoute(
                name: "AdminDeployments",
                routeTemplate: "admin/deployments",
                defaults: new { controller = "AdminDeployments" });

            config.Routes.MapHttpRoute(
                name: "AdminDeploymentBurst",
                routeTemplate: "admin/deploymentburst",
                defaults: new { controller = "DeploymentBurst" });

            config.Routes.MapHttpRoute(
                name: "AdminRDServer",
                routeTemplate: "admin/rdservers",
                defaults: new { controller = "RDServer" });
          
            config.Routes.MapHttpRoute(
                name: "AdminRDServertest",
                routeTemplate: "admin/GetServer/{deploymentName}/{role}",
                defaults: new { controller = "RDServer", role = RouteParameter.Optional });
            //end
            config.Routes.MapHttpRoute(
                name: "AdminCollections",
                routeTemplate: "admin/GetCollections/{deploymentName}",
                defaults: new { controller = "AdminCollections" });

            config.Routes.MapHttpRoute(
                name: "AdminCollectionConfig",
                routeTemplate: "admin/collectionconfig",
                defaults: new { controller = "CollectionConfig" });

            config.Routes.MapHttpRoute(
               name: "AdminCollectionConfig1",
               routeTemplate: "admin/GetUserProfileDisk/{deploymentFqdn}/{collectionName}",
               defaults: new { controller = "CollectionConfig" });

            config.Routes.MapHttpRoute(
                name: "AdminServer",
                routeTemplate: "admin/GetServer/{deploymentName}/{collectionName}",
                defaults: new { controller = "Server" });

            config.Routes.MapHttpRoute(
                name: "GetErrorLogMes",
                routeTemplate: "admin/GetErrors/{type}",
                defaults: new { controller = "User" });

            config.Routes.MapHttpRoute(
                name: "GetClientData",
                routeTemplate: "admin/GetClientData/{req}",
                defaults: new { controller = "User" });

            config.Routes.MapHttpRoute(
             name: "GetClientID2",
             routeTemplate: "admin/GetClientID2/{req2}",
             defaults: new { controller = "User" });

            config.Routes.MapHttpRoute(
            name: "UpdateProduct",
            routeTemplate: "admin/UpdateProduct/{req}",
            defaults: new { controller = "User" });
            #endregion wap admin

        }
    }
}
