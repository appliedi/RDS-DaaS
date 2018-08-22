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
   
    public class AzureRDSFarm
    {
        [DataMember]
        public string ResourceGroupName { get; set; }

        [DataMember]
        public string Location { get; set; }

        [DataMember]
        public string SubscriptionID { get; set; }

        [DataMember]
        public string ClientURL { get; set; }

    }
}
