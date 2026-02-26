# Ajo Documentation

Welcome to the Ajo platform documentation. This directory contains all technical documentation, guides, and implementation details.

## 📚 Documentation Structure

### 🏗️ Architecture (`architecture/`)
System design, data models, and architectural decisions.

- [Architecture Overview](architecture/architecture.md) - High-level system architecture
- [Profile Architecture](architecture/PROFILE_ARCHITECTURE.md) - User profile system design
- [Monitoring](architecture/monitoring.md) - System monitoring and observability
- [Storage Layout](architecture/storage-layout.md) - Data storage architecture
- [Threat Model](architecture/threat-model.md) - Security threat analysis

### 📖 Guides (`guides/`)
Step-by-step guides and quick references organized by topic.

#### General Guides
- [Monorepo Guide](guides/MONOREPO_GUIDE.md) - Working with the monorepo
- [Next.js Migration](guides/NEXTJS_MIGRATION.md) - Migration from Vite to Next.js
- [Quick Reference Guide](guides/QUICK_REFERENCE_GUIDE.md) - Quick command reference
- [Wallet Integration](guides/WALLET_INTEGRATION.md) - Integrating Stellar wallets
- [Frontend Setup](guides/FRONTEND_SETUP.md) - Frontend development setup
- [Group Status Feature](guides/GROUP_STATUS_FEATURE.md) - Group status functionality
- [Cycle Timing Guide](guides/CYCLE_TIMING_GUIDE.md) - Understanding cycle timing
- [Event Schema Reference](guides/EVENT_SCHEMA_REFERENCE.md) - Event data schemas

#### Accessibility (`guides/accessibility/`)
- [Accessibility Quick Reference](guides/accessibility/ACCESSIBILITY_QUICK_REFERENCE.md)
- [Accessibility Testing Guide](guides/accessibility/ACCESSIBILITY_TESTING_GUIDE.md)
- [Accessibility Improvements](guides/accessibility/ACCESSIBILITY_IMPROVEMENTS.md)

#### Caching (`guides/caching/`)
- [Caching Quick Reference](guides/caching/CACHING_QUICK_REFERENCE.md)
- [Caching Implementation](guides/caching/CACHING_IMPLEMENTATION.md)
- [Caching Deployment Guide](guides/caching/CACHING_DEPLOYMENT_GUIDE.md)
- [Caching Final Report](guides/caching/CACHING_FINAL_REPORT.md)

#### CI/CD (`guides/ci-cd/`)
- [CI/CD Checks](guides/ci-cd/CI_CD_CHECKS.md)
- [CI/CD Enhancement Summary](guides/ci-cd/CI_CD_ENHANCEMENT_SUMMARY.md)
- [CI/CD Setup](guides/ci-cd/CI_CD_SETUP.md)
- [Create PR Instructions](guides/ci-cd/CREATE_PR_INSTRUCTIONS.md)

#### Profile (`guides/profile/`)
- [Profile Quick Start](guides/profile/PROFILE_QUICK_START.md)
- [Profile Feature](guides/profile/PROFILE_FEATURE.md)

### 🔧 Implementation (`implementation/`)
Implementation details, summaries, and technical specifications.

#### General Implementation
- [Implementation Summary](implementation/IMPLEMENTATION_SUMMARY.md)
- [Design System Implementation](implementation/DESIGN_SYSTEM_IMPLEMENTATION.md)
- [Migration Summary](implementation/MIGRATION_SUMMARY.md)
- [Final Summary](implementation/FINAL_SUMMARY.md)
- [Cleanup Summary](implementation/CLEANUP_SUMMARY.md)

#### Events (`implementation/events/`)
- [Event Emission Implementation](implementation/events/EVENT_EMISSION_IMPLEMENTATION.md)
- [Event Implementation Summary](implementation/events/EVENT_IMPLEMENTATION_SUMMARY.md)

#### Error Handling (`implementation/errors/`)
- [Error Handling Implementation](implementation/errors/ERROR_HANDLING_IMPLEMENTATION.md)
- [Error Empty States Delivery](implementation/errors/ERROR_EMPTY_STATES_DELIVERY_SUMMARY.md)

#### Validation (`implementation/validation/`)
- [Validation Errors Implementation](implementation/validation/VALIDATION_ERRORS_IMPLEMENTATION.md)
- [Validation Errors Summary](implementation/validation/VALIDATION_ERRORS_SUMMARY.md)

