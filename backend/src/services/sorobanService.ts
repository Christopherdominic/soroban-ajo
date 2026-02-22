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


// Domain types

export interface Group {
  id: string
  name: string
  description: string
  contributionAmount: string // in stroops (1 XLM = 10_000_000)
  frequency: string // e.g. "monthly" | "weekly"
  maxMembers: number
  currentMembers: number
  admin: string // Stellar G-address
  createdAt: number // Unix timestamp (seconds)
  isActive: boolean
}

export interface GroupMember {
  publicKey: string
  joinedAt: number // Unix timestamp
  totalContributed: string // in stroops
  hasReceivedPayout: boolean
}

export interface GroupTransaction {
  id: string
  groupId: string
  publicKey: string
  amount: string // in stroops
  type: 'contribution' | 'payout'
  timestamp: number // Unix timestamp
  ledger: number
}


// Errors


export class SorobanServiceError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly cause?: unknown
  ) {
    super(message)
    this.name = 'SorobanServiceError'
  }
}


// Helpers



  // Applies in-memory pagination to a dataset.
  // Swap for native contract-level cursors once the contract supports them.
 
function paginate<T>(items: T[], { page, limit }: PaginationParams): PaginatedResult<T> {
  const total = items.length
  const totalPages = Math.ceil(total / limit) || 0
  const offset = (page - 1) * limit

  return {
    data: items.slice(offset, offset + limit),
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
  }
}


  // Polls the RPC node until the submitted transaction reaches a terminal
  //  status (SUCCESS | FAILED) or the timeout elapses.
 
async function pollForConfirmation(
  server: StellarSdk.SorobanRpc.Server,
  hash: string,
  timeoutMs = 30_000,
  intervalMs = 2_000
): Promise<StellarSdk.SorobanRpc.Api.GetTransactionResponse> {
  const deadline = Date.now() + timeoutMs

  while (Date.now() < deadline) {
    const response = await server.getTransaction(hash)

    if (response.status !== StellarSdk.SorobanRpc.Api.GetTransactionStatus.NOT_FOUND) {
      return response
    }

    await new Promise((resolve) => setTimeout(resolve, intervalMs))
  }

  throw new SorobanServiceError(
    `Transaction ${hash} did not confirm within ${timeoutMs}ms`,
    'TX_TIMEOUT'
  )
}

  //  Decodes a single ScVal into a plain string.
  //  Handles the most common Soroban scalar types.
 
function scValToString(val: StellarSdk.xdr.ScVal): string {
  switch (val.switch().name) {
    case 'scvString':
      return val.str().toString()
    case 'scvSymbol':
      return val.sym().toString()
    case 'scvBool':
      return String(val.b())
    case 'scvU32':
      return String(val.u32())
    case 'scvU64':
      return val.u64().toString()
    case 'scvI128':
      return val.i128().lo().toString()
    case 'scvAddress':
      return StellarSdk.Address.fromScVal(val).toString()
    default:
      return val.toXDR('base64')
  }
}

/**
 * Converts a Soroban ScVal map returned by the contract into a plain
 * Record<string, string> for easy destructuring.
 */
function decodeScMap(scVal: StellarSdk.xdr.ScVal): Record<string, string> {
  const result: Record<string, string> = {}
  const entries = scVal.map()
  if (!entries) return result

  for (const entry of entries) {
    const key = entry.key().str()?.toString() ?? entry.key().sym()?.toString() ?? ''
    result[key] = scValToString(entry.val())
  }

  return result
}

/** Maps a decoded contract map to our Group domain type. */
function mapToGroup(raw: Record<string, string>, id: string): Group {
  return {
    id,
    name: raw.name ?? '',
    description: raw.description ?? '',
    contributionAmount: raw.contribution_amount ?? '0',
    frequency: raw.frequency ?? '',
    maxMembers: Number(raw.max_members ?? 0),
    currentMembers: Number(raw.current_members ?? 0),
    admin: raw.admin ?? '',
    createdAt: Number(raw.created_at ?? 0),
    isActive: raw.is_active === 'true',
  }
}

