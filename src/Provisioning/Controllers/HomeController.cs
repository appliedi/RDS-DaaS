using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Net;
using System.Text;

namespace RDSProvision.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            return View(GetCustomers());
        }

        public ActionResult AllCustomers()
        {
            return View(GetCustomers());
        }

        public List<Customers> GetCustomers()
        {
            var allCustomers = new List<Customers>();
            try
            {
                if (SDKConnector.AzurePartnerManager == null)
                {
                    SDKConnector.AzurePartnerManager = SDKConnector.PartnerCenterSDK();
                }
                IPartner scopedPartnerOperations = SDKConnector.AzurePartnerManager.With(RequestContextFactory.Instance.Create(Guid.NewGuid()));
                // all the operations executed on this partner operation instance will share the same correlation Id but will differ in request Id
                // read customers into chunks of 40s            
                var customersBatch = SDKConnector.AzurePartnerManager.Customers.Query(QueryFactory.Instance.BuildIndexedQuery(40));
                var customersEnumerator = scopedPartnerOperations.Enumerators.Customers.Create(customersBatch);
                allCustomers = customersEnumerator.Current.Items.Select(item => new Customers
                {
                    companyName = item.CompanyProfile.CompanyName,
                    domain = item.CompanyProfile.Domain,
                    tenantId = item.CompanyProfile.TenantId,
                    Id = item.Id,
                    relationshipToPartner = item.RelationshipToPartner.ToString()
                }).ToList();
            }
            catch
            {
                allCustomers = null;
            }
            return allCustomers;
        }

        [HttpPost]
        public JsonResult CreateCustomer(string companyName, string domainName, string address, string city, string state, string zipCode, string firstName, string lastName, string emailID, string phoneNumber)
        {
            string result = null;
            try
            {
                if (SDKConnector.AzurePartnerManager == null)
                {
                    SDKConnector.AzurePartnerManager = SDKConnector.PartnerCenterSDK();
                }
                var partnerOperations = SDKConnector.AzurePartnerManager;

                var customerToCreate = new Customer()
                {
                    CompanyProfile = new CustomerCompanyProfile()
                    {
                        Domain = string.Format(CultureInfo.InvariantCulture,
                            domainName + "{0}",
                            ".onmicrosoft.com")
                    },
                    BillingProfile = new CustomerBillingProfile()
                    {
                        Culture = "EN-US",
                        Email = emailID,
                        Language = "En",
                        CompanyName = companyName,
                        DefaultAddress = new Address()
                        {
                            FirstName = firstName,
                            LastName = lastName,
                            AddressLine1 = address,
                            City = city,
                            State = state,
                            Country = "US",
                            PostalCode = zipCode,
                            PhoneNumber = phoneNumber
                        }
                    }
                };

                var newCustomer = partnerOperations.Customers.Create(customerToCreate);
                result = "success";
            }
            catch (Exception err)
            {
                result = null;
            }

            return Json(new { res = result }, JsonRequestBehavior.AllowGet);

        }

        [HttpPost]
        public JsonResult DeleteCustomer(string selectedCustomerId)
        {
            string result = null;
            try
            {
                if (SDKConnector.AzurePartnerManager == null)
                {
                    SDKConnector.AzurePartnerManager = SDKConnector.PartnerCenterSDK();
                }
                var partnerOperations = SDKConnector.AzurePartnerManager;
                partnerOperations.Customers.ById(selectedCustomerId).Delete();
                result = "success";
            }
            catch (Exception err)
            {
                result = null;
            }
            return Json(new { res = result }, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult CustomerData(string companyName, string companyId)
        {
            Session["CompanyName"] = companyName;
            Session["CompanyId"] = companyId;
            return Json(new { res = 1 }, JsonRequestBehavior.AllowGet);
        }

        public ActionResult ListDeployments()
        {
            if (Request.Form["Code"] != null || Request.Form["Code"].ToString() != "")
            {
                ViewBag.CompanyName = Session["CompanyName"];
                ViewBag.CustomerID = Session["CompanyId"];
                string customerId = ViewBag.CustomerID;
                ViewBag.atoken = "";
                try
                {
                    ViewBag.atoken = GetLoginDetails(Request.Form["Code"].ToString()).Access_Token.ToString();
                    if (SDKConnector.AzurePartnerManager == null)
                    {
                        SDKConnector.AzurePartnerManager = SDKConnector.PartnerCenterSDK();
                    }
                    //List Subscriptions
                    var subscriptions = SDKConnector.AzurePartnerManager.Customers.ById(customerId).Subscriptions.Get();
                    ViewBag.Subscriptions = subscriptions;

                    //Get offers
                    ResourceCollection<Offer> offers = SDKConnector.AzurePartnerManager.Offers.ByCountry("US").Get();
                    var allOffers = new List<Offers>();
                    allOffers = offers.Items.Select(item => new Offers
                    {
                        offerName = item.Name,
                        offerId = item.Id,
                        description = item.Description
                    }).ToList();

                    ViewBag.AllOffers = allOffers;

                }
                catch
                {

                }

                return View(GetCustomers());
            }
            else
            {
                return RedirectToAction("AllCustomers");
            }
        }

        public JsonResult CreateSubscription(string customerId, string offerId, string friendlyName)
        {
            string result = null;
            try
            {
                var order = new Order()
                {
                    ReferenceCustomerId = customerId,
                    LineItems = new List<OrderLineItem>()
                    {
                        new OrderLineItem()
                        {
                            OfferId = offerId,
                            FriendlyName = friendlyName,
                            Quantity = 5
                        }
                    }
                };
                if (SDKConnector.AzurePartnerManager == null)
                {
                    SDKConnector.AzurePartnerManager = SDKConnector.PartnerCenterSDK();
                }
                var createdOrder = SDKConnector.AzurePartnerManager.Customers.ById(customerId).Orders.Create(order);
                result = "success";
            }
            catch
            {
                result = "success";
            }
            return Json(new { res = result }, JsonRequestBehavior.AllowGet);
        }

        public string GetAccessToken(string code)
        {
            string OAUTH_2_0_TOKEN_ENDPOINT = "https://login.windows.net/common/oauth2/token";

            string client_ID = ConfigurationManager.AppSettings["ClientID"];
            var request = (HttpWebRequest)WebRequest.Create(OAUTH_2_0_TOKEN_ENDPOINT);
            string redirect_URI = ConfigurationManager.AppSettings["RedirectURI"];
            string azureResourceUrl = "https://management.core.windows.net/";

            var postData = "redirect_uri=" + redirect_URI + "";
            postData += "&grant_type=authorization_code";
            postData += "&resource=" + azureResourceUrl + "";
            postData += "&client_id=" + client_ID + "";
            postData += "&code=" + code + "";

            var data = Encoding.ASCII.GetBytes(postData);

            request.Method = "POST";
            request.ContentType = "application/x-www-form-urlencoded";
            request.ContentLength = data.Length;

            using (var stream = request.GetRequestStream())
            {
                stream.Write(data, 0, data.Length);
            }

            var response = (HttpWebResponse)request.GetResponse();

            var responseString = new StreamReader(response.GetResponseStream()).ReadToEnd();
            return responseString.ToString();
        }

        public LoginDetails GetLoginDetails(string code)
        {
            string token = GetAccessToken(code);
            LoginDetails loginDetails = JsonConvert.DeserializeObject<LoginDetails>(token);
            try
            {
                var handler = new JwtSecurityTokenHandler();
                var tokenS = handler.ReadToken(loginDetails.Access_Token) as JwtSecurityToken;
                loginDetails.UserName = tokenS.Claims.First(claim => claim.Type.Equals("name")).Value;
                loginDetails.Email = tokenS.Claims.First(claim => claim.Type.Equals("unique_name")).Value;
            }
            catch (Exception ex)
            {
                if (ex != null)
                {
                    string exception = ex.ToString();
                }
                loginDetails = null;
            }

            return loginDetails;
        }

        [HttpGet]
        public ActionResult GetResourceGroups(string SubId)
        {
            var ResourceGroupList = new List<ResourceGroup>();
            try
            {
                string token = Request.Headers["Authorization"];
                HttpClient clients = new HttpClient();
                clients.BaseAddress = new Uri("https://management.azure.com");
                clients.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
                HttpResponseMessage results = clients.GetAsync("subscriptions/" + SubId + "/resourcegroups?api-version=2015-01-01").Result;
                if (results.IsSuccessStatusCode)
                {
                    string strJson = results.Content.ReadAsStringAsync().Result;
                    //Deserialize the string to JSON object
                    var jObj = (JObject)JsonConvert.DeserializeObject(strJson);
                    ResourceGroupList = jObj["value"]
                                    .Select(item => new ResourceGroup
                                    {
                                        Name = (string)item["name"],
                                        Location = (string)item["location"],
                                        Id = (string)item["id"],
                                    }).ToList();
                }
            }
            catch (Exception ex)
            {
                if (ex != null)
                {
                    string exception = ex.ToString();
                }
                ResourceGroupList = null;
            }
            return Json(ResourceGroupList, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public string CreateResourceGroups(string SubId, string resourcegroupName, string Location, string TagName)
        {
            string result = "";
            try
            {
                string token = Request.Headers["Authorization"];
                HttpClient clients = new HttpClient();
                clients.BaseAddress = new Uri("https://management.azure.com");
                clients.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
                clients.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                CreateResourceGroupDTO request = new CreateResourceGroupDTO
                {
                    Location = Location
                };
                request.Tags = new tags { TagName1 = TagName };
                var content = new StringContent(JsonConvert.SerializeObject(request), Encoding.UTF8, "application/json");
                HttpResponseMessage results = clients.PutAsync("/subscriptions/" + SubId + "/resourcegroups/" + resourcegroupName + "?api-version=2015-01-01", content).Result;
                if (results.IsSuccessStatusCode)
                {
                    string strJson = results.Content.ReadAsStringAsync().Result;
                    //Deserialize the string to JSON object
                    var jObj = (JObject)JsonConvert.DeserializeObject(strJson);
                    result = "success";
                }
            }
            catch (Exception ex)
            {
                if (ex != null)
                {
                    string exception = ex.ToString();
                }
                result = null;
            }
            return result;
        }

        [HttpGet]
        public ActionResult GetLocations(string SubId)
        {
            var LocationList = new List<LocationDTO>();
            try
            {
                string token = Request.Headers["Authorization"];
                HttpClient clients = new HttpClient();
                clients.BaseAddress = new Uri("https://management.azure.com");
                clients.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
                HttpResponseMessage results = clients.GetAsync("subscriptions/" + SubId + "/locations?api-version=2015-01-01").Result;
                if (results.IsSuccessStatusCode)
                {
                    string strJson = results.Content.ReadAsStringAsync().Result;
                    //Deserialize the string to JSON object
                    var jObj = (JObject)JsonConvert.DeserializeObject(strJson);
                    LocationList = jObj["value"]
                                    .Select(item => new LocationDTO
                                    {
                                        Name = (string)item["name"],
                                        DisplayName = (string)item["displayName"]
                                    }).ToList();
                }
            }
            catch (Exception ex)
            {
                if (ex != null)
                {
                    string exception = ex.ToString();
                }
                LocationList = null;
            }
            return Json(LocationList, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public ActionResult GetVmSizes(string SubId, string Location)
        {
            var VMSizes = new List<VMSizeDTO>();
            try
            {
                string token = Request.Headers["Authorization"];
                HttpClient clients = new HttpClient();
                clients.BaseAddress = new Uri("https://management.azure.com");
                clients.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
                HttpResponseMessage results = clients.GetAsync("subscriptions/" + SubId + "/providers/Microsoft.Compute/locations/" + Location + "/vmSizes?api-version=2015-06-15").Result;
                if (results.IsSuccessStatusCode)
                {
                    string strJson = results.Content.ReadAsStringAsync().Result;
                    //Deserialize the string to JSON object
                    var jObj = (JObject)JsonConvert.DeserializeObject(strJson);
                    VMSizes = jObj["value"]
                                    .Select(item => new VMSizeDTO
                                    {
                                        Name = (string)item["name"],
                                    }).ToList();
                }
            }
            catch (Exception ex)
            {
                if (ex != null)
                {
                    string exception = ex.ToString();
                }
                VMSizes = null;
            }
            return Json(VMSizes, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public ActionResult GetVMListBySubId(string SubId)
        {
            var VMList = new List<VmListDTO>();
            try
            {
                string token = Request.Headers["Authorization"];
                HttpClient clients = new HttpClient();
                clients.BaseAddress = new Uri("https://management.azure.com");
                clients.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
                HttpResponseMessage results = clients.GetAsync("subscriptions/" + SubId + "/providers/Microsoft.Compute/virtualmachines?api-version=2015-06-15").Result;
                if (results.IsSuccessStatusCode)
                {
                    string strJson = results.Content.ReadAsStringAsync().Result;
                    //Deserialize the string to JSON object
                    var jObj = (JObject)JsonConvert.DeserializeObject(strJson);
                    VMList = jObj["value"]
                                    .Select(item => new VmListDTO
                                    {
                                        Name = (string)item["name"],
                                    }).ToList();
                }
            }
            catch (Exception ex)
            {
                if (ex != null)
                {
                    string exception = ex.ToString();
                }
                VMList = null;
            }
            return Json(VMList, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public ActionResult GetVMImageListBySubId(string SubId)
        {
            var VMImageList = new List<VMImageListDTO>();
            try
            {
                string token = Request.Headers["Authorization"];
                HttpClient clients = new HttpClient();
                clients.BaseAddress = new Uri("https://management.azure.com");
                clients.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
                HttpResponseMessage results = clients.GetAsync("/subscriptions/" + SubId + "/providers/Microsoft.Compute/images/?api-version=2016-08-30").Result;
                if (results.IsSuccessStatusCode)
                {
                    string strJson = results.Content.ReadAsStringAsync().Result;
                    //Deserialize the string to JSON object
                    var jObj = (JObject)JsonConvert.DeserializeObject(strJson);
                    VMImageList = jObj["value"]
                                    .Select(item => new VMImageListDTO
                                    {
                                        Name = (string)item["name"],
                                        Id = (string)item["id"]
                                    }).ToList();
                }
            }
            catch (Exception ex)
            {
                if (ex != null)
                {
                    string exception = ex.ToString();
                }
                VMImageList = null;
            }
            return Json(VMImageList, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult CreateRDS(string SubscriptionID, string ResourceGroup, string RDSDeploymentName, string IPAddress,
            string ADDomainName, string AdminUsername, string AdminPassword, string WindowsServer, string VMSizes, int NoOfRDSHS,
            string URL, string Location, string AzureVmImage, string subnetName, string vNetName)
        {
            string res = ""; string templateRDSArmTemplate = "";
            string templateRDSArmParameterSyntax = ""; string templateRDSArmParameter = "";
            try
            {
                if (subnetName == "null" && vNetName == "null")
                {
                    templateRDSArmTemplate = "http://" + URL + "/Templates/RDSARMTemplate.json";
                    templateRDSArmParameterSyntax = Server.MapPath("~/Templates/RDSARMParameters.json");
                    string jsonParam = System.IO.File.ReadAllText(templateRDSArmParameterSyntax);
                    jsonParam = jsonParam.Replace("{{deploymentname}}", RDSDeploymentName.ToLower());
                    jsonParam = jsonParam.Replace("{{ipaddress}}", IPAddress);
                    jsonParam = jsonParam.Replace("{{domainname}}", ADDomainName.ToLower());
                    jsonParam = jsonParam.Replace("{{adminname}}", AdminUsername);
                    jsonParam = jsonParam.Replace("{{adminpassword}}", AdminPassword);
                    jsonParam = jsonParam.Replace("{{windowsserver}}", WindowsServer);
                    jsonParam = jsonParam.Replace("{{vmsize}}", VMSizes);
                    // jsonParam = jsonParam.Replace("{{NoOfRDSHS}}", NoOfRDSHS);
                    Random random = new Random();
                    string newJosnFileName = "param_" + random.Next(1, 9999).ToString() + ".json";
                    string newParamFile = Server.MapPath("~/Templates/" + newJosnFileName + "");
                    using (var file = new StreamWriter(newParamFile, false))
                    {
                        file.Write(jsonParam);
                        file.Close();
                        file.Dispose();
                    }
                    templateRDSArmParameter = "http://" + URL + "/Templates/" + newJosnFileName + "";
                }
                else
                {
                    templateRDSArmTemplate = "http://" + URL + "/Templates/RDSTemplate.json";
                    templateRDSArmParameterSyntax = Server.MapPath("~/Templates/RDSParameters.json");
                    string jsonParam = System.IO.File.ReadAllText(templateRDSArmParameterSyntax);
                    jsonParam = jsonParam.Replace("{{deploymentname}}", RDSDeploymentName.ToLower());
                    jsonParam = jsonParam.Replace("{{domainname}}", ADDomainName.ToLower());
                    jsonParam = jsonParam.Replace("{{vnetname}}", vNetName);
                    jsonParam = jsonParam.Replace("{{subnetname}}", subnetName);
                    jsonParam = jsonParam.Replace("{{adminname}}", AdminUsername);
                    jsonParam = jsonParam.Replace("{{adminpassword}}", AdminPassword);
                    jsonParam = jsonParam.Replace("{{windowsserver}}", WindowsServer);
                    jsonParam = jsonParam.Replace("{{vmsize}}", VMSizes);
                    // jsonParam = jsonParam.Replace("{{NoOfRDSHS}}", NoOfRDSHS);
                    Random random = new Random();
                    string newJosnFileName = "param_" + random.Next(1, 9999).ToString() + ".json";
                    string newParamFile = Server.MapPath("~/Templates/" + newJosnFileName + "");
                    using (var file = new StreamWriter(newParamFile, false))
                    {
                        file.Write(jsonParam);
                        file.Close();
                        file.Dispose();
                    }
                    templateRDSArmParameter = "http://" + URL + "/Templates/" + newJosnFileName + "";
                }
                string token = Request.Headers["Authorization"];
                HttpClient clients = new HttpClient();
                clients.BaseAddress = new Uri("https://management.azure.com");
                clients.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
                clients.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                RDSDTO request = new RDSDTO();
                properties propertie = new properties();
                propertie.templateLink = new TemplateLink { uri = templateRDSArmTemplate, contentVersion = "1.0.0.0" };
                propertie.parametersLink = new ParametersLink { uri = templateRDSArmParameter, contentVersion = "1.0.0.0" };
                request.properties = new properties { mode = "Incremental", templateLink = propertie.templateLink, parametersLink = propertie.parametersLink };
                var content = new StringContent(JsonConvert.SerializeObject(request), Encoding.UTF8, "application/json");
                HttpResponseMessage results = clients.PutAsync("/subscriptions/" + SubscriptionID + "/resourcegroups/" + ResourceGroup + "/providers/Microsoft.Resources/deployments/" + RDSDeploymentName + "?api-version=2015-01-01", content).Result;
                if (results.IsSuccessStatusCode)
                {
                    string strJson = results.Content.ReadAsStringAsync().Result;
                    //Deserialize the string to JSON object
                    var jObj = (JObject)JsonConvert.DeserializeObject(strJson);
                    res = "1";
                    if (AzureVmImage != "null")
                    {
                        string shsRes = CreateSHS(SubscriptionID, ResourceGroup, RDSDeploymentName, IPAddress, AdminUsername, AdminPassword, VMSizes, NoOfRDSHS, Location, AzureVmImage, token);
                        if (shsRes == "1") { res = "1"; }
                        else { res = "0"; }
                    }
                }
            }
            catch (Exception ex)
            {
                res = ex.ToString();
            }
            var jsonResult = Json(new { aaData = res }, JsonRequestBehavior.AllowGet);
            return jsonResult;
        }

        public string CreateSHS(string SubscriptionID, string ResourceGroup, string RDSDeploymentName, string IPAddress, string AdminUsername, string AdminPassword, string VMSizes, int NoOfRDSHS, string Location, string AzureVmImage, string token)
        {
            string res = "0";
            CreateResponse AvailableSet = GetAvailableSetID(RDSDeploymentName, SubscriptionID, ResourceGroup, Location, token);
            CreateResponse IPAdderss = GetIPAdderssID(token, RDSDeploymentName, SubscriptionID, ResourceGroup, Location);
            CreateResponse VNET = GetVNETID(token, Location, SubscriptionID, ResourceGroup, RDSDeploymentName, IPAddress);
            CreateResponse Subnet = GetSubnetID(token, SubscriptionID, ResourceGroup, RDSDeploymentName, VNET.Name, IPAddress);
            CreateResponse NetworkInterfaceCard = GetNetworkInterfaceCardID(token, Location, SubscriptionID, ResourceGroup, RDSDeploymentName, IPAdderss.Id, Subnet.Id);
            string CreatevmMsg = CreateVm(token, Location, SubscriptionID, ResourceGroup, RDSDeploymentName, NetworkInterfaceCard.Id, AvailableSet.Id, AzureVmImage, VMSizes, AdminUsername, AdminPassword, NoOfRDSHS);
            if (CreatevmMsg == "success") { res = "1"; }
            return res;
        }

        [HttpPost]
        public string CreateSHSFromImage(string SubscriptionID, string ResourceGroup, string RDSDeploymentName, string IPAddress, string AdminUsername, string AdminPassword, string VMSizes, int NoOfRDSHS, string Location, string AzureVmImage)
        {
            string token = Request.Headers["Authorization"];
            string res = "0";
            CreateResponse AvailableSet = GetAvailableSetID(RDSDeploymentName, SubscriptionID, ResourceGroup, Location, token);
            CreateResponse IPAdderss = GetIPAdderssID(token, RDSDeploymentName, SubscriptionID, ResourceGroup, Location);
            CreateResponse VNET = GetVNETID(token, Location, SubscriptionID, ResourceGroup, RDSDeploymentName, IPAddress);
            CreateResponse Subnet = GetSubnetID(token, SubscriptionID, ResourceGroup, RDSDeploymentName, VNET.Name, IPAddress);
            CreateResponse NetworkInterfaceCard = GetNetworkInterfaceCardID(token, Location, SubscriptionID, ResourceGroup, RDSDeploymentName, IPAdderss.Id, Subnet.Id);
            string CreatevmMsg = CreateVm(token, Location, SubscriptionID, ResourceGroup, RDSDeploymentName, NetworkInterfaceCard.Id, AvailableSet.Id, AzureVmImage, VMSizes, AdminUsername, AdminPassword, NoOfRDSHS);
            if (CreatevmMsg == "success") { res = "1"; }
            return res;
        }

        public CreateResponse GetAvailableSetID(string RDSDeploymentName, string SubscriptionID, string ResourceGroup, string Location, string token)
        {
            Random random = new Random();
            string AvailableSetName = RDSDeploymentName + random.Next(1, 9999).ToString() + "As";
            CreateResponse res = new CreateResponse();
            HttpClient clients = new HttpClient();
            clients.BaseAddress = new Uri("https://management.azure.com");
            clients.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
            clients.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
            AvailableSetDTO availableSet = new AvailableSetDTO();
            availableSet.Name = AvailableSetName;
            availableSet.Type = "Microsoft.Compute/availabilitySets";
            availableSet.Location = Location;
            availableSet.Tags = new tag { };
            availableSet.Sku = new sku { name = "Aligned" };
            availableSet.Properties = new propertie
            {
                platformUpdateDomainCount = 5,
                platformFaultDomainCount = 3
            };
            var content = new StringContent(JsonConvert.SerializeObject(availableSet), Encoding.UTF8, "application/json");
            HttpResponseMessage results = clients.PutAsync("/subscriptions/" + SubscriptionID + "/resourceGroups/" + ResourceGroup + "/providers/Microsoft.Compute/availabilitySets/" + AvailableSetName + "?api-version=2017-03-30", content).Result;
            if (results.IsSuccessStatusCode)
            {
                string strJson = results.Content.ReadAsStringAsync().Result;
                //Deserialize the string to JSON object
                var jObj = (JObject)JsonConvert.DeserializeObject(strJson);
                res.Name = jObj["name"].ToString();
                res.Id = jObj["id"].ToString();
            }
            return res;
        }

        public CreateResponse GetIPAdderssID(string token, string RDSDeploymentName, string SubscriptionID, string ResourceGroup, string location)
        {
            CreateResponse res = new CreateResponse();
            Random random = new Random();
            string IPAdderssName = RDSDeploymentName + random.Next(1, 9999).ToString() + "ip";
            HttpClient clients = new HttpClient();
            clients.BaseAddress = new Uri("https://management.azure.com");
            clients.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
            clients.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
            IpAddressDTO ipadd = new IpAddressDTO();
            ipadd.Location = location;
            var content = new StringContent(JsonConvert.SerializeObject(ipadd), Encoding.UTF8, "application/json");
            HttpResponseMessage results = clients.PutAsync("/subscriptions/" + SubscriptionID + "/resourceGroups/" + ResourceGroup + "/providers/Microsoft.Network/publicIPAddresses/" + IPAdderssName + "?api-version=2017-09-01", content).Result;
            if (results.IsSuccessStatusCode)
            {
                string strJson = results.Content.ReadAsStringAsync().Result;
                //Deserialize the string to JSON object
                var jObj = (JObject)JsonConvert.DeserializeObject(strJson);
                res.Name = jObj["name"].ToString();
                res.Id = jObj["id"].ToString();
            }
            return res;
        }

        public CreateResponse GetVNETID(string token, string Location, string SubscriptionID, string ResourceGroup, string RDSDeploymentName, string IPAddress)
        {
            CreateResponse res = new CreateResponse();
            Random random = new Random();
            string VNETName = RDSDeploymentName + random.Next(1, 9999).ToString() + "vnet";
            HttpClient clients = new HttpClient();
            clients.BaseAddress = new Uri("https://management.azure.com");
            clients.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
            clients.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
            string[] IPAddressArray = { "10.0.0.0/16" }; //{ IPAddress };
            VirtualNetworksDTO VirtualNetworks = new VirtualNetworksDTO();
            VirtualNetworks.Location = Location;
            VirtualNetworks.properties = new property { addressSpace = new AddressSpace { addressPrefixes = IPAddressArray } };
            var content = new StringContent(JsonConvert.SerializeObject(VirtualNetworks), Encoding.UTF8, "application/json");
            HttpResponseMessage results = clients.PutAsync("subscriptions/" + SubscriptionID + "/resourceGroups/" + ResourceGroup + "/providers/Microsoft.Network/virtualNetworks/" + VNETName + "?api-version=2017-09-01", content).Result;
            if (results.IsSuccessStatusCode)
            {
                string strJson = results.Content.ReadAsStringAsync().Result;
                //Deserialize the string to JSON object
                var jObj = (JObject)JsonConvert.DeserializeObject(strJson);
                res.Name = jObj["name"].ToString();
                res.Id = jObj["id"].ToString();
            }
            return res;
        }

        public CreateResponse GetSubnetID(string token, string SubscriptionID, string ResourceGroup, string RDSDeploymentName, string virtualNetworks, string IPAddress)
        {
            CreateResponse res = new CreateResponse();
            Random random = new Random();
            string SubnetName = RDSDeploymentName + random.Next(1, 9999).ToString() + "subnet";
            HttpClient clients = new HttpClient();
            clients.BaseAddress = new Uri("https://management.azure.com");
            clients.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
            clients.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
            SubNetDTO SubNet = new SubNetDTO();
            SubNet.Properties = new SubProperties { addressPrefix = "10.0.0.0/16" };
            var content = new StringContent(JsonConvert.SerializeObject(SubNet), Encoding.UTF8, "application/json");
            HttpResponseMessage results = clients.PutAsync("/subscriptions/" + SubscriptionID + "/resourceGroups/" + ResourceGroup + "/providers/Microsoft.Network/virtualNetworks/" + virtualNetworks + "/subnets/" + SubnetName + "?api-version=2017-09-01", content).Result;
            if (results.IsSuccessStatusCode)
            {
                string strJson = results.Content.ReadAsStringAsync().Result;
                //Deserialize the string to JSON object
                var jObj = (JObject)JsonConvert.DeserializeObject(strJson);
                res.Name = jObj["name"].ToString();
                res.Id = jObj["id"].ToString();
            }
            return res;
        }

        public CreateResponse GetNetworkInterfaceCardID(string token, string Location, string SubscriptionID, string ResourceGroup, string RDSDeploymentName, string IPAdderssID, string SubnetId)
        {
            CreateResponse res = new CreateResponse();
            Random random = new Random();
            string NetworkInterfaceCardName = RDSDeploymentName + random.Next(1, 9999).ToString() + "-nic";
            string IpConfigName = RDSDeploymentName + random.Next(1, 9999).ToString() + "ip";
            HttpClient clients = new HttpClient();
            clients.BaseAddress = new Uri("https://management.azure.com");
            clients.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
            clients.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
            NetworkInterfaceCardDTO NetworkInterfaceCard = new NetworkInterfaceCardDTO();
            NetworkInterfaceCard.Location = Location;
            List<IpConfigurations> req = new List<IpConfigurations>
            { new IpConfigurations{
                name = IpConfigName,
                Properties = new IpProperties { publicIPAddress = new PublicIPAddress { id = IPAdderssID },
                    subnet = new PublicIPAddress { id = SubnetId } },
                }
            }.ToList();
            NetworkInterfaceCard.Properties = new NICProperties { enableAcceleratedNetworking = true, ipConfigurations = req };

            var content = new StringContent(JsonConvert.SerializeObject(NetworkInterfaceCard), Encoding.UTF8, "application/json");
            HttpResponseMessage results = clients.PutAsync("/subscriptions/" + SubscriptionID + "/resourceGroups/" + ResourceGroup + "/providers/Microsoft.Network/networkInterfaces/" + NetworkInterfaceCardName + "?api-version=2017-09-01", content).Result;
            if (results.IsSuccessStatusCode)
            {
                string strJson = results.Content.ReadAsStringAsync().Result;
                //Deserialize the string to JSON object
                var jObj = (JObject)JsonConvert.DeserializeObject(strJson);
                res.Name = jObj["name"].ToString();
                res.Id = jObj["id"].ToString();
            }
            return res;
        }

        public string CreateVm(string token, string Location, string SubscriptionID, string ResourceGroup, string RDSDeploymentName, string NetworkInterfaceCardID, string AvailableSetID, string VMImageID, string VMSizes, string AdminUsername, string AdminPassword, int NoOfRDSHS)
        {
            string CreateVm = "";
            for (int i = 0; i < NoOfRDSHS; i++)
            {
                Random random = new Random();
                string osDiskName = RDSDeploymentName + random.Next(1, 9999).ToString() + "osdisk";
                string VMName = RDSDeploymentName + random.Next(1, 9999).ToString() + "-sh";
                string computerName = RDSDeploymentName + random.Next(1, 9999).ToString() + "vm";
                HttpClient clients = new HttpClient();
                clients.BaseAddress = new Uri("https://management.azure.com");
                clients.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
                clients.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                CreateVMDTO CreateVM = new CreateVMDTO();
                CreateVM.name = VMName;
                CreateVM.location = Location;
                CreateVM.tags = new VMtags { department = "finance" };
                List<NetworkInterfaces> req = new List<NetworkInterfaces>{
                    new NetworkInterfaces
                    {
                        id =NetworkInterfaceCardID,
                        properties = new NIProperties{primary=true}
                    }
                }.ToList();
                CreateVM.properties = new VMProperties
                {
                    licenseType = "Windows_Server",
                    availabilitySet = new AvailabilitySet { id = AvailableSetID },
                    hardwareProfile = new HardwareProfile { vmSize = "Standard_D12_v2" },
                    storageProfile = new StorageProfile
                    {
                        imageReference = new ImageReference { id = VMImageID },
                        osDisk = new OsDisk { name = osDiskName, osType = "Windows", createOption = "fromImage" }
                    },
                    osProfile = new OsProfile
                    {
                        computerName = computerName,
                        adminUsername = AdminUsername,
                        adminPassword = AdminPassword,
                        windowsConfiguration = new WindowsConfiguration { provisionVMAgent = true, enableAutomaticUpdates = true, timeZone = "Pacific Standard Time" }
                    },
                    networkProfile = new NetworkProfile
                    {
                        networkInterfaces = req
                    }
                };
                var content = new StringContent(JsonConvert.SerializeObject(CreateVM), Encoding.UTF8, "application/json");
                HttpResponseMessage results = clients.PutAsync("/subscriptions/" + SubscriptionID + "/resourceGroups/" + ResourceGroup + "/providers/Microsoft.Compute/virtualMachines/" + VMName + "?api-version=2016-04-30-preview", content).Result;
                if (results.IsSuccessStatusCode)
                {
                    string strJson = results.Content.ReadAsStringAsync().Result;
                    //Deserialize the string to JSON object
                    var jObj = (JObject)JsonConvert.DeserializeObject(strJson);
                    CreateVm = "success";
                }
            }
            return CreateVm;
        }

        [HttpGet]
        public ActionResult GetAllDeployments()
        {
            var depList = new List<DeploymentDTO>();

            if (Session["CompanyId"] != null)
            {
                string customerId = Session["CompanyId"].ToString();
                var subscriptions = SDKConnector.AzurePartnerManager.Customers.ById(customerId).Subscriptions.Get();
                foreach (var sub in subscriptions.Items)
                {

                    string token = Request.Headers["Authorization"];
                    var ResourceGroupList = new List<ResourceGroup>();
                    HttpClient clients = new HttpClient();
                    clients.BaseAddress = new Uri("https://management.azure.com");
                    clients.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
                    clients.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                    HttpResponseMessage results = clients.GetAsync("/subscriptions/" + sub.Id + "/resourcegroups?api-version=2015-01-01").Result;
                    if (results.IsSuccessStatusCode)
                    {
                        string strJson = results.Content.ReadAsStringAsync().Result;
                        //Deserialize the string to JSON object
                        var jObj = (JObject)JsonConvert.DeserializeObject(strJson);
                        ResourceGroupList = jObj["value"]
                                            .Select(item => new ResourceGroup
                                            {
                                                Name = (string)item["name"],
                                                Location = (string)item["location"],
                                                Id = (string)item["id"],
                                            }).ToList();
                    }
                    foreach (var item in ResourceGroupList)
                    {
                        var dep = new List<DeploymentDTO>();
                        HttpResponseMessage DepRes = clients.GetAsync("/subscriptions/" + sub.Id + "/resourcegroups/" + item.Name + "/providers/Microsoft.Resources/deployments/?api-version=2017-05-10").Result;
                        if (DepRes.IsSuccessStatusCode)
                        {
                            string strJson = DepRes.Content.ReadAsStringAsync().Result;
                            //Deserialize the string to JSON object
                            var jObj = (JObject)JsonConvert.DeserializeObject(strJson);
                            dep = jObj["value"].Select(items => new DeploymentDTO
                            {
                                Name = (string)items["name"]
                            }).ToList();
                            DeploymentDTO updateVNetDNS = dep.Find(d => d.Name == "updateVNetDNS");
                            DeploymentDTO CreateAdVms = dep.Find(d => d.Name == "CreateAdVms");
                            DeploymentDTO DeployPrimaryAd = dep.Find(d => d.Name == "DeployPrimaryAd");
                            if ((updateVNetDNS != null) && (DeployPrimaryAd != null) && (CreateAdVms != null))
                            {
                                if (updateVNetDNS.Name == "updateVNetDNS" && DeployPrimaryAd.Name == "DeployPrimaryAd" && CreateAdVms.Name == "CreateAdVms")
                                {
                                    foreach (var d in dep)
                                    {
                                        HttpResponseMessage depsList = clients.GetAsync("/subscriptions/" + sub.Id + "/resourceGroups/" + item.Name + "/providers/Microsoft.Resources/deployments/" + d.Name + "/operations?api-version=2016-02-01").Result;
                                        if (depsList.IsSuccessStatusCode)
                                        {
                                            string strJson1 = depsList.Content.ReadAsStringAsync().Result;
                                            //Deserialize the string to JSON object
                                            var jObj1 = (JObject)JsonConvert.DeserializeObject(strJson1);
                                            var deploymentList = new DeploymentDTO();
                                            for (int i = 0; i < jObj1["value"].Count(); i++)
                                            {

                                                if (jObj1["value"][i]["properties"]["targetResource"] != null)
                                                {
                                                    var resname = Convert.ToString(jObj1["value"][i]["properties"]["targetResource"]["resourceName"] == null ? "" : jObj1["value"][i]["properties"]["targetResource"]["resourceName"]);
                                                    if (resname == "cb-vm")
                                                    {
                                                        depList.Add(new DeploymentDTO
                                                        {
                                                            Name = d.Name,
                                                            SubscriptionID = sub.Id.ToString(),
                                                            ResourceGroupName = item.Name
                                                        });
                                                    }
                                                }
                                            }

                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
            return Json(depList, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public int AcquireAccessToken()
        {
            int res = 0;
            try
            {
                string client_ID = ConfigurationManager.AppSettings["ClientID"];
                string redirect_URI = ConfigurationManager.AppSettings["RedirectURI"];
                var context = new AuthenticationContext("https://login.microsoftonline.com/common", false);
                var result = context.AcquireToken("https://management.core.windows.net/", client_ID, new Uri(redirect_URI), PromptBehavior.Always);
                var token = result.AccessToken;
                Session["access_token"] = token;
                res = 1;
            }
            catch
            {
                res = 0;
            }
            return res;
        }
    }
}