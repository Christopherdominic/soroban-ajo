import * as StellarSdk from 'stellar-sdk'

export interface PaginationParams {
  page: number
  limit: number
}

export interface PaginatedResult<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNextPage: boolean
    hasPrevPage: boolean
  }
}


// Applies in-memory pagination to a dataset.
// Replace this with native contract-level pagination once the Soroban contract supports it.

function paginate<T>(items: T[], { page, limit }: PaginationParams): PaginatedResult<T> {
  const total = items.length
  const totalPages = Math.ceil(total / limit)
  const offset = (page - 1) * limit
  const data = items.slice(offset, offset + limit);

  const paginate_d = {
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
  }

  return paginate_d
}

export class SorobanService {
  private server: StellarSdk.SorobanRpc.Server
  private contractId: string
  private networkPassphrase: string

  constructor() {
    this.contractId = process.env.SOROBAN_CONTRACT_ID || ''
    this.networkPassphrase = process.env.SOROBAN_NETWORK_PASSPHRASE || StellarSdk.Networks.TESTNET

    const rpcUrl = process.env.SOROBAN_RPC_URL || 'https://soroban-testnet.stellar.org'
    this.server = new StellarSdk.SorobanRpc.Server(rpcUrl)
  }

  /**
   * Fetches all groups from the contract and returns a paginated slice.
   * Note: Since Soroban doesn't support list operations natively, we iterate through IDs.
   */
  async getAllGroups(pagination: PaginationParams): Promise<PaginatedResult<any>> {
    const { page, limit } = pagination
    const allGroups: any[] = []

    // We try to fetch groups starting from ID 1 (based on contract logic)
    // In a real production environment, we would use an indexer.
    // For this implementation, we fetch a reasonable range or until we hit enough errors.
    let currentId = 1
    let consecutivelyMissing = 0
    const MAX_MISSING = 3 // Stop after 3 consecutive missing groups

    while (consecutivelyMissing < MAX_MISSING && allGroups.length < page * limit) {
      try {
        const group = await this.getGroup(currentId.toString())
        if (group) {
          allGroups.push(group)
          consecutivelyMissing = 0
        } else {
          consecutivelyMissing++
        }
      } catch (err) {
        consecutivelyMissing++
      }
      currentId++
    }

    return paginate(allGroups, pagination)
  }

  async getGroup(groupId: string) {
    return this.simulateCall('get_group', [StellarSdk.nativeToScVal(parseInt(groupId, 10), { type: 'u64' })])
  }

  async createGroup(groupData: any) {
    // This would typically involve building a transaction for the client to sign,
    // or signing with a backend account if authorized.
    console.log('Backend createGroup called with:', groupData)
    return { groupId: 'simulation_only' }
  }

  async joinGroup(groupId: string, publicKey: string) {
    console.log('Backend joinGroup called for:', groupId, 'by', publicKey)
    return { success: true }
  }

  async contribute(groupId: string, publicKey: string, amount: string) {
    console.log('Backend contribute called for:', groupId, 'by', publicKey, 'amount', amount)
    return { success: true, transactionId: 'simulation_only' }
  }

  async getGroupMembers(groupId: string) {
    const result = await this.simulateCall('list_members', [StellarSdk.nativeToScVal(parseInt(groupId, 10), { type: 'u64' })])
    return result || []
  }

  async getGroupStatus(groupId: string) {
    return this.simulateCall('get_group_status', [StellarSdk.nativeToScVal(parseInt(groupId, 10), { type: 'u64' })])
  }

  async getGroupTransactions(
    _groupId: string,
    pagination: PaginationParams
  ): Promise<PaginatedResult<any>> {
    // Contract events would be used here. For now, we return empty.
    const allTransactions: any[] = []
    return paginate(allTransactions, pagination)
  }

  private async simulateCall(functionName: string, args: StellarSdk.xdr.ScVal[] = []) {
    if (!this.contractId) throw new Error('SOROBAN_CONTRACT_ID is not configured')

    const contract = new StellarSdk.Contract(this.contractId)
    const call = contract.call(functionName, ...args)

    // Use a random/dummy account for simulation
    const dummyAccount = await this.server.getAccount('GAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWHF')

    const tx = new StellarSdk.TransactionBuilder(dummyAccount, {
      fee: '100',
      networkPassphrase: this.networkPassphrase
    })
      .addOperation(call)
      .setTimeout(30)
      .build()

    const simulation = await this.server.simulateTransaction(tx)

    if (StellarSdk.rpc.Api.isSimulationSuccess(simulation) && simulation.result) {
      return StellarSdk.scValToNative(simulation.result.retval)
    }

    return null
  }
}
