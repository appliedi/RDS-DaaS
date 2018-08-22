namespace RDSManagerAPI.Entities
{
    using System.Runtime.Serialization;

    /// <summary>
    /// This is a data contract class between extensions and resource provider
    /// </summary>
   
    public class Session
    {
        [DataMember]
        public string UserName { get; set; }

        [DataMember]
        public string SessionState { get; set; }

        [DataMember]
        public string LogonTime { get; set; }

        [DataMember]
        public string HostServer { get; set; }

        [DataMember]
        public int IdleTime { get; set; }

        [DataMember]
        public uint? UnifiedSessionID { get; set; }
    }
}