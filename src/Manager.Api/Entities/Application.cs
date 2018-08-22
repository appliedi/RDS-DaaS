namespace RDSManagerAPI.Entities
{
    using System.Runtime.Serialization;

    /// <summary>
    /// This is a data contract class between extensions and resource provider
    /// </summary>
   
    public class Application
    {
        [DataMember]
        public string Alias { get; set; }

        [DataMember]
        public string Name { get; set; }

        [DataMember]
        public string NavName { get; set; }

        [DataMember]
        public string Status { get; set; }

        [DataMember]
        public string Path { get; set; }

        [DataMember]
        public string Type { get; set; }

        [DataMember]
        public string FolderPath { get; set; }

        [DataMember]
        public string IconContents { get; set; }

        [DataMember]
        public string CommandLineParameters { get; set; }
    }
}
