# Implementation Plan: Referral and Rewards Program

## Overview

This implementation plan breaks down the Referral and Rewards Program into discrete, actionable tasks. The plan follows a bottom-up approach: database schema → core services → API endpoints → frontend components. Each task builds incrementally, with checkpoints to validate functionality before proceeding.

The implementation uses TypeScript for both backend (Express.js) and frontend (Next.js) components, integrates with the existing PostgreSQL/Prisma database, and leverages Soroban smart contracts for blockchain rewards.

## Tasks

- [ ] 1. Set up database schema and migrations
  - [ ] 1.1 Create Prisma schema extensions for referral and rewards models
    - Add Referral, ReferralCode, Reward, FraudFlag, LeaderboardCache, and RewardConfig models to schema.prisma
    - Add relations to existing User model
    - Include all indexes specified in design document
    - _Requirements: 1.1, 2.1, 3.1, 4.1, 5.1, 6.1, 7.1, 8.1, 12.1, 15.1, 16.1, 17.1, 20.1_
  
  - [ ] 1.2 Generate and run database migrations
    - Run `npx prisma migrate dev` to create migration files
    - Verify migration applies cleanly to development database
    - Test rollback procedure
    - _Requirements: 1.1, 2.1_
  
  - [ ]* 1.3 Write property test for schema integrity
    - **Property 1: Referral Code Generation**
    - **Validates: Requirements 1.1, 1.2, 1.3**

- [ ] 2. Implement referral code generation service
  - [ ] 2.1 Create ReferralCodeGenerator utility class
    - Implement cryptographically secure random code generation
    - Use character set excluding ambiguous characters (0, O, I, l)
    - Support configurable length (6-12 characters)
    - Implement collision detection with retry logic
    - _Requirements: 1.1, 1.2, 1.3_
  
  - [ ]* 2.2 Write unit tests for ReferralCodeGenerator
    - Test code format validation (alphanumeric, correct length)
    - Test collision handling
    - Test edge cases (minimum/maximum length)
    - _Requirements: 1.1, 1.2, 1.3_

- [ ] 3. Implement ReferralService
  - [ ] 3.1 Create ReferralService class with core methods
    - Implement generateReferralCode() with unique code generation
    - Implement getReferralCode() to retrieve existing codes
    - Implement validateReferralCode() for code validation
    - Implement createReferral() to establish referral relationships
    - Implement completeReferral() to mark referrals as completed
    - Implement getReferralStats() for user statistics
    - _Requirements: 1.1, 1.4, 2.1, 2.2, 2.3, 2.4, 2.5_
  
  - [ ]* 3.2 Write property test for referral relationship recording
    - **Property 2: Referral Relationship Recording**
    - **Validates: Requirements 2.1, 2.2, 2.3**
  
  - [ ]* 3.3 Write property test for referral code validation
    - **Property 3: Referral Code Validation**
    - **Validates: Requirements 2.4, 2.5**
  
  - [ ]* 3.4 Write unit tests for ReferralService
    - Test self-referral rejection
    - Test duplicate referee handling
    - Test referral count increments
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_

- [ ] 4. Checkpoint - Verify referral code generation and tracking
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 5. Implement RewardConfigParser
  - [ ] 5.1 Create RewardConfigParser class
    - Implement YAML/JSON parsing with js-yaml library
    - Implement Joi schema validation for configuration structure
    - Implement serialize() method to convert objects back to YAML
    - Handle validation errors with descriptive messages
    - _Requirements: 20.1, 20.2, 20.3, 20.4_
  
  - [ ]* 5.2 Write property test for configuration round-trip
    - **Property 39: Configuration Round-Trip**
    - **Validates: Requirements 20.4**
  
  - [ ]* 5.3 Write unit tests for RewardConfigParser
    - Test valid configuration parsing
    - Test invalid configuration error messages
    - Test missing required fields
    - Test serialization format
    - _Requirements: 20.1, 20.2, 20.3_

