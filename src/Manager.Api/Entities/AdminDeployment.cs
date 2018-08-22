using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;
using System.Threading.Tasks;

namespace RDSManagerAPI.Entities
{
    /// <summary>
    /// This is a data contract class between extensions and resource provider
    /// </summary>
   
    public class AdminDeployment
    {
        [DataMember]
        public string Id { get; set; }

        [DataMember]
        public string defaultNavigationId { get; set; }

        [DataMember]
        public string FriendlyName { get; set; }

        [DataMember]
        public string name { get; set; }    //for all-items view

        [DataMember]
        public string displayName { get; set; } //for all-items view

        [DataMember]
        public string status { get; set; }  //for all-items view

        [DataMember]
        public string RDSConnectionBroker { get; set; }

        [DataMember]
        public string Description { get; set; }

        [DataMember]
        public string AuditLocation { get; set; }

        [DataMember]
        public string Type { get { return "deploymentType"; } }
    }
}
