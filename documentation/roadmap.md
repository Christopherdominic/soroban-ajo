# Roadmap

## Vision

Make Ajo/Esusu accessible to anyone, anywhere, through transparent and trustless blockchain infrastructure.

## Guiding Principles

1. **Security First** - User funds are sacred
2. **User Experience** - Simple enough for non-technical users
3. **Community Driven** - Build with and for users
4. **African Focus** - Serve communities that need it most
5. **Sustainable** - Long-term maintenance and support

---

## Phase 0: Foundation (Current)

**Status:** ✅ Complete  
**Timeline:** Completed  
**Goal:** Build core contract and establish project

### Deliverables

- [x] Core smart contract (Rust/Soroban)
- [x] Comprehensive test suite
- [x] Documentation (architecture, storage, threat model)
- [x] CI/CD pipeline
- [x] Grant proposal
- [x] Demo materials
- [x] Open-source repository

### Success Metrics

- All tests passing
- Documentation complete
- Ready for security audit

---

## Phase 1: Security & Testnet (Q2 2026)

**Status:** 🎯 Next  
**Timeline:** 2-3 months  
**Goal:** Audit, test, and refine contract on testnet

### Milestone 1.1: Security Audit

**Duration:** 3-4 weeks  
**Budget:** $8,000 - $12,000

**Tasks:**
- [ ] Select audit firm (prefer Stellar ecosystem experience)
- [ ] Provide documentation and access
- [ ] Address findings
- [ ] Publish audit report

**Deliverables:**
- Professional security audit report
- Fixes for all critical/high issues
- Public disclosure of findings

### Milestone 1.2: Testnet Deployment

**Duration:** 2 weeks  
**Budget:** $1,000 (hosting, monitoring)

**Tasks:**
- [ ] Deploy to Stellar testnet
- [ ] Set up monitoring and alerting
- [ ] Create deployment documentation
- [ ] Build testnet faucet for demo tokens

**Deliverables:**
- Live testnet contract
- Monitoring dashboard
- Deployment guide

### Milestone 1.3: Community Testing

**Duration:** 4-6 weeks  
**Budget:** $2,000 (incentives, support)

**Tasks:**
- [ ] Recruit 50+ testers
- [ ] Run beta testing program
- [ ] Collect feedback
- [ ] Fix bugs
- [ ] Iterate on UX

**Deliverables:**
- 50+ test groups created
- Feedback report
- Bug fixes implemented
- Improved documentation

**Success Metrics:**
- Zero critical bugs found
- 90%+ tester satisfaction
- 100+ successful payouts executed

---

## Phase 2: Mainnet Launch (Q3 2026)

**Status:** 📅 Planned  
**Timeline:** 1-2 months  
**Goal:** Launch production-ready contract on mainnet

### Milestone 2.1: Mainnet Deployment

**Duration:** 2 weeks  
**Budget:** $3,000 (deployment, initial liquidity)

**Tasks:**
- [ ] Final code review
- [ ] Mainnet deployment
- [ ] Contract verification
- [ ] Set up production monitoring

**Deliverables:**
- Production contract on mainnet
- Verified contract source
- Status page

### Milestone 2.2: Basic Frontend (MVP)

**Duration:** 4-6 weeks  
**Budget:** $8,000

**Tasks:**
- [ ] Design UI/UX
- [ ] Build web app (Next.js + Stellar wallets)
- [ ] Implement core flows:
  - Create group
  - Join group
  - Contribute
  - View status
- [ ] Mobile responsive
- [ ] Deploy to production

**Deliverables:**
- Live web app at soroban-ajo.app
- Freighter wallet integration
- Mobile-friendly interface

**Tech Stack:**
- Next.js / React
- Stellar SDK
- Freighter wallet
- Tailwind CSS

### Milestone 2.3: Initial Adoption

**Duration:** Ongoing  
**Budget:** $2,000 (marketing, support)

