# Performance Testing Guide

## Overview

This document provides comprehensive guidelines for performance testing the Soroban Ajo project, including benchmarks, measurement procedures, and optimization strategies for both smart contracts and frontend components.

**Purpose**: Ensure the system meets performance requirements and provides good user experience
**Scope**: Smart contract gas costs, frontend load times, transaction throughput
**Target Audience**: QA Engineers, Performance Engineers, Developers

---

## Performance Benchmarks

### Smart Contract Performance Benchmarks

#### Gas Consumption Targets

| Operation | Target (stroops) | Maximum Acceptable | Priority |
|-----------|------------------|-------------------|----------|
| Group Creation | 50,000 | 75,000 | Critical |
| Join Group | 30,000 | 45,000 | Critical |
| Contribute | 40,000 | 60,000 | Critical |
| Execute Payout | 45,000 | 70,000 | Critical |
| Get Group | 5,000 | 10,000 | High |
| List Members | 10,000 | 15,000 | Medium |

**Notes**:
- 1 stroop = 0.0000001 XLM
- Gas costs include transaction fees and contract execution
- Targets based on Soroban network averages
- Maximum acceptable is 150% of target

#### Storage Cost Targets

| Data Type | Target Size | Maximum Acceptable |
|-----------|-------------|-------------------|
| Group Record | 500 bytes | 750 bytes |
| Contribution Record | 100 bytes | 150 bytes |
| Member Record | 50 bytes | 75 bytes |

#### Execution Time Targets

| Operation | Target Time | Maximum Acceptable |
|-----------|-------------|-------------------|
| Contract Call | < 1 second | < 3 seconds |
| Transaction Confirmation | < 5 seconds | < 10 seconds |
| State Query | < 500ms | < 1 second |

### Frontend Performance Benchmarks

#### Page Load Time Targets

| Metric | Target | Maximum Acceptable | Priority |
|--------|--------|-------------------|----------|
| Initial Page Load (FCP) | < 1.5 seconds | < 3 seconds | Critical |
| Time to Interactive (TTI) | < 2.5 seconds | < 4 seconds | Critical |
| Largest Contentful Paint (LCP) | < 2 seconds | < 3.5 seconds | High |
| First Input Delay (FID) | < 100ms | < 300ms | High |
| Cumulative Layout Shift (CLS) | < 0.1 | < 0.25 | Medium |

**Test Conditions**:
- Network: Fast 3G (1.6 Mbps down, 750 Kbps up)
- Device: Mid-tier mobile device (4x CPU slowdown)
- Cache: Cold cache (first visit)

#### Component Render Time Targets

| Component | Target | Maximum Acceptable |
|-----------|--------|-------------------|
| GroupCreationForm | < 50ms | < 100ms |
| GroupList (10 items) | < 100ms | < 200ms |
| GroupCard | < 30ms | < 60ms |
| WalletConnector | < 50ms | < 100ms |
| ContributionForm | < 50ms | < 100ms |

#### Data Fetching Time Targets

| Operation | Target | Maximum Acceptable |
|-----------|--------|-------------------|
| Fetch Group List | < 1 second | < 2 seconds |
| Fetch Group Details | < 500ms | < 1 second |
| Fetch Member List | < 500ms | < 1 second |
| Fetch Contribution Status | < 500ms | < 1 second |

#### Bundle Size Targets

| Bundle | Target | Maximum Acceptable |
|--------|--------|-------------------|
| Main JS Bundle | < 200 KB | < 300 KB |
| Vendor Bundle | < 150 KB | < 250 KB |
| CSS Bundle | < 50 KB | < 75 KB |
| Total Initial Load | < 400 KB | < 625 KB |

### Transaction Throughput Benchmarks

#### Concurrent User Targets

| Scenario | Target | Maximum Acceptable |
|----------|--------|-------------------|
| Concurrent Group Creations | 10/minute | 5/minute |
| Concurrent Contributions | 50/minute | 25/minute |
| Concurrent Payouts | 20/minute | 10/minute |
| Concurrent Queries | 100/second | 50/second |

#### System Capacity

| Metric | Target | Notes |
|--------|--------|-------|
| Total Groups | 10,000+ | No performance degradation |
| Members per Group | 100 | Maximum tested capacity |
| Active Groups | 1,000 | Concurrent active groups |
| Daily Transactions | 10,000+ | Sustained throughput |

---

## Smart Contract Performance Testing

### Measuring Gas Consumption

#### Using Soroban CLI

