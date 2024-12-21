import React, { useState, useEffect } from 'react';
import { ProductService } from '../../services/ProductService';
import { InventoryTable } from '../../components/inventory/InventoryTable';
import { ProductForm } from '../../components/inventory/ProductForm';
import { Product } from '../../types';

export const InventoryPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const data = await ProductService.getProducts();
      setProducts(data);
    } catch (error) {
      console.error('Error loading products:', error);
      // Handle error (show notification)
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProduct = async (data: Omit<Product, 'id'>) => {
    try {
      await ProductService.createProduct(data);
      await loadProducts();
      setIsFormOpen(false);
    } catch (error) {
      console.error('Error creating product:', error);
      // Handle error
    }
  };

  const handleUpdateProduct = async (data: Omit<Product, 'id'>) => {
    if (!selectedProduct) return;

    try {
      await ProductService.updateProduct(selectedProduct.id, data);
      await loadProducts();
      setIsFormOpen(false);
      setSelectedProduct(null);
    } catch (error) {
      console.error('Error updating product:', error);
      // Handle error
    }
  };

  const handleDeleteProduct = async (productId: number) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    try {
      await ProductService.deleteProduct(productId);
      await loadProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      // Handle error
    }
  };

  const handleUpdateStock = async (productId: number, quantity: number) => {
    try {
      await ProductService.updateStock(productId, quantity);
      await loadProducts();
    } catch (error) {
      console.error('Error updating stock:', error);
      // Handle error
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Inventory Management</h1>
        <button
          onClick={() => {
            setSelectedProduct(null);
            setIsFormOpen(true);
          }}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          Add Product
        </button>
      </div>

      {isFormOpen ? (
        <div className="mb-6">
          <ProductForm
            product={selectedProduct || undefined}
            onSubmit={selectedProduct ? handleUpdateProduct : handleCreateProduct}
            onCancel={() => {
              setIsFormOpen(false);
              setSelectedProduct(null);
            }}
          />
        </div>
      ) : (
        <InventoryTable
          products={products}
          onEdit={(product) => {
            setSelectedProduct(product);
            setIsFormOpen(true);
          }}
          onDelete={handleDeleteProduct}
          onUpdateStock={handleUpdateStock}
        />
      )}
    </div>
  );
}; 