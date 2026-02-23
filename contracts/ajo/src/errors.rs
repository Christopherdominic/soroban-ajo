use soroban_sdk::contracterror;

/// Error codes for the Ajo contract.
#[contracterror]
#[derive(Copy, Clone, Debug, Eq, PartialEq, PartialOrd, Ord)]
#[repr(u32)]
pub enum AjoError {
    /// The specified group wasn't found in storage.
    GroupNotFound = 1,

    /// Can't join because the group is already at its member limit.
    MaxMembersExceeded = 2,

    /// This account is already part of the group.
    AlreadyMember = 3,

    /// Address isn't a member of the group.
    NotMember = 4,

    /// You've already made your contribution for this cycle.
    AlreadyContributed = 5,

    /// We can't move forward until everyone has contributed.
    IncompleteContributions = 6,

    /// Member has already been paid out.
    AlreadyReceivedPayout = 7,

    /// All cycles for this group are finished.
    GroupComplete = 8,

    /// Contribution amount can't be zero.
    ContributionAmountZero = 9,

    /// Cycle duration must be greater than zero.
    CycleDurationZero = 10,

    /// Groups need at least 2 members to work.
    MaxMembersBelowMinimum = 11,

    /// Max members exceeds reasonable limit.
    MaxMembersAboveLimit = 18,

    /// Member doesn't have enough balance.
    InsufficientBalance = 12,

    /// The token transfer didn't go through.
    TransferFailed = 13,

    /// This group has no members initialized.
    NoMembers = 14,

    /// Only the creator or authorized members can do this.
    Unauthorized = 15,

    /// Contribution outside active cycle window
    OutsideCycleWindow = 16,

    /// Negative amounts aren't allowed for contributions.
    ContributionAmountNegative = 17,

    /// This group has been cancelled by its creator.
    GroupCancelled = 19,

    /// The contract has already been initialized.
    AlreadyInitialized = 20,
    
    /// The contract is currently paused and cannot execute this operation.
    ContractPaused = 21,
    
    /// Only the admin can pause the contract.
    UnauthorizedPause = 22,
    
    /// Only the admin can unpause the contract.
    UnauthorizedUnpause = 23,
}
