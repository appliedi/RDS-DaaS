using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace RDSManagerAPI.Entities
{
    public class ProductInfo
    {
        public string ClientId { get; set; }
        public string ExtendedTrial { get; set; }
        public string FirstLogin { get; set; }
        public string Licensed { get; set; }
        public string Trial { get; set; }
        public bool IsLicensedProduct { get; set; }
        public bool IsInTrailPeriod { get; set; }
        public string TrailNotification { get; set; }
    }
}