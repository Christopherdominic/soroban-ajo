import * as StellarSdk from 'stellar-sdk'
import { SorobanService, SorobanServiceError } from '../src/services/sorobanService'

// Mock stellar-sdk
jest.mock('stellar-sdk', () => ({
  SorobanRpc: {
    Server: jest.fn().mockImplementation(() => ({
      getAccount: jest.fn(),
      simulateTransaction: jest.fn(),
      sendTransaction: jest.fn(),
      getTransaction: jest.fn(),
    })),
    Api: {
      GetTransactionStatus: {
        NOT_FOUND: 'NOT_FOUND',
        FAILED: 'FAILED',
      },
      isSimulationError: jest.fn(),
      assembleTransaction: jest.fn(),
    },
  },
  TransactionBuilder: {
    fromXDR: jest.fn(),
  },
  Contract: jest.fn(),
  Address: jest.fn().mockImplementation(() => ({
    toScVal: jest.fn(),
  })),
  nativeToScVal: jest.fn(),
  BASE_FEE: '100',
  Networks: {
    TESTNET: 'Test SDF Network ; September 2015',
  },
}))

describe('SorobanService', () => {
  let sorobanService: SorobanService
  let mockServer: any

  beforeEach(() => {
    jest.clearAllMocks()

    // Set environment variables for testing
    process.env.SOROBAN_CONTRACT_ID = 'test-contract-id'
    process.env.SOROBAN_NETWORK_PASSPHRASE = 'Test SDF Network ; September 2015'
    process.env.SOROBAN_RPC_URL = 'https://test-rpc-url'

    sorobanService = new SorobanService()
    mockServer = (StellarSdk.SorobanRpc.Server as jest.Mock).mock.results[0].value
  })

  afterEach(() => {
    delete process.env.SOROBAN_CONTRACT_ID
    delete process.env.SOROBAN_NETWORK_PASSPHRASE
    delete process.env.SOROBAN_RPC_URL
  })

  describe('constructor', () => {
    it('should initialize with environment variables', () => {
      expect(sorobanService).toBeInstanceOf(SorobanService)
    })

    it('should warn when contract ID is not set', () => {
      delete process.env.SOROBAN_CONTRACT_ID
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation()
      new SorobanService()
      expect(consoleSpy).toHaveBeenCalledWith(
        '[SorobanService] SOROBAN_CONTRACT_ID is not set. Contract calls will fail.'
      )
      consoleSpy.mockRestore()
    })
  })

  describe('getAllGroups', () => {
    it('should return paginated groups successfully', async () => {
      const mockScVal = {
        vec: () => [
          {
            map: () => [
              { key: { str: () => 'id' }, val: { str: () => 'group1' } },
              { key: { str: () => 'name' }, val: { str: () => 'Test Group' } },
            ],
          },
        ],
      }

      mockServer.simulateTransaction.mockResolvedValue({
        result: { retval: mockScVal },
      })

      const result = await sorobanService.getAllGroups({ page: 1, limit: 10 })

      expect(result.data).toHaveLength(1)
      expect(result.data[0].id).toBe('group1')
      expect(result.pagination.page).toBe(1)
      expect(result.pagination.limit).toBe(10)
    })

    it('should return empty result when no groups exist', async () => {
      mockServer.simulateTransaction.mockResolvedValue({
        result: { retval: { switch: () => ({ name: 'scvVoid' }) } },
      })

      const result = await sorobanService.getAllGroups({ page: 1, limit: 10 })

      expect(result.data).toHaveLength(0)
      expect(result.pagination.total).toBe(0)
    })

    it('should handle simulation errors', async () => {
      mockServer.simulateTransaction.mockResolvedValue({
        error: 'Simulation failed',
      })

      StellarSdk.SorobanRpc.Api.isSimulationError.mockReturnValue(true)

      await expect(sorobanService.getAllGroups({ page: 1, limit: 10 })).rejects.toThrow(
        SorobanServiceError
      )
    })
  })

  describe('getGroup', () => {
    it('should return a group when found', async () => {
      const mockScVal = {
        map: () => [
          { key: { str: () => 'id' }, val: { str: () => 'group1' } },
          { key: { str: () => 'name' }, val: { str: () => 'Test Group' } },
        ],
      }

      mockServer.simulateTransaction.mockResolvedValue({
        result: { retval: mockScVal },
      })

      const result = await sorobanService.getGroup('group1')

      expect(result).not.toBeNull()
      expect(result!.id).toBe('group1')
      expect(result!.name).toBe('Test Group')
    })

    it('should return null when group not found', async () => {
      mockServer.simulateTransaction.mockResolvedValue({
        result: { retval: { switch: () => ({ name: 'scvVoid' }) } },
      })

      const result = await sorobanService.getGroup('nonexistent')

      expect(result).toBeNull()
    })
  })

  describe('getGroupMembers', () => {
    it('should return group members successfully', async () => {
      const mockScVal = {
        vec: () => [
          {
            map: () => [
              { key: { str: () => 'public_key' }, val: { str: () => 'GUSER123' } },
              { key: { str: () => 'joined_at' }, val: { u32: () => 1640995200 } },
            ],
          },
        ],
      }

      mockServer.simulateTransaction.mockResolvedValue({
        result: { retval: mockScVal },
      })

      const result = await sorobanService.getGroupMembers('group1')

      expect(result).toHaveLength(1)
      expect(result[0].publicKey).toBe('GUSER123')
      expect(result[0].joinedAt).toBe(1640995200)
    })

    it('should return empty array when no members', async () => {
      mockServer.simulateTransaction.mockResolvedValue({
        result: { retval: { switch: () => ({ name: 'scvVoid' }) } },
      })

      const result = await sorobanService.getGroupMembers('group1')

      expect(result).toHaveLength(0)
    })
  })

  describe('getGroupTransactions', () => {
    it('should return paginated transactions successfully', async () => {
      const mockScVal = {
        vec: () => [
          {
            map: () => [
              { key: { str: () => 'id' }, val: { str: () => 'tx1' } },
              { key: { str: () => 'group_id' }, val: { str: () => 'group1' } },
            ],
          },
        ],
      }

      mockServer.simulateTransaction.mockResolvedValue({
        result: { retval: mockScVal },
      })

      const result = await sorobanService.getGroupTransactions('group1', { page: 1, limit: 10 })

      expect(result.data).toHaveLength(1)
      expect(result.data[0].id).toBe('tx1')
      expect(result.data[0].groupId).toBe('group1')
      expect(result.pagination.page).toBe(1)
      expect(result.pagination.limit).toBe(10)
    })
  })

  describe('createGroup', () => {
    it('should return unsigned XDR for phase 1', async () => {
      const groupData = {
        name: 'Test Group',
        description: 'Test Description',
        contributionAmount: '10000000',
        frequency: 'monthly',
        maxMembers: 10,
        adminPublicKey: 'GADMIN123',
      }

      mockServer.getAccount.mockResolvedValue({ accountId: 'GADMIN123' })
      mockServer.simulateTransaction.mockResolvedValue({
        result: { retval: { switch: () => ({ name: 'scvVoid' }) } },
      })

      StellarSdk.SorobanRpc.Api.isSimulationError.mockReturnValue(false)
      StellarSdk.SorobanRpc.Api.assembleTransaction.mockReturnValue({
        build: () => ({ toXDR: () => 'AAAA...' }),
      })

      const result = await sorobanService.createGroup(groupData)

      expect(result.unsignedXdr).toBe('AAAA...')
      expect(result.groupId).toBeUndefined()
      expect(result.txHash).toBeUndefined()
    })

    it('should submit signed XDR for phase 2', async () => {
      const groupData = {
        name: 'Test Group',
        description: 'Test Description',
        contributionAmount: '10000000',
        frequency: 'monthly',
        maxMembers: 10,
        adminPublicKey: 'GADMIN123',
        signedXdr: 'AAAA...',
      }

      mockServer.sendTransaction.mockResolvedValue({
        hash: 'tx123',
        status: 'PENDING',
      })

      mockServer.getTransaction.mockResolvedValue({
        status: StellarSdk.SorobanRpc.Api.GetTransactionStatus.SUCCESS,
        returnValue: { str: () => 'group123' },
      })

      const result = await sorobanService.createGroup(groupData)

      expect(result.groupId).toBe('group123')
      expect(result.txHash).toBe('tx123')
      expect(result.unsignedXdr).toBeUndefined()
    })
  })

  describe('joinGroup', () => {
    it('should return unsigned XDR for phase 1', async () => {
      mockServer.getAccount.mockResolvedValue({ accountId: 'GUSER123' })
      mockServer.simulateTransaction.mockResolvedValue({
        result: { retval: { switch: () => ({ name: 'scvVoid' }) } },
      })

      StellarSdk.SorobanRpc.Api.isSimulationError.mockReturnValue(false)
      StellarSdk.SorobanRpc.Api.assembleTransaction.mockReturnValue({
        build: () => ({ toXDR: () => 'AAAA...' }),
      })

      const result = await sorobanService.joinGroup('group1', 'GUSER123')

      expect(result.unsignedXdr).toBe('AAAA...')
      expect(result.success).toBe(false)
      expect(result.txHash).toBeUndefined()
    })

    it('should submit signed XDR for phase 2', async () => {
      mockServer.sendTransaction.mockResolvedValue({
        hash: 'tx123',
        status: 'PENDING',
      })

      mockServer.getTransaction.mockResolvedValue({
        status: StellarSdk.SorobanRpc.Api.GetTransactionStatus.SUCCESS,
      })

      const result = await sorobanService.joinGroup('group1', 'GUSER123', 'AAAA...')

      expect(result.success).toBe(true)
      expect(result.txHash).toBe('tx123')
      expect(result.unsignedXdr).toBeUndefined()
    })
  })

  describe('contribute', () => {
    it('should return unsigned XDR for phase 1', async () => {
      mockServer.getAccount.mockResolvedValue({ accountId: 'GUSER123' })
      mockServer.simulateTransaction.mockResolvedValue({
        result: { retval: { switch: () => ({ name: 'scvVoid' }) } },
      })

      StellarSdk.SorobanRpc.Api.isSimulationError.mockReturnValue(false)
      StellarSdk.SorobanRpc.Api.assembleTransaction.mockReturnValue({
        build: () => ({ toXDR: () => 'AAAA...' }),
      })

      const result = await sorobanService.contribute('group1', 'GUSER123', '10000000')

      expect(result.unsignedXdr).toBe('AAAA...')
      expect(result.success).toBe(false)
      expect(result.txHash).toBeUndefined()
    })

    it('should submit signed XDR for phase 2', async () => {
      mockServer.sendTransaction.mockResolvedValue({
        hash: 'tx123',
        status: 'PENDING',
      })

      mockServer.getTransaction.mockResolvedValue({
        status: StellarSdk.SorobanRpc.Api.GetTransactionStatus.SUCCESS,
      })

      const result = await sorobanService.contribute('group1', 'GUSER123', '10000000', 'AAAA...')

      expect(result.success).toBe(true)
      expect(result.txHash).toBe('tx123')
      expect(result.unsignedXdr).toBeUndefined()
    })
  })

  describe('error handling', () => {
    it('should handle network errors gracefully', async () => {
      mockServer.simulateTransaction.mockRejectedValue(new Error('Network error'))

      await expect(sorobanService.getGroup('group1')).rejects.toThrow(SorobanServiceError)
    })

    it('should handle transaction timeout', async () => {
      mockServer.sendTransaction.mockResolvedValue({
        hash: 'tx123',
        status: 'PENDING',
      })

      mockServer.getTransaction.mockResolvedValue({
        status: StellarSdk.SorobanRpc.Api.GetTransactionStatus.NOT_FOUND,
      })

      const groupData = {
        name: 'Test Group',
        description: 'Test Description',
        contributionAmount: '10000000',
        frequency: 'monthly',
        maxMembers: 10,
        adminPublicKey: 'GADMIN123',
        signedXdr: 'AAAA...',
      }

      await expect(sorobanService.createGroup(groupData)).rejects.toThrow(
        'Transaction tx123 did not confirm within 30000ms'
      )
    })

    it('should handle failed transactions', async () => {
      mockServer.sendTransaction.mockResolvedValue({
        hash: 'tx123',
        status: 'PENDING',
      })

      mockServer.getTransaction.mockResolvedValue({
        status: StellarSdk.SorobanRpc.Api.GetTransactionStatus.FAILED,
      })

      const groupData = {
        name: 'Test Group',
        description: 'Test Description',
        contributionAmount: '10000000',
        frequency: 'monthly',
        maxMembers: 10,
        adminPublicKey: 'GADMIN123',
        signedXdr: 'AAAA...',
      }

      await expect(sorobanService.createGroup(groupData)).rejects.toThrow(
        'Transaction tx123 failed on-chain'
      )
    })
  })
})
