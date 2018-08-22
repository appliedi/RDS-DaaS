using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace RDSProvision.Models
{
    public class LoginDetails
    {
        public string UserName { get; set; }
        public string Email { get; set; }
        public string Access_Token { get; set; }
        public string Id_Token { get; set; }
        public string Refresh_Token { get; set; }
    }
}