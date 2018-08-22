using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace RDSProvision.Models
{
    public class SubNetDTO
    {
        public SubProperties Properties { get; set; }
    }
    public class SubProperties { public string addressPrefix { get; set; } }

}