namespace RDSManagerAPI.Entities
{
    using System.Runtime.Serialization;

    /// <summary>
    /// This is a data contract class between extensions and resource provider
    /// </summary>
   
    public class CollectionConfig
    {
        [DataMember]
        public int ActiveSessionLmit { get; set; }

        [DataMember]
        public int DisconnectFromSession { get; set; }

        [DataMember]
        public bool EndADisconnectedSession { get; set; }

        [DataMember]
        public bool EndSession { get; set; }

        [DataMember]
        public int IdleSessionLimit { get; set; }

        [DataMember]
        public int LoadBalancingConcurrentSessionsPerServer { get; set; }

        [DataMember]
        public string PeakStartTime { get; set; }

        [DataMember]
        public string PeakEndTime { get; set; }

        [DataMember]
        public byte LogoffWaitTime { get; set; }

        [DataMember]
        public byte SessionThreshholdPerCPU { get; set; }

        [DataMember]
        public short MinServerCount { get; set; }

        #region General Redirection

        [DataMember]
        public bool AudioVideoPlayback { get; set; }

        [DataMember]
        public bool AudioRecording { get; set; }

        [DataMember]
        public bool SmartCard { get; set; }

        [DataMember]
        public bool PlugAndPlay { get; set; }

        [DataMember]
        public bool Drive { get; set; }

        [DataMember]
        public bool Clipboard { get; set; }

        [DataMember]
        public uint ClientDeviceRedirectionOptions { get; set; }

        #endregion General Redirection

        #region Printer
        [DataMember]
        public bool ClientPrinterRedirected { get; set; }

        [DataMember]
        public bool ClientPrinterAsDefault { get; set; }

        [DataMember]
        public bool RDEasyPrintDriverEnabled { get; set; }
        #endregion Printer

        #region Monitor
        [DataMember]
        public int MaxRedirectedMonitors { get; set; }
        #endregion Monitor
    }
}
