using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace RDSProvision.Models
{
    public class NetworkInterfaceCardDTO
    {
        public string Location { get; set; }
        public NICProperties Properties { get; set; }
    }

    public class NICProperties
    {
        public bool enableAcceleratedNetworking { get; set; }
        public List<IpConfigurations> ipConfigurations { get; set; }
    }

    public class IpConfigurations
    {
        public string name { get; set; }
        public IpProperties Properties { get; set; }
      
    }

    public class IpProperties
    {
        public PublicIPAddress subnet { get; set; }
        public PublicIPAddress publicIPAddress { get; set; }
    }

    public class PublicIPAddress
    {
        public string id { get; set; }
    }


}