```bash
# Deploy contract
stellar contract deploy \
  --wasm target/wasm32-unknown-unknown/release/soroban_ajo.wasm \
  --source deployer \
  --network testnet

# Invoke with gas tracking
stellar contract invoke \
  --id <CONTRACT_ID> \
  --source creator \
  --network testnet \
  -- create_group \
  --creator <ADDRESS> \
  --contribution_amount 100000000 \
  --cycle_duration 604800 \
  --max_members 10

# Check transaction details for gas used
stellar transaction info <TX_HASH> --network testnet
```

#### Using Rust Tests

```rust
#[test]
fn test_gas_consumption_create_group() {
    let env = Env::default();
    env.mock_all_auths();
    
    let contract_id = env.register_contract(None, AjoContract);
    let client = AjoContractClient::new(&env, &contract_id);
    let creator = Address::generate(&env);
    
    // Measure gas before
    let gas_before = env.budget().cpu_instruction_cost();
    
    // Execute operation
    let group_id = client.create_group(
        &creator,
        &100_000_000i128,
        &604_800u64,
        &10u32
    );
    
    // Measure gas after
    let gas_after = env.budget().cpu_instruction_cost();
    let gas_used = gas_after - gas_before;
    
    println!("Gas used for create_group: {}", gas_used);
    
    // Assert within acceptable range
    assert!(gas_used < 75_000, "Gas consumption too high: {}", gas_used);
}
```

#### Automated Gas Tracking

```rust
// Add to test utilities
pub fn measure_gas<F, R>(env: &Env, operation: F) -> (R, u64)
where
    F: FnOnce() -> R,
{
    let gas_before = env.budget().cpu_instruction_cost();
    let result = operation();
    let gas_after = env.budget().cpu_instruction_cost();
    let gas_used = gas_after - gas_before;
    
    (result, gas_used)
}

// Usage
#[test]
fn test_all_operations_gas() {
    let (env, client, creator) = setup_test_env();
    
    let (group_id, gas) = measure_gas(&env, || {
        client.create_group(&creator, &100_000_000, &604_800, &10)
    });
    println!("create_group gas: {}", gas);
    assert!(gas < 75_000);
    
    let (_, gas) = measure_gas(&env, || {
        client.join_group(&member2, &group_id)
    });
    println!("join_group gas: {}", gas);
    assert!(gas < 45_000);
}
```

### Gas Optimization Strategies

#### Storage Optimization
- Use compact data structures
- Minimize storage writes
- Batch operations when possible
- Use efficient key structures

#### Computation Optimization
- Minimize loops and iterations
- Use efficient algorithms
- Cache computed values
- Avoid redundant calculations

#### Example Optimization
```rust
// Before: Multiple storage reads
pub fn get_all_members(env: &Env, group_id: u64) -> Vec<Address> {
    let group = get_group(env, group_id);  // Storage read
    let mut members = Vec::new(&env);
    for i in 0..group.members.len() {
        members.push_back(group.members.get(i).unwrap());  // Multiple reads
    }
    members
}

// After: Single storage read
pub fn get_all_members(env: &Env, group_id: u64) -> Vec<Address> {
    let group = get_group(env, group_id);  // Single storage read
    group.members.clone()  // Return directly
}
```

---

## Frontend Performance Testing

### Measuring Page Load Time

#### Using Lighthouse

```bash
# Install Lighthouse
npm install -g lighthouse

# Run Lighthouse audit
lighthouse http://localhost:3000 \
  --output html \
  --output-path ./performance-report.html \
  --throttling.cpuSlowdownMultiplier=4 \
  --throttling.rttMs=150 \
  --throttling.throughputKbps=1638.4

# View report
open performance-report.html
```

#### Using Chrome DevTools

1. Open Chrome DevTools (F12)
2. Go to "Performance" tab
3. Click "Record" button
4. Perform actions (page load, navigation, etc.)
5. Click "Stop" button
6. Analyze performance timeline

**Key Metrics to Check**:
- First Contentful Paint (FCP)
- Largest Contentful Paint (LCP)
- Time to Interactive (TTI)
- Total Blocking Time (TBT)
- Cumulative Layout Shift (CLS)

#### Using Web Vitals Library

```typescript
// Install web-vitals
npm install web-vitals

// Add to main.tsx
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

function sendToAnalytics(metric: any) {
  console.log(metric);
  // Send to analytics service
}

getCLS(sendToAnalytics);
getFID(sendToAnalytics);
getFCP(sendToAnalytics);
getLCP(sendToAnalytics);
getTTFB(sendToAnalytics);
```

