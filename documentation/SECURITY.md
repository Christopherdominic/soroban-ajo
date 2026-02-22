# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 0.1.x   | :white_check_mark: |

## Reporting a Vulnerability

The Soroban Ajo team takes security seriously. We appreciate your efforts to responsibly disclose your findings.

### How to Report

**Please DO NOT report security vulnerabilities through public GitHub issues.**

Instead, please report them via email to:

**security@soroban-ajo.example.com**

### What to Include

Please include as much of the following information as possible:

- **Type of vulnerability** (e.g., buffer overflow, SQL injection, cross-site scripting, etc.)
- **Full paths of source file(s)** related to the vulnerability
- **Location of the affected source code** (tag/branch/commit or direct URL)
- **Step-by-step instructions** to reproduce the issue
- **Proof-of-concept or exploit code** (if possible)
- **Impact of the issue**, including how an attacker might exploit it

### Response Timeline

- **Initial Response**: Within 24 hours
- **Confirmation/Triage**: Within 72 hours
- **Status Updates**: Every 7 days until resolved
- **Fix Timeline**: Varies by severity (see below)

### Severity Levels

#### Critical (24-48 hours)
- Loss of funds
- Unauthorized access to funds
- Complete system compromise

**Examples:**
- Ability to drain contract funds
- Authorization bypass for payouts
- Reentrancy vulnerabilities

#### High (3-7 days)
- Significant functionality compromise
- Data integrity issues
- Privilege escalation

**Examples:**
- Group manipulation by non-members
- Contribution tracking bypass
- State corruption

#### Medium (1-2 weeks)
- Limited functionality impact
- Information disclosure
- Minor logic errors

**Examples:**
- Gas inefficiencies
- Event emission issues
- Documentation errors affecting security

#### Low (2-4 weeks)
- Best practice violations
- Code quality issues
- Minor documentation issues

### Our Commitment

- We will acknowledge your email within 24 hours
- We will confirm the vulnerability and determine its impact
- We will release a fix as soon as possible
- We will credit you in our release notes (unless you prefer to remain anonymous)

### Bug Bounty Program

We currently operate an informal bug bounty program:

| Severity | Reward Range |
|----------|--------------|
| Critical | $1,000 - $5,000 |
| High     | $500 - $2,000 |
| Medium   | $100 - $500 |
| Low      | $50 - $100 |

**Note**: Rewards are at the discretion of the core team and depend on:
- Severity of the issue
- Quality of the report
- Ease of exploitation
- Impact on users

### Disclosure Policy

- Please give us reasonable time to fix the vulnerability before public disclosure
- We aim to release a fix before any public disclosure
- We will credit you in our security advisory (unless you prefer anonymity)
- We may request that you do not disclose the vulnerability until a fix is deployed

### Public Disclosure Process

1. Security team receives report
2. Team confirms vulnerability
3. Team develops fix
4. Fix is tested thoroughly
5. Fix is deployed to testnet
6. Fix is deployed to mainnet
7. Security advisory is published
8. Reporter is credited (if desired)

### Out of Scope

The following are generally considered out of scope:

- Attacks requiring physical access to a user's device
- Social engineering attacks
- Attacks on third-party services (wallets, RPC providers)
- Issues already publicly disclosed
- Issues in dependencies (report to upstream project)
- Theoretical vulnerabilities without proof of concept

### Safe Harbor

We support safe harbor for security researchers who:

- Make a good faith effort to avoid privacy violations, destruction of data, and interruption or degradation of our services
- Only interact with accounts you own or with explicit permission of the account holder
- Do not exploit a vulnerability beyond what is necessary to confirm its existence
- Report vulnerabilities as soon as discovered
- Keep vulnerability information confidential until a fix is released

We will not pursue legal action against researchers who follow these guidelines.

## Security Best Practices for Users

### For Contract Deployers

1. **Audit before mainnet**: Always get a professional security audit
2. **Test thoroughly**: Run extensive tests on testnet
3. **Monitor actively**: Set up alerts for unusual activity
4. **Keep updated**: Stay informed about security updates

### For Group Creators

1. **Vet members**: Know who you're forming groups with
2. **Start small**: Test with small amounts first
3. **Use reputable instances**: Only use verified contract deployments
4. **Backup data**: Keep records of all transactions

### For Group Members

1. **Verify contract**: Check the contract address is legitimate
2. **Understand risks**: This is experimental technology
3. **Only contribute what you can afford to lose**
4. **Report suspicious activity** immediately

## Security Audits

### Current Status

- **Version 0.1.x**: Pending professional audit
- **Target**: Complete audit before mainnet deployment

### Planned Audits

- **Q2 2026**: Professional smart contract audit
- **Q3 2026**: Mainnet deployment with audit report
- **Ongoing**: Community reviews and bug bounty program

### Past Audits

None yet - first audit scheduled for Q2 2026.

## Known Issues

### Current Limitations (MVP)

1. **No timeout mechanism**: Groups can be stuck if a member doesn't contribute
   - **Mitigation**: Social coordination, planned for v1.1
   - **Status**: Enhancement tracked in issue #X

2. **No token transfer enforcement**: MVP tracks contributions but doesn't enforce transfers
   - **Mitigation**: Production version will integrate Stellar Asset Contract
   - **Status**: Planned for v1.0

3. **No pause mechanism**: No emergency stop function
   - **Mitigation**: Thorough testing before deployment
   - **Status**: Planned for v1.1

## Security Resources

- [Soroban Security Best Practices](https://soroban.stellar.org/docs/security)
- [Stellar Security Guide](https://developers.stellar.org/docs/security)
- [OWASP Smart Contract Top 10](https://owasp.org/www-project-smart-contract-top-10/)

## Contact

- **Security Email**: security@soroban-ajo.example.com
- **General Contact**: contact@soroban-ajo.example.com
- **GitHub Issues**: [Report non-security bugs](https://github.com/yourusername/soroban-ajo/issues)

## PGP Key

```
-----BEGIN PGP PUBLIC KEY BLOCK-----
[Future: Add PGP key for encrypted communications]
-----END PGP PUBLIC KEY BLOCK-----
```

## Acknowledgments

We thank the following researchers for their responsible disclosure:

*None yet - be the first!*

---

**Thank you for helping keep Soroban Ajo and our users safe!** 🔒
