# Drips Codebase Refactoring Plan

## Executive Summary

This document outlines a comprehensive refactoring plan for the Drips decentralized savings groups platform. The refactoring focuses on improving code quality, maintainability, type safety, and performance across the frontend, backend, and smart contracts.

## Priority Levels
- **P0 (Critical)**: Must fix - blocks functionality or has security implications
- **P1 (High)**: Should fix soon - impacts maintainability significantly
- **P2 (Medium)**: Nice to have - improves code quality
- **P3 (Low)**: Optional - minor improvements

---

## 1. Backend Refactoring

### 1.1 Service Layer Issues (P1)

**File**: `backend/src/services/sorobanService.ts`

**Issues**:
1. Large monolithic service class (500+ lines)
2. Mixed concerns (data mapping, API calls, pagination)
3. Hardcoded configuration values
4. Inconsistent error handling
5. Missing input validation
6. No dependency injection

**Refactoring Actions**:

```typescript
// Create separate modules
backend/src/services/
├── soroban/
│   ├── SorobanClient.ts          // Core Stellar SDK wrapper
│   ├── ContractService.ts        // Contract interaction logic
│   ├── TransactionBuilder.ts     // Transaction building
│   └── ResponseMapper.ts         // Data transformation
├── validation/
│   ├── schemas.ts                // Zod schemas
│   └── validators.ts             // Validation functions
└── config/
    └── soroban.config.ts         // Configuration management
```

**Example Refactored Code**:

```typescript
// backend/src/services/soroban/SorobanClient.ts
import * as StellarSdk from 'stellar-sdk'
import { SorobanConfig } from '../config/soroban.config'

export class SorobanClient {
  private readonly server: StellarSdk.SorobanRpc.Server
  private readonly contract: StellarSdk.Contract
  
  constructor(private config: SorobanConfig) {
    this.server = new StellarSdk.SorobanRpc.Server(config.rpcUrl)
    this.contract = new StellarSdk.Contract(config.contractId)
  }
  
  async simulateTransaction(operation: StellarSdk.Operation): Promise<StellarSdk.xdr.ScVal> {
    // Implementation
  }
}

// backend/src/services/soroban/ContractService.ts
export class ContractService {
  constructor(
    private client: SorobanClient,
    private mapper: ResponseMapper
  ) {}
  
  async getGroup(groupId: string): Promise<Group | null> {
    const scVal = await this.client.simulateView('get_group', [
      StellarSdk.nativeToScVal(groupId, { type: 'string' })
    ])
    
    if (!scVal || scVal.switch().name === 'scvVoid') {
      return null
    }
    
    return this.mapper.mapToGroup(scVal, groupId)
  }
}
```

### 1.2 Controller Layer Issues (P1)

**File**: `backend/src/controllers/groupsController.ts`

**Issues**:
1. No input validation (commented TODO)
2. Inconsistent error responses
3. Missing request/response types
4. No rate limiting
5. Singleton service instance

**Refactoring Actions**:

```typescript
// backend/src/controllers/GroupsController.ts
import { z } from 'zod'
import { validateRequest } from '../middleware/validation'

// Define schemas
const createGroupSchema = z.object({
  name: z.string().min(3).max(100),
  contributionAmount: z.number().positive(),
  cycleLength: z.number().int().positive(),
  maxMembers: z.number().int().min(2).max(100),
})

export class GroupsController {
  constructor(private sorobanService: ContractService) {}
  
  @validateRequest(createGroupSchema)
  async createGroup(req: Request, res: Response, next: NextFunction) {
    try {
      const validatedData = req.body // Already validated by middleware
      const result = await this.sorobanService.createGroup(validatedData)
      
      return res.status(201).json({
        success: true,
        data: result,
      })
    } catch (error) {
      next(error)
    }
  }
}
```

### 1.3 Missing Middleware (P1)

**Create**:
- Request validation middleware
- Rate limiting
- Request logging with correlation IDs
- API versioning
- Response compression

```typescript
// backend/src/middleware/validation.ts
import { z } from 'zod'

export const validateRequest = (schema: z.ZodSchema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = await schema.parseAsync(req.body)
      next()
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: error.errors,
        })
      }
      next(error)
    }
  }
}
```

### 1.4 Configuration Management (P1)

**Issues**:
- Environment variables scattered throughout code
- No validation of required env vars
- No type safety for config

**Refactoring**:

```typescript
// backend/src/config/index.ts
import { z } from 'zod'

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']),
  PORT: z.string().transform(Number),
  SOROBAN_RPC_URL: z.string().url(),
  SOROBAN_CONTRACT_ID: z.string().min(1),
  SOROBAN_NETWORK_PASSPHRASE: z.string(),
  JWT_SECRET: z.string().min(32),
  FRONTEND_URL: z.string().url(),
})

export type Config = z.infer<typeof envSchema>

export const config: Config = envSchema.parse(process.env)
```

---

## 2. Frontend Refactoring

### 2.1 Hook Complexity (P1)

**File**: `frontend/src/hooks/useContractData.ts`

**Issues**:
1. Overly complex with too many responsibilities
2. Tight coupling to specific services
3. Inconsistent error handling
4. Type safety issues (using `any`)

**Refactoring Actions**:

Split into focused hooks:

```typescript
// frontend/src/hooks/queries/useGroups.ts
export const useGroups = (userId?: string) => {
  return useQuery({
    queryKey: ['groups', userId],
    queryFn: () => groupService.getUserGroups(userId!),
    enabled: !!userId,
  })
}

// frontend/src/hooks/mutations/useCreateGroup.ts
export const useCreateGroup = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (params: CreateGroupParams) => groupService.createGroup(params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groups'] })
    },
  })
}

// frontend/src/hooks/cache/useCacheInvalidation.ts
export const useCacheInvalidation = () => {
  // Cache-specific logic
}
```

