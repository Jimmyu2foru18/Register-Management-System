<?php

namespace App\Services;

use App\Models\Product;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class BatchOperationService
{
    public function importProducts(array $products): array
    {
        $imported = [];
        $failed = [];

        DB::beginTransaction();
        try {
            foreach ($products as $productData) {
                try {
                    $product = Product::create([
                        'name' => $productData['name'],
                        'category' => $productData['category'],
                        'price' => $productData['price'],
                        'stock_quantity' => $productData['stock_quantity'],
                        'min_stock_level' => $productData['min_stock_level'],
                        'reorder_quantity' => $productData['reorder_quantity'],
                        'barcode' => $productData['barcode'],
                    ]);
                    $imported[] = $product->id;
                } catch (\Exception $e) {
                    $failed[] = [
                        'data' => $productData,
                        'error' => $e->getMessage()
                    ];
                    Log::error('Failed to import product', [
                        'data' => $productData,
                        'error' => $e->getMessage()
                    ]);
                }
            }
            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }

        return [
            'imported' => $imported,
            'failed' => $failed
        ];
    }

    public function updateStock(array $updates): array
    {
        $updated = [];
        $failed = [];

        DB::beginTransaction();
        try {
            foreach ($updates as $update) {
                try {
                    $product = Product::findOrFail($update['id']);
                    $product->stock_quantity = $update['quantity'];
                    $product->save();
                    $updated[] = $product->id;
                } catch (\Exception $e) {
                    $failed[] = [
                        'id' => $update['id'],
                        'error' => $e->getMessage()
                    ];
                }
            }
            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }

        return [
            'updated' => $updated,
            'failed' => $failed
        ];
    }

    public function updatePrices(array $updates): array
    {
        $updated = [];
        $failed = [];

        DB::beginTransaction();
        try {
            foreach ($updates as $update) {
                try {
                    $product = Product::findOrFail($update['id']);
                    $product->price = $update['price'];
                    $product->save();
                    $updated[] = $product->id;
                } catch (\Exception $e) {
                    $failed[] = [
                        'id' => $update['id'],
                        'error' => $e->getMessage()
                    ];
                }
            }
            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }

        return [
            'updated' => $updated,
            'failed' => $failed
        ];
    }
} 