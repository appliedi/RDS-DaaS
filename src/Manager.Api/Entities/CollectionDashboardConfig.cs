namespace RDSManagerAPI.Entities
{
    using System.Runtime.Serialization;
    /// <summary>
    /// A data type to store the information to be shown on the Collection Dashboard on Wap Admin site
    /// </summary>
   
    public class CollectionDashboardConfig
    {
        [DataMember]
        public string ConnectionBroker { get; set; }

        [DataMember]
        public string CollectionName { get; set; }

        #region Burst status
        [DataMember]
        public bool BurstActive { get; set; }

        #endregion Burst status

        #region User Profile

        [DataMember]
        public bool EnableUserProfileDisk { get; set; }

        [DataMember]
        public string DiskPath { get; set; }

        [DataMember]
        public int MaxUserProfileDiskSizeGB { get; set; }

        #endregion User Profile
    }

}
