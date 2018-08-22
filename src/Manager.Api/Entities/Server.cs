namespace RDSManagerAPI.Entities
{
    using System.Runtime.Serialization;

    /// <summary>
    /// This is a data contract class between extensions and resource provider
    /// </summary>
   
    public class Server
    {
        [DataMember]
        public string Name { get; set; }

        [DataMember]
        public string Status { get; set; }

        [DataMember]
        public int Sessions { get; set; }

        [DataMember]
        public string Type { get; set; }
    }
}
