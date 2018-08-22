// ---------------------------------------------------------
// Copyright (c) Microsoft Corporation. All rights reserved.
// ---------------------------------------------------------

namespace RDSManagerAPI.Entities
{
    using System.Collections.Generic;
    using System.Runtime.Serialization;

    /// <summary>
    /// This is a data contract class between extensions and resource provider
    /// </summary>

    public class Subscription : IExtensibleDataObject
    {
        /// <summary>
        /// Gets or sets the subscription id.
        /// </summary>
        [DataMember(Order = 1)]
        public string SubscriptionId { get; set; }

        /// <summary>
        /// Gets or sets the subscription admin id.
        /// </summary>
        [DataMember(Order = 2)]
        public string AdminId { get; set; }

        /// <summary>
        /// Gets or sets the name of the subscription.
        /// </summary>
        [DataMember(Order = 3)]
        public string SubscriptionName { get; set; }

        /// <summary>
        /// Gets the co admin ids.
        /// </summary>
        [DataMember(Order = 4)]
        public string CoAdminIds { get; set; }

        /// <summary>
        /// Gets or sets the state.
        /// </summary>
        [DataMember(Order = 5)]
        public SubscriptionState State { get; set; }

        /// <summary>
        /// Gets or sets the state of the lifecycle (Only required if Resource Provider opt to implement async protocols).
        /// </summary>
        [DataMember(Order = 6)]
        public SubscriptionLifecycleState LifecycleState { get; set; }

        /// <summary>
        /// Gets or sets the last error message (Only required if Resource Provider opt to implement async protocols).
        /// </summary>
        [DataMember(Order = 7)]
        public string LastErrorMessage { get; set; }

        /// <summary>
        /// Gets or sets the quota settings.
        /// </summary>
        [DataMember(Order = 8)]
        public IList<ServiceQuotaSetting> QuotaSettings { get; set; }

        /// <summary>
        /// Gets or sets the extension data.
        /// </summary>
        public ExtensionDataObject ExtensionData { get; set; }
    }

    /// <summary>
    /// Represents a subscription lifecycle state.
    /// </summary>
   
    public enum SubscriptionLifecycleState
    {
        /// <summary>
        /// The subscription is provisioned.
        /// </summary>
        [EnumMember]
        Provisioned = 0,

        /// <summary>
        /// The subscription is being provisioned.
        /// </summary>
        [EnumMember]
        Provisioning,

        /// <summary>
        /// The subscription is being updated.
        /// </summary>
        [EnumMember]
        Updating,

        /// <summary>
        /// The subscription is being deleted.
        /// </summary>
        [EnumMember]
        Deleting,

        /// <summary>
        /// The subscription has been deleted.  This state is optional and it's semantically the same as subscription does not exist (404).
        /// This is for the case when a Resource Provider need to keep the subscription record around (e.g. for billing). 
        /// </summary>
        [EnumMember]
        Deleted,

        /// <summary>
        /// The subscription is out-of-sync due to an error from a previous operation.
        /// </summary>
        [EnumMember]
        OutOfSync
    }

    /// <summary>
    /// Represents a subscription state.
    /// </summary>
   
    public enum SubscriptionState
    {
        /// <summary>
        /// The subscription is active
        /// </summary>
        [EnumMember]
        Active = 0,

        /// <summary>
        /// The subscription is suspended
        /// </summary>
        [EnumMember]
        Suspended = 1,

        /// <summary>
        /// The subscription is being deleted or partially deleted
        /// Only deletion operation will be allowed for subscriptions in this state
        /// </summary>
        [EnumMember]
        DeletePending = 2
    }
}
