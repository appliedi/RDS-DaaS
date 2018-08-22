using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;
using System.Threading.Tasks;

namespace RDSManagerAPI.Entities
{
    /// <summary>
    /// This is a data contract class between extensions and resource provider
    /// </summary>
   
    public class RDServer
    {
        [DataMember]
        public string Name { get; set; }

        [DataMember]
        public string Roles { get; set; }

        [DataMember]
        public string Status { get; set; }

        [DataMember]
        public string Type { get; set; }

        [DataMember]
        public string Collection { get; set; }

    }
}
