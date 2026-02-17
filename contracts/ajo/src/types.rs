use soroban_sdk::{contracttype, Address, Vec};

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

/// Comprehensive status of a group including current state and pending actions
#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct GroupStatus {
    /// The group ID
    pub group_id: u64,
    
    /// Current cycle number
    pub current_cycle: u32,
    
    /// Address of the next payout recipient
    pub next_recipient: Address,
    
    /// Number of members who have contributed in current cycle
    pub contributions_count: u32,
    
    /// Total number of members in the group
    pub total_members: u32,
    
    /// Whether all members have contributed in current cycle
    pub cycle_complete: bool,
    
    /// Whether the group has completed all cycles
    pub is_complete: bool,
    
    /// Timestamp when current cycle started
    pub cycle_start_time: u64,
}
