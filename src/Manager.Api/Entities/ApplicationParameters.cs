namespace RDSManagerAPI.Entities
{
    using System.Runtime.Serialization;

    /// <summary>
    /// This is a data contract class between extensions and resource provider
    /// </summary>
   
    public class ApplicationParameters
    {
        public string ApplicationPath { get; set; }

        public string CommandLineParams { get; set; }
    }
}
