use soroban_sdk::{symbol_short, Address, Env, String, Symbol, Vec};

use crate::types::{Group, GroupMetadata};

/// Storage keys for the Ajo contract
#[allow(dead_code)]
pub enum StorageKey {
    /// Counter for group IDs
    GroupCounter,
    
    /// Group data: Group(group_id) -> Group
    Group(u64),
    
    /// Contribution record: Contribution(group_id, cycle, member) -> bool
    Contribution(u64, u32, Address),
    
    /// Payout record: Payout(group_id, member) -> bool
    PayoutReceived(u64, Address),
}

impl StorageKey {
    /// Convert storage key to Symbol for use with Soroban storage
    ///
    /// # Arguments
    /// * `_env` - The environment (unused but kept for future use)
    ///
    /// # Returns
    /// Symbol representation of the storage key
    #[allow(dead_code)]
    pub fn to_symbol(&self, _env: &Env) -> Symbol {
        match self {
            StorageKey::GroupCounter => symbol_short!("GCOUNTER"),
            StorageKey::Group(_id) => {
                // For complex keys, we use a tuple-like approach
                symbol_short!("GROUP")
            }
            StorageKey::Contribution(_, _, _) => symbol_short!("CONTRIB"),
            StorageKey::PayoutReceived(_, _) => symbol_short!("PAYOUT"),
        }
    }
}

/// Get the next group ID and increment the counter
///
/// # Arguments
/// * `env` - The environment
///
/// # Returns
/// The next available group ID
pub fn get_next_group_id(env: &Env) -> u64 {
    let key = symbol_short!("GCOUNTER");
    let current: u64 = env.storage().instance().get(&key).unwrap_or(0);
    let next = current + 1;
    env.storage().instance().set(&key, &next);
    next
}

/// Store a group in persistent storage
///
/// # Arguments
/// * `env` - The environment
/// * `group_id` - The unique group identifier
/// * `group` - The group data to store
pub fn store_group(env: &Env, group_id: u64, group: &Group) {
    let key = (symbol_short!("GROUP"), group_id);
    env.storage().persistent().set(&key, group);
}

/// Get a group from storage
///
/// # Arguments
/// * `env` - The environment
/// * `group_id` - The unique group identifier
///
/// # Returns
/// The group data if it exists, None otherwise
pub fn get_group(env: &Env, group_id: u64) -> Option<Group> {
    let key = (symbol_short!("GROUP"), group_id);
    env.storage().persistent().get(&key)
}

/// Store a contribution record
///
/// # Arguments
/// * `env` - The environment
/// * `group_id` - The group identifier
/// * `cycle` - The cycle number
/// * `member` - The member address
/// * `paid` - Whether the contribution was made
pub fn store_contribution(env: &Env, group_id: u64, cycle: u32, member: &Address, paid: bool) {
    let key = (symbol_short!("CONTRIB"), group_id, cycle, member);
    env.storage().persistent().set(&key, &paid);
}

/// Check if a member has contributed for a cycle
///
/// # Arguments
/// * `env` - The environment
/// * `group_id` - The group identifier
/// * `cycle` - The cycle number
/// * `member` - The member address
///
/// # Returns
/// True if the member has contributed, false otherwise
pub fn has_contributed(env: &Env, group_id: u64, cycle: u32, member: &Address) -> bool {
    let key = (symbol_short!("CONTRIB"), group_id, cycle, member);
    env.storage().persistent().get(&key).unwrap_or(false)
}

/// Mark a member as having received their payout
///
/// # Arguments
/// * `env` - The environment
/// * `group_id` - The group identifier
/// * `member` - The member address
pub fn mark_payout_received(env: &Env, group_id: u64, member: &Address) {
    let key = (symbol_short!("PAYOUT"), group_id, member);
    env.storage().persistent().set(&key, &true);
}

/// Check if a member has received their payout
///
/// # Arguments
/// * `env` - The environment
/// * `group_id` - The group identifier
/// * `member` - The member address
///
/// # Returns
/// True if the member has received their payout, false otherwise
#[allow(dead_code)]
pub fn has_received_payout(env: &Env, group_id: u64, member: &Address) -> bool {
    let key = (symbol_short!("PAYOUT"), group_id, member);
    env.storage().persistent().get(&key).unwrap_or(false)
}

/// Get contribution status for all members in a cycle
///
/// # Arguments
/// * `env` - The environment
/// * `group_id` - The group identifier
/// * `cycle` - The cycle number
/// * `members` - The list of member addresses
///
/// # Returns
/// Vector of tuples containing (Address, bool) for each member's contribution status
pub fn get_cycle_contributions(
    env: &Env,
    group_id: u64,
    cycle: u32,
    members: &Vec<Address>,
) -> Vec<(Address, bool)> {
    let mut results = Vec::new(env);
    
    for member in members.iter() {
        let paid = has_contributed(env, group_id, cycle, &member);
        results.push_back((member, paid));
    }
    
    results
}

/// Store metadata for a group
///
/// # Arguments
/// * `env` - The environment
/// * `group_id` - The group identifier
/// * `metadata` - The metadata to store
pub fn store_metadata(env: &Env, group_id: u64, metadata: &GroupMetadata) {
    let key = (symbol_short!("META"), group_id);
    env.storage().persistent().set(&key, metadata);
}

/// Get metadata for a group
///
/// # Arguments
/// * `env` - The environment
/// * `group_id` - The group identifier
///
/// # Returns
/// The group metadata if it exists, None otherwise
pub fn get_metadata(env: &Env, group_id: u64) -> Option<GroupMetadata> {
    let key = (symbol_short!("META"), group_id);
    env.storage().persistent().get(&key)
}
