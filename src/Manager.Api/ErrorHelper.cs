using RDSManagerAPI.Commands;
using System;

namespace RDSManagerAPI
{

    public static class ErrorHelper
    {
        private static string eventSource = "AzurePack.RDSManager.Api";
        private static int errorEventID = 255;

        public static void WriteErrorToEventLog(string message)
        {
            System.Diagnostics.EventLog eventLog = new System.Diagnostics.EventLog();
            if (!System.Diagnostics.EventLog.SourceExists(ErrorHelper.eventSource))
            {
                System.Diagnostics.EventLog.CreateEventSource(ErrorHelper.eventSource, "Application");
            }

            eventLog.Source = ErrorHelper.eventSource;
            eventLog.WriteEntry(message.Replace(" Check AzurePack.RDSManager.Api source events in Windows Application Event Logs on the WAP Admin API Server(s) for details.", string.Empty),
                                System.Diagnostics.EventLogEntryType.Error,
                                ErrorHelper.errorEventID);
            eventLog.Close();
        }

        public static void WriteInfoToEventLog(string message)
        {
            System.Diagnostics.EventLog eventLog = new System.Diagnostics.EventLog();
            if (!System.Diagnostics.EventLog.SourceExists(ErrorHelper.eventSource))
            {
                System.Diagnostics.EventLog.CreateEventSource(ErrorHelper.eventSource, "Application");
            }

            eventLog.Source = ErrorHelper.eventSource;
            eventLog.WriteEntry(message,
                                System.Diagnostics.EventLogEntryType.Information,
                                ErrorHelper.errorEventID);
            eventLog.Close();
        }

        public static void SendExcepToDB(Exception ex, string methodName, string deploymentName)
        {
            try
            {
                string stm = @"INSERT INTO ErrorLogs(Datetime, Methodname, ErrorMessage, DeploymentName) values(@Datetime,@Methodname,@ErrorMessage,@DeploymentName)";
                DBHelper.ExecuteCommand(stm, DateTime.Now, methodName,  ex.ToString(), deploymentName);
            }
            catch (Exception exe)
            {
                ErrorHelper.WriteErrorToEventLog(exe.Message);
                throw exe;
            }
        }
        public static void SendExcepToDB(string ex, string methodName, string deploymentName)
        {
            try
            {
                string stm = @"INSERT INTO ErrorLogs(Datetime, Methodname, ErrorMessage, DeploymentName) values(@Datetime,@Methodname,@ErrorMessage,@DeploymentName)";
                DBHelper.ExecuteCommand(stm, DateTime.Now, methodName, ex.ToString(), deploymentName);
            }
            catch (Exception exe)
            {
                ErrorHelper.WriteErrorToEventLog(exe.Message);
                throw exe;
            }
        }
    }
           
            
    }
