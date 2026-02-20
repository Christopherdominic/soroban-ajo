# State Transition Flows

## Overview
Comprehensive state transition diagrams and flows for all user interactions, showing how UI states change based on user actions and system responses.

---

## 1. Group Creation Flow

### States
1. **Initial** → Form empty, all fields enabled
2. **Filling** → User entering data, inline validation
3. **Validating** → Client-side validation running
4. **Valid** → All fields valid, submit enabled
5. **Submitting** → Loading state, form disabled
6. **Confirming** → Confirmation dialog shown
7. **Processing** → Blockchain transaction processing
8. **Success** → Group created, success state shown
9. **Error** → Error state with retry option

### Transition Diagram

```
[Initial]
   ↓ (user types)
[Filling] ←→ [Validating]
   ↓ (all valid)
[Valid]
   ↓ (click submit)
[Submitting]
   ↓ (validation passes)
[Confirming]
   ↓ (user confirms)
[Processing]
   ↓ (success)        ↓ (error)
[Success]          [Error]
   ↓                  ↓ (retry)
[Dashboard]        [Filling]
```

### State Details

**Initial State**:
- All inputs empty
- Submit button disabled
- No validation messages
- Helper text visible

**Filling State**:
- User typing in fields
- Inline validation on blur
- Character counters active
- Submit button disabled until valid

**Valid State**:
- All fields pass validation
- Green checkmarks visible
- Submit button enabled
- No error messages

**Submitting State**:
- Submit button shows spinner
- All inputs disabled
- "Creating group..." message
- Cancel button available

**Confirming State**:
- Modal dialog shown
- Form data summarized
- "Create" and "Edit" buttons
- Focus on "Edit" button

**Processing State**:
- Progress indicator shown
- "Processing transaction..." message
- Estimated time displayed
- Cannot cancel

**Success State**:
- Success icon and message
- Group details displayed
- "View Group" button
- Auto-redirect in 3s

**Error State**:
- Error icon and message
- Error details shown
- "Try Again" button
- "Cancel" button

---

## 2. Contribution Flow

### States
1. **Not Due** → Contribution not yet required
2. **Due** → Contribution period active
3. **Initiating** → User clicks contribute
4. **Wallet Approval** → Waiting for wallet signature
5. **Processing** → Transaction submitting
6. **Confirming** → Blockchain confirmation
7. **Completed** → Contribution recorded
8. **Failed** → Transaction failed
9. **Late** → Contribution overdue

### Transition Diagram

```
[Not Due]
   ↓ (cycle starts)
[Due]
   ↓ (click contribute)
[Initiating]
   ↓ (wallet opens)
[Wallet Approval]
   ↓ (user signs)      ↓ (user rejects)
[Processing]         [Due]
   ↓ (submitted)
[Confirming]
   ↓ (confirmed)      ↓ (failed)
[Completed]         [Failed]
                       ↓ (retry)
                    [Due]
   ↓ (deadline passes)
[Late]
```

### State UI Specifications

**Not Due**:
```tsx
<ContributionCard status="not-due">
  <Icon name="status-inactive" variant="default" />
  <Heading>Next Contribution</Heading>
  <Countdown>Due in 5 days</Countdown>
  <Button disabled>Contribute</Button>
</ContributionCard>
```

**Due**:
```tsx
<ContributionCard status="due">
  <Icon name="status-warning" variant="warning" />
  <Heading>Contribution Due</Heading>
  <Amount>100 USDC</Amount>
  <Countdown>Due in 2 days</Countdown>
  <Button variant="primary">Contribute Now</Button>
</ContributionCard>
```

**Processing**:
```tsx
<ContributionCard status="processing">
  <Spinner />
  <Heading>Processing...</Heading>
  <Progress value={60} />
  <Text>Confirming transaction on blockchain</Text>
</ContributionCard>
```

**Completed**:
```tsx
<ContributionCard status="completed">
  <Icon name="validation-check" variant="success" />
  <Heading>Contribution Sent!</Heading>
  <Amount>100 USDC</Amount>
  <Timestamp>2 minutes ago</Timestamp>
  <Link>View Transaction →</Link>
</ContributionCard>
```

**Late**:
```tsx
<ContributionCard status="late">
  <Icon name="status-error" variant="error" />
  <Heading>Contribution Overdue</Heading>
  <Amount>100 USDC</Amount>
  <Warning>Overdue by 2 days</Warning>
  <Button variant="error">Pay Now</Button>
</ContributionCard>
```

---

## 3. Wallet Connection Flow