**Tasks:**
- [ ] Launch campaign
- [ ] Partner with 5 communities
- [ ] Create tutorial content
- [ ] Provide support

**Success Metrics:**
- 100+ groups created
- 500+ unique users
- $50K+ in contributions processed

---

## Phase 3: Enhanced Features (Q4 2026)

**Status:** 📅 Planned  
**Timeline:** 3-4 months  
**Goal:** Add flexibility and token support

### Milestone 3.1: Token Support

**Duration:** 4 weeks  
**Budget:** $6,000

**Tasks:**
- [ ] Implement Stellar Asset Contract integration
- [ ] Support USDC, EURC, and custom tokens
- [ ] Update tests for multi-token scenarios
- [ ] Security review of token handling

**Features:**
```rust
create_group(
    contribution_amount,
    cycle_duration,
    max_members,
    token_address: Option<Address>  // NEW
)
```

**Deliverables:**
- Multi-token support
- Updated documentation
- Token selector in UI

### Milestone 3.2: Timeout & Recovery Mechanisms

**Duration:** 4 weeks  
**Budget:** $5,000

**Tasks:**
- [ ] Implement timeout mechanism
- [ ] Add skip delinquent member function
- [ ] Penalty system for late contributions
- [ ] Grace period configuration

**Features:**
```rust
pub fn force_cycle_advance() {
    // Skip non-contributing member after timeout
    // Redistribute or reduce payout
}
```

**Deliverables:**
- Timeout protection
- Configurable grace periods
- Recovery mechanisms

### Milestone 3.3: Advanced Group Options

**Duration:** 4 weeks  
**Budget:** $4,000

**Tasks:**
- [ ] Flexible payout order (not just rotation)
- [ ] Variable contribution amounts
- [ ] Group invitations (whitelist)
- [ ] Private vs public groups

**Features:**
- Random payout order (lottery-style)
- Auction for payout position
- Need-based priority
- Member voting

**Deliverables:**
- Flexible group configurations
- Updated contract and UI

**Success Metrics:**
- 500+ groups using new features
- Positive user feedback
- No new security issues

---

## Phase 4: Mobile & Scale (Q1 2027)

**Status:** 📅 Planned  
**Timeline:** 3-4 months  
**Goal:** Mobile app and improved scalability

### Milestone 4.1: Mobile Application

**Duration:** 8-10 weeks  
**Budget:** $15,000

**Tasks:**
- [ ] React Native app development
- [ ] iOS and Android deployment
- [ ] Mobile wallet integration
- [ ] Push notifications
- [ ] Offline mode

**Deliverables:**
- iOS app in App Store
- Android app in Play Store
- Mobile-first UX

### Milestone 4.2: Fiat On/Off Ramps

**Duration:** 6 weeks  
**Budget:** $10,000

**Tasks:**
- [ ] Partner with fiat gateway (e.g., MoonPay, Ramp)
- [ ] Integrate fiat deposits
- [ ] Support local payment methods (M-Pesa, bank transfer)
- [ ] Compliance research

**Target Regions:**
- Nigeria (Naira)
- Kenya (Shilling)
- Ghana (Cedi)
- South Africa (Rand)

**Deliverables:**
- Fiat-to-XLM/USDC in-app
- Local payment method support

### Milestone 4.3: Performance Optimization

**Duration:** 4 weeks  
**Budget:** $5,000

**Tasks:**
- [ ] Optimize contract gas usage
- [ ] Implement caching layer
- [ ] Event indexing service
- [ ] GraphQL API for queries

**Deliverables:**
- 50% reduction in transaction costs
- Sub-second query responses
- Improved scalability

**Success Metrics:**
- Support 10,000+ concurrent groups
- Handle 100+ transactions per second
- 99.9% uptime

---

## Phase 5: Ecosystem & Governance (Q2-Q3 2027)

**Status:** 🔮 Future  
**Timeline:** 6 months  
**Goal:** Build sustainable ecosystem

### Milestone 5.1: Reputation System

