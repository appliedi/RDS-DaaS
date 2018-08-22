using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace RDSProvision.Models
{
    public class VirtualNetworksDTO
    {
        public string Location { get; set; }
        public property properties { get; set; }

    }
    public class property
    {
        public AddressSpace addressSpace { get; set; }

    }
    public class AddressSpace
    {
        public string[] addressPrefixes { get; set; }
    }
}