### 2.2 Service Layer Issues (P0)

**File**: `frontend/src/services/soroban.ts`

**Issues**:
1. **CRITICAL**: All methods return placeholder data (TODO comments)
2. Circuit breaker implementation but no actual Stellar SDK integration
3. Complex retry logic that's never tested
4. Mixing concerns (caching, retry, circuit breaking, business logic)

**Refactoring Actions**:

```typescript
// frontend/src/services/stellar/StellarClient.ts
import { Contract, SorobanRpc, TransactionBuilder } from 'stellar-sdk'

export class StellarClient {
  private server: SorobanRpc.Server
  private contract: Contract
  
  constructor(config: StellarConfig) {
    this.server = new SorobanRpc.Server(config.rpcUrl)
    this.contract = new Contract(config.contractId)
  }
  
  async invokeContract(method: string, params: any[]) {
    // Actual Stellar SDK implementation
  }
}

// frontend/src/services/groups/GroupService.ts
export class GroupService {
  constructor(
    private stellarClient: StellarClient,
    private cacheService: CacheService
  ) {}
  
  async createGroup(params: CreateGroupParams): Promise<string> {
    // Real implementation using stellarClient
    const result = await this.stellarClient.invokeContract('create_group', [
      params.groupName,
      params.cycleLength,
      params.contributionAmount,
      params.maxMembers,
    ])
    
    return result.groupId
  }
}
```

### 2.3 Component Issues (P2)

**File**: `frontend/src/components/GroupsList.tsx`

**Issues**:
1. Fixed orphaned code (already done)
2. Large component with mixed concerns
3. Inline styles and magic numbers
4. No loading/error states for individual items

**Refactoring Actions**:

```typescript
// Split into smaller components
frontend/src/components/groups/
├── GroupsList.tsx           // Container
├── GroupsTable.tsx          // Table view
├── GroupsGrid.tsx           // Grid view
├── GroupListItem.tsx        // Individual item
├── GroupStatusBadge.tsx     // Status indicator
└── GroupsListSkeleton.tsx   // Loading state
```

### 2.4 Type Safety Issues (P1)

**Issues**:
- Using `any` types in multiple places
- Missing interface definitions
- Inconsistent type imports

**Refactoring**:

```typescript
// frontend/src/types/api.ts
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  pagination?: PaginationMeta
}

export interface PaginationMeta {
  page: number
  limit: number
  total: number
  totalPages: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

// frontend/src/types/group.ts
export interface Group {
  id: string
  name: string
  description: string
  contributionAmount: number
  frequency: string
  maxMembers: number
  currentMembers: number
  admin: string
  createdAt: number
  isActive: boolean
  status: GroupStatus
}

export type GroupStatus = 'active' | 'completed' | 'paused'
```

---

## 3. Shared Improvements

### 3.1 Error Handling (P0)

**Create unified error handling**:

```typescript
// shared/errors/AppError.ts
export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 500,
    public isOperational: boolean = true
  ) {
    super(message)
    Object.setPrototypeOf(this, AppError.prototype)
  }
}

export class ValidationError extends AppError {
  constructor(message: string, public details?: any) {
    super(message, 'VALIDATION_ERROR', 400)
  }
}

export class ContractError extends AppError {
  constructor(message: string, public contractError?: any) {
    super(message, 'CONTRACT_ERROR', 500)
  }
}
```

### 3.2 Logging (P1)

**Implement structured logging**:

```typescript
// shared/logging/logger.ts
import winston from 'winston'

export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'drips-api' },
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
})
```

### 3.3 Testing (P1)

**Add comprehensive tests**:

```
backend/tests/
├── unit/
│   ├── services/
│   ├── controllers/
│   └── utils/
├── integration/
│   └── api/
└── e2e/

frontend/src/tests/
├── unit/
│   ├── hooks/
│   ├── services/
│   └── utils/
├── integration/
│   └── components/
└── e2e/
```

---

## 4. Implementation Plan

### Phase 1: Critical Fixes (Week 1)
- [ ] Implement actual Stellar SDK integration in frontend
- [ ] Add input validation to backend controllers
- [ ] Fix type safety issues (remove `any` types)
- [ ] Implement proper error handling

### Phase 2: Architecture Improvements (Week 2)
- [ ] Refactor backend service layer
- [ ] Split frontend hooks into focused modules
- [ ] Add configuration management
- [ ] Implement structured logging

### Phase 3: Code Quality (Week 3)
- [ ] Add comprehensive tests
- [ ] Refactor large components
- [ ] Add API documentation
- [ ] Implement rate limiting

### Phase 4: Performance & Polish (Week 4)
- [ ] Optimize caching strategies
- [ ] Add monitoring and metrics
- [ ] Performance profiling
- [ ] Documentation updates

---

## 5. Success Metrics

- [ ] Test coverage > 80%
- [ ] No `any` types in production code
- [ ] All API endpoints have validation
- [ ] Response time < 200ms for cached requests
- [ ] Zero critical security vulnerabilities
- [ ] TypeScript strict mode enabled
- [ ] All TODO comments resolved

---

## 6. Risk Mitigation

1. **Breaking Changes**: Use feature flags for gradual rollout
2. **Testing**: Comprehensive test suite before refactoring
3. **Rollback Plan**: Git branches for each phase
4. **Documentation**: Update docs alongside code changes
5. **Team Communication**: Daily standups during refactoring

---

## 7. Next Steps

1. Review this plan with the team
2. Prioritize based on business needs
3. Create detailed tickets for each task
4. Set up CI/CD for automated testing
5. Begin Phase 1 implementation

