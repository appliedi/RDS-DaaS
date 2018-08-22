namespace RDSManagerAPI.Entities
{
    using System;
    using System.Runtime.Serialization;

    /// <summary>
    /// This is a data contract class between extensions and resource provider
    /// </summary>
   
    public class BurstSettings
    {
        public DateTime StartTime { get; set; }

        public DateTime EndTime { get; set; }

        public int LogOffWaitTime { get; set; }

        public int SessionThresholdPerCPU { get; set; }

        public int MinimumServerCount { get; set; }
    }
}
