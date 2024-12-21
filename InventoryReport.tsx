import React, { useState, useEffect } from 'react';
import ReportService, { InventoryReportParams } from '../../services/ReportService';

interface InventoryData {
  summary: {
    category: string;
    total_products: number;
    total_stock: number;
    total_value: number;
  }[];
  details: any[];
  total_value: number;
  low_stock_count: number;
}

export const InventoryReport: React.FC = () => {
  const [data, setData] = useState<InventoryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<InventoryReportParams>({
    category: '',
    lowStockOnly: false,
  });

  const fetchReport = async (params: InventoryReportParams) => {
    try {
      setLoading(true);
      const response = await ReportService.getInventoryReport(params) as InventoryData;
      setData(response);
    } catch (error) {
      console.error('Error fetching inventory report:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport(filters);
  }, [filters]);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex gap-4">
          <select
            value={filters.category}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFilters({ ...filters, category: e.target.value })}
            className="rounded-md border-gray-300 shadow-sm"
          >
            <option value="">All Categories</option>
            {data?.summary.map((item) => (
              <option key={item.category} value={item.category}>
                {item.category}
              </option>
            ))}
          </select>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={filters.lowStockOnly}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFilters({ ...filters, lowStockOnly: e.target.checked })}
              className="rounded border-gray-300"
            />
            Low Stock Only
          </label>
        </div>
        <button
          onClick={() => ReportService.exportReport({
            type: 'inventory',
            format: 'excel',
            ...filters,
          })}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          Export Report
        </button>
      </div>

      {data && (
        <>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-lg font-medium">Total Inventory Value</h3>
              <p className="text-2xl font-bold">${data.total_value.toFixed(2)}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-lg font-medium">Low Stock Items</h3>
              <p className="text-2xl font-bold">{data.low_stock_count}</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow">
            <div className="p-4 border-b">
              <h3 className="text-lg font-medium">Inventory by Category</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Products
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Total Stock
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Value
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {data.summary.map((item) => (
                    <tr key={item.category}>
                      <td className="px-6 py-4 whitespace-nowrap">{item.category}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{item.total_products}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{item.total_stock}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        ${item.total_value.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}; 