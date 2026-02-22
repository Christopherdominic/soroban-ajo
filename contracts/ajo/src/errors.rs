use soroban_sdk::contracterror;

/// Error codes for the Ajo contract.
#[contracterror]
#[derive(Copy, Clone, Debug, Eq, PartialEq, PartialOrd, Ord)]
#[repr(u32)]
pub enum AjoError {
    /// Contract has already been initialized
    AlreadyInitialized = 1,
    
    /// The specified group wasn't found in storage.
    GroupNotFound = 2,
    
    /// Can't join because the group is already at its member limit.
    MaxMembersExceeded = 3,
    
    /// This account is already part of the group.
    AlreadyMember = 4,
    
    /// Address isn't a member of the group.
    NotMember = 5,
    
    /// You've already made your contribution for this cycle.
    AlreadyContributed = 6,
    
    /// We can't move forward until everyone has contributed.
    IncompleteContributions = 7,
    
    /// Member has already been paid out.
    AlreadyReceivedPayout = 8,
    
    /// All cycles for this group are finished.
    GroupComplete = 9,
    
    /// Contribution amount can't be zero.
    ContributionAmountZero = 10,
    
    /// Cycle duration must be greater than zero.
    CycleDurationZero = 11,
    
    /// Groups need at least 2 members to work.
    MaxMembersBelowMinimum = 12,
    
    /// Max members exceeds reasonable limit.
    MaxMembersAboveLimit = 13,
    
    /// Member doesn't have enough balance.
    InsufficientBalance = 14,
    
    /// The token transfer didn't go through.
    TransferFailed = 15,
    
    /// This group has no members initialized.
    NoMembers = 16,
    
    /// Only the creator or authorized members can do this.
    Unauthorized = 17,
    
    /// Contribution outside active cycle window
    OutsideCycleWindow = 18,
    
    /// Negative amounts aren't allowed for contributions.
    ContributionAmountNegative = 19,
    
    /// Metadata name exceeds maximum length
    MetadataNameTooLong = 20,
    
    /// Metadata description exceeds maximum length
    MetadataDescriptionTooLong = 21,
    
    /// Metadata rules exceed maximum length
    MetadataRulesTooLong = 22,
}
