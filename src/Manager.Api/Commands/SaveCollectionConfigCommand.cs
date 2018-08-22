namespace RDSManagerAPI.Commands
{
    using System;
    using System.Collections.Generic;
    using System.Globalization;
    using RDSManagerAPI.Entities;
    using System.Collections.Concurrent;
    using Controllers;
    using System.Configuration;
    using System.Net;
    public class SaveCollectionConfigCommand : ICommand
    {
        string deploymentInfo;
        string collectionName;
        int operation;
        CollectionConfig config = new CollectionConfig();
        Dictionary<string, object> data;
        string correlationId;
        static ConcurrentDictionary<string, Tuple<string, DateTime?, bool>> openCommands =
            new ConcurrentDictionary<string, Tuple<string, DateTime?, bool>>();

        public object Result { get; set; }
        public SaveCollectionConfigCommand(int option)
        {
            this.operation = option;
        }
        public void Init(Dictionary<string, object> data)
        {
            this.data = data;
            this.correlationId = (data.ContainsKey("CorrelationId") ? data["CorrelationId"] as string : null);
            this.deploymentInfo = data["ConnectionBroker"] as string;
            this.collectionName = data["CollectionName"] as string;
            
            config.PeakStartTime = TimeSpan.ParseExact(data["PeakStartTime"] as string, @"h\:m", CultureInfo.CurrentCulture).ToString();
            config.PeakEndTime = TimeSpan.ParseExact(data["PeakEndTime"] as string, @"h\:m", CultureInfo.CurrentCulture).ToString();
            config.LogoffWaitTime = byte.Parse(data["LogoffWaitTime"] as string);
            config.SessionThreshholdPerCPU = byte.Parse(data["SessionThreshholdPerCPU"] as string);
            config.MinServerCount = Int16.Parse(data["MinServerCount"] as string);
            
            var loadBalancingConcurrentSessionsPerServer =
                int.Parse(data["LoadBalancingConcurrentSessionsPerServer"] as string);
            if(loadBalancingConcurrentSessionsPerServer == 0)
            {
                data["LoadBalancingConcurrentSessionsPerServer"] = "999999";
            }

            //-ClientDeviceRedirectionOptions
            config.AudioVideoPlayback = (bool)data["AudioVideoPlayback"];
            config.AudioRecording = (bool)data["AudioRecording"];
            config.SmartCard = (bool)data["SmartCard"];
            config.PlugAndPlay = (bool)data["PlugAndPlay"];
            config.Drive = (bool)data["Drive"];
            config.Clipboard = (bool)data["Clipboard"];
            config.ClientDeviceRedirectionOptions = getClientDeviceRedirectionOptions();
            data.Add("ClientDeviceRedirectionOptions", config.ClientDeviceRedirectionOptions);
            config.ClientPrinterRedirected = (bool)data["ClientPrinterRedirected"]; //-ClientPrinterRedirected
            config.ClientPrinterAsDefault = (bool)data["ClientPrinterAsDefault"]; //-ClientPrinterAsDefault
            config.RDEasyPrintDriverEnabled = (bool)data["RDEasyPrintDriverEnabled"];   //-RDEasyPrintDriverEnabled

            config.MaxRedirectedMonitors = int.Parse(data["MaxRedirectedMonitors"].ToString()); //-MaxRedirectedMonitors 
        }

        public string Execute()
        {
           try
            {
                string psl_Script = "";
                string pslsetClientRedirectionSettings = ConfigurationManager.AppSettings["psl_layer"].ToString() + "/setClientRedirectionSettings.ps1";
               
                using (WebClient client = new WebClient())
                {
                    psl_Script = client.DownloadString(pslsetClientRedirectionSettings);
                }
               var s = string.Empty;
                if (this.correlationId == null)
                {
                    this.correlationId = Guid.NewGuid().ToString();

                    s = "{\"status\": \"executing\",\"correlationId\":\""
                           + this.correlationId + "\"}";
                    this.Result = s;

                    if (openCommands.TryAdd(correlationId,
                        new Tuple<string, DateTime?, bool>(null, DateTime.UtcNow, false)))
                    {

                        //var isBurstConfigOnlyToSave = (bool)data["SaveOnlyBurstSettings"];

                        //if (isBurstConfigOnlyToSave)
                        //{
                        //    saveConfigToDb();

                        //    var val = new Tuple<string, DateTime?, bool>(s, DateTime.UtcNow, true);
                        //    openCommands.AddOrUpdate(this.correlationId, val, (x, y) =>
                        //    {
                        //        return val;
                        //    });

                        //    this.PurgeCache();
                        //}
                        //else
                        //{
                        if (operation == 1)
                        {
                            string pslsavecollectionconfig = ConfigurationManager.AppSettings["psl_layer"].ToString() + "/savecollectionconfig.ps1";
                           
                            using (WebClient client = new WebClient())
                            {
                                psl_Script = client.DownloadString(pslsavecollectionconfig);
                            }
                            var command = new ScriptCommand(psl_Script,
                              new[] { "ConnectionBroker", "CollectionName", "ActiveSessionLmit",
                            "DisconnectFromSession", "EndADisconnectedSession", "EndSession",
                            "IdleSessionLimit", "LoadBalancingConcurrentSessionsPerServer"
                              });

                            command.Init(data);

                            s += AdminCommandsController.ProccessCommandSub(command);

                        }
                        else if (operation == 2)
                        {
                            saveConfigToDb();
                        }
                        else if (operation == 3)
                        {
                            // Saving Client Redirection settings
                            var command = new ScriptCommand(psl_Script,
                                        new[] { "ConnectionBroker", "CollectionName", "ClientDeviceRedirectionOptions", "ClientPrinterRedirected",
                                        "ClientPrinterAsDefault", "RDEasyPrintDriverEnabled", "MaxRedirectedMonitors"});

                            command.Init(data);
                            s += AdminCommandsController.ProccessCommandSub(command);

                            var val = new Tuple<string, DateTime?, bool>(s, DateTime.UtcNow, true);
                            openCommands.AddOrUpdate(this.correlationId, val, (x, y) =>
                            {
                                return val;
                            });

                            this.PurgeCache();
                        }

                        //Commented Threading part to get the results synchronously 
                        // System.Threading.ThreadPool.QueueUserWorkItem((state) =>
                        //  {




                        // });
                        //}
                    }
                    else
                    {
                        s = "{\"status\": \"executing\",\"correlationId\":\""
                            + this.correlationId + "\"}";
                        this.Result = s;
                    }
                }
                else
                {

                    Tuple<string, DateTime?, bool> current = null;
                    if (!openCommands.TryGetValue(this.correlationId, out current))
                    {
                        s = "{\"status\": \"correlation id not found\"}";
                    }
                    else if (current.Item3)
                    {
                        openCommands.TryRemove(this.correlationId, out current);
                        s = current.Item1;
                    }
                    else
                    {
                        s = @"{""status"": ""executing"",""correlationId"": """ + this.correlationId + @"""}";
                    }
                }

                this.Result = s;
                return s;
            }
            catch (Exception ex)
            {
                ErrorHelper.WriteErrorToEventLog(ex.Message);
                throw ex;
            }
        }

        private void PurgeCache()
        {
            var delIfBefore = DateTime.UtcNow.Subtract(new TimeSpan(2));
            var keys = new string[openCommands.Keys.Count];
            openCommands.Keys.CopyTo(keys, 0);
            for (int i = 0; i < keys.Length; i++)
            {
                Tuple<string, DateTime?, bool> delCurrent = null;
                if (openCommands.TryGetValue(keys[i], out delCurrent))
                {
                    if (delCurrent.Item2 == null ||
                        delIfBefore > delCurrent.Item2)
                    {
                        openCommands.TryRemove(keys[i], out delCurrent);
                    }
                }
            }
        }

        public string Execute1()
        {
            try
            {
                string pslsetClientRedirectionSettings = ConfigurationManager.AppSettings["psl_layer"].ToString() + "/setClientRedirectionSettings.ps1";
                string psl_Script = "";
                using (WebClient client = new WebClient())
                {
                    psl_Script = client.DownloadString(pslsetClientRedirectionSettings);
                }
                var isBurstConfigOnlyToSave = (bool)data["SaveOnlyBurstSettings"];

                if (isBurstConfigOnlyToSave)
                {
                    saveConfigToDb();
                }
                else
                {
                    string pslsavecollectionconfig = ConfigurationManager.AppSettings["psl_layer"].ToString() + "/savecollectionconfig.ps1";
                  
                    using (WebClient client = new WebClient())
                    {
                        psl_Script = client.DownloadString(pslsavecollectionconfig);
                    }
                    var command = new ScriptCommand(psl_Script,
                            new[] { "ConnectionBroker", "CollectionName", "ActiveSessionLmit",
                            "DisconnectFromSession", "EndADisconnectedSession", "EndSession",
                            "IdleSessionLimit", "LoadBalancingConcurrentSessionsPerServer"
                            });

                    command.Init(data);
                    command.Execute();

                    saveConfigToDb();

                    // Saving Client Redirection settings
                    command = new ScriptCommand(psl_Script,
                        new[] { "ConnectionBroker", "CollectionName", "ClientDeviceRedirectionOptions", "ClientPrinterRedirected",
                                "ClientPrinterAsDefault", "RDEasyPrintDriverEnabled", "MaxRedirectedMonitors"});

                    command.Init(data);
                    command.Execute();
                }
                this.Result = config;
                return string.Empty;
            }
            catch (Exception ex)
            {
                ErrorHelper.WriteErrorToEventLog(ex.Message);
                //ErrorHelper.SendExcepToDB(ex, " Execute1",);
                throw ex;
            }
        }

        /// <summary>
        /// Save the configuration settings to CollectionBurstSettings table in DB
        /// </summary>
        private void saveConfigToDb()
        {
            // Try update first. If no row got updated, then insert (if this is frequently called, consider adding a procedure call in DB)
            string stm = @"UPDATE CollectionBurstSettings SET StartTime=@StartTime, EndTime=@EndTime, LogOffWaitTime=@LogOffWaitTime, "
                        + "SessionThresholdPerCPU=@SessionThresholdPerCPU, MinServerCount=@MinServerCount "
                        + "WHERE DeploymentFQDN=@DeploymentFQDN AND CollectionName=@Name";
            var result = ServicesManager.Instance.ExecuteCommand(stm, config.PeakStartTime, config.PeakEndTime, config.LogoffWaitTime,
                config.SessionThreshholdPerCPU, config.MinServerCount, deploymentInfo, collectionName);
            if (result == 0)
            {
                stm = "INSERT INTO CollectionBurstSettings(DeploymentFQDN, CollectionName, IsActive, StartTime, EndTime, "
                         + "LogOffWaitTime, SessionThresholdPerCPU, MinServerCount) "
                         + "VALUES(@fqdn, @collectionName, 0, @PeakStartTime,@PeakStopTime,@LogoffTime,@SessionThresholdPerCPU,@MinServerCount)";
                ServicesManager.Instance.ExecuteCommand(stm, deploymentInfo, collectionName,
                        config.PeakStartTime, config.PeakEndTime, config.LogoffWaitTime, config.SessionThreshholdPerCPU, config.MinServerCount);
            }
        }

        private uint getClientDeviceRedirectionOptions()
        {
            RDClientDeviceRedirectionOptions option = RDClientDeviceRedirectionOptions.None;
            if (config.AudioVideoPlayback) option |= RDClientDeviceRedirectionOptions.AudioVideoPlayBack;
            if (config.AudioRecording) option |= RDClientDeviceRedirectionOptions.AudioRecording;
            if (config.SmartCard) option |= RDClientDeviceRedirectionOptions.SmartCard;
            if (config.PlugAndPlay) option |= RDClientDeviceRedirectionOptions.PlugAndPlayDevice;
            if (config.Drive) option |= RDClientDeviceRedirectionOptions.Drive;
            if (config.Clipboard) option |= RDClientDeviceRedirectionOptions.Clipboard;
            return (uint)option;
        }
    }
}