- [ ] 6. Implement FraudDetector service
  - [ ] 6.1 Create FraudDetector class with detection methods
    - Implement checkReferral() for comprehensive fraud checks
    - Implement checkSelfReferral() to detect same user referrals
    - Implement checkIPMatch() to compare IP addresses
    - Implement checkDeviceMatch() to compare device fingerprints
    - Implement checkBulkCreation() to detect IP-based bulk signups
    - Implement flagReferral() to create fraud flags
    - Implement shouldBlockReward() to check if rewards should be withheld
    - Use Redis for IP-based rate limiting (24-hour rolling window)
    - _Requirements: 17.1, 17.2, 17.3, 17.4, 18.1, 18.2, 18.3, 18.4_
  
  - [ ]* 6.2 Write property test for fraud detection checks
    - **Property 30: Fraud Detection Checks**
    - **Validates: Requirements 17.1, 17.2**
  
  - [ ]* 6.3 Write property test for fraud flagging
    - **Property 31: Fraud Flagging**
    - **Validates: Requirements 17.3**
  
  - [ ]* 6.4 Write property test for flagged referral blocking
    - **Property 32: Flagged Referral Blocking**
    - **Validates: Requirements 17.4, 18.4**
  
  - [ ]* 6.5 Write unit tests for FraudDetector
    - Test self-referral detection
    - Test IP match detection
    - Test bulk creation threshold (3 referrals in 24 hours)
    - Test fraud flag creation
    - _Requirements: 17.1, 17.2, 17.3, 17.4, 18.1, 18.2, 18.3, 18.4_

- [ ] 7. Implement blockchain integration services
  - [ ] 7.1 Create RewardBlockchainService class
    - Implement transferRewardTokens() with retry logic (3 attempts, exponential backoff)
    - Implement transaction confirmation waiting
    - Handle blockchain errors and timeouts
    - _Requirements: 5.1, 5.2, 5.3, 5.4_
  
  - [ ] 7.2 Create NFTBadgeService class
    - Implement mintBadge() to mint NFTs on Soroban
    - Integrate with IPFS service for metadata storage
    - Set NFT properties (non-transferable, non-burnable)
    - Handle minting failures with retry logic
    - _Requirements: 7.1, 7.2, 7.3, 7.4_
  
  - [ ]* 7.3 Write property test for token reward blockchain recording
    - **Property 9: Token Reward Blockchain Recording**
    - **Validates: Requirements 5.1, 5.2, 5.3**
  
  - [ ]* 7.4 Write property test for token transfer retry
    - **Property 10: Token Transfer Retry**
    - **Validates: Requirements 5.4**
  
  - [ ]* 7.5 Write unit tests for blockchain services
    - Test token transfer success path
    - Test token transfer retry on failure
    - Test NFT minting with metadata
    - Test transaction confirmation
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 7.1, 7.2, 7.3, 7.4_

