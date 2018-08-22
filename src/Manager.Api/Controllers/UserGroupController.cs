using RDSManagerAPI.Entities;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Http;
using System.Web.Mvc;

namespace RDSManagerAPI.Controllers
{
    public class UserGroupController : ApiController
    {
        private static ConcurrentDictionary<string, PowerShellExecutor<UserGroup>> executors =
            new ConcurrentDictionary<string, PowerShellExecutor<UserGroup>>();

        public List<UserGroup> GetUserGroups(string subscriptionId)
        {
            try
            {
                PowerShellExecutor<UserGroup> executor;
                string key = subscriptionId + ":";
                string pslgetusergroups = ConfigurationManager.AppSettings["psl_layer"].ToString() + "/getusergroups.ps1";
                string psl_Script = "";
                using (WebClient client = new WebClient())
                {
                    psl_Script = client.DownloadString(pslgetusergroups);
                }
                //string security = "\"" + "Security" + "\"";
                //string domainLocal = "\"" + "DomainLocal" + "\"";
                //string query = "Get-ADGroup -Filter 'GroupCategory -eq " + security + " -and GroupScope -ne " + domainLocal + "' | select  samaccountname,objectClass";
                if (!UserGroupController.executors.TryGetValue(key, out executor))
                {
                    executor = new PowerShellExecutor<UserGroup>();
                    executor.CmdName = "";
                    executor.NewFunc = this.NewFunc;
                    executor.Configure = (engine) =>
                    {
                        //engine.AddScript(query);
                        engine.AddScript(psl_Script);
                    };
                    executor = UserGroupController.executors.GetOrAdd(key, executor);
                }

                var list = executor.GetList();
                return list;
            }
            catch (Exception ex)
            {
                ErrorHelper.SendExcepToDB(ex, " GetUserGroups", subscriptionId);
                throw ex;
            }
        }
        public List<UserGroup> GetUsersFromUserGroups(string subscriptionId, String UserGroupName)
        {
            try
            {
                PowerShellExecutor<UserGroup> executor;
                string key = subscriptionId + UserGroupName;
                string usergroup = "\"" + UserGroupName + "\"";
                if (!UserGroupController.executors.TryGetValue(key, out executor))
                {
                    executor = new PowerShellExecutor<UserGroup>();
                    executor.CmdName = "";
                    executor.NewFunc = this.NewUserFunc;
                    executor.Configure = (engine) =>
                    {
                        engine.AddScript("Get-ADGroupMember " + usergroup);
                    };
                    executor = UserGroupController.executors.GetOrAdd(key, executor);
                }

                var list = executor.GetList();
                return list;
            }
            catch (Exception ex)
            {
                ErrorHelper.SendExcepToDB(ex, " GetUsersFromUserGroups", subscriptionId);
                throw ex;
            }
        }
        public void NewFunc(dynamic psObject, List<UserGroup> userGroupList)
        {
            var userGroup = new UserGroup();
            userGroup.UserGroupName = psObject.UserGroupName as string;
            userGroup.Type = psObject.Type as string;
            userGroupList.Add(userGroup);
        }
        public void NewUserFunc(dynamic psObject, List<UserGroup> userGroupList)
        {
            var userGroup = new UserGroup();
            userGroup.UserName = psObject.samaccountname;
            userGroup.Type = psObject.objectClass;
            userGroupList.Add(userGroup);
        }
    }
}
