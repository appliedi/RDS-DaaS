namespace RDSManagerAPI.Controllers
{
    using System;
    using System.Collections.Generic;
    using System.Threading;
    using System.Threading.Tasks;
    using System.Web.Http;
    using Newtonsoft.Json;
    using Commands;
    using System.Reflection;

    public class AdminCommandsController : ApiController
    {
        public AdminCommandsController()
        {

        }

        [HttpPost]
        public async Task<string> ProcessCommand(string subscriptionId)
        {
            return await ProcessCommand();
        }

        [HttpPost]
        public async Task<string> ProcessCommand()
        {
            try
            {
                string bodyText = await this.Request.Content.ReadAsStringAsync();
                var data = JsonConvert.DeserializeObject<Dictionary<string, object>>(JsonConvert.DeserializeObject(bodyText).ToString());
                var command = CommandFactory.GetCommand(data);
                return ProccessCommandSub(command);
            }
            catch (Exception ex)
            {
                ErrorHelper.WriteErrorToEventLog(ex.Message);
                throw ex;
            }
        }

        internal static string ProccessCommandSub(ICommand command)
        {
            try
            {
                command.Execute();
                return (command.Result == null) ? string.Empty : JsonConvert.SerializeObject(command.Result);
            }
            catch (Exception ex)
            {
                ErrorHelper.WriteErrorToEventLog(ex.Message);
                throw ex;
            }
        }
    }
}
