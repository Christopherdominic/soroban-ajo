use soroban_sdk::{contracttype, Address, Vec};

/// State of a group in its lifecycle.
#[contracttype]
#[derive(Clone, Copy, Debug, Eq, PartialEq, PartialOrd, Ord)]
#[repr(u32)]
pub enum GroupState {
    /// Group is active and accepting contributions.
    Active = 0,
    /// Group has been cancelled and refunds are being processed.
    Cancelled = 1,
    /// Group has completed all cycles successfully.
    Complete = 2,
}

/// Represents an Ajo group configuration and state.
///
/// An Ajo (also known as Esusu or Tontine) is a rotating savings group
/// where members contribute a fixed amount each cycle, and one member
/// receives the full pool each round until everyone has been paid out.
#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct Group {
    /// Unique group identifier, auto-incremented from storage counter
    pub id: u64,

    /// Address of the member who created the group.
    /// Automatically added as the first member on creation.
    pub creator: Address,

    /// Fixed contribution amount each member must pay per cycle, denominated in stroops.
    /// 1 XLM = 10,000,000 stroops.
    pub contribution_amount: i128,

    /// Duration of each cycle in seconds.
    /// When a cycle ends, the next payout can be triggered.
    pub cycle_duration: u64,

    /// Maximum number of members allowed in the group.
    /// Must be between 2 and 100 (inclusive).
    pub max_members: u32,

    /// Ordered list of member addresses.
    /// Members receive payouts in the order they appear in this list.
    pub members: Vec<Address>,

    /// Current cycle number, starts at 1 and increments after each payout.
    pub current_cycle: u32,

    /// Zero-based index into `members` indicating who receives the next payout.
    /// When `payout_index == members.len()`, the group is complete.
    pub payout_index: u32,

    /// Unix timestamp (seconds) when the group was created.
    pub created_at: u64,

    /// Unix timestamp (seconds) when the current cycle started.
    /// Used together with `cycle_duration` to calculate when the cycle ends.
    pub cycle_start_time: u64,

    /// Whether the group has completed all payout cycles.
    /// Once `true`, no further contributions or payouts are accepted.
    pub is_complete: bool,

    /// Grace period duration in seconds after cycle ends.
    /// Members can still contribute during this period but will incur penalties.
    /// Default: 86400 seconds (24 hours)
    pub grace_period: u64,

    /// Penalty rate as a percentage (0-100) applied to late contributions.
    /// For example, 5 means 5% penalty on the contribution amount.
    /// Penalties are added to the group pool for the next recipient.
    pub penalty_rate: u32,

    /// Current state of the group (Active, Cancelled, or Complete).
    pub state: GroupState,
}

/// Records a single member's contribution for a specific cycle.
///
/// Written to persistent storage when a member calls `contribute()`.
/// Used to prevent double-contributions and to verify cycle completion
/// before executing a payout.
#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct ContributionRecord {
    /// Address of the member who made (or is expected to make) the contribution.
    pub member: Address,

    /// The group this contribution belongs to.
    pub group_id: u64,

    /// The cycle number this contribution is for.
    pub cycle: u32,

    /// Whether the member has paid their contribution for this cycle.
    /// `true` means the contribution has been recorded; `false` means pending.
    pub has_paid: bool,

    /// Unix timestamp (seconds) when the contribution was recorded.
    pub timestamp: u64,

    /// Whether this contribution was made late (during grace period).
    pub is_late: bool,

    /// Penalty amount charged for late contribution (in stroops).
    /// Zero if contribution was on time.
    pub penalty_amount: i128,
}

/// Tracks penalty statistics for a member across all cycles in a group.
#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct MemberPenaltyRecord {
    /// Address of the member.
    pub member: Address,

    /// The group this record belongs to.
    pub group_id: u64,

    /// Total number of late contributions.
    pub late_count: u32,

    /// Total number of on-time contributions.
    pub on_time_count: u32,

    /// Total penalty amount paid (in stroops).
    pub total_penalties: i128,

    /// Reliability score (0-100): percentage of on-time contributions.
    pub reliability_score: u32,
}

/// Records that a member has received their payout for a given cycle.
///
/// Written to persistent storage after `execute_payout()` succeeds.
/// Can be used for audit trails and to prevent duplicate payouts.
#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct PayoutRecord {
    /// Address of the member who received the payout.
    pub member: Address,

    /// The group this payout belongs to.
    pub group_id: u64,

    /// The cycle number in which this payout was made.
    pub cycle: u32,

    /// Total payout amount in stroops (`contribution_amount × member_count`).
    pub amount: i128,

    /// Unix timestamp (seconds) when the payout was executed.
    pub timestamp: u64,
}

