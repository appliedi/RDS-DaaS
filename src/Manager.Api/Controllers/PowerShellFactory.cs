namespace RDSManagerAPI.Controllers
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Web;
    using System.Management.Automation;

    public static class PowerShellFactory
    {
        public static void getCollectionPuslishedAppList(PowerShell engine, string brokerfqdn, string collectionName)
        {
            engine.AddCommand("Get-RDAvailableApp");
            engine.AddParameter("CollectionName", collectionName);
            engine.AddParameter("ConnectionBroker", brokerfqdn);
        }

        public static void getCollectionPuslishableAppList(PowerShell engine, string brokerfqdn, string collectionName)
        {
            engine.AddCommand("Get-RDRemoteApp");
            engine.AddParameter("CollectionName", collectionName);
            engine.AddParameter("ConnectionBroker", brokerfqdn);
        }

        public static void getCollectionSessions(PowerShell engine, string brokerfqdn, string collectionName)
        {
            engine.AddCommand("Get-RDSessionCollection");
            engine.AddParameter("CollectionName", collectionName);
            engine.AddParameter("ConnectionBroker", brokerfqdn);
        }

        public static void getCollectionHosts(PowerShell engine, string brokerfqdn, string collectionName)
        {
            engine.AddCommand("Get-SessionHost");
            engine.AddParameter("CollectionName", collectionName);
            engine.AddParameter("ConnectionBroker", brokerfqdn);
        }

        public static void getCollectionUserSessions(PowerShell engine, string brokerfqdn, string collectionName)
        {
            engine.AddCommand("Get-RDUserSession");
            engine.AddParameter("CollectionName", collectionName);
            engine.AddParameter("ConnectionBroker", brokerfqdn);
        }
    }
}