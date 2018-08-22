using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.NetworkInformation;
using System.Security.Cryptography;
using System.Text;
using System.Web;

namespace RDSManagerAPI.Commands
{
    public class ProductMaster
    {
        public string GetMacAddress()
        {
            string macAddresses = string.Empty;
            try
            {
                foreach (NetworkInterface nic in NetworkInterface.GetAllNetworkInterfaces())
                {
                    if (nic.OperationalStatus == OperationalStatus.Up)
                    {
                        macAddresses += nic.GetPhysicalAddress().ToString();
                        break;
                    }
                }
                string hostName = Dns.GetHostName();
                macAddresses+=hostName;
            }
            catch
            {
                macAddresses = string.Empty;
            }

            return macAddresses;
        }
       
    }
}