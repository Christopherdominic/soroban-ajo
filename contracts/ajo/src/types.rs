use soroban_sdk::{contracttype, Address, String, Vec};

/// Metadata size limits (in characters)
pub const MAX_NAME_LENGTH: u32 = 64;
pub const MAX_DESCRIPTION_LENGTH: u32 = 256;
pub const MAX_RULES_LENGTH: u32 = 512;

/// Metadata for a group with size constraints
/// 
/// Size limits are enforced to ensure efficient storage and prevent abuse:
/// - name: max 64 characters
/// - description: max 256 characters  
/// - rules: max 512 characters
#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct GroupMetadata {
    /// Human-readable name for the group
    pub name: String,
    
    /// Detailed description of the group's purpose
    pub description: String,
    
    /// Rules and guidelines for group members
    pub rules: String,
}

/// Represents an Ajo group configuration and state
#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct Group {
    /// Unique group identifier
    pub id: u64,
    
    /// Creator of the group
    pub creator: Address,
    
    /// Fixed contribution amount per member per cycle (in stroops for XLM)
    pub contribution_amount: i128,
    
    /// Duration of each cycle in seconds
    pub cycle_duration: u64,
    
    /// Maximum number of members allowed
    pub max_members: u32,
    
    /// Current list of member addresses
    pub members: Vec<Address>,
    
    /// Current cycle number (starts at 1)
    pub current_cycle: u32,
    
    /// Index of member who receives payout next (0-based)
    pub payout_index: u32,
    
    /// Timestamp when the group was created
    pub created_at: u64,
    
    /// Timestamp when the current cycle started
    pub cycle_start_time: u64,
    
    /// Whether the group has completed all cycles
    pub is_complete: bool,
}

/// Contribution status for a specific member in a specific cycle
#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct ContributionRecord {
    pub member: Address,
    pub group_id: u64,
    pub cycle: u32,
    pub has_paid: bool,
    pub timestamp: u64,
}

/// Payout record for tracking who has received their payout
#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct PayoutRecord {
    pub member: Address,
    pub group_id: u64,
    pub cycle: u32,
    pub amount: i128,
    pub timestamp: u64,
}

/// Comprehensive group status returned by get_group_status
/// Provides all key information in a single call to reduce client complexity
#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct GroupStatus {
    /// The group ID
    pub group_id: u64,
    
    /// Current cycle number
    pub current_cycle: u32,
    
    /// Address of the next recipient (check has_next_recipient first)
    pub next_recipient: Address,
    
    /// Whether there is a next recipient (false if group is complete)
    pub has_next_recipient: bool,
    
    /// Number of members who have contributed this cycle
    pub contributions_received: u32,
    
    /// Total number of members in the group
    pub total_members: u32,
    
    /// List of members who haven't contributed yet this cycle
    pub pending_contributors: Vec<Address>,
    
    /// Whether the group has completed all cycles
    pub is_complete: bool,
    
    /// Timestamp when current cycle started
    pub cycle_start_time: u64,
    
    /// Timestamp when current cycle ends
    pub cycle_end_time: u64,
    
    /// Current timestamp for reference
    pub current_time: u64,
    
    /// Whether the cycle window is still active
    pub is_cycle_active: bool,
}
