import React, { useState, useEffect } from 'react';
import { StatCard } from '../../components/dashboard/StatCard';
import { SalesChart } from '../../components/dashboard/SalesChart';
import { RecentTransactions } from '../../components/dashboard/RecentTransactions';
import { Transaction } from '../../types';

// Icons (you'll need to install an icon library like @heroicons/react)
import { 
  CurrencyDollarIcon, 
  ShoppingCartIcon, 
  UserGroupIcon, 
  ExclamationIcon 
} from '@heroicons/react/outline';

export const DashboardPage: React.FC = () => {
  const [salesData, setSalesData] = useState([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch dashboard data
    const fetchDashboardData = async () => {
      try {
        // TODO: Implement API calls
        // const data = await DashboardService.getData();
        setLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Sales"
          value="$12,345"
          icon={<CurrencyDollarIcon className="h-8 w-8" />}
          trend={{ value: 12, isPositive: true }}
        />
        <StatCard
          title="Orders"
          value="123"
          icon={<ShoppingCartIcon className="h-8 w-8" />}
          trend={{ value: 5, isPositive: true }}
        />
        <StatCard
          title="Customers"
          value="1,234"
          icon={<UserGroupIcon className="h-8 w-8" />}
          trend={{ value: 8, isPositive: true }}
        />
        <StatCard
          title="Low Stock Items"
          value="12"
          icon={<ExclamationIcon className="h-8 w-8" />}
          trend={{ value: 2, isPositive: false }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <SalesChart data={salesData} />
        <RecentTransactions transactions={transactions} />
      </div>
    </div>
  );
}; 