namespace RDSManagerAPI.Controllers
{
    using Newtonsoft.Json;
    using System;
    using System.Collections.Generic;
    using System.Threading.Tasks;
    using System.Web.Http;
    public class ProcessesController : ApiController
    {
        public ProcessesController()
        {

        }

        [HttpPost]
        public async Task<string> ProcessCommand(string subscriptionId)
        {
            try
            {
                
                string bodyText = await this.Request.Content.ReadAsStringAsync();
                var data = JsonConvert.DeserializeObject<Dictionary<string, object>>(JsonConvert.DeserializeObject(bodyText).ToString());
                var command = Commands.CommandFactory.GetCommand(data);
                command.Execute();
                if (command.Result != null)
                {
                    return JsonConvert.SerializeObject(command.Result);
                }
                else
                {
                    return string.Empty;
                }
            }
            catch (Exception ex)
            {
                //ErrorHelper.WriteErrorToEventLog(ex.Message);
                 ErrorHelper.SendExcepToDB(ex, "ProcessCommand", subscriptionId);
                throw ex;
            }
        }

    }


}
