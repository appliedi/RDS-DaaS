namespace RDSManagerAPI.Entities
{
    using System.Runtime.Serialization;

    /// <summary>
    /// This is a data contract class between extensions and resource provider
    /// </summary>
   
    public class Collection
    {
        [DataMember]
        public string Name { get; set; }

        [DataMember]
        public string NavName { get; set; }

        [DataMember]
        public string Description { get; set; }

        [DataMember]
        public int Size { get; set; }

        [DataMember]
        public string Status { get; set; }

        [DataMember]
        public string ResourceType { get; set; }
        [DataMember]
        public bool Burst { get; set; }

        [DataMember]
        public string Type { get { return "collectionType"; } }
    }
}
