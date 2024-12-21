export interface User {
  id: number;
  name: string;
  email: string;
  role: 'employee' | 'supervisor' | 'admin';
  branchId: number;
}

export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  stockQuantity: number;
  minStockLevel: number;
  reorderQuantity: number;
  barcode: string;
}

export interface Transaction {
  id: number;
  userId: number;
  products: TransactionProduct[];
  totalAmount: number;
  paymentMethod: string;
  createdAt: string;
}

export interface TransactionProduct {
  productId: number;
  quantity: number;
  price: number;
}

export interface Branch {
  id: number;
  name: string;
  location: string;
  managerId: number;
}