- [ ] 8. Checkpoint - Verify fraud detection and blockchain integration
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 9. Implement RewardEngine service
  - [ ] 9.1 Create RewardEngine class with reward distribution methods
    - Implement distributeReferralReward() for dual reward distribution
    - Implement distributeAchievementReward() for achievement rewards
    - Implement grantFeeDiscount() to create discount rewards
    - Implement grantBonusTokens() to create token rewards with blockchain integration
    - Implement grantPremiumFeature() to create feature access rewards
    - Implement mintNFTBadge() to create NFT badge rewards
    - Implement loadConfiguration() to parse and apply reward config
    - Implement getConfiguration() to retrieve active config
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 4.1, 5.1, 6.1, 7.1, 8.2, 9.3, 10.4, 11.3_
  
  - [ ] 9.2 Implement reward eligibility verification
    - Implement verifyAccountStatus() to check for suspensions and fraud flags
    - Implement verifyRequiredActions() to check completion criteria
    - Implement logEligibilityCheck() for audit trail
    - Integrate with FraudDetector.shouldBlockReward()
    - _Requirements: 19.1, 19.2, 19.3, 19.4_
  
  - [ ] 9.3 Implement reward lifecycle management
    - Implement getActiveRewards() to retrieve non-expired rewards
    - Implement redeemReward() to process redemptions
    - Implement expireRewards() background job to mark expired rewards
    - Handle reward state transitions (PENDING → ACTIVE → REDEEMED/EXPIRED)
    - _Requirements: 4.4, 6.4, 15.1, 15.2, 15.3, 15.4_
  
  - [ ] 9.4 Implement fee discount application logic
    - Implement getApplicableDiscount() to find highest active discount
    - Implement calculateDiscountedFee() for fee calculation
    - Filter expired discounts
    - _Requirements: 4.1, 4.2, 4.3, 4.4_
  
  - [ ]* 9.5 Write property test for dual referral rewards
    - **Property 4: Dual Referral Rewards**
    - **Validates: Requirements 3.1, 3.3, 3.4**
  
  - [ ]* 9.6 Write property test for fee discount storage
    - **Property 5: Fee Discount Storage**
    - **Validates: Requirements 4.1**
  
  - [ ]* 9.7 Write property test for maximum discount application
    - **Property 6: Maximum Discount Application**
    - **Validates: Requirements 4.2**
  
  - [ ]* 9.8 Write property test for discount calculation
    - **Property 7: Discount Calculation**
    - **Validates: Requirements 4.3**
  
  - [ ]* 9.9 Write property test for reward expiration
    - **Property 8: Reward Expiration**
    - **Validates: Requirements 4.4, 6.4**
  
  - [ ]* 9.10 Write property test for premium feature access grant
    - **Property 11: Premium Feature Access Grant**
    - **Validates: Requirements 6.1, 6.2, 6.3**
  
  - [ ]* 9.11 Write property test for reward eligibility verification
    - **Property 34: Account Status Verification**
    - **Property 35: Reward Eligibility Verification**
    - **Validates: Requirements 19.1, 19.2, 19.3**
  
  - [ ]* 9.12 Write unit tests for RewardEngine
    - Test referral reward distribution to both parties
    - Test reward state transitions
    - Test blockchain integration for token rewards
    - Test fee discount calculation
    - Test premium feature grant expiration
    - Test reward redemption validation
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 4.1, 4.2, 4.3, 4.4, 5.1, 6.1, 6.2, 6.3, 6.4, 15.1, 15.2, 15.3, 15.4_

- [ ] 10. Implement AchievementTracker service
  - [ ] 10.1 Create AchievementTracker class with monitoring methods
    - Implement handleGroupCreation() to track first group achievement
    - Implement handleContributionComplete() to track contribution count
    - Implement handleCycleComplete() to track perfect attendance
    - Implement handleReferralComplete() to track community helper
    - Implement unlockAchievement() to create achievement records
    - Integrate with RewardEngine to distribute achievement rewards
    - Create notifications for achievement unlocks
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 9.1, 9.2, 9.3, 9.4, 10.1, 10.2, 10.3, 10.4, 11.1, 11.2, 11.3, 11.4_
  
  - [ ]* 10.2 Write property test for achievement unlock timestamp
    - **Property 13: Achievement Unlock Timestamp**
    - **Validates: Requirements 8.3**
  
  - [ ]* 10.3 Write property test for achievement notification
    - **Property 14: Achievement Notification**
    - **Validates: Requirements 8.4**
  
  - [ ]* 10.4 Write property test for achievement reward grant
    - **Property 15: Achievement Reward Grant**
    - **Validates: Requirements 8.2, 9.3, 10.4, 11.3**
  
  - [ ]* 10.5 Write property test for contribution count increment
    - **Property 16: Contribution Count Increment**
    - **Validates: Requirements 9.1, 9.4**
  
  - [ ]* 10.6 Write property test for perfect cycle count increment
    - **Property 17: Perfect Cycle Count Increment**
    - **Validates: Requirements 10.1**
  
  - [ ]* 10.7 Write property test for late payment reset
    - **Property 18: Late Payment Reset**
    - **Validates: Requirements 10.2**
  
  - [ ]* 10.8 Write property test for qualified referral counting
    - **Property 19: Qualified Referral Counting**
    - **Validates: Requirements 11.2**
  
  - [ ]* 10.9 Write unit tests for AchievementTracker
    - Test first group achievement unlock
    - Test 10 contributions achievement unlock
    - Test perfect attendance achievement (3 cycles)
    - Test late payment resets perfect cycle count
    - Test community helper achievement (5 referrals)
    - Test achievement notification creation
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 9.1, 9.2, 9.3, 9.4, 10.1, 10.2, 10.3, 10.4, 11.1, 11.2, 11.3, 11.4_

