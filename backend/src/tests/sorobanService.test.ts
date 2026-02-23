import { SorobanService } from '../services/sorobanService'
import * as StellarSdk from 'stellar-sdk'

// Mock stellar-sdk
const mockScValToNative = jest.fn();
const mockNativeToScVal = jest.fn();

jest.mock('stellar-sdk', () => {
    const actual = jest.requireActual('stellar-sdk')
    const mockServerInstance = {
        getAccount: jest.fn().mockResolvedValue({}),
        simulateTransaction: jest.fn(),
        sendTransaction: jest.fn(),
        getTransaction: jest.fn(),
    }
    const MockServer = jest.fn().mockImplementation(() => mockServerInstance)

    return {
        ...actual,
        scValToNative: (val: any) => mockScValToNative(val),
        nativeToScVal: (val: any, options: any) => mockNativeToScVal(val, options),
        rpc: {
            ...actual.rpc,
            Server: MockServer,
            Api: {
                ...actual.rpc.Api,
                isSimulationSuccess: jest.fn(),
                GetTransactionStatus: {
                    NOT_FOUND: 'NOT_FOUND',
                    SUCCESS: 'SUCCESS',
                }
            }
        },
        SorobanRpc: {
            Server: MockServer,
        },
        Contract: jest.fn().mockImplementation(() => ({
            call: jest.fn(),
        })),
        TransactionBuilder: jest.fn().mockImplementation(() => ({
            addOperation: jest.fn().mockReturnThis(),
            setTimeout: jest.fn().mockReturnThis(),
            build: jest.fn().mockReturnThis(),
        })),
    }
})

describe('SorobanService', () => {
    let service: SorobanService
    let mockServer: any

    beforeAll(() => {
        process.env.SOROBAN_CONTRACT_ID = 'CCG6KKK...';
    });

    beforeEach(() => {
        jest.clearAllMocks()
        service = new SorobanService()
        mockServer = (service as any).server

        // Setup default mock behaviors
        mockScValToNative.mockReset();
        mockNativeToScVal.mockReset();
    })

    describe('getGroup', () => {
        it('should return parsed group data on success', async () => {
            const mockGroup = { id: 1, name: 'Test Group' }
            const mockSimulation = {
                result: { retval: 'mock_sc_val' }
            }

                ; (StellarSdk.rpc.Api.isSimulationSuccess as any).mockReturnValue(true)
            mockServer.simulateTransaction.mockResolvedValue(mockSimulation)
            mockScValToNative.mockReturnValue(mockGroup)

            const result = await service.getGroup('1')
            expect(result).toEqual(mockGroup)
            expect(mockScValToNative).toHaveBeenCalledWith('mock_sc_val')
        })

        it('should return null on simulation failure', async () => {
            ; (StellarSdk.rpc.Api.isSimulationSuccess as any).mockReturnValue(false)
            mockServer.simulateTransaction.mockResolvedValue({})

            const result = await service.getGroup('1')
            expect(result).toBeNull()
        })
    })

    describe('getAllGroups', () => {
        it('should paginate groups correctly', async () => {
            const group1 = { id: 1, name: 'Group 1' }
            const group2 = { id: 2, name: 'Group 2' }

            jest.spyOn(service, 'getGroup')
                .mockResolvedValueOnce(group1)
                .mockResolvedValueOnce(group2)
                .mockResolvedValueOnce(null)

            const result = await service.getAllGroups({ page: 1, limit: 10 })

            expect(result.data).toHaveLength(2)
            expect(result.data[0]).toEqual(group1)
            expect(result.data[1]).toEqual(group2)
        })
    })

    describe('getGroupMembers', () => {
        it('should return an array of members', async () => {
            const mockMembers = ['Address1', 'Address2']
            const mockSimulation = {
                result: { retval: 'mock_sc_val' }
            }

                ; (StellarSdk.rpc.Api.isSimulationSuccess as any).mockReturnValue(true)
            mockServer.simulateTransaction.mockResolvedValue(mockSimulation)
            mockScValToNative.mockReturnValue(mockMembers)

            const result = await service.getGroupMembers('1')
            expect(result).toEqual(mockMembers)
        })
    })
})
