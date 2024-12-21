<?php

namespace App\Services;

use App\Models\Product;
use Illuminate\Support\Facades\DB;
use App\Events\LowStockAlert;

class ProductService
{
    public function createProduct(array $data): Product
    {
        return DB::transaction(function () use ($data) {
            return Product::create([
                'name' => $data['name'],
                'category' => $data['category'],
                'price' => $data['price'],
                'stock_quantity' => $data['stockQuantity'],
                'min_stock_level' => $data['minStockLevel'],
                'reorder_quantity' => $data['reorderQuantity'],
                'barcode' => $data['barcode'],
            ]);
        });
    }

    public function updateProduct(Product $product, array $data): Product
    {
        return DB::transaction(function () use ($product, $data) {
            $product->update($data);
            return $product->fresh();
        });
    }

    public function deleteProduct(Product $product): void
    {
        DB::transaction(function () use ($product) {
            $product->delete();
        });
    }

    public function updateStock(Product $product, int $quantity): Product
    {
        return DB::transaction(function () use ($product, $quantity) {
            $product->stock_quantity = $quantity;
            $product->save();

            if ($product->stock_quantity <= $product->min_stock_level) {
                event(new LowStockAlert($product));
            }

            return $product->fresh();
        });
    }
} 