### Measuring Component Render Time

#### Using React DevTools Profiler

```typescript
import { Profiler } from 'react';

function onRenderCallback(
  id: string,
  phase: 'mount' | 'update',
  actualDuration: number,
  baseDuration: number,
  startTime: number,
  commitTime: number
) {
  console.log(`${id} ${phase} took ${actualDuration}ms`);
  
  // Assert performance
  if (actualDuration > 100) {
    console.warn(`Slow render detected: ${id} took ${actualDuration}ms`);
  }
}

function App() {
  return (
    <Profiler id="App" onRender={onRenderCallback}>
      <GroupCreationForm />
    </Profiler>
  );
}
```

#### Using Performance API

```typescript
// Measure component render
function measureRender(componentName: string, renderFn: () => void) {
  performance.mark(`${componentName}-start`);
  renderFn();
  performance.mark(`${componentName}-end`);
  
  performance.measure(
    componentName,
    `${componentName}-start`,
    `${componentName}-end`
  );
  
  const measure = performance.getEntriesByName(componentName)[0];
  console.log(`${componentName} render time: ${measure.duration}ms`);
  
  return measure.duration;
}

// Usage in tests
it('renders within performance budget', () => {
  const duration = measureRender('GroupCreationForm', () => {
    render(<GroupCreationForm />);
  });
  
  expect(duration).toBeLessThan(100);
});
```

### Measuring Data Fetching Time

```typescript
// Add timing to API calls
async function fetchGroups() {
  const startTime = performance.now();
  
  try {
    const groups = await sorobanService.getGroups();
    const endTime = performance.now();
    const duration = endTime - startTime;
    
    console.log(`fetchGroups took ${duration}ms`);
    
    if (duration > 2000) {
      console.warn(`Slow API call: fetchGroups took ${duration}ms`);
    }
    
    return groups;
  } catch (error) {
    const endTime = performance.now();
    console.error(`fetchGroups failed after ${endTime - startTime}ms`);
    throw error;
  }
}
```

### Bundle Size Analysis

```bash
# Analyze bundle size
npm run build

# Use webpack-bundle-analyzer
npm install --save-dev webpack-bundle-analyzer

# Add to vite.config.ts
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [
    react(),
    visualizer({
      open: true,
      gzipSize: true,
      brotliSize: true,
    }),
  ],
});

# Build and view analysis
npm run build
```

### Frontend Optimization Strategies

#### Code Splitting
```typescript
// Lazy load routes
import { lazy, Suspense } from 'react';

const GroupDetailPage = lazy(() => import('./components/GroupDetailPage'));

function App() {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route path="/group/:id" element={<GroupDetailPage />} />
      </Routes>
    </Suspense>
  );
}
```

#### Memoization
```typescript
import { memo, useMemo } from 'react';

// Memoize expensive components
const GroupCard = memo(({ group }: { group: Group }) => {
  return <div>{group.name}</div>;
});

// Memoize expensive calculations
function GroupList({ groups }: { groups: Group[] }) {
  const sortedGroups = useMemo(() => {
    return groups.sort((a, b) => a.id - b.id);
  }, [groups]);
  
  return <div>{sortedGroups.map(g => <GroupCard key={g.id} group={g} />)}</div>;
}
```

#### Image Optimization
```typescript
// Use optimized images
<img 
  src="/images/logo.webp" 
  alt="Logo"
  loading="lazy"
  width="200"
  height="100"
/>
```

---

## Load Testing

### Load Testing Strategy

#### Tools
- **Artillery**: HTTP load testing
- **k6**: Modern load testing tool
- **Apache JMeter**: Comprehensive load testing

#### Test Scenarios

**Scenario 1: Normal Load**
- 10 concurrent users
- Duration: 5 minutes
- Operations: Mixed (create, join, contribute)

**Scenario 2: Peak Load**
- 50 concurrent users
- Duration: 10 minutes
- Operations: Heavy contribution activity

**Scenario 3: Stress Test**
- 100 concurrent users
- Duration: 15 minutes
- Operations: All operations

### Example Load Test (Artillery)

```yaml
# load-test.yml
config:
  target: "http://localhost:3000"
  phases:
    - duration: 60
      arrivalRate: 5
      name: "Warm up"
    - duration: 300
      arrivalRate: 10
      name: "Normal load"
    - duration: 120
      arrivalRate: 20
      name: "Peak load"
  
scenarios:
  - name: "Create and join group"
    flow:
      - get:
          url: "/"
      - post:
          url: "/api/groups"
          json:
            contributionAmount: 100
            cycleDuration: 7
            maxMembers: 10
      - think: 2
      - post:
          url: "/api/groups/{{ groupId }}/join"
```

