use soroban_sdk::{symbol_short, Address, Env, Symbol, Vec};

/// Logical storage key categories used by the Ajo contract.
///
/// Soroban storage uses raw key values; this enum documents the naming
/// conventions and composite key structures used throughout the contract.
/// Each variant maps to a specific `symbol_short!` or tuple key at the
/// call site.
pub enum StorageKey {
    /// Singleton key for the contract administrator address.
    /// Stored in instance storage under `"ADMIN"`.
    Admin,

    /// Monotonically increasing counter used to assign unique group IDs.
    /// Stored in instance storage under `"GCOUNTER"`.
    GroupCounter,

    /// Full group state keyed by its numeric ID.
    /// Stored in persistent storage under `("GROUP", group_id)`.
    Group(u64),

    /// Per-member contribution flag for a specific group and cycle.
    /// Stored in persistent storage under `("CONTRIB", group_id, cycle, member)`.
    /// Value is `bool` — `true` means the member has contributed.
    Contribution(u64, u32, Address),

    /// Records whether a member has received their payout for a group.
    /// Stored in persistent storage under `("PAYOUT", group_id, member)`.
    /// Value is `bool` — `true` means the payout has been distributed.
    PayoutReceived(u64, Address),

    /// Optional metadata for a group (name, description, rules).
    /// Stored in persistent storage under `("METADATA", group_id)`.
    Metadata(u64),
}

impl StorageKey {
    /// Returns the short [`Symbol`] prefix associated with this key variant.
    ///
    /// Note: composite keys (e.g., [`StorageKey::Group`]) pair this symbol
    /// with additional fields in a tuple at the storage call site; this
    /// method returns only the symbol portion.
    pub fn to_symbol(&self, env: &Env) -> Symbol {
        match self {
            StorageKey::Admin => symbol_short!("ADMIN"),
            StorageKey::GroupCounter => symbol_short!("GCOUNTER"),
            StorageKey::Group(_) => symbol_short!("GROUP"),
            StorageKey::Contribution(_, _, _) => symbol_short!("CONTRIB"),
            StorageKey::PayoutReceived(_, _) => symbol_short!("PAYOUT"),
            StorageKey::Metadata(_) => symbol_short!("METADATA"),
        }
    }
}

/// Returns the next available group ID and atomically increments the counter.
///
/// The counter starts at 0 and is stored in instance storage. Each call
/// increments it by 1 and returns the new value, so the first group
/// ever created receives ID `1`.
pub fn get_next_group_id(env: &Env) -> u64 {
    let key = symbol_short!("GCOUNTER");
    let current: u64 = env.storage().instance().get(&key).unwrap_or(0);
    let next = current + 1;
    env.storage().instance().set(&key, &next);
    next
}

/// Persists a [`Group`](crate::types::Group) to ledger storage.
///
/// Overwrites any existing data for the given `group_id`. Call this any time
/// the group's mutable fields (members, cycle, payout index, etc.) change.
pub fn store_group(env: &Env, group_id: u64, group: &crate::types::Group) {
    let key = (symbol_short!("GROUP"), group_id);
    env.storage().persistent().set(&key, group);
}

/// Retrieves a [`Group`](crate::types::Group) from ledger storage.
///
/// Returns `None` if no group exists for the given `group_id`. Callers
/// typically convert this to [`AjoError::GroupNotFound`](crate::errors::AjoError::GroupNotFound)
/// via `.ok_or(...)`.
pub fn get_group(env: &Env, group_id: u64) -> Option<crate::types::Group> {
    let key = (symbol_short!("GROUP"), group_id);
    env.storage().persistent().get(&key)
}

/// Removes a group's record from persistent storage.
///
/// This is a destructive, irreversible operation. Use with caution —
/// primarily intended for administrative cleanup or future migration paths.
pub fn remove_group(env: &Env, group_id: u64) {
    let key = (symbol_short!("GROUP"), group_id);
    env.storage().persistent().remove(&key);
}

