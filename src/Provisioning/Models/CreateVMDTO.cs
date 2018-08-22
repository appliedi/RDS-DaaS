using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace RDSProvision.Models
{
    public class CreateVMDTO
    {
        public string name { get; set; }
        public string location { get; set; }
        public VMtags tags { get; set; }
        public VMProperties properties { get; set; }
    }

    public class VMtags
    {
        public string department { get; set; }
    }

    public class VMProperties
    {
        public string licenseType { get; set; }
        public AvailabilitySet availabilitySet { get; set; }
        public HardwareProfile hardwareProfile { get; set; }
        public StorageProfile storageProfile { get; set; }
        public OsProfile osProfile { get; set; }
        public NetworkProfile networkProfile { get; set; }

    }

    public class AvailabilitySet { public string id { get; set; } }
    public class HardwareProfile { public string vmSize { get; set; } }
    public class StorageProfile { public ImageReference imageReference { get; set; } public OsDisk osDisk { get; set; } }
    public class ImageReference { public string id { get; set; } }
    public class OsDisk { public string name { get; set; } public string osType { get; set; } public string createOption { get; set; } }
    public class OsProfile { public string computerName { get; set; } public string adminUsername { get; set; } public string adminPassword { get; set; } public WindowsConfiguration windowsConfiguration { get; set; } }
    public class WindowsConfiguration { public bool provisionVMAgent { get; set; } public bool enableAutomaticUpdates { get; set; } public string timeZone { get; set; } }

    public class NetworkProfile { public List<NetworkInterfaces> networkInterfaces { get; set; } }
    public class NetworkInterfaces { public string id { get; set; } public NIProperties properties { get; set; } }
    public class NIProperties { public bool primary { get; set; } }
}