```bash
# Run load test
artillery run load-test.yml

# Generate report
artillery run --output report.json load-test.yml
artillery report report.json
```

---

## Performance Testing Checklist

### Pre-Test Checklist
- [ ] Test environment configured
- [ ] Baseline metrics recorded
- [ ] Test data prepared
- [ ] Monitoring tools configured
- [ ] Test scenarios defined

### Smart Contract Performance Tests
- [ ] Measure gas for group creation
- [ ] Measure gas for join group
- [ ] Measure gas for contribute
- [ ] Measure gas for execute payout
- [ ] Verify all operations within targets
- [ ] Test with maximum group size
- [ ] Test with maximum contribution amount

### Frontend Performance Tests
- [ ] Measure initial page load (Lighthouse)
- [ ] Measure component render times
- [ ] Measure data fetching times
- [ ] Analyze bundle sizes
- [ ] Test on slow network (Fast 3G)
- [ ] Test on slow device (4x CPU slowdown)
- [ ] Verify Core Web Vitals

### Load Testing
- [ ] Execute normal load scenario
- [ ] Execute peak load scenario
- [ ] Execute stress test scenario
- [ ] Monitor system resources
- [ ] Verify no errors under load
- [ ] Verify response times acceptable

### Post-Test Checklist
- [ ] Results documented
- [ ] Benchmarks compared
- [ ] Issues identified
- [ ] Optimization recommendations made
- [ ] Report generated

---

## Performance Monitoring

### Continuous Monitoring

#### Smart Contract Monitoring
- Track gas costs over time
- Alert on gas cost increases
- Monitor transaction success rate
- Track contract execution time

#### Frontend Monitoring
- Real User Monitoring (RUM)
- Synthetic monitoring
- Error rate tracking
- Performance budgets

#### Tools
- **Sentry**: Error and performance monitoring
- **Google Analytics**: User behavior and performance
- **Grafana**: Custom dashboards
- **Prometheus**: Metrics collection

### Performance Budgets

Set and enforce performance budgets:

```json
// performance-budget.json
{
  "budgets": [
    {
      "resourceSizes": [
        {
          "resourceType": "script",
          "budget": 300
        },
        {
          "resourceType": "total",
          "budget": 625
        }
      ]
    },
    {
      "timings": [
        {
          "metric": "interactive",
          "budget": 4000
        },
        {
          "metric": "first-contentful-paint",
          "budget": 3000
        }
      ]
    }
  ]
}
```

---

## Performance Regression Testing

### Automated Performance Tests

```typescript
// performance.test.ts
import { test, expect } from 'vitest';
import { render } from '@testing-library/react';
import { performance } from 'perf_hooks';

test('GroupCreationForm renders within budget', () => {
  const start = performance.now();
  render(<GroupCreationForm />);
  const end = performance.now();
  const duration = end - start;
  
  expect(duration).toBeLessThan(100);
});
```

### CI/CD Integration

```yaml
# .github/workflows/performance.yml
name: Performance Tests

on:
  pull_request:
    branches: [ main ]

jobs:
  performance:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Run Lighthouse CI
        uses: treosh/lighthouse-ci-action@v9
        with:
          urls: |
            http://localhost:3000
          budgetPath: ./performance-budget.json
          uploadArtifacts: true
      
      - name: Run smart contract performance tests
        run: |
          cd contracts/ajo
          cargo test --release -- --nocapture | grep "gas:"
```

---

## Troubleshooting Performance Issues

### Smart Contract Performance Issues

**High Gas Costs**:
- Review storage operations
- Optimize loops and iterations
- Check for redundant calculations
- Profile contract execution

**Slow Transaction Confirmation**:
- Check network congestion
- Verify transaction fees
- Check RPC endpoint performance

### Frontend Performance Issues

**Slow Page Load**:
- Analyze bundle size
- Check for render-blocking resources
- Optimize images
- Enable code splitting

**Slow Component Rendering**:
- Profile component with React DevTools
- Check for unnecessary re-renders
- Add memoization
- Optimize expensive calculations

**Slow Data Fetching**:
- Check API response times
- Implement caching
- Use pagination
- Optimize queries

---

## Related Documents
- Test Automation Strategy
- Regression Test Checklist
- Test Execution Report Template

---

**Document Version**: 1.0
**Last Updated**: 2024-01-15
**Owner**: QA Team / Performance Team