/** Maps a decoded contract map to our GroupMember domain type. */
function mapToMember(raw: Record<string, string>): GroupMember {
  return {
    publicKey: raw.public_key ?? '',
    joinedAt: Number(raw.joined_at ?? 0),
    totalContributed: raw.total_contributed ?? '0',
    hasReceivedPayout: raw.has_received_payout === 'true',
  }
}

/** Maps a decoded contract map to our GroupTransaction domain type. */
function mapToTransaction(raw: Record<string, string>): GroupTransaction {
  return {
    id: raw.id ?? '',
    groupId: raw.group_id ?? '',
    publicKey: raw.public_key ?? '',
    amount: raw.amount ?? '0',
    type: (raw.type as GroupTransaction['type']) ?? 'contribution',
    timestamp: Number(raw.timestamp ?? 0),
    ledger: Number(raw.ledger ?? 0),
  }
}


// Service


export class SorobanService {
  private readonly server: StellarSdk.SorobanRpc.Server
  private readonly contractId: string
  private readonly networkPassphrase: string
  private readonly contract: StellarSdk.Contract

  constructor() {
    this.contractId = process.env.SOROBAN_CONTRACT_ID || ''
    this.networkPassphrase = process.env.SOROBAN_NETWORK_PASSPHRASE || StellarSdk.Networks.TESTNET

    const rpcUrl = process.env.SOROBAN_RPC_URL || 'https://soroban-testnet.stellar.org'

    this.server = new StellarSdk.SorobanRpc.Server(rpcUrl)
    this.contract = new StellarSdk.Contract(this.contractId)

    if (!this.contractId) {
      console.warn('[SorobanService] SOROBAN_CONTRACT_ID is not set. Contract calls will fail.')
    }
  }

  // READ methods — simulation only, no fee or signature required

  /**
   * Fetches every group from the contract (`get_all_groups`) and returns
   * a paginated slice.
   */
  async getAllGroups(pagination: PaginationParams): Promise<PaginatedResult<Group>> {
    const scVal = await this.simulateView('get_all_groups', [])

    if (!scVal || scVal.switch().name === 'scvVoid') {
      return paginate([], pagination)
    }

    const groups: Group[] = (scVal.vec() ?? []).map((item, i) => {
      const raw = decodeScMap(item)
      return mapToGroup(raw, raw.id || String(i))
    })

    return paginate(groups, pagination)
  }

  /**
   * Fetches a single group by ID from the contract (`get_group`).
   * Returns null when the group does not exist.
   */
  async getGroup(groupId: string): Promise<Group | null> {
    const args = [StellarSdk.nativeToScVal(groupId, { type: 'string' })]
    const scVal = await this.simulateView('get_group', args)

    if (!scVal || scVal.switch().name === 'scvVoid') {
      return null
    }

    return mapToGroup(decodeScMap(scVal), groupId)
  }

  /**
   * Fetches all members of a group from the contract (`get_group_members`).
   */
  async getGroupMembers(groupId: string): Promise<GroupMember[]> {
    const args = [StellarSdk.nativeToScVal(groupId, { type: 'string' })]
    const scVal = await this.simulateView('get_group_members', args)

    if (!scVal || scVal.switch().name === 'scvVoid') {
      return []
    }

    return (scVal.vec() ?? []).map((item) => mapToMember(decodeScMap(item)))
  }

  /**
   * Fetches all transactions for a group (`get_group_transactions`) and
   * returns a paginated slice.
   */
  async getGroupTransactions(
    groupId: string,
    pagination: PaginationParams
  ): Promise<PaginatedResult<GroupTransaction>> {
    const args = [StellarSdk.nativeToScVal(groupId, { type: 'string' })]
    const scVal = await this.simulateView('get_group_transactions', args)

    if (!scVal || scVal.switch().name === 'scvVoid') {
      return paginate([], pagination)
    }

    const txs: GroupTransaction[] = (scVal.vec() ?? []).map((item) =>
      mapToTransaction(decodeScMap(item))
    )

    return paginate(txs, pagination)
  }

  // WRITE methods — client-signs / server-submits pattern
  //
  // Two-phase flow:
  //   Phase 1 — Client requests unsigned XDR:
  //     POST /api/groups          { name, ..., adminPublicKey }
  //     → 200 { unsignedXdr: "AAAA..." }
  //
  //   Phase 2 — Client signs with their wallet and re-submits:
  //     POST /api/groups          { ..., signedXdr: "AAAA..." }
  //     → 201 { groupId, txHash }
  //
  // Secret keys NEVER leave the client. The server only handles XDR blobs.

