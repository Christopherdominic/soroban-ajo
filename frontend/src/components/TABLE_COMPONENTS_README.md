# Polished Table Components

A comprehensive set of table components with sorting, filtering, pagination, density controls, and responsive design.

## Components

### DataTable

The main table component with full feature support.

```tsx
import { DataTable, Column } from './DataTable'

const columns: Column<YourDataType>[] = [
  {
    id: 'name',
    header: 'Name',
    accessor: 'name',
    sortable: true,
    render: (value) => <strong>{value}</strong>
  }
]

<DataTable
  data={data}
  columns={columns}
  density="comfortable"
  selectable
  selectedRows={selectedRows}
  onSelectionChange={setSelectedRows}
  loading={false}
  emptyMessage="No data available"
  onRowClick={(row) => console.log(row)}
  stickyHeader
  maxHeight="max-h-[600px]"
/>
```

#### Props

- `data`: Array of data objects
- `columns`: Column definitions
- `density`: 'compact' | 'comfortable' | 'spacious'
- `selectable`: Enable row selection
- `selectedRows`: Set of selected row IDs
- `onSelectionChange`: Callback when selection changes
- `getRowId`: Function to extract row ID (default: row.id)
- `loading`: Show loading state
- `emptyMessage`: Message when no data
- `onRowClick`: Callback when row is clicked
- `stickyHeader`: Make header sticky on scroll
- `maxHeight`: Maximum table height

#### Column Definition

```tsx
interface Column<T> {
  id: string
  header: string
  accessor: keyof T | ((row: T) => React.ReactNode)
  sortable?: boolean
  width?: string
  align?: 'left' | 'center' | 'right'
  render?: (value: any, row: T) => React.ReactNode
}
```

### TablePagination

Pagination controls for tables.

```tsx
import { TablePagination } from './TablePagination'

<TablePagination
  currentPage={1}
  totalPages={10}
  pageSize={25}
  totalItems={250}
  onPageChange={setPage}
  onPageSizeChange={setPageSize}
  pageSizeOptions={[10, 25, 50, 100]}
  showPageSizeSelector
  showItemCount
  compact={false}
/>
```

#### Props

- `currentPage`: Current page number (1-indexed)
- `totalPages`: Total number of pages
- `pageSize`: Items per page
- `totalItems`: Total number of items
- `onPageChange`: Callback when page changes
- `onPageSizeChange`: Callback when page size changes
- `pageSizeOptions`: Available page sizes
- `showPageSizeSelector`: Show page size dropdown
- `showItemCount`: Show item count text
- `compact`: Use compact layout

### TableDensitySelector

Controls for changing table density.

```tsx
import { TableDensitySelector, TableDensityIconButton } from './TableDensitySelector'

// Button group variant
<TableDensitySelector
  density={density}
  onDensityChange={setDensity}
  showLabels={true}
  variant="buttons"
/>

// Dropdown variant
<TableDensitySelector
  density={density}
  onDensityChange={setDensity}
  variant="dropdown"
/>

// Icon button with menu
<TableDensityIconButton
  density={density}
  onDensityChange={setDensity}
/>
```

#### Props

- `density`: Current density setting
- `onDensityChange`: Callback when density changes
- `showLabels`: Show text labels (buttons variant only)
- `variant`: 'buttons' | 'dropdown'

### ResponsiveDataTable

Mobile-responsive table that switches to card view on small screens.

```tsx
import { ResponsiveDataTable } from './ResponsiveDataTable'

<ResponsiveDataTable
  data={data}
  columns={columns}
  mobileBreakpoint={768}
  cardRenderer={(row, isSelected, onSelect) => (
    <div className="p-4">
      {/* Custom mobile card layout */}
    </div>
  )}
/>
```

#### Props

All DataTable props plus:
- `mobileBreakpoint`: Width threshold for mobile view (default: 768)
- `cardRenderer`: Custom renderer for mobile cards

## Hooks

### useTableState

Comprehensive hook for managing table state.

```tsx
import { useTableState } from '../hooks/useTableState'

const table = useTableState({
  data: myData,
  initialPageSize: 10,
  initialDensity: 'comfortable',
  filterFn: (row, filters) => {
    // Custom filter logic
    return true
  }
})

// Access state and actions
table.currentPage
table.paginatedData
table.setCurrentPage(2)
table.updateFilter('status', 'active')
table.selectAll()
```

#### Returned Values

**Pagination:**
- `currentPage`, `pageSize`, `totalPages`, `paginatedData`
- `setCurrentPage`, `setPageSize`
- `goToFirstPage`, `goToLastPage`, `goToNextPage`, `goToPreviousPage`

**Filtering:**
- `filters`, `filteredData`, `hasFilters`
- `setFilters`, `updateFilter`, `clearFilters`

**Selection:**
- `selectedRows`, `hasSelection`
- `setSelectedRows`, `selectRow`, `deselectRow`, `toggleRow`
- `selectAll`, `deselectAll`, `isRowSelected`

**Density:**
- `density`, `setDensity`

**Sorting:**
- `sortColumn`, `sortDirection`, `setSorting`

**Computed:**
- `totalItems`

## Examples

### Basic Table

```tsx
import { DataTable, Column } from './components/DataTable'

interface User {
  id: string
  name: string
  email: string
}

const columns: Column<User>[] = [
  { id: 'name', header: 'Name', accessor: 'name', sortable: true },
  { id: 'email', header: 'Email', accessor: 'email', sortable: true }
]

function MyTable() {
  const [users] = useState<User[]>([...])
  
  return <DataTable data={users} columns={columns} />
}
```

### Table with Pagination

```tsx
import { DataTable } from './components/DataTable'
import { TablePagination } from './components/TablePagination'
import { useTableState } from './hooks/useTableState'

function PaginatedTable() {
  const table = useTableState({ data: myData })
  
  return (
    <>
      <DataTable
        data={table.paginatedData}
        columns={columns}
      />
      <TablePagination
        currentPage={table.currentPage}
        totalPages={table.totalPages}
        pageSize={table.pageSize}
        totalItems={table.totalItems}
        onPageChange={table.setCurrentPage}
        onPageSizeChange={table.setPageSize}
      />
    </>
  )
}
```

### Full-Featured Table

See `AdvancedDataTableExample.tsx` for a complete implementation with:
- Filtering
- Sorting
- Pagination
- Row selection
- Density controls
- Export functionality
- Bulk actions

## Styling

Components use Tailwind CSS classes and follow the existing design system. Key features:

- Consistent spacing and typography
- Hover and focus states
- Smooth transitions
- Accessible color contrasts
- Responsive breakpoints

## Accessibility

All components include:
- Proper ARIA labels and roles
- Keyboard navigation support
- Focus indicators
- Screen reader announcements
- Semantic HTML structure

## Performance

- Memoized computations with `useMemo`
- Optimized re-renders with `useCallback`
- Efficient sorting and filtering
- Virtual scrolling ready (can be added)

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Chrome Mobile)
- Responsive design for all screen sizes