### States
1. **Disconnected** → No wallet connected
2. **Connecting** → Wallet connection initiated
3. **Approving** → User approving in wallet
4. **Connected** → Wallet successfully connected
5. **Wrong Network** → Connected to wrong network
6. **Switching Network** → Network switch in progress
7. **Error** → Connection failed

### Transition Diagram

```
[Disconnected]
   ↓ (click connect)
[Connecting]
   ↓ (wallet opens)
[Approving]
   ↓ (approved)         ↓ (rejected)
[Connected]          [Disconnected]
   ↓ (wrong network)
[Wrong Network]
   ↓ (click switch)
[Switching Network]
   ↓ (switched)
[Connected]
```

---

## 4. Page Load Flow

### States
1. **Initial Load** → Page loading
2. **Authenticating** → Checking wallet connection
3. **Fetching Data** → Loading user data
4. **Rendering** → Displaying content
5. **Ready** → Page fully loaded
6. **Error** → Load failed

### Transition Diagram

```
[Initial Load]
   ↓
[Authenticating]
   ↓ (authenticated)    ↓ (not authenticated)
[Fetching Data]      [Ready - Guest Mode]
   ↓ (data loaded)      ↓ (fetch failed)
[Rendering]          [Error]
   ↓                    ↓ (retry)
[Ready]              [Fetching Data]
```

### Loading States UI

**Initial Load** (0-500ms):
```tsx
<PageLoader>
  <Logo />
  <Spinner size={48} />
  <Text>Loading...</Text>
</PageLoader>
```

**Fetching Data** (500ms+):
```tsx
<SkeletonScreen>
  <SkeletonHeader />
  <SkeletonCard count={3} />
  <SkeletonTable rows={5} />
</SkeletonScreen>
```

**Ready**:
```tsx
<Page>
  <Header />
  <Content />
  <Footer />
</Page>
```

---

## 5. Form Validation Flow

### States
1. **Pristine** → Field not touched
2. **Touched** → Field focused then blurred
3. **Validating** → Validation running
4. **Valid** → Validation passed
5. **Invalid** → Validation failed
6. **Correcting** → User fixing errors

### Transition Diagram

```
[Pristine]
   ↓ (focus + blur)
[Touched]
   ↓ (validate)
[Validating]
   ↓ (valid)           ↓ (invalid)
[Valid]              [Invalid]
   ↓ (edit)            ↓ (edit)
[Correcting]        [Correcting]
   ↓ (validate)        ↓ (validate)
[Validating]        [Validating]
```

### Field State UI

**Pristine**:
```tsx
<Input
  label="Group Name"
  placeholder="Enter group name"
  helperText="Choose a memorable name"
/>
```

**Valid**:
```tsx
<Input
  label="Group Name"
  value="Family Savings"
  valid={true}
  icon={<Icon name="validation-check" variant="success" />}
/>
```

**Invalid**:
```tsx
<Input
  label="Group Name"
  value="A"
  invalid={true}
  error="Name must be at least 3 characters"
  icon={<Icon name="validation-cross" variant="error" />}
/>
```

---

## 6. Search/Filter Flow

### States
1. **Empty** → No search query
2. **Typing** → User entering query
3. **Debouncing** → Waiting for user to stop typing
4. **Searching** → Executing search
5. **Results** → Displaying results
6. **No Results** → No matches found
7. **Error** → Search failed

### Transition Diagram

```
[Empty]
   ↓ (user types)
[Typing]
   ↓ (300ms delay)
[Debouncing]
   ↓ (execute search)
[Searching]
   ↓ (results found)    ↓ (no results)    ↓ (error)
[Results]            [No Results]      [Error]
   ↓ (clear)            ↓ (clear)         ↓ (retry)
[Empty]              [Empty]           [Searching]
```

### Search State UI

**Empty**:
```tsx
<SearchBar
  placeholder="Search groups..."
  icon={<Icon name="ui-search" />}
/>
<EmptyState
  icon="ui-search"
  heading="Search for Groups"
  message="Enter a name or keyword to find groups"
/>
```

**Searching**:
```tsx
<SearchBar
  value="family"
  loading={true}
  icon={<Spinner size={16} />}
/>
<SkeletonResults count={3} />
```

**Results**:
```tsx
<SearchBar value="family" />
<ResultsCount>3 groups found</ResultsCount>
<ResultsList>
  <GroupCard />
  <GroupCard />
  <GroupCard />
</ResultsList>
```