/// Records whether a member has paid their contribution for a given cycle.
///
/// The composite key `(group_id, cycle, member)` ensures that contribution
/// records are scoped per-group and per-cycle, so a member paying in cycle 1
/// does not affect their status in cycle 2.
///
/// # Arguments
/// * `group_id` - The group the contribution belongs to
/// * `cycle` - The cycle number being recorded
/// * `member` - The contributing member's address
/// * `paid` - `true` to mark as paid; `false` to reset (rarely needed)
pub fn store_contribution(env: &Env, group_id: u64, cycle: u32, member: &Address, paid: bool) {
    let key = (symbol_short!("CONTRIB"), group_id, cycle, member);
    env.storage().persistent().set(&key, &paid);
}

/// Returns `true` if the given member has contributed during the specified cycle.
///
/// Defaults to `false` if no record exists (i.e., the member has not yet contributed).
///
/// # Arguments
/// * `group_id` - The group to check
/// * `cycle` - The cycle number to check
/// * `member` - The member address to check
pub fn has_contributed(env: &Env, group_id: u64, cycle: u32, member: &Address) -> bool {
    let key = (symbol_short!("CONTRIB"), group_id, cycle, member);
    env.storage().persistent().get(&key).unwrap_or(false)
}

/// Records that the given member has received their payout for a group.
///
/// This flag is set after `execute_payout` successfully distributes funds.
/// It can be used for audit purposes and to prevent any future duplicate payouts.
///
/// # Arguments
/// * `group_id` - The group the payout belongs to
/// * `member` - The address that received the payout
pub fn mark_payout_received(env: &Env, group_id: u64, member: &Address) {
    let key = (symbol_short!("PAYOUT"), group_id, member);
    env.storage().persistent().set(&key, &true);
}

/// Returns `true` if the given member has already received a payout for this group.
///
/// Defaults to `false` if no record exists.
///
/// # Arguments
/// * `group_id` - The group to check
/// * `member` - The member address to check
pub fn has_received_payout(env: &Env, group_id: u64, member: &Address) -> bool {
    let key = (symbol_short!("PAYOUT"), group_id, member);
    env.storage().persistent().get(&key).unwrap_or(false)
}

/// Returns contribution status for every member in a cycle as an ordered vector.
///
/// Iterates through `members` in order and looks up each one's contribution
/// flag for the given cycle. The returned vector preserves member order and
/// pairs each address with a `bool` indicating whether they have contributed.
///
/// # Arguments
/// * `group_id` - The group to query
/// * `cycle` - The cycle number to query
/// * `members` - The ordered member list from the group (use `group.members`)
///
/// # Returns
/// A `Vec<(Address, bool)>` where `true` means the member has contributed.
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

/// Stores the contract administrator address in instance storage.
///
/// Should only be called once during [`AjoContract::initialize`](crate::contract::AjoContract::initialize).
/// Subsequent calls will overwrite the existing admin — access control
/// to prevent that is enforced at the contract level.
pub fn store_admin(env: &Env, admin: &Address) {
    let key = symbol_short!("ADMIN");
    env.storage().instance().set(&key, admin);
}

/// Retrieves the contract administrator address from instance storage.
///
/// Returns `None` if the contract has not yet been initialized.
/// Callers typically use `.ok_or(AjoError::Unauthorized)` to enforce auth.
pub fn get_admin(env: &Env) -> Option<Address> {
    let key = symbol_short!("ADMIN");
    env.storage().instance().get(&key)
}

/// Stores optional metadata for a group.
///
/// Metadata includes human-readable information like name, description, and rules.
/// This is stored separately from the core group data to keep the main Group
/// struct lean and to allow metadata to be optional.
///
/// # Arguments
/// * `group_id` - The group to store metadata for
/// * `metadata` - The metadata to store
///
/// # Note
/// Overwrites any existing metadata for the group. Validation of size limits
/// should be performed before calling this function.
pub fn store_metadata(env: &Env, group_id: u64, metadata: &crate::types::GroupMetadata) {
    let key = (symbol_short!("METADATA"), group_id);
    env.storage().persistent().set(&key, metadata);
}

/// Retrieves optional metadata for a group.
///
/// Returns `None` if no metadata has been set for the group. Groups can
/// exist without metadata, so this is not an error condition.
///
/// # Arguments
/// * `group_id` - The group to retrieve metadata for
///
/// # Returns
/// The group's metadata if it exists, or `None` if no metadata has been set.
pub fn get_metadata(env: &Env, group_id: u64) -> Option<crate::types::GroupMetadata> {
    let key = (symbol_short!("METADATA"), group_id);
    env.storage().persistent().get(&key)
}
