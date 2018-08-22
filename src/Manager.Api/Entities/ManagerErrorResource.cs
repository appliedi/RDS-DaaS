// ---------------------------------------------------------
// Copyright (c) Microsoft Corporation. All rights reserved.
// ---------------------------------------------------------

namespace RDSManagerAPI.Entities
{
    using System.Runtime.Serialization;

    /// <summary>
    /// Error Resource Contract
    /// </summary>
    
    public sealed class ManagerErrorResource
    {
        /// <summary>
        /// Gets or sets the error code.
        /// </summary>
        [DataMember]
        public string Code { get; set; }

        /// <summary>
        /// Gets or sets the error message.
        /// </summary>
        [DataMember]
        public string Message { get; set; }

        /// <summary>
        /// Gets or sets the error state.
        /// </summary>
        [DataMember]
        public string State { get; set; }

        /// <summary>
        /// Gets or sets the error severity.
        /// </summary>
        [DataMember]
        public string Severity { get; set; }
    }
}
