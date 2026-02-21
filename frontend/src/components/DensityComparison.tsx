// Visual comparison of table density options
// Use this component to demonstrate density differences

import React, { useState } from 'react'
import { DataTable, Column, DensityOption } from './DataTable'
import { TableDensitySelector } from './TableDensitySelector'

interface SampleData {
  id: string
  product: string
  category: string
  price: number
  stock: number
}

const sampleData: SampleData[] = [
  { id: '1', product: 'Laptop', category: 'Electronics', price: 999, stock: 15 },
  { id: '2', product: 'Mouse', category: 'Accessories', price: 29, stock: 150 },
  { id: '3', product: 'Keyboard', category: 'Accessories', price: 79, stock: 85 },
  { id: '4', product: 'Monitor', category: 'Electronics', price: 349, stock: 42 },
  { id: '5', product: 'Webcam', category: 'Electronics', price: 89, stock: 67 },
]

const columns: Column<SampleData>[] = [
  { id: 'product', header: 'Product', accessor: 'product', sortable: true },
  { id: 'category', header: 'Category', accessor: 'category', sortable: true },
  {
    id: 'price',
    header: 'Price',
    accessor: 'price',
    sortable: true,
    align: 'right',
    render: (value) => `$${value}`,
  },
  {
    id: 'stock',
    header: 'Stock',
    accessor: 'stock',
    sortable: true,
    align: 'right',
    render: (value) => (
      <span className={value < 50 ? 'text-red-600 font-semibold' : 'text-green-600'}>
        {value}
      </span>
    ),
  },
]

export const DensityComparison: React.FC = () => {
  const [density, setDensity] = useState<DensityOption>('comfortable')

  return (
    <div className="p-6 space-y-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Table Density Demo</h2>
            <p className="text-sm text-gray-600 mt-1">
              Switch between density options to see the difference
            </p>
          </div>
          <TableDensitySelector
            density={density}
            onDensityChange={setDensity}
            showLabels={true}
          />
        </div>

        <DataTable data={sampleData} columns={columns} density={density} />

        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold text-gray-900 mb-2">Current Density: {density}</h3>
          <div className="text-sm text-gray-600 space-y-1">
            {density === 'compact' && (
              <>
                <p>• Minimal padding for maximum data visibility</p>
                <p>• Best for data-heavy tables with many rows</p>
                <p>• Smaller text and tighter spacing</p>
              </>
            )}
            {density === 'comfortable' && (
              <>
                <p>• Balanced spacing for general use</p>
                <p>• Default option for most tables</p>
                <p>• Good readability and data density</p>
              </>
            )}
            {density === 'spacious' && (
              <>
                <p>• Maximum padding for easy reading</p>
                <p>• Best for tables with fewer rows</p>
                <p>• Larger text and generous spacing</p>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Side-by-side comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {(['compact', 'comfortable', 'spacious'] as DensityOption[]).map((d) => (
          <div key={d} className="bg-white rounded-lg shadow p-4">
            <h3 className="font-semibold text-gray-900 mb-3 capitalize">{d}</h3>
            <DataTable data={sampleData.slice(0, 3)} columns={columns} density={d} />
          </div>
        ))}
      </div>
    </div>
  )
}
