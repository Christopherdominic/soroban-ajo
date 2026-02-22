# Soroban-Ajo: Frontend Architecture Specification

## 1. Design Philosophy
Our architecture follows a **Layered Service Pattern** to decouple the UI from the Stellar blockchain complexities. This ensures the application remains maintainable even as Soroban smart contracts evolve.

## 2. Technical Stack
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript (Strict Mode)
- **State Management:**
    - **Global/Session:** `Zustand` (Lightweight, for wallet sessions and UI persistence).
    - **Server/Blockchain Cache:** `TanStack Query v5` (Handles async states, caching, and polling).
- **Network Layer:**
    - `stellar-sdk` & `soroban-client` for XDR manipulation and RPC calls.
    - `Axios` for Backend API communication.
- **UI & UX:** Tailwind CSS + Shadcn UI + Lucide Icons.

## 3. Directory & Module Structure
- `/src/app`: Routes, layouts, and page-specific logic.
- `/src/components`: 
    - `/ui`: Low-level Atomic components (Buttons, Inputs).
    - `/ajo`: Feature-specific components (Contribution Cards, Cycle Timelines).
- `/src/hooks`: Custom hooks like `useSoroban` (low-level) and `useAjoGroup` (high-level).
- `/src/services`: Pure logic for contract invocations (XDR encoding/decoding).
- `/src/store`: Zustand stores for wallet and global settings.

## 4. Wallet Integration Strategy
We implement a **Unified Wallet Adapter**. Instead of components calling `Freighter` directly, they interact with a `useWallet` hook. This allows us to support multiple providers (Freighter, Albedo, Hana) through a single interface, handling network switching and account changes reactively.

## 5. Data Synchronization
Since blockchain data is asynchronous, we utilize **TanStack Query** to manage the "Closed Ledger" state. 
- **Reads:** Cached for 60 seconds unless a transaction is detected.
- **Writes:** Use `optimistic updates` to show the user immediate feedback while the transaction is pending in the Stellar network. 
