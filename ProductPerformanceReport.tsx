import React, { useState, useEffect } from 'react';
import { DateRangeSelector } from './DateRangeSelector';
import ReportService, { ProductPerformanceParams } from '../../services/ReportService';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

interface ProductPerformanceData {
  top_products: {
    id: number;
    name: string;
    category: string;
    total_quantity: number;
    total_revenue: number;
  }[];
  period: {
    start: string;
    end: string;
  };
  summary: {
    total_revenue: number;
    total_quantity: number;
  };
}

export const ProductPerformanceReport: React.FC = () => {
  const [data, setData] = useState<ProductPerformanceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [limit, setLimit] = useState(10);

  const fetchReport = async (params: ProductPerformanceParams) => {
    try {
      setLoading(true);
      const response = await ReportService.getProductPerformance(params) as ProductPerformanceData;
      setData(response);
    } catch (error) {
      console.error('Error fetching product performance report:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDateRangeSubmit = (dates: { startDate: string; endDate: string }) => {
    fetchReport({ ...dates, limit });
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <DateRangeSelector onSubmit={handleDateRangeSubmit} />
        <div className="flex gap-4 items-center">
          <label className="flex items-center gap-2">
            <span className="text-sm text-gray-700">Top Products</span>
            <select
              value={limit}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setLimit(Number(e.target.value))}
              className="rounded-md border-gray-300 shadow-sm"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
            </select>
          </label>
          <button
            onClick={() =>
              ReportService.exportReport({
                type: 'product-performance',
                format: 'excel',
                startDate: data?.period.start,
                endDate: data?.period.end,
              })
            }
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Export Report
          </button>
        </div>
      </div>

      {data && (
        <>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-lg font-medium">Total Revenue</h3>
              <p className="text-2xl font-bold">${data.summary.total_revenue.toFixed(2)}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-lg font-medium">Total Units Sold</h3>
              <p className="text-2xl font-bold">{data.summary.total_quantity}</p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-medium mb-4">Top Products by Revenue</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.top_products}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                  <YAxis yAxisId="revenue" orientation="left" stroke="#4F46E5" />
                  <YAxis yAxisId="quantity" orientation="right" stroke="#10B981" />
                  <Tooltip />
                  <Legend />
                  <Bar
                    yAxisId="revenue"
                    dataKey="total_revenue"
                    name="Revenue"
                    fill="#4F46E5"
                  />
                  <Bar
                    yAxisId="quantity"
                    dataKey="total_quantity"
                    name="Units Sold"
                    fill="#10B981"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow">
            <div className="p-4 border-b">
              <h3 className="text-lg font-medium">Product Details</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Product
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Units Sold
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Revenue
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {data.top_products.map((product) => (
                    <tr key={product.id}>
                      <td className="px-6 py-4 whitespace-nowrap">{product.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{product.category}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{product.total_quantity}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        ${product.total_revenue.toFixed(2)}
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