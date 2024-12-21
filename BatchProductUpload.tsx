import React, { useState, useRef } from 'react';
import type { ChangeEvent } from 'react';
import Papa from 'papaparse';
import { Product } from '../../types';

interface BatchUploadProps {
  onUploadComplete: (products: Product[]) => void;
  onError: (error: string) => void;
}

export const BatchProductUpload: React.FC<BatchUploadProps> = ({ 
  onUploadComplete, 
  onError 
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = async (file: File) => {
    setIsProcessing(true);
    try {
      const text = await file.text();
      Papa.parse(text, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          if (results.errors.length > 0) {
            onError('Error parsing CSV file');
            return;
          }

          const products = results.data.map((row: any) => ({
            name: row.name,
            category: row.category,
            price: parseFloat(row.price),
            stockQuantity: parseInt(row.stock_quantity, 10),
            minStockLevel: parseInt(row.min_stock_level, 10),
            reorderQuantity: parseInt(row.reorder_quantity, 10),
            barcode: row.barcode,
          id: row.id,
          }));

          onUploadComplete(products);
        },
        error: (error) => {
          onError(error.message);
        },
      });
    } catch (error) {
      onError('Error reading file');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file && file.type === 'text/csv') {
      processFile(file);
    } else {
      onError('Please upload a CSV file');
    }
  };

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  return (
    <div className="w-full p-6 bg-white rounded-lg shadow">
      <h2 className="text-lg font-medium mb-4">Batch Product Upload</h2>
      
      <div
        className={`
          border-2 border-dashed rounded-lg p-8 text-center
          ${isDragging ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300'}
          transition-colors duration-200
          hover:border-indigo-500 hover:bg-indigo-50
          cursor-pointer
        `}
        onDragOver={(e: React.DragEvent<HTMLDivElement>) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        {isProcessing ? (
          <div className="animate-pulse">Processing...</div>
        ) : (
          <>
            <div className="text-gray-600">
              Drag and drop your CSV file here, or click to select
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              className="hidden"
              onChange={handleFileSelect}
            />
          </>
        )}
      </div>

      <div className="mt-4">
        <h3 className="text-sm font-medium mb-2">CSV Format:</h3>
        <code className="text-xs bg-gray-50 p-2 rounded block">
          name,category,price,stock_quantity,min_stock_level,reorder_quantity,barcode
        </code>
      </div>
    </div>
  );
}; 