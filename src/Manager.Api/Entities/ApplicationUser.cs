namespace RDSManagerAPI.Entities
{
    using System.Runtime.Serialization;

    /// <summary>
    /// This is a data contract class between extensions and resource provider
    /// </summary>
   
    public class ApplicationUser
    {
        public string Name { get; set; }

        public string Type { get; set; }
    }
}
