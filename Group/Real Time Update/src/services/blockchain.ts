import { ethers } from 'ethers';
import { ROSCA_GROUP_ABI, CONTRACT_ADDRESS, RPC_ENDPOINT } from '../config/contracts';
import { GroupData, GroupMember, Transaction } from '../types/group';

export class BlockchainService {
  private provider: ethers.JsonRpcProvider | null = null;
  private contract: ethers.Contract | null = null;
  private useMockData: boolean = false;

  constructor() {
    this.initializeProvider();
  }

  private initializeProvider() {
    try {
      // Check if RPC endpoint is a placeholder
      if (RPC_ENDPOINT.includes('YOUR_API_KEY') || RPC_ENDPOINT.includes('PLACEHOLDER')) {
        console.warn('⚠️ Blockchain service is using mock data. Please configure a valid RPC endpoint in /src/config/contracts.ts');
        this.useMockData = true;
        return;
      }

      // Try to use window.ethereum if available (MetaMask, etc.)
      if (typeof window !== 'undefined' && (window as any).ethereum) {
        this.provider = new ethers.BrowserProvider((window as any).ethereum);
      } else {
        // Fallback to RPC provider
        this.provider = new ethers.JsonRpcProvider(RPC_ENDPOINT);
      }
    } catch (error) {
      console.error('Failed to initialize provider:', error);
      this.useMockData = true;
    }
  }

  private async getContract(contractAddress: string) {
    if (!this.provider) {
      throw new Error('Provider not initialized');
    }
    return new ethers.Contract(contractAddress, ROSCA_GROUP_ABI, this.provider);
  }

  async getGroupData(groupId: string): Promise<GroupData> {
    if (this.useMockData) {
      return this.getMockGroupData(groupId);
    }

    try {
      const contract = await this.getContract(groupId);
      
      // Fetch group info
      const groupInfo = await contract.getGroupInfo();
      const members = await contract.getMembers();
      const cycleInfo = await contract.getCurrentCycleInfo();
      
      // Fetch member details
      const memberDetails: GroupMember[] = await Promise.all(
        members.map(async (address: string) => {
          const memberInfo = await contract.getMemberInfo(address);
          return {
            address,
            joinedAt: Number(memberInfo.joinedAt),
            hasContributedThisCycle: memberInfo.hasContributed,
            totalContributions: ethers.formatEther(memberInfo.totalContributions),
            isRecipientThisCycle: address.toLowerCase() === cycleInfo.recipient.toLowerCase(),
          };
        })
      );

      const groupData: GroupData = {
        id: groupId,
        name: groupInfo.name,
        description: groupInfo.description,
        totalMembers: members.length,
        currentMembers: members.length,
        contributionAmount: ethers.formatEther(groupInfo.contributionAmount),
        cycleLength: Number(groupInfo.cycleLength),
        currentCycle: Number(groupInfo.currentCycle),
        totalCycles: Number(groupInfo.totalCycles),
        currentCycleStartTime: Number(cycleInfo.startTime),
        nextCycleTime: Number(cycleInfo.endTime),
        totalContributed: ethers.formatEther(cycleInfo.totalContributed),
        totalRequired: ethers.formatEther(cycleInfo.totalRequired),
        status: this.parseStatus(groupInfo.status),
        members: memberDetails,
        creator: members[0] || '',
        contractAddress: groupId,
      };

      return groupData;
    } catch (error) {
      console.error('Error fetching group data:', error);
      // Return mock data for development
      return this.getMockGroupData(groupId);
    }
  }

