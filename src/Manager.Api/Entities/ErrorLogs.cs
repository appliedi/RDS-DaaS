using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace RDSManagerAPI.Entities
{
    public class ErrorLogsMes
    {
        public string Message { get; set; }
        public string MethodName { get; set; }
        public string DateTime { get; set; }
        public string DeploymentName { get; set; }
    }
}