**No Results**:
```tsx
<SearchBar value="xyz123" />
<EmptyState
  icon="ui-search"
  heading="No Groups Found"
  message="Try different keywords or browse all groups"
  action={{ label: "Clear Search", onClick: clearSearch }}
/>
```

---

## 7. Modal/Dialog Flow

### States
1. **Closed** → Modal not visible
2. **Opening** → Animation in progress
3. **Open** → Modal fully visible
4. **Interacting** → User interacting with modal
5. **Submitting** → Form submitting
6. **Closing** → Animation out
7. **Closed** → Modal hidden

### Transition Diagram

```
[Closed]
   ↓ (trigger open)
[Opening] (200ms animation)
   ↓
[Open]
   ↓ (user interacts)
[Interacting]
   ↓ (submit)           ↓ (cancel/escape)
[Submitting]         [Closing]
   ↓ (complete)          ↓ (200ms animation)
[Closing]            [Closed]
   ↓
[Closed]
```

---

## 8. Notification/Toast Flow

### States
1. **Hidden** → Not visible
2. **Entering** → Sliding in
3. **Visible** → Fully displayed
4. **Exiting** → Fading out
5. **Hidden** → Removed from DOM

### Transition Diagram

```
[Hidden]
   ↓ (trigger)
[Entering] (300ms)
   ↓
[Visible] (4s duration)
   ↓ (auto-dismiss)     ↓ (user dismisses)
[Exiting] (200ms)    [Exiting] (200ms)
   ↓                    ↓
[Hidden]             [Hidden]
```

### Toast Lifecycle

```tsx
// Show toast
toast.success("Group created!")

// Timeline:
// 0ms: Hidden
// 0-300ms: Entering (slide in from right)
// 300ms-4300ms: Visible
// 4300ms-4500ms: Exiting (fade out)
// 4500ms: Hidden (removed from DOM)
```

---

## 9. Data Refresh Flow

### States
1. **Stale** → Data needs refresh
2. **Refreshing** → Fetching new data
3. **Fresh** → Data up to date
4. **Error** → Refresh failed

### Transition Diagram

```
[Fresh]
   ↓ (time passes / user action)
[Stale]
   ↓ (auto-refresh / manual refresh)
[Refreshing]
   ↓ (success)         ↓ (error)
[Fresh]             [Error]
                       ↓ (retry)
                    [Refreshing]
```

### Refresh UI Patterns

**Pull to Refresh** (Mobile):
```tsx
<PullToRefresh onRefresh={handleRefresh}>
  <Content />
</PullToRefresh>
```

**Manual Refresh Button**:
```tsx
<Button
  variant="ghost"
  onClick={handleRefresh}
  loading={isRefreshing}
>
  <Icon name="action-refresh" />
  Refresh
</Button>
```

**Auto-refresh Indicator**:
```tsx
<Banner variant="info">
  <Icon name="action-refresh" className="animate-spin" />
  Updating data...
</Banner>
```

---

## 10. Error Recovery Flow

### States
1. **Error** → Error occurred
2. **Retrying** → Automatic retry
3. **Success** → Recovered
4. **Failed** → Max retries exceeded
5. **Manual Retry** → User-initiated retry

### Transition Diagram

```
[Error]
   ↓ (auto-retry)
[Retrying] (attempt 1)
   ↓ (failed)
[Retrying] (attempt 2)
   ↓ (failed)
[Retrying] (attempt 3)
   ↓ (failed)         ↓ (success)
[Failed]           [Success]
   ↓ (user clicks retry)
[Manual Retry]
   ↓ (success)
[Success]
```

### Retry UI

**Auto-retry**:
```tsx
<ErrorState
  heading="Connection Failed"
  message="Retrying automatically..."
  progress="Attempt 2 of 3"
/>
```

**Manual retry**:
```tsx
<ErrorState
  heading="Unable to Load Data"
  message="We couldn't fetch your groups. Please try again."
  action={{ label: "Retry", onClick: handleRetry }}
  secondaryAction={{ label: "Go Back", onClick: goBack }}
/>
```

---

## Best Practices

### State Management
- Use clear state names
- Document all possible states
- Handle edge cases
- Provide loading feedback
- Show error recovery options

### Transitions
- Animate state changes (200-300ms)
- Provide visual feedback
- Maintain context during transitions
- Prevent jarring changes
- Use skeleton screens for loading

### User Feedback
- Show progress indicators
- Provide time estimates
- Explain what's happening
- Offer cancellation when possible
- Confirm successful actions

---

**Version**: 1.0  
**Last Updated**: February 20, 2026