/// Comprehensive snapshot of a group's current state.
///
/// Returned by [`crate::contract::AjoContract::get_group_status`] to give callers a single
/// consolidated view without having to make multiple queries.
#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct GroupStatus {
    /// The unique identifier of the group being described.
    pub group_id: u64,

    /// Current cycle number (1-based). Increments after each successful payout.
    pub current_cycle: u32,

    /// `true` if there is a valid next recipient (i.e., the group is not yet complete).
    /// When `false`, `next_recipient` is a placeholder and should be ignored.
    pub has_next_recipient: bool,

    /// Address of the member scheduled to receive the next payout.
    /// Only meaningful when `has_next_recipient` is `true`.
    pub next_recipient: Address,

    /// Number of members who have already contributed in the current cycle.
    pub contributions_received: u32,

    /// Total number of members currently in the group.
    pub total_members: u32,

    /// Addresses of members who have not yet contributed in the current cycle.
    pub pending_contributors: Vec<Address>,

    /// Whether the group has finished all cycles and is closed.
    pub is_complete: bool,

    /// Whether the current cycle window is still open for contributions.
    /// `false` means the cycle has expired and a payout can be triggered.
    pub is_cycle_active: bool,

    /// Unix timestamp (seconds) when the current cycle started.
    pub cycle_start_time: u64,

    /// Unix timestamp (seconds) when the current cycle ends (`cycle_start_time + cycle_duration`).
    pub cycle_end_time: u64,

    /// The ledger timestamp at the moment this status was queried.
    pub current_time: u64,

    /// Total penalties collected in the current cycle (in stroops).
    pub cycle_penalty_pool: i128,

    /// Whether the cycle is in grace period (after cycle end but before grace period expires).
    pub is_in_grace_period: bool,

    /// Unix timestamp when grace period ends.
    pub grace_period_end_time: u64,
}

/// Optional metadata for a group.
#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct GroupMetadata {
    /// Name of the group.
    pub name: soroban_sdk::String,
    /// Description of the group purpose or goal.
    pub description: soroban_sdk::String,
    /// Custom rules or guidelines for members.
    pub rules: soroban_sdk::String,
}

pub const MAX_NAME_LENGTH: u32 = 50;
pub const MAX_DESCRIPTION_LENGTH: u32 = 250;
pub const MAX_RULES_LENGTH: u32 = 1000;

/// Tracks a refund request initiated by a member.
#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct RefundRequest {
    /// The group this refund request is for.
    pub group_id: u64,

    /// Address of the member who initiated the request.
    pub requester: Address,

    /// Unix timestamp when the request was created.
    pub created_at: u64,

    /// Unix timestamp when voting ends.
    pub voting_deadline: u64,

    /// Number of votes in favor of the refund.
    pub votes_for: u32,

    /// Number of votes against the refund.
    pub votes_against: u32,

    /// Whether the request has been executed.
    pub executed: bool,

    /// Whether the request was approved.
    pub approved: bool,
}

/// Records a member's vote on a refund request.
#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct RefundVote {
    /// The group this vote is for.
    pub group_id: u64,

    /// Address of the member who voted.
    pub voter: Address,

    /// Whether the vote is in favor (true) or against (false).
    pub in_favor: bool,

    /// Unix timestamp when the vote was cast.
    pub timestamp: u64,
}

/// Records a refund transaction.
#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct RefundRecord {
    /// The group this refund is for.
    pub group_id: u64,

    /// Address of the member receiving the refund.
    pub member: Address,

    /// Amount refunded in stroops.
    pub amount: i128,

    /// Unix timestamp when the refund was processed.
    pub timestamp: u64,

    /// Reason for the refund (cancellation, emergency, vote).
    pub reason: RefundReason,
}

/// Reason for a refund.
#[contracttype]
#[derive(Clone, Copy, Debug, Eq, PartialEq, PartialOrd, Ord)]
#[repr(u32)]
pub enum RefundReason {
    /// Group was cancelled by creator before first payout.
    CreatorCancellation = 0,
    /// Refund approved by member vote.
    MemberVote = 1,
    /// Emergency refund by admin.
    EmergencyRefund = 2,
}

/// Voting period duration in seconds (7 days).
pub const VOTING_PERIOD: u64 = 604_800;

/// Minimum approval percentage required for refund (51%).
pub const REFUND_APPROVAL_THRESHOLD: u32 = 51;
