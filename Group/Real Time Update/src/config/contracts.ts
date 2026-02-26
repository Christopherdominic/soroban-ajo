// Smart Contract ABI for ROSCA Group
export const ROSCA_GROUP_ABI = [
  "function getGroupInfo() view returns (string name, string description, uint256 contributionAmount, uint256 cycleLength, uint256 totalCycles, uint256 currentCycle, uint8 status)",
  "function getMembers() view returns (address[] memory)",
  "function getMemberInfo(address member) view returns (bool hasJoined, uint256 joinedAt, bool hasContributed, uint256 totalContributions)",
  "function getCurrentCycleInfo() view returns (uint256 startTime, uint256 endTime, address recipient, uint256 totalContributed, uint256 totalRequired)",
  "function getTotalMembers() view returns (uint256)",
  "function contribute() payable",
  "event Contribution(address indexed member, uint256 amount, uint256 cycle)",
  "event Payout(address indexed recipient, uint256 amount, uint256 cycle)",
  "event MemberJoined(address indexed member, uint256 timestamp)",
  "event CycleCompleted(uint256 cycle, address recipient)"
];

// Example contract address (replace with your deployed contract)
export const CONTRACT_ADDRESS = "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb";

// RPC endpoint configuration
// 
// IMPORTANT: Replace this with your actual RPC provider URL to connect to the blockchain.
// While the placeholder is present, the app will use mock data for demonstration.
//
// Options:
// 1. Alchemy: https://eth-mainnet.g.alchemy.com/v2/YOUR_API_KEY
// 2. Infura: https://mainnet.infura.io/v3/YOUR_PROJECT_ID
// 3. QuickNode: https://your-endpoint.quiknode.pro/YOUR_TOKEN
// 4. Local: http://localhost:8545
//
// Get a free API key from:
// - Alchemy: https://www.alchemy.com/
// - Infura: https://infura.io/
//
export const RPC_ENDPOINT = process.env.REACT_APP_RPC_ENDPOINT || "https://eth-mainnet.g.alchemy.com/v2/YOUR_API_KEY";