- [ ] 11. Checkpoint - Verify reward engine and achievement tracking
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 12. Implement LeaderboardService
  - [ ] 12.1 Create LeaderboardService class with ranking methods
    - Implement updateReferrerRank() with Redis sorted sets
    - Implement updateActiveUserRank() for monthly contributions
    - Implement updateSaverRank() for total savings
    - Implement getTopReferrers() with Redis caching and database fallback
    - Implement getTopActiveUsers() with monthly reset logic
    - Implement getTopSavers() with total savings calculation
    - Implement getUserRank() to get individual user position
    - Use Redis ZADD for O(log N) updates
    - Set 5-minute TTL on cached leaderboards
    - _Requirements: 12.1, 12.2, 12.3, 12.4, 13.1, 13.2, 13.3, 13.4, 14.1, 14.2, 14.3, 14.4_
  
  - [ ]* 12.2 Write property test for leaderboard ranking correctness
    - **Property 20: Leaderboard Ranking Correctness**
    - **Validates: Requirements 12.1, 12.4, 13.1, 14.1**
  
  - [ ]* 12.3 Write property test for leaderboard size limit
    - **Property 21: Leaderboard Size Limit**
    - **Validates: Requirements 12.2, 13.2, 14.2**
  
  - [ ]* 12.4 Write property test for monthly contribution reset
    - **Property 22: Monthly Contribution Reset**
    - **Validates: Requirements 13.3**
  
  - [ ]* 12.5 Write property test for total savings calculation
    - **Property 23: Total Savings Calculation**
    - **Validates: Requirements 14.4**
  
  - [ ]* 12.6 Write unit tests for LeaderboardService
    - Test Redis cache hit/miss scenarios
    - Test leaderboard updates on user actions
    - Test top 100 limit enforcement
    - Test monthly reset on first day of month
    - Test user rank retrieval
    - _Requirements: 12.1, 12.2, 12.3, 12.4, 13.1, 13.2, 13.3, 13.4, 14.1, 14.2, 14.3, 14.4_

- [ ] 13. Implement API controllers and routes
  - [ ] 13.1 Create ReferralController with endpoints
    - POST /api/referrals/generate - Generate or retrieve referral code
    - POST /api/referrals/validate - Validate referral code
    - GET /api/referrals/stats - Get referral statistics
    - Add JWT authentication middleware
    - Add request validation middleware
    - Add rate limiting (10 requests per minute per user)
    - _Requirements: 1.1, 1.4, 2.1, 2.2, 2.3, 2.4, 2.5_
  
  - [ ] 13.2 Create RewardController with endpoints
    - GET /api/rewards - Get user rewards with filtering
    - POST /api/rewards/:id/redeem - Redeem specific reward
    - GET /api/rewards/history - Get complete reward history
    - Add JWT authentication middleware
    - Add ownership verification for reward operations
    - _Requirements: 15.1, 15.2, 15.3, 15.4, 16.1, 16.2, 16.3, 16.4_
  
  - [ ] 13.3 Create LeaderboardController with endpoints
    - GET /api/leaderboards/referrers - Get top referrers
    - GET /api/leaderboards/active - Get most active users
    - GET /api/leaderboards/savers - Get best savers
    - Support period query parameter (ALL_TIME, MONTHLY, WEEKLY)
    - Support pagination (limit, offset)
    - Add caching headers for client-side caching
    - _Requirements: 12.1, 12.2, 12.3, 12.4, 13.1, 13.2, 13.3, 13.4, 14.1, 14.2, 14.3, 14.4_
  
  - [ ]* 13.4 Write integration tests for API endpoints
    - Test referral code generation flow
    - Test referral creation with validation
    - Test reward redemption flow
    - Test reward history retrieval
    - Test leaderboard queries
    - Test authentication and authorization
    - _Requirements: 1.1, 2.1, 12.1, 13.1, 14.1, 15.1, 16.1_

