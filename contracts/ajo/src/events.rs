use soroban_sdk::{symbol_short, Address, Env};

/// Emit an event when a group is created
pub fn emit_group_created(
    env: &Env,
    group_id: u64,
    creator: &Address,
    contribution_amount: i128,
    max_members: u32,
) {
    let topics = (symbol_short!("created"), group_id);
    env.events()
        .publish(topics, (creator, contribution_amount, max_members));
}

/// Emit an event when a member joins a group
pub fn emit_member_joined(env: &Env, group_id: u64, member: &Address) {
    let topics = (symbol_short!("joined"), group_id);
    env.events().publish(topics, member);
}

/// Emit an event when a member contributes
pub fn emit_contribution_made(
    env: &Env,
    group_id: u64,
    member: &Address,
    cycle: u32,
    amount: i128,
) {
    let topics = (symbol_short!("contrib"), group_id, cycle);
    env.events().publish(topics, (member, amount));
}

/// Emit an event when a payout is executed
pub fn emit_payout_executed(
    env: &Env,
    group_id: u64,
    recipient: &Address,
    cycle: u32,
    amount: i128,
) {
    let topics = (symbol_short!("payout"), group_id, cycle);
    env.events().publish(topics, (recipient, amount));
}

/// Emit an event when a group completes all cycles
pub fn emit_group_completed(env: &Env, group_id: u64) {
    let topics = (symbol_short!("complete"), group_id);
    env.events().publish(topics, ());
}

/// Emit an event when a cycle advances
pub fn emit_cycle_advanced(env: &Env, group_id: u64, new_cycle: u32, cycle_start_time: u64) {
    let topics = (symbol_short!("cycle"), group_id);
    env.events().publish(topics, (new_cycle, cycle_start_time));
}

/// Emit an event when a group is cancelled by its creator
pub fn emit_group_cancelled(
    env: &Env,
    group_id: u64,
    creator: &Address,
    member_count: u32,
    refund_per_member: i128,
) {
    let topics = (symbol_short!("cancel"), group_id);
    env.events()
        .publish(topics, (creator, member_count, refund_per_member));
}

/// Emit an event when a late contribution is made with penalty
pub fn emit_late_contribution(
    env: &Env,
    group_id: u64,
    member: &Address,
    cycle: u32,
    amount: i128,
    penalty: i128,
) {
    let topics = (symbol_short!("late"), group_id, cycle);
    env.events().publish(topics, (member, amount, penalty));
}

/// Emit an event when penalties are distributed with payout
pub fn emit_penalty_distributed(
    env: &Env,
    group_id: u64,
    recipient: &Address,
    cycle: u32,
    base_amount: i128,
    penalty_bonus: i128,
) {
    let topics = (symbol_short!("pendistr"), group_id, cycle);
    env.events()
        .publish(topics, (recipient, base_amount, penalty_bonus));
}

/// Emit an event when a refund request is created
pub fn emit_refund_requested(
    env: &Env,
    group_id: u64,
    requester: &Address,
    voting_deadline: u64,
) {
    let topics = (symbol_short!("refreq"), group_id);
    env.events().publish(topics, (requester, voting_deadline));
}

/// Emit an event when a member votes on a refund request
pub fn emit_refund_vote(
    env: &Env,
    group_id: u64,
    voter: &Address,
    in_favor: bool,
) {
    let topics = (symbol_short!("refvote"), group_id);
    env.events().publish(topics, (voter, in_favor));
}

/// Emit an event when a refund is processed
pub fn emit_refund_processed(
    env: &Env,
    group_id: u64,
    member: &Address,
    amount: i128,
    reason: u32,
) {
    let topics = (symbol_short!("refund"), group_id);
    env.events().publish(topics, (member, amount, reason));
}

/// Emit an event when an emergency refund is executed
pub fn emit_emergency_refund(
    env: &Env,
    group_id: u64,
    admin: &Address,
    total_refunded: i128,
) {
    let topics = (symbol_short!("emrefund"), group_id);
    env.events().publish(topics, (admin, total_refunded));
}
