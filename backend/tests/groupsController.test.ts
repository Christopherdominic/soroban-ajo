import { NextFunction, Request, Response } from 'express'
import { GroupsController } from '../src/controllers/groupsController'
import {
  Group,
  GroupMember,
  GroupTransaction,
  PaginatedResult,
  SorobanService,
} from '../src/services/sorobanService'

// Mock the SorobanService
jest.mock('../src/services/sorobanService')
const MockedSorobanService = SorobanService as jest.MockedClass<typeof SorobanService>

describe('GroupsController', () => {
  let groupsController: GroupsController
  let mockRequest: Partial<Request>
  let mockResponse: Partial<Response>
  let mockNext: NextFunction

  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks()

    // Create controller instance
    groupsController = new GroupsController()

    // Mock request, response, and next function
    mockRequest = {}
    mockResponse = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    }
    mockNext = jest.fn()
  })

  describe('listGroups', () => {
    it('should return paginated groups successfully', async () => {
      // Arrange
      const mockGroups: Group[] = [
        {
          id: 'group1',
          name: 'Test Group 1',
          description: 'Description 1',
          contributionAmount: '10000000',
          frequency: 'monthly',
          maxMembers: 10,
          currentMembers: 5,
          admin: 'GADMIN123',
          createdAt: 1640995200,
          isActive: true,
        },
        {
          id: 'group2',
          name: 'Test Group 2',
          description: 'Description 2',
          contributionAmount: '20000000',
          frequency: 'weekly',
          maxMembers: 20,
          currentMembers: 8,
          admin: 'GADMIN456',
          createdAt: 1641081600,
          isActive: true,
        },
      ]

      const mockPaginatedResult: PaginatedResult<Group> = {
        data: mockGroups,
        pagination: {
          page: 1,
          limit: 20,
          total: 2,
          totalPages: 1,
          hasNextPage: false,
          hasPrevPage: false,
        },
      }

      mockRequest.query = { page: '1', limit: '20' }
      MockedSorobanService.prototype.getAllGroups.mockResolvedValue(mockPaginatedResult)

      // Act
      await groupsController.listGroups(mockRequest as Request, mockResponse as Response, mockNext)

      // Assert
      expect(MockedSorobanService.prototype.getAllGroups).toHaveBeenCalledWith({
        page: 1,
        limit: 20,
      })
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: mockGroups,
        pagination: mockPaginatedResult.pagination,
      })
      expect(mockNext).not.toHaveBeenCalled()
    })

    it('should use default pagination when query params are missing', async () => {
      // Arrange
      const mockPaginatedResult: PaginatedResult<Group> = {
        data: [],
        pagination: {
          page: 1,
          limit: 20,
          total: 0,
          totalPages: 0,
          hasNextPage: false,
          hasPrevPage: false,
        },
      }

      mockRequest.query = {}
      MockedSorobanService.prototype.getAllGroups.mockResolvedValue(mockPaginatedResult)

      // Act
      await groupsController.listGroups(mockRequest as Request, mockResponse as Response, mockNext)

      // Assert
      expect(MockedSorobanService.prototype.getAllGroups).toHaveBeenCalledWith({
        page: 1,
        limit: 20,
      })
    })

    it('should handle invalid pagination params gracefully', async () => {
      // Arrange
      const mockPaginatedResult: PaginatedResult<Group> = {
        data: [],
        pagination: {
          page: 1,
          limit: 20,
          total: 0,
          totalPages: 0,
          hasNextPage: false,
          hasPrevPage: false,
        },
      }

      mockRequest.query = { page: 'invalid', limit: '200' }
      MockedSorobanService.prototype.getAllGroups.mockResolvedValue(mockPaginatedResult)

      // Act
      await groupsController.listGroups(mockRequest as Request, mockResponse as Response, mockNext)

      // Assert
      expect(MockedSorobanService.prototype.getAllGroups).toHaveBeenCalledWith({
        page: 1,
        limit: 100, // Should be capped at MAX_LIMIT
      })
    })

    it('should call next when service throws an error', async () => {
      // Arrange
      const error = new Error('Service error')
      mockRequest.query = {}
      MockedSorobanService.prototype.getAllGroups.mockRejectedValue(error)

      // Act
      await groupsController.listGroups(mockRequest as Request, mockResponse as Response, mockNext)

      // Assert
      expect(mockNext).toHaveBeenCalledWith(error)
      expect(mockResponse.json).not.toHaveBeenCalled()
    })
  })

  describe('getGroup', () => {
    it('should return a group when found', async () => {
      // Arrange
      const mockGroup: Group = {
        id: 'group1',
        name: 'Test Group',
        description: 'Test Description',
        contributionAmount: '10000000',
        frequency: 'monthly',
        maxMembers: 10,
        currentMembers: 5,
        admin: 'GADMIN123',
        createdAt: 1640995200,
        isActive: true,
      }

      mockRequest.params = { id: 'group1' }
      MockedSorobanService.prototype.getGroup.mockResolvedValue(mockGroup)

      // Act
      await groupsController.getGroup(mockRequest as Request, mockResponse as Response, mockNext)

      // Assert
      expect(MockedSorobanService.prototype.getGroup).toHaveBeenCalledWith('group1')
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: mockGroup,
      })
      expect(mockNext).not.toHaveBeenCalled()
    })

    it('should return 404 when group is not found', async () => {
      // Arrange
      mockRequest.params = { id: 'nonexistent' }
      MockedSorobanService.prototype.getGroup.mockResolvedValue(null)

      // Act
      await groupsController.getGroup(mockRequest as Request, mockResponse as Response, mockNext)

      // Assert
      expect(MockedSorobanService.prototype.getGroup).toHaveBeenCalledWith('nonexistent')
      expect(mockResponse.status).toHaveBeenCalledWith(404)
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        error: 'Group not found',
      })
      expect(mockNext).not.toHaveBeenCalled()
    })

    it('should call next when service throws an error', async () => {
      // Arrange
      const error = new Error('Service error')
      mockRequest.params = { id: 'group1' }
      MockedSorobanService.prototype.getGroup.mockRejectedValue(error)

      // Act
      await groupsController.getGroup(mockRequest as Request, mockResponse as Response, mockNext)

      // Assert
      expect(mockNext).toHaveBeenCalledWith(error)
      expect(mockResponse.json).not.toHaveBeenCalled()
    })
  })

  describe('createGroup', () => {
    it('should return unsigned XDR for phase 1 (no signedXdr)', async () => {
      // Arrange
      const groupData = {
        name: 'New Group',
        description: 'New Description',
        contributionAmount: '10000000',
        frequency: 'monthly',
        maxMembers: 10,
        adminPublicKey: 'GADMIN123',
      }

      const mockResult = { unsignedXdr: 'AAAA...' }
      mockRequest.body = groupData
      MockedSorobanService.prototype.createGroup.mockResolvedValue(mockResult)

      // Act
      await groupsController.createGroup(mockRequest as Request, mockResponse as Response, mockNext)

      // Assert
      expect(MockedSorobanService.prototype.createGroup).toHaveBeenCalledWith(groupData)
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: mockResult,
      })
      expect(mockNext).not.toHaveBeenCalled()
    })

    it('should return 201 for phase 2 (with signedXdr)', async () => {
      // Arrange
      const groupData = {
        name: 'New Group',
        description: 'New Description',
        contributionAmount: '10000000',
        frequency: 'monthly',
        maxMembers: 10,
        adminPublicKey: 'GADMIN123',
        signedXdr: 'AAAA...',
      }

      const mockResult = { groupId: 'group123', txHash: 'hash123' }
      mockRequest.body = groupData
      MockedSorobanService.prototype.createGroup.mockResolvedValue(mockResult)

      // Act
      await groupsController.createGroup(mockRequest as Request, mockResponse as Response, mockNext)

      // Assert
      expect(MockedSorobanService.prototype.createGroup).toHaveBeenCalledWith(groupData)
      expect(mockResponse.status).toHaveBeenCalledWith(201)
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: mockResult,
      })
      expect(mockNext).not.toHaveBeenCalled()
    })

    it('should call next when service throws an error', async () => {
      // Arrange
      const error = new Error('Service error')
      mockRequest.body = {}
      MockedSorobanService.prototype.createGroup.mockRejectedValue(error)

      // Act
      await groupsController.createGroup(mockRequest as Request, mockResponse as Response, mockNext)

      // Assert
      expect(mockNext).toHaveBeenCalledWith(error)
      expect(mockResponse.json).not.toHaveBeenCalled()
    })
  })

  describe('joinGroup', () => {
    it('should return unsigned XDR when no signedXdr provided', async () => {
      // Arrange
      const joinData = {
        publicKey: 'GUSER123',
      }

      const mockResult = { success: false, unsignedXdr: 'AAAA...' }
      mockRequest.params = { id: 'group1' }
      mockRequest.body = joinData
      MockedSorobanService.prototype.joinGroup.mockResolvedValue(mockResult)

      // Act
      await groupsController.joinGroup(mockRequest as Request, mockResponse as Response, mockNext)

      // Assert
      expect(MockedSorobanService.prototype.joinGroup).toHaveBeenCalledWith(
        'group1',
        'GUSER123',
        undefined
      )
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: mockResult,
      })
      expect(mockNext).not.toHaveBeenCalled()
    })

    it('should submit transaction when signedXdr provided', async () => {
      // Arrange
      const joinData = {
        publicKey: 'GUSER123',
        signedXdr: 'AAAA...',
      }

      const mockResult = { success: true, txHash: 'hash123' }
      mockRequest.params = { id: 'group1' }
      mockRequest.body = joinData
      MockedSorobanService.prototype.joinGroup.mockResolvedValue(mockResult)

      // Act
      await groupsController.joinGroup(mockRequest as Request, mockResponse as Response, mockNext)

      // Assert
      expect(MockedSorobanService.prototype.joinGroup).toHaveBeenCalledWith(
        'group1',
        'GUSER123',
        'AAAA...'
      )
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: mockResult,
      })
      expect(mockNext).not.toHaveBeenCalled()
    })

    it('should call next when service throws an error', async () => {
      // Arrange
      const error = new Error('Service error')
      mockRequest.params = { id: 'group1' }
      mockRequest.body = {}
      MockedSorobanService.prototype.joinGroup.mockRejectedValue(error)

      // Act
      await groupsController.joinGroup(mockRequest as Request, mockResponse as Response, mockNext)

      // Assert
      expect(mockNext).toHaveBeenCalledWith(error)
      expect(mockResponse.json).not.toHaveBeenCalled()
    })
  })

  describe('contribute', () => {
    it('should return unsigned XDR when no signedXdr provided', async () => {
      // Arrange
      const contributeData = {
        amount: '10000000',
        publicKey: 'GUSER123',
      }

      const mockResult = { success: false, unsignedXdr: 'AAAA...' }
      mockRequest.params = { id: 'group1' }
      mockRequest.body = contributeData
      MockedSorobanService.prototype.contribute.mockResolvedValue(mockResult)

      // Act
      await groupsController.contribute(mockRequest as Request, mockResponse as Response, mockNext)

      // Assert
      expect(MockedSorobanService.prototype.contribute).toHaveBeenCalledWith(
        'group1',
        'GUSER123',
        '10000000',
        undefined
      )
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: mockResult,
      })
      expect(mockNext).not.toHaveBeenCalled()
    })

    it('should submit transaction when signedXdr provided', async () => {
      // Arrange
      const contributeData = {
        amount: '10000000',
        publicKey: 'GUSER123',
        signedXdr: 'AAAA...',
      }

      const mockResult = { success: true, txHash: 'hash123' }
      mockRequest.params = { id: 'group1' }
      mockRequest.body = contributeData
      MockedSorobanService.prototype.contribute.mockResolvedValue(mockResult)

      // Act
      await groupsController.contribute(mockRequest as Request, mockResponse as Response, mockNext)

      // Assert
      expect(MockedSorobanService.prototype.contribute).toHaveBeenCalledWith(
        'group1',
        'GUSER123',
        '10000000',
        'AAAA...'
      )
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: mockResult,
      })
      expect(mockNext).not.toHaveBeenCalled()
    })

    it('should call next when service throws an error', async () => {
      // Arrange
      const error = new Error('Service error')
      mockRequest.params = { id: 'group1' }
      mockRequest.body = {}
      MockedSorobanService.prototype.contribute.mockRejectedValue(error)

      // Act
      await groupsController.contribute(mockRequest as Request, mockResponse as Response, mockNext)

      // Assert
      expect(mockNext).toHaveBeenCalledWith(error)
      expect(mockResponse.json).not.toHaveBeenCalled()
    })
  })

  describe('getMembers', () => {
    it('should return group members successfully', async () => {
      // Arrange
      const mockMembers: GroupMember[] = [
        {
          publicKey: 'GUSER123',
          joinedAt: 1640995200,
          totalContributed: '10000000',
          hasReceivedPayout: false,
        },
        {
          publicKey: 'GUSER456',
          joinedAt: 1641081600,
          totalContributed: '20000000',
          hasReceivedPayout: true,
        },
      ]

      mockRequest.params = { id: 'group1' }
      MockedSorobanService.prototype.getGroupMembers.mockResolvedValue(mockMembers)

      // Act
      await groupsController.getMembers(mockRequest as Request, mockResponse as Response, mockNext)

      // Assert
      expect(MockedSorobanService.prototype.getGroupMembers).toHaveBeenCalledWith('group1')
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: mockMembers,
      })
      expect(mockNext).not.toHaveBeenCalled()
    })

    it('should call next when service throws an error', async () => {
      // Arrange
      const error = new Error('Service error')
      mockRequest.params = { id: 'group1' }
      MockedSorobanService.prototype.getGroupMembers.mockRejectedValue(error)

      // Act
      await groupsController.getMembers(mockRequest as Request, mockResponse as Response, mockNext)

      // Assert
      expect(mockNext).toHaveBeenCalledWith(error)
      expect(mockResponse.json).not.toHaveBeenCalled()
    })
  })

  describe('getTransactions', () => {
    it('should return paginated transactions successfully', async () => {
      // Arrange
      const mockTransactions: GroupTransaction[] = [
        {
          id: 'tx1',
          groupId: 'group1',
          publicKey: 'GUSER123',
          amount: '10000000',
          type: 'contribution',
          timestamp: 1640995200,
          ledger: 12345,
        },
        {
          id: 'tx2',
          groupId: 'group1',
          publicKey: 'GUSER456',
          amount: '20000000',
          type: 'contribution',
          timestamp: 1641081600,
          ledger: 12346,
        },
      ]

      const mockPaginatedResult: PaginatedResult<GroupTransaction> = {
        data: mockTransactions,
        pagination: {
          page: 1,
          limit: 20,
          total: 2,
          totalPages: 1,
          hasNextPage: false,
          hasPrevPage: false,
        },
      }

      mockRequest.params = { id: 'group1' }
      mockRequest.query = { page: '1', limit: '20' }
      MockedSorobanService.prototype.getGroupTransactions.mockResolvedValue(mockPaginatedResult)

      // Act
      await groupsController.getTransactions(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      )

      // Assert
      expect(MockedSorobanService.prototype.getGroupTransactions).toHaveBeenCalledWith('group1', {
        page: 1,
        limit: 20,
      })
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: mockTransactions,
        pagination: mockPaginatedResult.pagination,
      })
      expect(mockNext).not.toHaveBeenCalled()
    })

    it('should use default pagination when query params are missing', async () => {
      // Arrange
      const mockPaginatedResult: PaginatedResult<GroupTransaction> = {
        data: [],
        pagination: {
          page: 1,
          limit: 20,
          total: 0,
          totalPages: 0,
          hasNextPage: false,
          hasPrevPage: false,
        },
      }

      mockRequest.params = { id: 'group1' }
      mockRequest.query = {}
      MockedSorobanService.prototype.getGroupTransactions.mockResolvedValue(mockPaginatedResult)

      // Act
      await groupsController.getTransactions(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      )

      // Assert
      expect(MockedSorobanService.prototype.getGroupTransactions).toHaveBeenCalledWith('group1', {
        page: 1,
        limit: 20,
      })
    })

    it('should call next when service throws an error', async () => {
      // Arrange
      const error = new Error('Service error')
      mockRequest.params = { id: 'group1' }
      mockRequest.query = {}
      MockedSorobanService.prototype.getGroupTransactions.mockRejectedValue(error)

      // Act
      await groupsController.getTransactions(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      )

      // Assert
      expect(mockNext).toHaveBeenCalledWith(error)
      expect(mockResponse.json).not.toHaveBeenCalled()
    })
  })
})
