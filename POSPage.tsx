import React, { useState } from 'react';
import { ProductScanner } from '../../components/pos/ProductScanner';
import { Cart } from '../../components/pos/Cart';
import { Product } from '../../types';

interface CartItem extends Product {
  quantity: number;
}

export const POSPage: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const handleProductScanned = (product: Product) => {
    setCartItems((items) => {
      const existingItem = items.find((item) => item.id === product.id);
      
      if (existingItem) {
        return items.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...items, { ...product, quantity: 1 }];
    });
  };

  const handleUpdateQuantity = (productId: number, quantity: number) => {
    if (quantity < 1) {
      handleRemoveItem(productId);
      return;
    }

    setCartItems((items) =>
      items.map((item) =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const handleRemoveItem = (productId: number) => {
    setCartItems((items) => items.filter((item) => item.id !== productId));
  };

  return (
    <div className="h-screen flex">
      <div className="flex-1 p-4">
        <ProductScanner onProductScanned={handleProductScanned} />
        {/* Add product grid/search here */}
      </div>
      <div className="w-96 border-l">
        <Cart
          items={cartItems}
          onUpdateQuantity={handleUpdateQuantity}
          onRemoveItem={handleRemoveItem}
        />
      </div>
    </div>
  );
}; 