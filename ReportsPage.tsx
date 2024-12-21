import React, { useState } from 'react';
import { SalesReport } from '../../components/reports/SalesReport';
import { InventoryReport } from '../../components/reports/InventoryReport';
import { ProductPerformanceReport } from '../../components/reports/ProductPerformanceReport';

type ReportType = 'sales' | 'inventory' | 'performance';

export const ReportsPage: React.FC = () => {
  const [activeReport, setActiveReport] = useState<ReportType>('sales');

  const renderReport = () => {
    switch (activeReport) {
      case 'sales':
        return <SalesReport />;
      case 'inventory':
        return <InventoryReport />;
      case 'performance':
        return <ProductPerformanceReport />;
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-4">Reports</h1>
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'sales', label: 'Sales Report' },
              { id: 'inventory', label: 'Inventory Report' },
              { id: 'performance', label: 'Product Performance' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveReport(tab.id as ReportType)}
                className={`
                  py-4 px-1 border-b-2 font-medium text-sm
                  ${
                    activeReport === tab.id
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                `}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {renderReport()}
    </div>
  );
}; 