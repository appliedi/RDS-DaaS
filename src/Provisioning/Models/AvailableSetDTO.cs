using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace RDSProvision.Models
{
    public class AvailableSetDTO
    {
        public string Name { get; set; }
        public string Type { get; set; }
        public string Location { get; set; }
        public tag Tags { get; set; }
        public sku Sku { get; set; }
        public propertie Properties { get; set; }
    }
    public class tag { }
    public class sku { public string name { get; set; } }
    public class propertie
    {
        public int platformUpdateDomainCount { get; set; }
        public int platformFaultDomainCount { get; set; }
    }
}
