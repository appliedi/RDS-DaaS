using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Web;
using System.Web.Http;
using RDSManagerAPI.Commands;
using RDSManagerAPI.Entities;
using System.Xml;
using System.Threading.Tasks;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.Net.Http;
using System.Net;
using System.IO;
using System.Net.Http.Headers;
using System.Text;
using System.Collections.Specialized;

namespace RDSManagerAPI.Controllers
{
    public class DeploymentBurstController : ApiController
    {
        /// <summary>
        /// Get the deployment properties given a deployment FQDN
        /// </summary>
        /// <param name="deploymentFQDN">FQDN of a deployment</param>
        /// <returns>DeploymentBurstSettings</returns>
        [HttpGet]
        public virtual DeploymentBurstSettings GetDeploymentBurstSettings(string deploymentFQDN)
        {
          try
            {
                string stm = string.Format("SELECT * FROM DeploymentBurstSettings WHERE DeploymentFQDN ='{0}'", deploymentFQDN);
                var result = ServicesManager.Instance.ExecuteQuery<DeploymentBurstSettings>(stm, (rdr, list) =>
                {
                    DeploymentBurstSettings burst = new DeploymentBurstSettings
                    {
                        DeploymentFQDN = rdr["DeploymentFQDN"].ToString(),
                        IsActive = (bool)rdr["IsActive"],
                        PublishUserName = rdr["PublishUserName"].ToString(),
                        PublishPassword = "",//rdr["PublishPassword"].ToString(), // UI doesn't need access to password
                        AzureSubscriptionName = rdr["AzureSubscriptionName"].ToString(),
                        ResourceGroupName = rdr["ResourceGroupName"].ToString(),
                        CreatedDate = (DateTime)rdr["CreatedDate"],
                        LastModifiedDate = (DateTime)rdr["LastModifiedDate"]
                    };
                    list.Add(burst);
                }).FirstOrDefault();
                return result;
            }
            catch (Exception ex)
            {
                ErrorHelper.SendExcepToDB(ex, "GetDeploymentBurstSettings", deploymentFQDN);
                throw ex;
            }
        }