- [ ] 14. Integrate with existing gamification system
  - [ ] 14.1 Add hooks to existing contribution flow
    - Call AchievementTracker.handleContributionComplete() after contribution
    - Call ReferralService.completeReferral() on first contribution
    - Call RewardEngine.distributeReferralReward() when referral completes
    - Call LeaderboardService.updateActiveUserRank() after contribution
    - Call LeaderboardService.updateSaverRank() after contribution
    - _Requirements: 3.1, 9.1, 13.4, 14.4_
  
  - [ ] 14.2 Add hooks to existing group creation flow
    - Call AchievementTracker.handleGroupCreation() after group creation
    - _Requirements: 8.1_
  
  - [ ] 14.3 Add hooks to existing cycle completion flow
    - Call AchievementTracker.handleCycleComplete() after cycle completion
    - Pass late payment status to determine perfect attendance
    - _Requirements: 10.1, 10.2_
  
  - [ ] 14.4 Add fee discount application to contribution processing
    - Call RewardEngine.getApplicableDiscount() before fee calculation
    - Call RewardEngine.calculateDiscountedFee() to apply discount
    - Display original and discounted fee to user
    - _Requirements: 4.1, 4.2, 4.3_

- [ ] 15. Checkpoint - Verify API endpoints and system integration
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 16. Implement frontend components
  - [ ] 16.1 Create ReferralDashboard component
    - Display user's referral code with copy button
    - Display shareable referral link
    - Show total referrals count (pending, active, completed)
    - Show list of referrals with status and join date
    - Show total rewards earned from referrals
    - Add social sharing buttons (Twitter, WhatsApp, Email)
    - _Requirements: 1.1, 2.2, 2.3, 3.4_
  
  - [ ] 16.2 Create RewardHistory component
    - Display all rewards in a table (type, status, earned date, expiration)
    - Add filtering by status (pending, active, redeemed, expired)
    - Add filtering by type (discount, token, feature, NFT)
    - Sort by earned date (most recent first)
    - Show redemption button for active rewards
    - Display reward details in expandable rows
    - _Requirements: 16.1, 16.2, 16.3, 16.4_
  
  - [ ] 16.3 Create LeaderboardView component
    - Display tabs for three leaderboard types (referrers, active, savers)
    - Show top 100 users with rank, username, and score
    - Highlight current user's position
    - Add period selector (all-time, monthly, weekly)
    - Implement infinite scroll or pagination
    - Show user's rank even if not in top 100
    - _Requirements: 12.1, 12.2, 12.4, 13.1, 13.2, 14.1, 14.2_
  
  - [ ] 16.4 Create AchievementBadges component
    - Display all available achievements with lock/unlock status
    - Show achievement progress bars (e.g., 7/10 contributions)
    - Display NFT badges with images and metadata
    - Show achievement unlock notifications as toasts
    - Add achievement detail modal with criteria and rewards
    - _Requirements: 8.1, 8.3, 8.4, 9.2, 10.3, 11.1_
  
  - [ ] 16.5 Create RewardNotification component
    - Display toast notifications for new rewards
    - Show reward type, amount, and source (referral/achievement)
    - Add "View Rewards" button to navigate to reward history
    - Implement auto-dismiss after 5 seconds
    - _Requirements: 3.3, 8.4_
  
  - [ ] 16.6 Integrate components into existing pages
    - Add ReferralDashboard to user profile page
    - Add RewardHistory to user profile page
    - Add LeaderboardView as new page in navigation
    - Add AchievementBadges to user profile page
    - Add RewardNotification to app layout for global notifications
    - _Requirements: 1.1, 8.1, 12.1, 13.1, 14.1, 16.1_

