use soroban_sdk::contracterror;

/// Error codes for the Ajo contract
#[contracterror]
#[derive(Copy, Clone, Debug, Eq, PartialEq, PartialOrd, Ord)]
#[repr(u32)]
pub enum AjoError {
    /// Group does not exist
    GroupNotFound = 1,
    
    /// Group has reached maximum members
    GroupFull = 2,
    
    /// Address is already a member of this group
    AlreadyMember = 3,
    
    /// Address is not a member of this group
    NotMember = 4,
    
    /// Member has already contributed for this cycle
    AlreadyContributed = 5,
    
    /// Not all members have contributed for this cycle
    IncompleteContributions = 6,
    
    /// Member has already received payout
    AlreadyReceivedPayout = 7,
    
    /// Group cycle is complete
    GroupComplete = 8,
    
    /// Invalid contribution amount
    InvalidAmount = 9,
    
    /// Invalid cycle duration
    InvalidCycleDuration = 10,
    
    /// Invalid maximum members count
    InvalidMaxMembers = 11,
    
    /// Insufficient balance for contribution
    InsufficientBalance = 12,
    
    /// Transfer failed
    TransferFailed = 13,
    
    /// Group has no members
    NoMembers = 14,
    
    /// Unauthorized operation
    Unauthorized = 15,
    
    /// Contribution made outside the active cycle window
    OutsideCycleWindow = 16,
    
    /// Emergency withdrawal not allowed
    WithdrawalNotAllowed = 17,
}
