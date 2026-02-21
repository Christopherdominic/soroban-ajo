// Comprehensive showcase of all table components and features
// Use this page to test and demonstrate table functionality

import React from 'react'
import { DataTableExample } from '../components/DataTableExample'
import { AdvancedDataTableExample } from '../components/AdvancedDataTableExample'
import { DensityComparison } from '../components/DensityComparison'

export const TableShowcase: React.FC = () => {
  const [activeTab, setActiveTab] = React.useState<'basic' | 'advanced' | 'density'>('basic')

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <h1 className="text-3xl font-bold text-gray-900">Table Components Showcase</h1>
            <p className="mt-2 text-gray-600">
              Polished table components with sorting, filtering, pagination, and density controls
            </p>
          </div>

          {/* Tabs */}
          <div className="flex space-x-1 border-b border-gray-200">
            <button
              onClick={() => setActiveTab('basic')}
              className={`px-6 py-3 font-medium text-sm transition-colors ${
                activeTab === 'basic'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Basic Example
            </button>
            <button
              onClick={() => setActiveTab('advanced')}
              className={`px-6 py-3 font-medium text-sm transition-colors ${
                activeTab === 'advanced'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Advanced Features
            </button>
            <button
              onClick={() => setActiveTab('density')}
              className={`px-6 py-3 font-medium text-sm transition-colors ${
                activeTab === 'density'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Density Comparison
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Feature Overview */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="flex items-start space-x-3">
              <span className="text-green-600 text-xl">✓</span>
              <div>
                <h3 className="font-semibold text-gray-900">Sortable Columns</h3>
                <p className="text-sm text-gray-600">Click headers to sort data</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-green-600 text-xl">✓</span>
              <div>
                <h3 className="font-semibold text-gray-900">Density Controls</h3>
                <p className="text-sm text-gray-600">Compact, comfortable, spacious</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-green-600 text-xl">✓</span>
              <div>
                <h3 className="font-semibold text-gray-900">Row Selection</h3>
                <p className="text-sm text-gray-600">Select individual or all rows</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-green-600 text-xl">✓</span>
              <div>
                <h3 className="font-semibold text-gray-900">Pagination</h3>
                <p className="text-sm text-gray-600">Navigate large datasets</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-green-600 text-xl">✓</span>
              <div>
                <h3 className="font-semibold text-gray-900">Filtering</h3>
                <p className="text-sm text-gray-600">Search and filter data</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-green-600 text-xl">✓</span>
              <div>
                <h3 className="font-semibold text-gray-900">Responsive</h3>
                <p className="text-sm text-gray-600">Mobile-friendly design</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-green-600 text-xl">✓</span>
              <div>
                <h3 className="font-semibold text-gray-900">Export</h3>
                <p className="text-sm text-gray-600">CSV and JSON export</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-green-600 text-xl">✓</span>
              <div>
                <h3 className="font-semibold text-gray-900">Loading States</h3>
                <p className="text-sm text-gray-600">Spinner and empty states</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-green-600 text-xl">✓</span>
              <div>
                <h3 className="font-semibold text-gray-900">Accessible</h3>
                <p className="text-sm text-gray-600">Keyboard and screen reader support</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'basic' && (
          <div>
            <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">Basic Example</h3>
              <p className="text-sm text-blue-800">
                This example demonstrates core table features including sorting, filtering,
                pagination, and row selection. Try clicking column headers to sort, use the
                filters to narrow results, and select rows to see bulk actions.
              </p>
            </div>
            <DataTableExample />
          </div>
        )}

        {activeTab === 'advanced' && (
          <div>
            <div className="mb-4 p-4 bg-purple-50 border border-purple-200 rounded-lg">
              <h3 className="font-semibold text-purple-900 mb-2">Advanced Features</h3>
              <p className="text-sm text-purple-800">
                This example showcases advanced functionality including export to CSV/JSON,
                bulk actions, advanced filtering, and complete state management using the
                useTableState hook. Select rows and use the export buttons to download data.
              </p>
            </div>
            <AdvancedDataTableExample />
          </div>
        )}

        {activeTab === 'density' && (
          <div>
            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <h3 className="font-semibold text-green-900 mb-2">Density Options</h3>
              <p className="text-sm text-green-800">
                Compare the three density options side-by-side. Compact is ideal for
                data-heavy tables, comfortable is the default balanced option, and spacious
                provides maximum readability for smaller datasets.
              </p>
            </div>
            <DensityComparison />
          </div>
        )}

        {/* Documentation Links */}
        <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Documentation</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <h3 className="font-semibold text-gray-900">API Documentation</h3>
                <p className="text-sm text-gray-600">
                  Detailed component props and usage examples
                </p>
              </div>
              <code className="text-sm text-blue-600">
                src/components/TABLE_COMPONENTS_README.md
              </code>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <h3 className="font-semibold text-gray-900">Implementation Guide</h3>
                <p className="text-sm text-gray-600">
                  Quick start and integration instructions
                </p>
              </div>
              <code className="text-sm text-blue-600">
                frontend/TABLE_COMPONENTS_GUIDE.md
              </code>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <h3 className="font-semibold text-gray-900">Implementation Summary</h3>
                <p className="text-sm text-gray-600">
                  Overview of all created files and features
                </p>
              </div>
              <code className="text-sm text-blue-600">
                frontend/TABLE_COMPONENTS_SUMMARY.md
              </code>
            </div>
          </div>
        </div>

        {/* Component Files */}
        <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Component Files</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <code className="p-3 bg-gray-50 rounded text-sm text-gray-700">
              src/components/DataTable.tsx
            </code>
            <code className="p-3 bg-gray-50 rounded text-sm text-gray-700">
              src/components/TablePagination.tsx
            </code>
            <code className="p-3 bg-gray-50 rounded text-sm text-gray-700">
              src/components/TableDensitySelector.tsx
            </code>
            <code className="p-3 bg-gray-50 rounded text-sm text-gray-700">
              src/components/ResponsiveDataTable.tsx
            </code>
            <code className="p-3 bg-gray-50 rounded text-sm text-gray-700">
              src/hooks/useTableState.ts
            </code>
            <code className="p-3 bg-gray-50 rounded text-sm text-gray-700">
              src/components/DataTableExample.tsx
            </code>
          </div>
        </div>
      </div>
    </div>
  )
}
