using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;
using System.Threading.Tasks;

namespace RDSManagerAPI.Entities
{
   
    public class UserGroup
    {
        [DataMember]
        public string UserGroupName { get; set; }

        [DataMember]
        public string UserName { get; set; }

        [DataMember]
        public string Type { get; set; }
    }
}
