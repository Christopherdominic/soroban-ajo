# Soroban-Ajo Frontend 🚀

The frontend for the Soroban-Ajo platform—a decentralized Rotating Savings and Credit Association (ROSCA) built on the Stellar network. This is a modern, high-performance web application designed for seamless blockchain interaction.

## 🛠 Tech Stack

- **Framework:** [Next.js 14](https://nextjs.org/) (App Router)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) + [Shadcn UI](https://ui.shadcn.com/)
- **State Management:** - [Zustand](https://zustand-demo.pmnd.rs/) (Global UI State)
  - [TanStack Query v5](https://tanstack.com/query/latest) (Server/Blockchain State)
- **Blockchain Interface:** `stellar-sdk` & `soroban-client`
- **Charts:** [Recharts](https://recharts.org/)

## 🚀 Getting Started

### Prerequisites

- **Node.js:** 18.17.0 or later
- **Wallet:** [Freighter Wallet](https://www.freighter.app/) (Chrome/Firefox extension)
- **Network:** Access to Stellar Testnet (via RPC)

### Installation

1. **Install dependencies:**
   ```bash
   npm install