# Requirements Document

## Introduction

This document specifies the requirements for a Referral and Rewards Program for the Ajo decentralized savings platform. The system will incentivize user growth through referral tracking, provide multiple reward types, implement an achievement system, and display leaderboards to encourage engagement and platform adoption.

## Glossary

- **Referral_System**: The subsystem responsible for generating referral codes and tracking referral relationships
- **Reward_Engine**: The subsystem that calculates, distributes, and manages rewards
- **Achievement_Tracker**: The subsystem that monitors user actions and unlocks achievements
- **Leaderboard_Service**: The subsystem that ranks and displays user performance metrics
- **Referrer**: A user who invites another user to the platform
- **Referee**: A user who joins the platform using a referral code
- **Referral_Code**: A unique alphanumeric identifier assigned to each user for inviting others
- **Reward**: A benefit granted to users for specific actions or achievements
- **Achievement**: A milestone unlocked when a user completes specific criteria
- **Redemption_System**: The subsystem that processes reward claims and applies benefits
- **Fraud_Detector**: The subsystem that identifies and prevents fraudulent referral activity
- **Reward_History**: A record of all rewards earned and redeemed by a user

## Requirements

### Requirement 1: Generate Unique Referral Codes

**User Story:** As a platform user, I want to receive a unique referral code, so that I can invite friends and earn rewards.

#### Acceptance Criteria

1. WHEN a user account is created, THE Referral_System SHALL generate a unique referral code for that user
2. THE Referral_System SHALL ensure each referral code is alphanumeric and between 6 and 12 characters in length
3. THE Referral_System SHALL verify that no two users receive identical referral codes
4. THE Referral_System SHALL make the referral code available to the user within 1 second of account creation

### Requirement 2: Track Referral Relationships

**User Story:** As a platform administrator, I want to track who invited whom, so that I can attribute rewards correctly.

#### Acceptance Criteria

1. WHEN a new user registers with a referral code, THE Referral_System SHALL record the relationship between the referrer and referee
2. THE Referral_System SHALL store the timestamp of each referral relationship
3. THE Referral_System SHALL maintain a count of total referrals for each referrer
4. WHEN a referral relationship is recorded, THE Referral_System SHALL verify the referral code exists before creating the relationship
5. IF a referral code does not exist, THEN THE Referral_System SHALL reject the registration and return an error message

### Requirement 3: Distribute Referral Rewards

**User Story:** As a user who invites friends, I want to receive rewards when my referrals join and participate, so that I am incentivized to grow the platform.

#### Acceptance Criteria

1. WHEN a referee completes their first contribution, THE Reward_Engine SHALL grant a reward to both the referrer and referee
2. THE Reward_Engine SHALL apply the reward within 5 seconds of the triggering action
3. THE Reward_Engine SHALL notify both the referrer and referee when a referral reward is granted
4. THE Reward_Engine SHALL record each reward distribution in the Reward_History

### Requirement 4: Provide Contribution Fee Discounts

**User Story:** As a user, I want to receive contribution fee discounts as rewards, so that I can save money on platform fees.

#### Acceptance Criteria

1. WHEN a user earns a fee discount reward, THE Reward_Engine SHALL store the discount percentage and expiration date
2. WHEN a user makes a contribution, THE Reward_Engine SHALL apply the highest available discount to the transaction fee
3. THE Reward_Engine SHALL reduce the contribution fee by the discount percentage before processing payment
4. WHEN a discount expires, THE Reward_Engine SHALL remove it from the user's active rewards

### Requirement 5: Grant Bonus Tokens

**User Story:** As a user, I want to receive bonus tokens as rewards, so that I can use them within the platform ecosystem.

#### Acceptance Criteria

1. WHEN a user earns a bonus token reward, THE Reward_Engine SHALL credit the specified token amount to the user's wallet
2. THE Reward_Engine SHALL record the token grant transaction on the Stellar blockchain
3. THE Reward_Engine SHALL confirm the blockchain transaction completes successfully before marking the reward as distributed
4. IF the blockchain transaction fails, THEN THE Reward_Engine SHALL retry up to 3 times before marking the reward as failed

### Requirement 6: Unlock Premium Features

**User Story:** As a user, I want to unlock premium features through rewards, so that I can access advanced platform capabilities.

#### Acceptance Criteria

