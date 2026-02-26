use soroban_sdk::{Address, Env, Vec};
use crate::storage;
use crate::types::{InsuranceConfig, InsuranceClaim, ClaimStatus, InsurancePool, Group};
use crate::errors::AjoError;
use crate::utils;

/// Calculates the insurance premium for a contribution.
pub fn calculate_premium(amount: i128, rate_bps: u32) -> i128 {
    (amount * (rate_bps as i128)) / 10000
}

/// Adds funds to the insurance pool for a token.
pub fn deposit_to_pool(env: &Env, token: &Address, amount: i128) {
    let mut pool = storage::get_insurance_pool(env, token).unwrap_or(InsurancePool {
        balance: 0,
        total_payouts: 0,
        pending_claims_count: 0,
    });
    pool.balance += amount;
    storage::store_insurance_pool(env, token, &pool);
}

/// Records a claim against the insurance pool.
pub fn file_claim(
    env: &Env,
    group_id: u64,
    cycle: u32,
    claimant: Address,
    defaulter: Address,
    amount: i128,
) -> Result<u64, AjoError> {
    let claim_id = storage::get_next_claim_id(env);
    let now = env.ledger().timestamp();

    let claim = InsuranceClaim {
        id: claim_id,
        group_id,
        cycle,
        defaulter,
        claimant,
        amount,
        status: ClaimStatus::Pending,
        created_at: now,
    };

    storage::store_insurance_claim(env, claim_id, &claim);

    // Update pool stats
    let group = storage::get_group(env, group_id).ok_or(AjoError::GroupNotFound)?;
    let mut pool = storage::get_insurance_pool(env, &group.token_address).unwrap_or(InsurancePool {
        balance: 0,
        total_payouts: 0,
        pending_claims_count: 0,
    });
    pool.pending_claims_count += 1;
    storage::store_insurance_pool(env, &group.token_address, &pool);

    Ok(claim_id)
}

/// Processes a claim and executes payout if approved.
pub fn process_claim(env: &Env, claim_id: u64, approved: bool) -> Result<(), AjoError> {
    let mut claim = storage::get_insurance_claim(env, claim_id).ok_or(AjoError::InvalidClaim)?;
    
    if claim.status != ClaimStatus::Pending {
        return Err(AjoError::ClaimAlreadyProcessed);
    }

    let group = storage::get_group(env, claim.group_id).ok_or(AjoError::GroupNotFound)?;
    let mut pool = storage::get_insurance_pool(env, &group.token_address).ok_or(AjoError::PoolNotFound)?;

    if approved {
        if pool.balance < claim.amount {
            return Err(AjoError::InsufficientPoolBalance);
        }

        // Payout from insurance pool
        pool.balance -= claim.amount;
        pool.total_payouts += claim.amount;
        claim.status = ClaimStatus::Paid;

        // Transfer tokens from contract to claimant
        crate::token::transfer_token(
            env,
            &group.token_address,
            &env.current_contract_address(),
            &claim.claimant,
            claim.amount,
        )?;
    } else {
        claim.status = ClaimStatus::Rejected;
    }

    pool.pending_claims_count -= 1;
    storage::store_insurance_pool(env, &group.token_address, &pool);
    storage::store_insurance_claim(env, claim_id, &claim);

    Ok(())
}

/// Verifies a claim automatically.
/// In a real scenario, this would check if the defaulter actually missed their contribution.
pub fn verify_claim(env: &Env, claim_id: u64) -> Result<bool, AjoError> {
    let claim = storage::get_insurance_claim(env, claim_id).ok_or(AjoError::InvalidClaim)?;
    
    // Automatic verification: Check if defaulter has contributed in that cycle
    let has_contributed = storage::has_contributed(env, claim.group_id, claim.cycle, &claim.defaulter);
    
    // If they haven't contributed, the claim is valid
    Ok(!has_contributed)
}

/// Automatically processes a claim if it can be verified.
pub fn auto_process_claim(env: &Env, claim_id: u64) -> Result<(), AjoError> {
    if verify_claim(env, claim_id)? {
        process_claim(env, claim_id, true)
    } else {
        process_claim(env, claim_id, false)
    }
}

/// Calculates risk score for a member based on history.
pub fn get_member_risk_score(env: &Env, member: &Address) -> u32 {
    // This is a simplified version. In practice, it would aggregate across multiple groups.
    // We'll use the reliability_score if available in some context, or calculate one.
    // For now, let's assume a default of 100 (best) and subtract for late/missed payments.
    100
}

/// Calculates group risk rating.
pub fn get_group_risk_rating(env: &Env, group: &Group) -> u32 {
    let total_members = group.members.len();
    if total_members == 0 { return 0; }

    // Simplified: Average of member risk scores? 
    // Or just based on historical group performance if we had that.
    75 // Default medium risk
}
