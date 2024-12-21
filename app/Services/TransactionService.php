<?php

namespace App\Services;

use App\Models\User;
use App\Models\Product;
use App\Models\Transaction;
use Illuminate\Support\Facades\DB;
use App\Exceptions\InsufficientStockException;

class TransactionService
{
    public function createTransaction(User $user, array $products, string $paymentMethod): Transaction
    {
        return DB::transaction(function () use ($user, $products, $paymentMethod) {
            // Calculate total amount and validate stock
            $totalAmount = 0;
            $transactionProducts = [];

            foreach ($products as $item) {
                $product = Product::findOrFail($item['productId']);
                
                if ($product->stock_quantity < $item['quantity']) {
                    throw new InsufficientStockException(
                        "Insufficient stock for product: {$product->name}"
                    );
                }

                $totalAmount += $product->price * $item['quantity'];
                $transactionProducts[] = [
                    'product_id' => $product->id,
                    'quantity' => $item['quantity'],
                    'price' => $product->price,
                ];

                // Update stock
                $product->stock_quantity -= $item['quantity'];
                $product->save();
            }

            // Create transaction
            $transaction = Transaction::create([
                'user_id' => $user->id,
                'total_amount' => $totalAmount,
                'payment_method' => $paymentMethod,
            ]);

            // Attach products to transaction
            foreach ($transactionProducts as $item) {
                $transaction->products()->attach($item['product_id'], [
                    'quantity' => $item['quantity'],
                    'price' => $item['price'],
                ]);
            }

            return $transaction->load('products');
        });
    }
} 