#### Icons (`implementation/icons/`)
- [Icon Implementation Checklist](implementation/icons/ICON_IMPLEMENTATION_CHECKLIST.md)
- [Icon Delivery Summary](implementation/icons/ICON_DELIVERY_SUMMARY.md)

#### Wallet (`implementation/wallet/`)
- [Wallet Implementation Summary](implementation/wallet/WALLET_IMPLEMENTATION_SUMMARY.md)

#### Webhooks
- [Webhook Implementation Summary](implementation/WEBHOOK_IMPLEMENTATION_SUMMARY.md)
- [Webhook System](implementation/WEBHOOK_SYSTEM.md)

#### Profile
- [Profile Implementation Summary](implementation/PROFILE_IMPLEMENTATION_SUMMARY.md)

#### Environment
- [Environment Implementation Summary](implementation/ENVIRONMENT_IMPLEMENTATION_SUMMARY.md)

#### Copy
- [Copy Implementation Guide](implementation/COPY_IMPLEMENTATION_GUIDE.md)
- [In-App Copy Summary](implementation/IN_APP_COPY_SUMMARY.md)

#### Cycle Timing
- [Cycle Timing Implementation](implementation/CYCLE_TIMING_IMPLEMENTATION.md)

### 💻 Development (`development/`)
Development workflows, refactoring plans, and testing guides.

- [Refactoring Plan](development/REFACTORING_PLAN.md) - Comprehensive codebase refactoring plan
- [Refactoring Summary](development/REFACTORING_SUMMARY.md) - Summary of completed refactoring
- [Code Quality Review](development/CODE_QUALITY_REVIEW.md) - Code quality standards
- [Environment Setup](development/ENVIRONMENT_SETUP.md) - Development environment setup
- [Environment Quick Reference](development/ENV_QUICK_REFERENCE.md) - Environment variables reference

### 🎨 Design (`design/`)
Design specifications, UI patterns, and style guides.

#### UI States (`design/ui-states/`)
- Error states, empty states, loading states, and other UI state designs

#### Icons (`design/icons/`)
- Icon system documentation and guidelines

#### Copy (`design/copy/`)
- In-app copy guidelines and tone of voice

### 🔌 API (`api/`)
API documentation and specifications.

- Backend API documentation is available at `/api-docs` when running the backend server
- See [Backend README](../backend/README.md) for API endpoint details

### 📋 General Documentation
- [Code of Conduct](CODE_OF_CONDUCT.md) - Community guidelines
- [Roadmap](roadmap.md) - Project roadmap and future plans

## 🚀 Quick Links

### Getting Started
1. [Main README](../README.md) - Project overview and setup
2. [Contributing Guidelines](../CONTRIBUTING.md) - How to contribute
3. [Frontend README](../frontend/README.md) - Frontend setup
4. [Backend README](../backend/README.md) - Backend setup

### For Developers
- [Architecture Overview](architecture/architecture.md) - Understand the system
- [Refactoring Plan](development/REFACTORING_PLAN.md) - Code quality improvements
- [CI/CD Checks](guides/CI_CD_CHECKS.md) - Automated checks and workflows

### For Users
- [Profile Feature](guides/PROFILE_FEATURE.md) - User profile functionality
- [Profile Quick Start](guides/PROFILE_QUICK_START.md) - Get started with profiles

## 📝 Documentation Standards

When adding new documentation:

1. **Location**: Place docs in the appropriate subfolder
   - `architecture/` - System design and architecture
   - `guides/` - How-to guides and quick references
   - `implementation/` - Implementation details and specs
   - `development/` - Development workflows and tools
   - `api/` - API documentation

2. **Format**: Use Markdown (.md) format

3. **Naming**: Use descriptive names with UPPERCASE for important docs
   - Good: `CACHING_IMPLEMENTATION.md`
   - Good: `profile-feature.md`
   - Avoid: `doc1.md`, `temp.md`

4. **Content**: Include
   - Clear title and description
   - Table of contents for long docs
   - Code examples where applicable
   - Links to related documentation
   - Last updated date

5. **Update Index**: Add new docs to this README

## 🔄 Maintenance

This documentation is actively maintained. If you find:
- Outdated information
- Broken links
- Missing documentation
- Unclear explanations

Please open an issue or submit a pull request.

## 📧 Support

For questions about the documentation:
1. Check existing docs first
2. Search closed issues
3. Open a new issue with the `documentation` label

---

Last Updated: February 2026
