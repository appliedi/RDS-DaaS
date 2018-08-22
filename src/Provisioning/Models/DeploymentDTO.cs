using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace RDSProvision.Models
{
    public class DeploymentDTO
    {
        public string Name { get; set; }
        public string SubscriptionID { get; set; }
        public string ResourceGroupName { get; set; }
    }
}