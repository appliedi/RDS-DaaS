namespace RDSManagerAPI.Entities
{
    using System.Runtime.Serialization;

    /// <summary>
    /// This is a data contract class between extensions and resource provider
    /// </summary>
   
    public class Process
    {
        [DataMember]
        public string ProcessName { get; set; }

        [DataMember]
        public int ProcessId { get; set; }

        [DataMember]
        public string Type { get { return "processType"; } }
    }
}