**Duration:** 6 weeks  
**Budget:** $8,000

**Features:**
- On-chain reputation scores
- Badges for reliable members
- History tracking
- Trust metrics

### Milestone 5.2: Insurance Pool

**Duration:** 6 weeks  
**Budget:** $7,000

**Features:**
- Community insurance fund
- Stake tokens to cover failed groups
- Claim mechanism for victims
- Risk assessment

### Milestone 5.3: Governance

**Duration:** 8 weeks  
**Budget:** $10,000

**Features:**
- DAO for parameter updates
- Community voting on upgrades
- Treasury management
- Proposal system

### Milestone 5.4: Developer SDK

**Duration:** 4 weeks  
**Budget:** $5,000

**Deliverables:**
- JavaScript SDK
- Python SDK
- Integration guides
- Example apps

**Success Metrics:**
- 10+ third-party integrations
- 100+ developers using SDK
- Active developer community

---

## Long-Term Vision (2028+)

### Expansion

- **Geographic:** Expand to Latin America, Southeast Asia
- **Use Cases:** Micro-lending, supply chain financing, community bonds
- **Partnerships:** Integrate with remittance services, microfinance institutions

### Innovations

- **Cross-Chain:** Bridge to other blockchains
- **AI Integration:** Smart contribution scheduling, risk assessment
- **DeFi Composability:** Use Ajo savings as collateral

### Social Impact

- **Target:** 1 million users by 2028
- **Impact:** $1 billion in savings facilitated
- **Jobs:** Support 100+ full-time community coordinators

---

## Funding Requirements

### Total Budget (Phases 1-4)

| Phase | Budget | Timeline |
|-------|--------|----------|
| Phase 1 | $11,000 | Q2 2026 |
| Phase 2 | $13,000 | Q3 2026 |
| Phase 3 | $15,000 | Q4 2026 |
| Phase 4 | $30,000 | Q1 2027 |
| **Total** | **$69,000** | **12 months** |

### Funding Sources

1. **Drips Wave Grant** - $15,000 (requested)
2. **Stellar Community Fund** - $20,000 (applied)
3. **Private Donors** - $10,000 (target)
4. **Future Revenue** - Transaction fees (long-term)

---

## Success Metrics

### Technical

- ✅ Zero critical security vulnerabilities
- ✅ 99.9% contract uptime
- ✅ <$0.10 average transaction cost

### Adoption

- 📊 1,000+ groups by end of 2026
- 📊 10,000+ users by end of 2026
- 📊 $5M+ in contributions by end of 2026

### Impact

- 🌍 50%+ users from Africa
- 🌍 80%+ user satisfaction
- 🌍 90%+ successful group completion rate

---

## Risk Mitigation

### Technical Risks

- **Smart Contract Bugs** → Professional audits, bug bounty
- **Scalability Issues** → Load testing, optimization
- **Stellar Network Changes** → Active monitoring, rapid response

### Business Risks

- **Low Adoption** → Pilot programs, partnerships, marketing
- **Competition** → Focus on UX and community
- **Regulatory** → Legal review, compliance by region

### Operational Risks

- **Team Capacity** → Hire incrementally, outsource where needed
- **Funding Gap** → Multiple funding sources, lean operations

---

## Community Involvement

### How to Contribute

1. **Developers** - Submit PRs, build integrations
2. **Testers** - Join beta program, report bugs
3. **Advocates** - Share with communities, provide feedback
4. **Donors** - Financial support, grants

### Governance

- **Q1 2027:** Transition to community governance
- **Community Council** - Elected representatives
- **Proposal Process** - Open to all stakeholders

---

## Conclusion

This roadmap balances **ambition with realism**, **innovation with security**, and **growth with sustainability**.

We're building for the long term, with the communities who need Ajo most at the center of every decision.

**Join us in bringing transparent, trustless savings to the world. 🌍**

---

*Last Updated: February 2026*  
*Next Review: May 2026*
