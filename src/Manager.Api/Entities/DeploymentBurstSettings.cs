using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;
using System.Threading.Tasks;

namespace RDSManagerAPI.Entities
{
   
    public class DeploymentBurstSettings
    {
        [DataMember]
        public string DeploymentFQDN { get; set; }

        [DataMember]
        public bool IsActive { get; set; }

        [DataMember]
        public string PublishUserName { get; set; }

        [DataMember]
        public string PublishPassword { get; set; }

        [DataMember]
        public string AzureSubscriptionName { get; set; }

        [DataMember]
        public string ResourceGroupName { get; set; }

        [DataMember]
        public DateTime CreatedDate { get; set; }

        [DataMember]
        public DateTime LastModifiedDate { get; set; }

    }
}
