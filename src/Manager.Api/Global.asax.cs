using System;
using System.Collections.Generic;
using System.Configuration;
using System.DirectoryServices.AccountManagement;
using System.Linq;
using System.Text;
using System.Web;
using System.Web.Http;
using System.Web.Routing;

namespace RDSManagerAPI
{
    public class WebApiApplication : System.Web.HttpApplication
    {
        protected void Application_Start()
        {
            WebApiConfig.Register(GlobalConfiguration.Configuration);
        }
        /*
        protected void Application_AuthenticateRequest(Object sender, EventArgs e)
        {
           
            string authorizationHeader = Request.Headers["Authorization"];

            if (string.IsNullOrEmpty(authorizationHeader))
            {
                throw new UnauthorizedAccessException("Access Denied :: Auth header empty");
            }

            string[] authorizationHeaderParts = authorizationHeader.Split(new char[] { ' ' }, 2);

            if (authorizationHeaderParts.Length != 2 || !string.Equals(authorizationHeaderParts[0], "Basic", StringComparison.InvariantCultureIgnoreCase))
            {
                throw new UnauthorizedAccessException("Access Denied :: Invalid Header");
            }

            authorizationHeader = (authorizationHeader.Split(' '))[1];

            string[] credentials = Encoding.ASCII.GetString(Convert.FromBase64String(authorizationHeader)).Split(new char[] { ':' });

            if (credentials == null)
            {
                throw new UnauthorizedAccessException("Access Denied :: No credentials found");
            }

            string username = credentials[0];
            string password = credentials[1];
            string[] dfName = username.Split('\\');
            string domainName = dfName[0];
            string Username = dfName[1];
            using (PrincipalContext pc = new PrincipalContext(ContextType.Domain, domainName))
            {

                bool isValid = pc.ValidateCredentials(Username, password);
                if (isValid)
                {
                    UserPrincipal user = UserPrincipal.FindByIdentity(pc, Username);
                    GroupPrincipal deploymentGroup = GroupPrincipal.FindByIdentity(pc, "DeploymentAdmins");
                    deploymentGroup.GetMembers();
                    GroupPrincipal tenantGroup = GroupPrincipal.FindByIdentity(pc, "TenantAdmins");
                    string userGroup = string.Empty;
                    if (user != null)
                    {
                        if (user.IsMemberOf(deploymentGroup))
                        {
                            userGroup = "DeploymentAdmin";
                        }
                        else if (user.IsMemberOf(tenantGroup))
                        {
                            userGroup = "TenantAdmin";
                        }
                        else
                        {
                            throw new UnauthorizedAccessException("Access Denied - Username password didn't match");
                        }
                    }

                }
                else
                {
                    throw new UnauthorizedAccessException("Access Denied - Username password didn't match");
                }
            }
            
        }
        */
    }
}