- [ ] 17. Implement background jobs and scheduled tasks
  - [ ] 17.1 Create reward expiration job
    - Implement cron job to run daily at midnight
    - Call RewardEngine.expireRewards() to mark expired rewards
    - Log number of rewards expired
    - _Requirements: 4.4, 6.4_
  
  - [ ] 17.2 Create leaderboard refresh job
    - Implement cron job to run every 5 minutes
    - Refresh Redis cache from database for all leaderboard types
    - Handle monthly reset on first day of month
    - _Requirements: 12.3, 13.3, 13.4, 14.3_
  
  - [ ] 17.3 Create fraud review notification job
    - Implement cron job to run hourly
    - Query pending fraud flags
    - Send notification to admin team if flags exist
    - _Requirements: 17.4, 18.4_
  
  - [ ] 17.4 Create blockchain retry job
    - Implement cron job to run every 10 minutes
    - Query FAILED rewards with retry count < 3
    - Retry blockchain transactions
    - Update reward status based on result
    - _Requirements: 5.4_

- [ ] 18. Create reward configuration file and admin tools
  - [ ] 18.1 Create default reward configuration YAML file
    - Define referral rewards for referrer and referee
    - Define all four achievements with criteria and rewards
    - Define premium features (advanced_analytics, priority_support)
    - Store in config/rewards.yaml
    - _Requirements: 20.1, 20.3_
  
  - [ ] 18.2 Create configuration loading script
    - Read rewards.yaml on application startup
    - Parse with RewardConfigParser
    - Load into RewardEngine
    - Store in RewardConfig table with version
    - _Requirements: 20.1, 20.2_
  
  - [ ] 18.3 Create admin endpoint for configuration management
    - POST /api/admin/config/rewards - Upload new configuration
    - GET /api/admin/config/rewards - Get active configuration
    - GET /api/admin/config/rewards/history - Get configuration versions
    - Add admin role verification
    - Validate configuration before activation
    - _Requirements: 20.1, 20.2, 20.3_

- [ ] 19. Implement monitoring and observability
  - [ ] 19.1 Add Prometheus metrics
    - Add counter for referrals created (by status)
    - Add counter for rewards distributed (by type and status)
    - Add counter for fraud detected (by type and severity)
    - Add histogram for blockchain transaction duration
    - Add histogram for leaderboard query duration
    - _Requirements: 1.1, 2.1, 3.1, 5.1, 12.1, 17.1_
  
  - [ ] 19.2 Add structured logging
    - Log referral creation with metadata
    - Log reward distribution with details
    - Log fraud detection with evidence
    - Log blockchain transactions with status
    - Log achievement unlocks with criteria
    - Use consistent log format with timestamps and context
    - _Requirements: 1.1, 2.1, 3.1, 5.1, 8.1, 17.1, 19.4_
  
  - [ ] 19.3 Create monitoring dashboard
    - Create Grafana dashboard for key metrics
    - Add panels for referral growth over time
    - Add panels for reward distribution by type
    - Add panels for fraud detection alerts
    - Add panels for blockchain transaction success rate
    - Add panels for leaderboard query performance
    - _Requirements: 1.1, 2.1, 3.1, 5.1, 12.1, 17.1_

- [ ] 20. Final checkpoint and integration testing
  - [ ] 20.1 Run end-to-end integration tests
    - Test complete referral flow: code generation → registration → first contribution → dual rewards
    - Test achievement flow: user action → achievement unlock → reward grant → blockchain transaction
    - Test leaderboard flow: user action → stats update → cache invalidation → leaderboard refresh
    - Test fraud flow: suspicious referral → fraud detection → flagging → reward blocking
    - _Requirements: 1.1, 2.1, 3.1, 8.1, 12.1, 17.1_
  
  - [ ] 20.2 Verify all requirements are met
    - Review requirements document and confirm all acceptance criteria are satisfied
    - Test edge cases and error conditions
    - Verify performance requirements (response times, update latencies)
    - _Requirements: All_
  
  - [ ] 20.3 Final checkpoint - Ensure all tests pass
    - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation throughout implementation
- Property tests validate universal correctness properties from the design document
- Unit tests validate specific examples and edge cases
- Integration tests verify interactions between services
- The implementation follows TypeScript best practices with strong typing
- All blockchain operations include retry logic and error handling
- Redis is used for caching and rate limiting to ensure performance
- Fraud detection runs on every referral creation to maintain system integrity
