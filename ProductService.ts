import { BaseService } from './BaseService';
import { Product } from '../types';

export class ProductService extends BaseService {
  static async getProducts(params?: {
    category?: string;
    search?: string;
    lowStock?: boolean;
  }): Promise<Product[]> {
    return this.get<Product[]>('/products', { params });
  }

  static async getProduct(id: number): Promise<Product> {
    return this.get<Product>(`/products/${id}`);
  }

  static async createProduct(data: Omit<Product, 'id'>): Promise<Product> {
    return this.post<Product>('/products', data);
  }

  static async updateProduct(id: number, data: Partial<Product>): Promise<Product> {
    return this.put<Product>(`/products/${id}`, data);
  }

  static async deleteProduct(id: number): Promise<void> {
    return this.delete<void>(`/products/${id}`);
  }

  static async updateStock(id: number, quantity: number): Promise<Product> {
    return this.put<Product>(`/products/${id}/stock`, { quantity });
  }

  static async searchByBarcode(barcode: string): Promise<Product> {
    return this.get<Product>(`/products/barcode/${barcode}`);
  }
} 