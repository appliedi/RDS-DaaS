using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace RDSProvision.Models
{
    public class Customers
    {
        public string companyName { get; set; }
        public string domain { get; set; }
        public string Id { get; set; }
        public string tenantId { get; set; }
        public string relationshipToPartner { get; set; }
        public int subscriptionCount { get; set; }

    }
}