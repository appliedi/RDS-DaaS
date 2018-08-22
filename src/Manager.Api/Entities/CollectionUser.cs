namespace RDSManagerAPI.Entities
{
    using System.Runtime.Serialization;

    /// <summary>
    /// This is a data contract class between extensions and resource provider
    /// </summary>
   
    public class CollectionUser
    {
        [DataMember]
        public string Name { get; set; }

        [DataMember]
        public string UserType { get; set; }

        [DataMember]
        public int Count { get; set; }

        [DataMember]
        public string ConnectionBroker { get; set; }

        [DataMember]
        public bool IsValid { get; set; }

        [DataMember]
        public string Message { get; set; }

    }
    public class CollectionUserBrokerOnly
    {
        [DataMember]
        public string ConnectionBroker { get; set; }

    }
}
