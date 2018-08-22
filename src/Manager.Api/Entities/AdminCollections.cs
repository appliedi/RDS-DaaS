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
   
    public class AdminCollection
    {
        [DataMember]
        public string Name { get; set; }

        [DataMember]
        public string NavName { get; set; }

        [DataMember]
        public string Description { get; set; }

        [DataMember]
        public string AuditLocation { get; set; }

        [DataMember]
        public int Size { get; set; }

        [DataMember]
        public string CollectionType { get; set; }

        [DataMember]
        public bool Burst { get; set; }

        [DataMember]
        public string Type { get { return "collectionType"; } }
    }
}
