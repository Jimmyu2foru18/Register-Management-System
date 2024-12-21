import { BaseService } from './BaseService';
import { Product } from '../types';

export interface StockAlert {
  product: Product;
  currentStock: number;
  minimumLevel: number;
  reorderQuantity: number;
}

export class AlertService extends BaseService {
  static async getLowStockAlerts(): Promise<StockAlert[]> {
    return this.get<StockAlert[]>('/alerts/low-stock');
  }

  static async markAlertAsHandled(productId: number): Promise<void> {
    return this.post<void>(`/alerts/low-stock/${productId}/handled`, {});
  }

  static async createReorderRequest(
    productId: number,
    quantity: number
  ): Promise<void> {
    return this.post<void>('/orders', { productId, quantity });
  }
} 