  /**
   * Creates a new Ajo group.
   *
   * - Without `signedXdr`: builds + simulates the transaction and returns
   *   unsigned XDR for the client wallet to sign.
   * - With `signedXdr`: submits it, waits for confirmation, and returns
   *   the new group ID and transaction hash.
   */
  async createGroup(groupData: {
    name: string
    description: string
    contributionAmount: string // stroops
    frequency: string
    maxMembers: number
    adminPublicKey: string
    signedXdr?: string
  }): Promise<{ groupId?: string; txHash?: string; unsignedXdr?: string }> {
    const {
      name,
      description,
      contributionAmount,
      frequency,
      maxMembers,
      adminPublicKey,
      signedXdr,
    } = groupData

    if (signedXdr) {
      const { hash, result } = await this.submitSignedXdr(signedXdr)
      const groupId =
        result.returnValue?.str()?.toString() ?? result.returnValue?.sym()?.toString() ?? hash
      return { groupId, txHash: hash }
    }

    const args: StellarSdk.xdr.ScVal[] = [
      StellarSdk.nativeToScVal(name, { type: 'string' }),
      StellarSdk.nativeToScVal(description, { type: 'string' }),
      StellarSdk.nativeToScVal(BigInt(contributionAmount), { type: 'i128' }),
      StellarSdk.nativeToScVal(frequency, { type: 'string' }),
      StellarSdk.nativeToScVal(maxMembers, { type: 'u32' }),
      new StellarSdk.Address(adminPublicKey).toScVal(),
    ]

    const unsignedXdr = await this.buildUnsignedTransaction(adminPublicKey, 'create_group', args)
    return { unsignedXdr }
  }

  /**
   * Joins an existing group.
   *
   * - Without `signedXdr`: returns unsigned XDR for the wallet to sign.
   * - With `signedXdr`: submits and returns the transaction hash.
   */
  async joinGroup(
    groupId: string,
    publicKey: string,
    signedXdr?: string
  ): Promise<{ success: boolean; txHash?: string; unsignedXdr?: string }> {
    if (signedXdr) {
      const { hash } = await this.submitSignedXdr(signedXdr)
      return { success: true, txHash: hash }
    }

    const args: StellarSdk.xdr.ScVal[] = [
      StellarSdk.nativeToScVal(groupId, { type: 'string' }),
      new StellarSdk.Address(publicKey).toScVal(),
    ]

    const unsignedXdr = await this.buildUnsignedTransaction(publicKey, 'join_group', args)
    return { success: false, unsignedXdr }
  }

  /**
   * Submits a member contribution.
   * `amount` must be in stroops (1 XLM = 10_000_000 stroops).
   *
   * - Without `signedXdr`: returns unsigned XDR for the wallet to sign.
   * - With `signedXdr`: submits and returns the transaction hash.
   */
  async contribute(
    groupId: string,
    publicKey: string,
    amount: string,
    signedXdr?: string
  ): Promise<{ success: boolean; txHash?: string; unsignedXdr?: string }> {
    if (signedXdr) {
      const { hash } = await this.submitSignedXdr(signedXdr)
      return { success: true, txHash: hash }
    }

    const args: StellarSdk.xdr.ScVal[] = [
      StellarSdk.nativeToScVal(groupId, { type: 'string' }),
      new StellarSdk.Address(publicKey).toScVal(),
      StellarSdk.nativeToScVal(BigInt(amount), { type: 'i128' }),
    ]

    const unsignedXdr = await this.buildUnsignedTransaction(publicKey, 'contribute', args)
    return { success: false, unsignedXdr }
  }

  // Private helpers

