// ---------------------------------------------------------
// Copyright (c) Microsoft Corporation. All rights reserved.
// ---------------------------------------------------------

namespace RDSManagerAPI.Entities
{
    using System.Runtime.Serialization;

    /// <summary>
    /// AdminSettings define data contract of RDS Manager resource provider endpoint registration information
    /// </summary>
   
    public class AdminSettings
    {
        /// <summary>
        /// Address of RDSManager resource provider
        /// </summary>
        [DataMember(Order = 0)]
        public string EndpointAddress { get; set; }

        /// <summary>
        /// Username used by Admin API to connect with RDSManager Resource Provider
        /// </summary>
        [DataMember(Order = 1)]
        public string Username { get; set; }

        /// <summary>
        /// Password used by Admin API to connect with RDSManager Resource Provider
        /// </summary>
        [DataMember(Order = 2)]
        public string Password { get; set; }
    }
}
