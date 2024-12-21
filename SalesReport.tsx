import React from '../../utils/react-imports';
import { useState, useEffect } from '../../utils/react-imports';
import type { FC } from '../../utils/react-imports';
import { DateRangeSelector } from './DateRangeSelector';
import ReportService, { SalesReportParams } from '../../services/ReportService';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export const SalesReport: FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [groupBy, setGroupBy] = useState<'day' | 'week' | 'month'>('day');

  const fetchReport = async (params: SalesReportParams) => {
    try {
      setLoading(true);
      const response = await ReportService.getSalesReport(params);
      setData(response);
    } catch (error) {
      console.error('Error fetching sales report:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDateRangeSubmit = (dates: { startDate: string; endDate: string }) => {
    fetchReport({ ...dates, groupBy });
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <DateRangeSelector onSubmit={handleDateRangeSubmit} />
        <select
          value={groupBy}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setGroupBy(e.target.value as 'day' | 'week' | 'month')}
          className="rounded-md border-gray-300 shadow-sm"
        >
          <option value="day">Daily</option>
          <option value="week">Weekly</option>
          <option value="month">Monthly</option>
        </select>
      </div>

      {data && (
        <>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-lg font-medium">Total Sales</h3>
              <p className="text-2xl font-bold">${data.summary.total_sales.toFixed(2)}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-lg font-medium">Total Transactions</h3>
              <p className="text-2xl font-bold">{data.summary.total_transactions}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-lg font-medium">Average Transaction</h3>
              <p className="text-2xl font-bold">
                ${data.summary.average_transaction_value.toFixed(2)}
              </p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-medium mb-4">Sales Trend</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="period" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="total_sales"
                    stroke="#4F46E5"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}
    </div>
  );
}; 