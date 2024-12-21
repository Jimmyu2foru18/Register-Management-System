import React, { useState, useEffect, useRef } from 'react';
import { Product } from '../../types';
import { ProductService } from '../../services/ProductService';

export const ProductScanner: React.FC = () => {
  const [barcode, setBarcode] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleBarcodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!barcode) return;

    try {
      const product = await ProductService.searchByBarcode(barcode);
      // onProductScanned(product);
      setBarcode('');
    } catch (error) {
      console.error('Error scanning product:', error);
      // Handle error (show notification, etc.)
    }
  };

  return (
    <form onSubmit={handleBarcodeSubmit} className="flex gap-2">
      <input
        ref={inputRef}
        type="text"
        value={barcode}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setBarcode(e.target.value)}
        placeholder="Scan barcode or enter product code"
        className="flex-1 px-4 py-2 border rounded"
        autoComplete="off"
      />
      <button
        type="submit"
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Add
      </button>
    </form>
  );
}; 