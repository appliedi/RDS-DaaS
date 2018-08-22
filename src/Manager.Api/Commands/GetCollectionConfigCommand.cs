namespace RDSManagerAPI.Commands
{
    using System;
    using System.Collections.Generic;
    using RDSManagerAPI.Entities;
    using System.Configuration;
    using System.Net;

    public class GetCollectionConfigCommand : ICommand
    {
        string deploymentInfo;
        string collectionName;
        int operation;
        Dictionary<string, object> data;
        const string Param1 = "ConnectionBroker";
        const string Param2 = "CollectionName";
        public GetCollectionConfigCommand(int option)
        {
            this.operation = option;
        }
        public void Init(Dictionary<string, object> data)
        {
            this.deploymentInfo = data[Param1] as string;
            this.collectionName = data[Param2] as string;
            this.data = data;
        }

        public object Result { get; set; }

        public string Execute()
        {
            CollectionConfig config = new CollectionConfig();
            config.PeakStartTime = "00:00";
            config.PeakEndTime = "00:00";
            config.LogoffWaitTime = 0;

            try
            {
                if (operation == 1)
                {
                    var count = 0;
                    string pslgetcollectionconfig = ConfigurationManager.AppSettings["psl_layer"].ToString() + "/getcollectionconfig.ps1";
                    string psl_Script = "";
                    using (WebClient client = new WebClient())
                    {
                        psl_Script = client.DownloadString(pslgetcollectionconfig);
                    }
                    var command = new ScriptCommand(psl_Script,
                            new[] { Param1, Param2 }, (psObject, scriptCommand) =>
                            {
                                if (count == 0)
                                {
                                    if (psObject != null)
                                    {
                                        config.ActiveSessionLmit = psObject.ActiveSessionLimitMin == null ? 0 : psObject.ActiveSessionLimitMin;
                                        config.DisconnectFromSession = psObject.DisconnectedSessionLimitMin == null ? 0 : psObject.DisconnectedSessionLimitMin;
                                        config.IdleSessionLimit = psObject.IdleSessionLimitMin == null ? 0 : psObject.IdleSessionLimitMin;
                                        config.EndADisconnectedSession = psObject.BrokenConnectionAction == null ? false : psObject.BrokenConnectionAction.ToString().Equals("Logoff", StringComparison.OrdinalIgnoreCase);
                                        config.EndSession = psObject.AutomaticReconnectionEnabled == null ? false : psObject.AutomaticReconnectionEnabled;
                                    }
                                }
                                else
                                {
                                    if (psObject != null)
                                    {
                                        config.LoadBalancingConcurrentSessionsPerServer = psObject.SessionLimit == null ? 0 : psObject.SessionLimit;
                                    }
                                }
                                count++;
                                scriptCommand.Result = config;
                            });

                    command.Init(data);
                    command.Execute();
                    if (config.LoadBalancingConcurrentSessionsPerServer == 999999)
                    {
                        config.LoadBalancingConcurrentSessionsPerServer = 9999;
                    }
                }
                else if (operation == 2)
                {
                    ServicesManager.Instance.ExecuteQuery<CollectionConfig>("SELECT * FROM [CollectionBurstSettings] WHERE DeploymentFQDN = @FQDN AND CollectionName = @Name", (rdr, list) =>
                    {
                        config.PeakStartTime = TimeSpan.Parse(rdr["StartTime"].ToString()).ToString(@"hh\:mm") ?? "00:00";
                        config.PeakEndTime = TimeSpan.Parse(rdr["EndTime"].ToString()).ToString(@"hh\:mm") ?? "00:00";
                        config.LogoffWaitTime = byte.Parse(rdr["LogOffWaitTime"].ToString());
                        config.SessionThreshholdPerCPU = byte.Parse(rdr["SessionThresholdPerCPU"].ToString());
                        config.MinServerCount = Int16.Parse(rdr["MinServerCount"].ToString());
                    }, deploymentInfo, collectionName);
                }
                else if(operation==3)
                {
                    // Get the Client Redirection Settings via ScriptCommand/Powershell
                    config= GetRedirectSettings();
                }

                this.Result = config;

                return string.Empty;
            }
            catch (Exception ex)
            {
                ErrorHelper.WriteErrorToEventLog(ex.Message);
                throw ex;
            }
        }
        
        private CollectionConfig GetRedirectSettings()
        {
            string pslgetClientRediretionSettings = ConfigurationManager.AppSettings["psl_layer"].ToString() + "/getClientRediretionSettings.ps1";
            string psl_Script = "";
            using (WebClient client = new WebClient())
            {
                psl_Script = client.DownloadString(pslgetClientRediretionSettings);
            }
            var command = new ScriptCommand(psl_Script,
            new[] { Param1, Param2 }, (psObject, scriptCommand) =>
            {
                var config = new CollectionConfig();
                if (psObject != null)
                {
                    var options = (RDClientDeviceRedirectionOptions)psObject.ClientDeviceRedirectionOptions;
                    config = new CollectionConfig
                    {
                        AudioVideoPlayback = (options & RDClientDeviceRedirectionOptions.AudioVideoPlayBack) != 0,
                        AudioRecording = (options & RDClientDeviceRedirectionOptions.AudioRecording) != 0,
                        PlugAndPlay = (options & RDClientDeviceRedirectionOptions.PlugAndPlayDevice) != 0,
                        SmartCard = (options & RDClientDeviceRedirectionOptions.SmartCard) != 0,
                        Clipboard = (options & RDClientDeviceRedirectionOptions.Clipboard) != 0,
                        Drive = (options & RDClientDeviceRedirectionOptions.Drive) != 0,
                        ClientPrinterRedirected = psObject.ClientPrinterRedirected > 0,
                        ClientPrinterAsDefault = psObject.ClientPrinterAsDefault > 0,
                        RDEasyPrintDriverEnabled = psObject.RDEasyPrintDriverEnabled > 0,
                        MaxRedirectedMonitors = psObject.MaxRedirectedMonitors
                    };
                }
                scriptCommand.Result = config;
            });

            command.Init(this.data);
            command.Execute();
            CollectionConfig result = (CollectionConfig)command.Result;
            return result;
        }
    }
}