1. WHEN a user earns a premium feature reward, THE Reward_Engine SHALL grant access to the specified feature
2. THE Reward_Engine SHALL store the feature access grant with an expiration date
3. WHEN a user attempts to access a premium feature, THE Reward_Engine SHALL verify the user has an active grant for that feature
4. WHEN a premium feature grant expires, THE Reward_Engine SHALL revoke access to that feature

### Requirement 7: Award NFT Badges

**User Story:** As a user, I want to receive NFT badges for achievements, so that I can showcase my accomplishments.

#### Acceptance Criteria

1. WHEN a user earns an NFT badge reward, THE Reward_Engine SHALL mint the NFT on the Stellar blockchain
2. THE Reward_Engine SHALL transfer the NFT to the user's wallet address
3. THE Reward_Engine SHALL store the NFT metadata including badge name, description, and achievement criteria
4. THE Reward_Engine SHALL ensure each NFT badge is unique and non-transferable

### Requirement 8: Track First Group Creation Achievement

**User Story:** As a user, I want to unlock an achievement when I create my first group, so that I am recognized for starting a savings group.

#### Acceptance Criteria

1. WHEN a user creates their first savings group, THE Achievement_Tracker SHALL unlock the First_Group_Created achievement
2. THE Achievement_Tracker SHALL grant the associated reward for the First_Group_Created achievement
3. THE Achievement_Tracker SHALL record the achievement unlock timestamp
4. THE Achievement_Tracker SHALL notify the user that the achievement has been unlocked

### Requirement 9: Track Successful Contributions Achievement

**User Story:** As a user, I want to unlock an achievement after making 10 successful contributions, so that I am recognized for consistent participation.

#### Acceptance Criteria

1. WHEN a user completes a contribution, THE Achievement_Tracker SHALL increment the user's successful contribution count
2. WHEN a user's successful contribution count reaches 10, THE Achievement_Tracker SHALL unlock the Ten_Contributions achievement
3. THE Achievement_Tracker SHALL grant the associated reward for the Ten_Contributions achievement
4. THE Achievement_Tracker SHALL count only completed contributions that were not reversed or refunded

### Requirement 10: Track Perfect Attendance Achievement

**User Story:** As a user, I want to unlock an achievement for making all contributions on time, so that I am recognized for reliability.

#### Acceptance Criteria

1. WHEN a user completes a contribution cycle with no late payments, THE Achievement_Tracker SHALL increment the user's perfect cycle count
2. WHEN a user makes a late payment, THE Achievement_Tracker SHALL reset the user's perfect cycle count to zero
3. WHEN a user achieves 3 consecutive perfect cycles, THE Achievement_Tracker SHALL unlock the Perfect_Attendance achievement
4. THE Achievement_Tracker SHALL grant the associated reward for the Perfect_Attendance achievement

### Requirement 11: Track Community Helper Achievement

**User Story:** As a user, I want to unlock an achievement for inviting 5 or more friends, so that I am recognized for growing the community.

#### Acceptance Criteria

1. WHEN a user's total referral count reaches 5, THE Achievement_Tracker SHALL unlock the Community_Helper achievement
2. THE Achievement_Tracker SHALL count only referrals where the referee has completed at least one contribution
3. THE Achievement_Tracker SHALL grant the associated reward for the Community_Helper achievement
4. THE Achievement_Tracker SHALL update the referral count in real-time as referees complete contributions

### Requirement 12: Display Top Referrers Leaderboard

**User Story:** As a user, I want to see a leaderboard of top referrers, so that I can compare my referral performance with others.

#### Acceptance Criteria

1. THE Leaderboard_Service SHALL rank users by total number of active referrals
2. THE Leaderboard_Service SHALL display the top 100 referrers
3. THE Leaderboard_Service SHALL update the leaderboard within 10 seconds of a referral status change
4. THE Leaderboard_Service SHALL display each user's rank, username, and referral count

### Requirement 13: Display Most Active Users Leaderboard

**User Story:** As a user, I want to see a leaderboard of most active users, so that I can compare my activity level with others.

#### Acceptance Criteria

1. THE Leaderboard_Service SHALL rank users by total number of contributions made in the current month
2. THE Leaderboard_Service SHALL display the top 100 most active users
3. THE Leaderboard_Service SHALL reset monthly contribution counts on the first day of each month
4. THE Leaderboard_Service SHALL update the leaderboard within 10 seconds of a contribution being completed

