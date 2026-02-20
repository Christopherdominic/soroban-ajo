# Getting Started - Quick Reference

## 📚 Documentation Files

| File | Purpose | Audience |
|------|---------|----------|
| `frontend/README.md` | Complete reference | All developers |
| `FRONTEND_SETUP.md` | Step-by-step setup | New contributors |

## 🚀 Quick Start (30 seconds)

```bash
cd soroban-ajo/frontend
npm install
npm run dev
# Open http://localhost:5173
```

## 📖 What's Included

### FRONTEND_SETUP.md
- ✅ Prerequisites checklist
- ✅ Installation (3 steps)
- ✅ Environment setup
- ✅ Development workflow
- ✅ 5 key concepts with code
- ✅ 3 component examples
- ✅ Troubleshooting (6 issues)
- ✅ Quick reference

### frontend/README.md
- ✅ Project structure
- ✅ Tech stack
- ✅ Component architecture
- ✅ Stellar integration
- ✅ Testing guide
- ✅ Security practices
- ✅ Deployment
- ✅ Contributing guide

## 🎯 Key Concepts Explained

1. **Component Structure** - TypeScript patterns
2. **React Query** - Data fetching & caching
3. **Wallet Integration** - Freighter connection
4. **Contract Interaction** - Soroban calls
5. **State Management** - Server & local state

## 💡 Component Examples

1. **Button** - Reusable UI component
2. **Group Card** - Data display
3. **Form** - Validation & submission

## 🔧 Common Commands

```bash
npm run dev          # Start dev server
npm run build        # Build production
npm test             # Run tests
npm run lint         # Lint code
npm run type-check   # Check types
```

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| Port in use | `npx kill-port 5173` |
| Module not found | `rm -rf node_modules && npm install` |
| TypeScript errors | Restart TS server in VS Code |
| Wallet issues | Check Freighter, clear cache |
| Contract fails | Verify contract ID in `.env.local` |
| Build fails | `rm -rf node_modules/.vite && npm run build` |

## 📝 Environment Setup

Create `.env.local`:
```env
VITE_SOROBAN_RPC_URL=https://soroban-testnet.stellar.org
VITE_SOROBAN_CONTRACT_ID=your_contract_id
VITE_STELLAR_NETWORK_PASSPHRASE=Test SDF Network ; September 2015
```

## 🎓 Learning Path

### Beginners
1. Read FRONTEND_SETUP.md
2. Follow installation steps
3. Review key concepts
4. Try examples
5. Pick issue #19-24

### Experienced
1. Quick start from README
2. Review architecture
3. Check integration patterns
4. Pick issue #25-35

## ✅ CI/CD Status

All checks passing:
- Formatting ✅
- Linting ✅
- Build ✅

## 📞 Support

- Comment on GitHub issues
- Check troubleshooting section
- Review existing discussions

---

**Ready to contribute? Start with FRONTEND_SETUP.md! 🚀**
