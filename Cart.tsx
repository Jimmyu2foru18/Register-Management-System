import React from 'react';
import { Product } from '../../types';

interface CartItem extends Product {
  quantity: number;
}

interface CartProps {
  items: CartItem[];
  onUpdateQuantity: (productId: number, quantity: number) => void;
  onRemoveItem: (productId: number) => void;
}

export const Cart: React.FC<CartProps> = ({
  items,
  onUpdateQuantity,
  onRemoveItem,
}) => {
  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between p-4 border-b"
          >
            <div className="flex-1">
              <h3 className="font-medium">{item.name}</h3>
              <p className="text-gray-600">${item.price.toFixed(2)}</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                className="px-2 py-1 bg-gray-200 rounded"
              >
                -
              </button>
              <span className="w-8 text-center">{item.quantity}</span>
              <button
                onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                className="px-2 py-1 bg-gray-200 rounded"
              >
                +
              </button>
              <button
                onClick={() => onRemoveItem(item.id)}
                className="ml-2 text-red-500"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="p-4 bg-gray-100">
        <div className="flex justify-between mb-4">
          <span className="font-medium">Total:</span>
          <span className="font-medium">${total.toFixed(2)}</span>
        </div>
        <button className="w-full py-2 bg-green-500 text-white rounded hover:bg-green-600">
          Complete Sale
        </button>
      </div>
    </div>
  );
}; 