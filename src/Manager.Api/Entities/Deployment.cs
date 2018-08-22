namespace RDSManagerAPI.Entities
{
    using System.Runtime.Serialization;

    /// <summary>
    /// This is a data contract class between extensions and resource provider
    /// </summary>
   
    public class Deployment
    {
        [DataMember]
        public string Id { get; set; }

        [DataMember]
        public string defaultNavigationId { get; set; }

        [DataMember]
        public string FriendlyName { get; set; }

        [DataMember]
        public string name { get; set; }    //for all-items view

        [DataMember]
        public string displayName { get; set; } //for all-items view

        [DataMember]
        public string Status { get; set; }

        [DataMember]
        public string RDSConnectionBroker { get; set; }

        [DataMember]
        public string Type { get { return "deploymentType"; } }
    }
}
