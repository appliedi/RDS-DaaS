using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Net;
using System.Collections.Specialized;
using System.Text;
using System.IO;
using System.Configuration;
using System.Net.Mail;
using System.Drawing;
using System.Windows.Forms;
using System.Drawing.Imaging;
using System.Net.Mime;

namespace AzureRDSManager.Controllers
{
    public class HomeController : Controller
    {

        public ActionResult Login()
        {
            getURL();
            return View();
        }
        public ActionResult Dashboard()
        {
            return View();
        }
        public ActionResult UpdateLicense()
        {
            return View();
        }
        public ActionResult PreSettings()
        {
            return View();
        }
        public PartialViewResult PartDeploymentAdmin()
        {
            return PartialView();
        }
        public PartialViewResult PartTenantAdmin()
        {
            return PartialView();
        }

        public void getURL()
        {
            Uri uri = new Uri(Request.Url.AbsoluteUri);
            string currentEnvironment = uri.Scheme + Uri.SchemeDelimiter + uri.Host;
            ViewBag.ApiPath = currentEnvironment + "/" + ConfigurationManager.AppSettings["ApiLocation"] + "/";
            ViewBag.LoginPath = currentEnvironment + "/" + ConfigurationManager.AppSettings["loginRedirect"];
        }
    }
}