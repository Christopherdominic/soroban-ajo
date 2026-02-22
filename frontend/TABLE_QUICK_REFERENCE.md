# Table Components - Quick Reference

## 🚀 Quick Start

```tsx
import { DataTable, Column } from './components/DataTable'

const columns: Column<MyData>[] = [
  { id: 'name', header: 'Name', accessor: 'name', sortable: true }
]

<DataTable data={myData} columns={columns} />
```

## 📦 Components

| Component | Purpose | Size |
|-----------|---------|------|
| `DataTable` | Main table with all features | 9.4 KB |
| `TablePagination` | Page navigation controls | 6.5 KB |
| `TableDensitySelector` | Density toggle | 5.9 KB |
| `ResponsiveDataTable` | Mobile-responsive wrapper | 3.3 KB |
| `useTableState` | State management hook | 5.6 KB |

## 🎨 Density Options

```tsx
<DataTable density="compact" />      // Minimal spacing
<DataTable density="comfortable" />  // Balanced (default)
<DataTable density="spacious" />     // Maximum spacing
```

## 📊 Column Definition

```tsx
{
  id: 'unique-id',              // Required: unique identifier
  header: 'Display Name',       // Required: column header text
  accessor: 'fieldName',        // Required: data field or function
  sortable: true,               // Optional: enable sorting
  width: '200px',               // Optional: column width
  align: 'left',                // Optional: left|center|right
  render: (value, row) => (     // Optional: custom rendering
    <span>{value}</span>
  )
}
```

## 🔧 Common Patterns

### With Pagination
```tsx
const table = useTableState({ data })

<DataTable data={table.paginatedData} columns={columns} />
<TablePagination {...table} />
```

### With Selection
```tsx
<DataTable
  selectable
  selectedRows={selected}
  onSelectionChange={setSelected}
/>
```

### With Filtering
```tsx
const table = useTableState({
  data,
  filterFn: (row, filters) => row.status === filters.status
})
```

### With Export
```tsx
const exportCSV = () => {
  const csv = data.map(row => Object.values(row).join(',')).join('\n')
  // Download logic
}
```

## 🎯 Props Cheat Sheet

### DataTable
```tsx
data          // Array of data objects
columns       // Column definitions
density       // 'compact' | 'comfortable' | 'spacious'
selectable    // Enable row selection
selectedRows  // Set<string> of selected IDs
loading       // Show loading state
emptyMessage  // Custom empty message
onRowClick    // Row click handler
stickyHeader  // Sticky header on scroll
maxHeight     // Max table height
```

### TablePagination
```tsx
currentPage   // Current page number (1-indexed)
totalPages    // Total number of pages
pageSize      // Items per page
totalItems    // Total item count
onPageChange  // Page change handler
onPageSizeChange // Page size change handler
compact       // Use compact layout
```

### TableDensitySelector
```tsx
density       // Current density
onDensityChange // Density change handler
showLabels    // Show text labels
variant       // 'buttons' | 'dropdown'
```

## 📱 Responsive Usage

```tsx
<ResponsiveDataTable
  mobileBreakpoint={768}
  cardRenderer={(row, isSelected, onSelect) => (
    <div>{/* Custom mobile card */}</div>
  )}
/>
```

## 🪝 Hook Usage

```tsx
const table = useTableState({
  data: myData,
  initialPageSize: 10,
  initialDensity: 'comfortable',
  filterFn: (row, filters) => true
})

// Access everything:
table.currentPage
table.paginatedData
table.selectedRows
table.filters
table.density
table.setCurrentPage(2)
table.updateFilter('status', 'active')
table.selectAll()
```

## 🎨 Custom Rendering

```tsx
{
  id: 'status',
  header: 'Status',
  accessor: 'status',
  render: (value) => (
    <span className={`badge ${value}`}>
      {value}
    </span>
  )
}
```

## 📂 File Locations

```
src/
├── components/
│   ├── DataTable.tsx
│   ├── TablePagination.tsx
│   ├── TableDensitySelector.tsx
│   ├── ResponsiveDataTable.tsx
│   ├── DataTableExample.tsx
│   ├── AdvancedDataTableExample.tsx
│   └── DensityComparison.tsx
├── hooks/
│   └── useTableState.ts
└── pages/
    └── TableShowcase.tsx
```

## 🔍 Examples

- **Basic**: `DataTableExample.tsx`
- **Advanced**: `AdvancedDataTableExample.tsx`
- **Density**: `DensityComparison.tsx`
- **Showcase**: `pages/TableShowcase.tsx`

## ⌨️ Keyboard Shortcuts

- `Tab` - Navigate between elements
- `Enter` - Activate buttons/links
- `Space` - Toggle checkboxes
- `Arrow Keys` - Navigate table (when focused)

## 🎯 Common Use Cases

### Simple Table
```tsx
<DataTable data={data} columns={columns} />
```

### Sortable Table
```tsx
const columns = [
  { id: 'name', header: 'Name', accessor: 'name', sortable: true }
]
```

### Paginated Table
```tsx
const table = useTableState({ data })
<DataTable data={table.paginatedData} columns={columns} />
<TablePagination {...table} />
```

### Selectable Table
```tsx
const [selected, setSelected] = useState(new Set())
<DataTable selectable selectedRows={selected} onSelectionChange={setSelected} />
```

### Filtered Table
```tsx
const table = useTableState({ data, filterFn })
<input onChange={(e) => table.updateFilter('search', e.target.value)} />
<DataTable data={table.paginatedData} columns={columns} />
```

## 📚 Documentation

- **Full API**: `TABLE_COMPONENTS_README.md`
- **Guide**: `TABLE_COMPONENTS_GUIDE.md`
- **Summary**: `TABLE_COMPONENTS_SUMMARY.md`
- **Checklist**: `TABLE_IMPLEMENTATION_CHECKLIST.md`

## ✅ Status

**COMPLETE** - All features implemented and ready to use!