  /**
   * Runs a read-only simulation against the contract.
   * No ledger state is changed; no fee is charged.
   */
  private async simulateView(
    method: string,
    args: StellarSdk.xdr.ScVal[]
  ): Promise<StellarSdk.xdr.ScVal | null> {
    try {
      // Simulation requires any funded account as the source.
      // Uses SOROBAN_SIMULATION_ACCOUNT from .env (add this to .env.example).
      const simulationSource =
        process.env.SOROBAN_SIMULATION_ACCOUNT ||
        'GAAZI4TCR3TY5OJHCTJC2A4QSY6CJWJH5IAJTGKIN2ER7LBNVKOCCWN'

      const account = await this.server.getAccount(simulationSource)

      const tx = new StellarSdk.TransactionBuilder(account, {
        fee: StellarSdk.BASE_FEE,
        networkPassphrase: this.networkPassphrase,
      })
        .addOperation(this.contract.call(method, ...args))
        .setTimeout(30)
        .build()

      const simResult = await this.server.simulateTransaction(tx)

      if (StellarSdk.SorobanRpc.Api.isSimulationError(simResult)) {
        throw new SorobanServiceError(
          `Simulation failed for ${method}: ${simResult.error}`,
          'SIMULATION_ERROR'
        )
      }

      return (
        (simResult as StellarSdk.SorobanRpc.Api.SimulateTransactionSuccessResponse).result
          ?.retval ?? null
      )
    } catch (error) {
      if (error instanceof SorobanServiceError) throw error
      throw new SorobanServiceError(`Failed to simulate ${method}`, 'SIMULATION_ERROR', error)
    }
  }

  /**
   * Builds a transaction, simulates it to obtain the Soroban resource
   * footprint and fee estimate, assembles the final transaction, and
   * returns it as a base64 XDR string ready for the client to sign.
   */
  private async buildUnsignedTransaction(
    sourcePublicKey: string,
    method: string,
    args: StellarSdk.xdr.ScVal[]
  ): Promise<string> {
    try {
      const account = await this.server.getAccount(sourcePublicKey)

      const tx = new StellarSdk.TransactionBuilder(account, {
        fee: StellarSdk.BASE_FEE,
        networkPassphrase: this.networkPassphrase,
      })
        .addOperation(this.contract.call(method, ...args))
        .setTimeout(300) // 5 min window for the client to sign
        .build()

      const simResult = await this.server.simulateTransaction(tx)

      if (StellarSdk.SorobanRpc.Api.isSimulationError(simResult)) {
        throw new SorobanServiceError(
          `Simulation failed for ${method}: ${simResult.error}`,
          'SIMULATION_ERROR'
        )
      }

      // assembleTransaction injects auth entries and adjusts the resource fee
      const assembled = StellarSdk.SorobanRpc.assembleTransaction(
        tx,
        simResult as StellarSdk.SorobanRpc.Api.SimulateTransactionSuccessResponse
      ).build()

      return assembled.toXDR()
    } catch (error) {
      if (error instanceof SorobanServiceError) throw error
      throw new SorobanServiceError(
        `Failed to build transaction for ${method}`,
        'BUILD_ERROR',
        error
      )
    }
  }

  /**
   * Accepts a base64-encoded signed XDR from the client, submits it to
   * the network, polls until confirmation, and returns the hash and the
   * full confirmed transaction response.
   */
  private async submitSignedXdr(signedXdr: string): Promise<{
    hash: string
    result: StellarSdk.SorobanRpc.Api.GetSuccessfulTransactionResponse
  }> {
    try {
      const tx = StellarSdk.TransactionBuilder.fromXDR(signedXdr, this.networkPassphrase)

      const sendResponse = await this.server.sendTransaction(tx)

      if (sendResponse.status === 'ERROR') {
        throw new SorobanServiceError(
          `Submission rejected: ${sendResponse.errorResult?.toXDR('base64') ?? 'unknown'}`,
          'SUBMISSION_ERROR'
        )
      }

      const confirmed = await pollForConfirmation(this.server, sendResponse.hash)

      if (confirmed.status === StellarSdk.SorobanRpc.Api.GetTransactionStatus.FAILED) {
        throw new SorobanServiceError(
          `Transaction ${sendResponse.hash} failed on-chain`,
          'TX_FAILED'
        )
      }

      return {
        hash: sendResponse.hash,
        result: confirmed as StellarSdk.SorobanRpc.Api.GetSuccessfulTransactionResponse,
      }
    } catch (error) {
      if (error instanceof SorobanServiceError) throw error
      throw new SorobanServiceError(
        'Failed to submit signed transaction',
        'SUBMISSION_ERROR',
        error
      )
    }
  }
}
