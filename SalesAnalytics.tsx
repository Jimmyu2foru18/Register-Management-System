import React, { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { DateRangeSelector } from '../reports/DateRangeSelector';

interface SalesData {
  period: string;
  transaction_count: number;
  total_sales: number;
  average_sale: number;
  unique_customers: number;
}

export const SalesAnalytics: React.FC = () => {
  const [data, setData] = useState<SalesData[]>([]);
  const [loading, setLoading] = useState(true);
  const [groupBy, setGroupBy] = useState<'hour' | 'day' | 'week' | 'month'>('day');

  const fetchData = async (startDate: string, endDate: string) => {
    try {
      const response = await fetch(`/api/analytics/sales?start_date=${startDate}&end_date=${endDate}&group_by=${groupBy}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error('Error fetching sales data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">Sales Analytics</h2>
      <div className="flex justify-between mb-6">
        <DateRangeSelector onSubmit={({ startDate, endDate }) => fetchData(startDate, endDate)} />
        <select
          value={groupBy}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setGroupBy(e.target.value as typeof groupBy)}
          className="rounded-md border-gray-300"
        >
          <option value="hour">Hourly</option>
          <option value="day">Daily</option>
          <option value="week">Weekly</option>
          <option value="month">Monthly</option>
        </select>
      </div>

      {loading ? (
        <Loading />
      ) : (
        <>
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="period" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="total_sales"
                  stroke="#8884d8"
                  name="Total Sales"
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="transaction_count"
                  stroke="#82ca9d"
                  name="Transactions"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-500">Total Sales</h3>
              <p className="mt-1 text-2xl font-semibold text-gray-900">
                ${data.reduce((sum: number, item: SalesData) => sum + item.total_sales, 0).toFixed(2)}
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-500">Total Transactions</h3>
              <p className="mt-1 text-2xl font-semibold text-gray-900">
                {data.reduce((sum: number, item: SalesData) => sum + item.transaction_count, 0)}
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-500">Average Sale</h3>
              <p className="mt-1 text-2xl font-semibold text-gray-900">
                ${(data.reduce((sum: number, item: SalesData) => sum + item.average_sale, 0) / data.length).toFixed(2)}
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}; 