### Requirement 14: Display Best Savers Leaderboard

**User Story:** As a user, I want to see a leaderboard of best savers, so that I can compare my savings performance with others.

#### Acceptance Criteria

1. THE Leaderboard_Service SHALL rank users by total amount saved across all groups
2. THE Leaderboard_Service SHALL display the top 100 best savers
3. THE Leaderboard_Service SHALL update the leaderboard within 10 seconds of a contribution being completed
4. THE Leaderboard_Service SHALL calculate total savings as the sum of all completed contributions

### Requirement 15: Process Reward Redemption

**User Story:** As a user, I want to redeem my earned rewards, so that I can receive the benefits.

#### Acceptance Criteria

1. WHEN a user requests to redeem a reward, THE Redemption_System SHALL verify the user has the reward available
2. THE Redemption_System SHALL apply the reward benefit to the user's account within 5 seconds
3. THE Redemption_System SHALL mark the reward as redeemed in the Reward_History
4. IF a reward cannot be redeemed, THEN THE Redemption_System SHALL return a descriptive error message to the user

### Requirement 16: Display Reward History

**User Story:** As a user, I want to view my reward history, so that I can track what rewards I have earned and redeemed.

#### Acceptance Criteria

1. THE Reward_Engine SHALL maintain a complete history of all rewards earned by each user
2. THE Reward_Engine SHALL record the reward type, amount, earn date, and redemption status for each reward
3. WHEN a user requests their reward history, THE Reward_Engine SHALL return all reward records sorted by earn date in descending order
4. THE Reward_Engine SHALL display whether each reward is pending, active, redeemed, or expired

### Requirement 17: Detect Fraudulent Referral Activity

**User Story:** As a platform administrator, I want to detect fraudulent referral activity, so that I can prevent abuse of the rewards system.

#### Acceptance Criteria

1. WHEN a new referral is created, THE Fraud_Detector SHALL check if the referee's IP address matches the referrer's IP address
2. WHEN a new referral is created, THE Fraud_Detector SHALL check if the referee's device fingerprint matches the referrer's device fingerprint
3. IF the Fraud_Detector identifies matching IP addresses or device fingerprints, THEN THE Fraud_Detector SHALL flag the referral as suspicious
4. WHEN a referral is flagged as suspicious, THE Fraud_Detector SHALL prevent reward distribution until manual review is completed

### Requirement 18: Prevent Multiple Account Fraud

**User Story:** As a platform administrator, I want to prevent users from creating multiple accounts to exploit referral rewards, so that the system remains fair.

#### Acceptance Criteria

1. WHEN a user attempts to use their own referral code, THE Fraud_Detector SHALL reject the referral and return an error message
2. THE Fraud_Detector SHALL track the number of referrals from each IP address within a 24-hour period
3. WHEN more than 3 referrals originate from the same IP address within 24 hours, THE Fraud_Detector SHALL flag all referrals from that IP address as suspicious
4. THE Fraud_Detector SHALL prevent reward distribution for flagged referrals until manual review is completed

### Requirement 19: Validate Reward Eligibility

**User Story:** As a platform administrator, I want to ensure only eligible users receive rewards, so that the rewards system maintains integrity.

#### Acceptance Criteria

1. WHEN a reward is about to be distributed, THE Reward_Engine SHALL verify the user's account is in good standing
2. THE Reward_Engine SHALL verify the user has completed all required actions for the reward
3. IF a user's account is suspended or flagged for fraud, THEN THE Reward_Engine SHALL withhold reward distribution
4. THE Reward_Engine SHALL log all reward eligibility checks with the verification result and timestamp

### Requirement 20: Parse Reward Configuration Files

**User Story:** As a platform administrator, I want to configure reward rules through configuration files, so that I can adjust reward parameters without code changes.

#### Acceptance Criteria

1. WHEN a valid reward configuration file is provided, THE Reward_Config_Parser SHALL parse it into a Reward_Configuration object
2. WHEN an invalid reward configuration file is provided, THE Reward_Config_Parser SHALL return a descriptive error message indicating the validation failure
3. THE Reward_Config_Printer SHALL format Reward_Configuration objects back into valid configuration files
4. FOR ALL valid Reward_Configuration objects, parsing then printing then parsing SHALL produce an equivalent object