        public void CopyStream(Stream stream, string destPath)
        {
            using (var fileStream = new FileStream(destPath, FileMode.Create, FileAccess.Write))
            {
                stream.Seek(0, SeekOrigin.Begin);
                //stream.WriteAsync(fileStream);
                stream.CopyTo(fileStream);
            }
        }
        [HttpPost]
        public async Task<string> GetConfig(string brokerName)
        {
            string bodyText = await this.Request.Content.ReadAsStringAsync();
            string fullPath = string.Empty;
            string fileName = string.Empty;
            if (!Request.Content.IsMimeMultipartContent())
            {
                return Request.CreateErrorResponse(HttpStatusCode.UnsupportedMediaType, "The request doesn't contain valid content!").ToString();
            }
            try
            {


                var provider = new MultipartMemoryStreamProvider();



                await Request.Content.ReadAsMultipartAsync(provider);

                var path = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "AzureConfigfile");

                foreach (var file in provider.Contents)
                {

                    if (file.Headers.ContentDisposition.FileName != null)
                    {
                        fileName = Path.GetFileName(file.Headers.ContentDisposition.FileName.Trim('\"'));
                        fullPath = Path.Combine(path, fileName);
                        var buffer = await file.ReadAsByteArrayAsync();
                        File.WriteAllBytes(fullPath, buffer);
                        break;
                    }
                }

                string azureFilePath = "\"" + fileName + "\"";
                string currentAzureSubscriptionName = "\"" + HttpContext.Current.Request.Form["CurrentAzureSubscriptionName"] + "\"";
                string cloudServiceName = "\"" + HttpContext.Current.Request.Form["CloudServiceName"] + "\"";

                string beginPeakTime = "\"" + HttpContext.Current.Request.Form["BeginPeakTime"] + "\"";
                string endPeakTime = "\"" + HttpContext.Current.Request.Form["EndPeakTime"] + "\"";
                string timeDifferenceInHours = "\"" + HttpContext.Current.Request.Form["TimeDifferenceInHours"] + "\"";
                string sessionThresholdPerCPU = "\"" + HttpContext.Current.Request.Form["SessionThresholdPerCPU"] + "\"";
                string minimumNumberOfRDSH = "\"" + HttpContext.Current.Request.Form["MinimumNumberOfRDSH"] + "\"";
                string limitSecondsToForceLogOffUser = "\"" + HttpContext.Current.Request.Form["LimitSecondsToForceLogOffUser"] + "\"";
                string logOffMessageTitle = "\"" + HttpContext.Current.Request.Form["LogOffMessageTitle"] + "\"";
                string logOffMessageBody = "\"" + HttpContext.Current.Request.Form["LogOffMessageBody"] + "\"";

                string line1 = "<?xml version=" + @"""1.0""" + " encoding=" + @"""utf-8""" + "?>";
                string cLine1 = "<!-- Version 1.1.0  -->";
                string line2 = "<RDSScale>";
                string line3 = "<Azure>";
                string cLine2 = "<!--File path of the Azure publish setting file used for authenticating into Microsoft Azure -->";
                string line4 = "<Variable Name=" + @"""AzurePublishSettingFile""" + " Value=" + azureFilePath + "/>";
                string cLine3 = " <!--Azure subscription name -->";
                string line5 = "<Variable Name=" + @"""CurrentAzureSubscriptionName""" + " Value=" + currentAzureSubscriptionName + "/>";
                string cLine4 = " <!--Cloud Service Name -->";
                string line6 = "<Variable Name=" + @"""CloudServiceName""" + " Value=" + cloudServiceName + "/>";
                string line7 = "</Azure>";
                string line8 = "<RDSScaleSettings>";
                string cLine5 = "<!-- Begin of the peak usage time -->";
                string line9 = "<Variable Name=" + @"""BeginPeakTime""" + " Value=" + beginPeakTime + "/>";
                string cLine6 = "<!--End of the peak usage time-->";
                string line10 = "<Variable Name=" + @"""EndPeakTime""" + " Value=" + endPeakTime + "/>";
                string cLine7 = "<!--Time difference between local time and UTC, in hours-->";
                string line11 = "<Variable Name=" + @"""TimeDifferenceInHours""" + " Value=" + timeDifferenceInHours + "/>";
                string cLine8 = "<!-- Maximum number of sessions per CPU threshold used to determine when a new RDSH server needs to be started -->";
                string line12 = "<Variable Name=" + @"""SessionThresholdPerCPU""" + " Value=" + sessionThresholdPerCPU + "/>";
                string cLine9 = "<!-- Minimum number of RDSH servers to keep running during off-peak usage time -->";
                string line13 = "<Variable Name=" + @"""MinimumNumberOfRDSH""" + " Value=" + minimumNumberOfRDSH + "/>";
                string cLine10 = "<!--Number of seconds to wait before forcing users to logoff. If 0, don't force users to logoff -->";
                string line14 = "<Variable Name=" + @"""LimitSecondsToForceLogOffUser""" + " Value=" + limitSecondsToForceLogOffUser + "/>";
                string cLine11 = "<!--Message title sent to a user before forcing logoff -->";
                string line15 = "<Variable Name=" + @"""LogOffMessageTitle""" + " Value=" + logOffMessageTitle + "/>";
                string cLine12 = "<!--Message body to sent to a user before forcing logoff -->";
                string line16 = "<Variable Name=" + @"""LogOffMessageBody""" + " Value=" + logOffMessageBody + "/>";
                string line17 = "</RDSScaleSettings>";
                string line18 = "</RDSScale>";

                string[] configFile = new string[30] { line1, cLine1, line2, line3, cLine2, line4, cLine3, line5, cLine4, line6, line7, line8, cLine5, line9, cLine6, line10, cLine7, line11, cLine8, line12, cLine9, line13, cLine10, line14, cLine11, line15, cLine12, line16, line17, line18 };

                var configfilepath = HttpContext.Current.Server.MapPath("~/AzureConfigfile/Config.xml");
                System.IO.File.WriteAllLines(configfilepath, configFile);

                return string.Empty;
            }
            catch (Exception e)
            {
               return Request.CreateErrorResponse(HttpStatusCode.InternalServerError, e.Message).ToString();
            }
        }

    }
}