  async getTransactionHistory(groupId: string): Promise<Transaction[]> {
    if (this.useMockData) {
      return this.getMockTransactions();
    }

    try {
      const contract = await this.getContract(groupId);
      
      // Fetch events from the contract
      const contributionFilter = contract.filters.Contribution();
      const payoutFilter = contract.filters.Payout();
      const memberJoinedFilter = contract.filters.MemberJoined();
      
      const [contributions, payouts, joins] = await Promise.all([
        contract.queryFilter(contributionFilter),
        contract.queryFilter(payoutFilter),
        contract.queryFilter(memberJoinedFilter),
      ]);

      const transactions: Transaction[] = [
        ...contributions.map((event: any) => ({
          id: event.transactionHash,
          type: 'contribution' as const,
          from: event.args.member,
          amount: ethers.formatEther(event.args.amount),
          timestamp: Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000,
          txHash: event.transactionHash,
          status: 'confirmed' as const,
        })),
        ...payouts.map((event: any) => ({
          id: event.transactionHash,
          type: 'payout' as const,
          from: groupId,
          to: event.args.recipient,
          amount: ethers.formatEther(event.args.amount),
          timestamp: Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000,
          txHash: event.transactionHash,
          status: 'confirmed' as const,
        })),
        ...joins.map((event: any) => ({
          id: event.transactionHash,
          type: 'join' as const,
          from: event.args.member,
          timestamp: Number(event.args.timestamp) * 1000,
          txHash: event.transactionHash,
          status: 'confirmed' as const,
        })),
      ];

      return transactions.sort((a, b) => b.timestamp - a.timestamp);
    } catch (error) {
      console.error('Error fetching transaction history:', error);
      return this.getMockTransactions();
    }
  }

  private parseStatus(status: number): 'active' | 'completed' | 'pending' {
    switch (status) {
      case 0: return 'pending';
      case 1: return 'active';
      case 2: return 'completed';
      default: return 'pending';
    }
  }

  // Mock data for development/testing
  private getMockGroupData(groupId: string): GroupData {
    return {
      id: groupId,
      name: "Save Together Group",
      description: "Monthly savings group for our community",
      totalMembers: 10,
      currentMembers: 8,
      contributionAmount: "0.5",
      cycleLength: 2592000, // 30 days in seconds
      currentCycle: 3,
      totalCycles: 10,
      currentCycleStartTime: Date.now() / 1000 - 15 * 24 * 60 * 60,
      nextCycleTime: Date.now() / 1000 + 15 * 24 * 60 * 60,
      totalContributed: "3.5",
      totalRequired: "5.0",
      status: 'active',
      members: [
        {
          address: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
          joinedAt: Date.now() - 90 * 24 * 60 * 60 * 1000,
          hasContributedThisCycle: true,
          totalContributions: "1.5",
          isRecipientThisCycle: false,
        },
        {
          address: "0x1234567890123456789012345678901234567890",
          joinedAt: Date.now() - 85 * 24 * 60 * 60 * 1000,
          hasContributedThisCycle: true,
          totalContributions: "1.5",
          isRecipientThisCycle: true,
          nickname: "Alice",
        },
        {
          address: "0x2345678901234567890123456789012345678901",
          joinedAt: Date.now() - 80 * 24 * 60 * 60 * 1000,
          hasContributedThisCycle: false,
          totalContributions: "1.0",
          isRecipientThisCycle: false,
          nickname: "Bob",
        },
      ],
      creator: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
      contractAddress: groupId,
    };
  }

  private getMockTransactions(): Transaction[] {
    return [
      {
        id: "tx1",
        type: "contribution",
        from: "0x1234567890123456789012345678901234567890",
        amount: "0.5",
        timestamp: Date.now() - 2 * 60 * 60 * 1000,
        txHash: "0xabcdef1234567890",
        status: "confirmed",
      },
      {
        id: "tx2",
        type: "contribution",
        from: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
        amount: "0.5",
        timestamp: Date.now() - 5 * 60 * 60 * 1000,
        txHash: "0xabcdef1234567891",
        status: "confirmed",
      },
      {
        id: "tx3",
        type: "payout",
        from: CONTRACT_ADDRESS,
        to: "0x1234567890123456789012345678901234567890",
        amount: "5.0",
        timestamp: Date.now() - 30 * 24 * 60 * 60 * 1000,
        txHash: "0xabcdef1234567892",
        status: "confirmed",
      },
    ];
  }
}

export const blockchainService = new BlockchainService();