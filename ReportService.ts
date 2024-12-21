import { BaseService } from './BaseService';

export interface SalesReportParams {
  startDate: string;
  endDate: string;
  groupBy: 'day' | 'week' | 'month';
}

export interface InventoryReportParams {
  category?: string;
  lowStockOnly?: boolean;
}

export interface ProductPerformanceParams {
  startDate: string;
  endDate: string;
  limit?: number;
}

export interface ExportParams {
  type: 'sales' | 'inventory' | 'product-performance';
  format: 'excel' | 'csv';
  startDate?: string;
  endDate?: string;
  category?: string;
  lowStockOnly?: boolean;
}

class ReportService extends BaseService {
  static async getSalesReport(params: SalesReportParams) {
    return this.get('/reports/sales', { params });
  }

  static async getInventoryReport(params: InventoryReportParams = {}) {
    return this.get('/reports/inventory', { params });
  }

  static async getProductPerformance(params: ProductPerformanceParams) {
    return this.get('/reports/product-performance', { params });
  }

  static async exportReport(params: ExportParams) {
    const response = await this.post<{ download_url: string }>('/reports/export', params);
    window.location.href = response.download_url;
    return response;
  }
}

export default ReportService; 