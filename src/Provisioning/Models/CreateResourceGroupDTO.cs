using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace RDSProvision.Models
{
    public class CreateResourceGroupDTO
    {
        public string Location { get; set; }
        public tags Tags { get; set; }
    }

    public class tags
    {
        public string TagName1 { get; set; }
    }
}