using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace RDSProvision.Models
{
    public class Subscriptions
    {
        public string subName { get; set; }
        public string subId { get; set; }
        public string orderName { get; set; }
        public string orderID { get; set; }

        public string offerID { get; set; }
        public string creationDate { get; set; }
        public string effectiveStartDate { get; set; }
        public string billingCycle { get; set; }
        public string autoRenewEnabled { get; set; }


    }
}