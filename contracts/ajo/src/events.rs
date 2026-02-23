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
    env.events().publish(topics, (creator, contribution_amount, max_members));
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

/// Emit an event when a member performs an emergency withdrawal
pub fn emit_emergency_withdrawal(
    env: &Env,
    group_id: u64,
    member: &Address,
    refund_amount: i128,
    penalty_amount: i128,
) {
    let topics = (symbol_short!("withdraw"), group_id);
    env.events().publish(topics, (member, refund_amount, penalty_amount));
}
