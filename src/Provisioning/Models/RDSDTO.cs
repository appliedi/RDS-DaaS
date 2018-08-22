using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace RDSProvision.Models
{
    public class RDSDTO
    {
        public properties properties { get; set; }
    }

    public class properties
    {
        public TemplateLink templateLink { get; set; }
        public string mode { get; set; }
        public ParametersLink parametersLink { get; set; }
    }

    public class TemplateLink
    {
        public string uri { get; set; }
        public string contentVersion { get; set; }
    }

    public class ParametersLink
    {
        public string uri { get; set; }
        public string contentVersion { get; set; }
    }
}