<?php

namespace App\Services;

use App\Models\Transaction;
use App\Models\Product;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class AnalyticsService
{
    public function getSalesAnalytics(string $startDate, string $endDate, string $groupBy = 'day')
    {
        $query = Transaction::whereBetween('created_at', [$startDate, $endDate]);

        $groupFormat = match ($groupBy) {
            'hour' => '%Y-%m-%d %H:00',
            'day' => '%Y-%m-%d',
            'week' => '%Y-%u',
            'month' => '%Y-%m',
            default => '%Y-%m-%d',
        };

        return $query->select([
            DB::raw("DATE_FORMAT(created_at, '$groupFormat') as period"),
            DB::raw('COUNT(*) as transaction_count'),
            DB::raw('SUM(total_amount) as total_sales'),
            DB::raw('AVG(total_amount) as average_sale'),
            DB::raw('COUNT(DISTINCT user_id) as unique_customers')
        ])
        ->groupBy('period')
        ->orderBy('period')
        ->get();
    }

    public function getProductPerformance(string $startDate, string $endDate)
    {
        return DB::table('transaction_product')
            ->join('products', 'transaction_product.product_id', '=', 'products.id')
            ->join('transactions', 'transaction_product.transaction_id', '=', 'transactions.id')
            ->whereBetween('transactions.created_at', [$startDate, $endDate])
            ->select(
                'products.id',
                'products.name',
                'products.category',
                DB::raw('SUM(transaction_product.quantity) as total_quantity'),
                DB::raw('SUM(transaction_product.quantity * transaction_product.price) as total_revenue'),
                DB::raw('COUNT(DISTINCT transactions.id) as appearance_in_transactions')
            )
            ->groupBy('products.id', 'products.name', 'products.category')
            ->orderByDesc('total_revenue')
            ->get();
    }

    public function getEmployeePerformance(string $startDate, string $endDate)
    {
        return DB::table('employee_performance')
            ->join('users', 'employee_performance.user_id', '=', 'users.id')
            ->whereBetween('date', [$startDate, $endDate])
            ->select(
                'users.id',
                'users.name',
                DB::raw('SUM(transactions_count) as total_transactions'),
                DB::raw('SUM(total_sales) as total_sales'),
                DB::raw('SUM(items_processed) as total_items'),
                DB::raw('AVG(average_transaction_time) as avg_transaction_time')
            )
            ->groupBy('users.id', 'users.name')
            ->get();
    }

    public function predictSales(string $productId, int $daysAhead = 7)
    {
        // Simple moving average prediction
        $historicalData = DB::table('transaction_product')
            ->join('transactions', 'transaction_product.transaction_id', '=', 'transactions.id')
            ->where('product_id', $productId)
            ->whereBetween('transactions.created_at', [
                Carbon::now()->subDays(30),
                Carbon::now()
            ])
            ->select(
                DB::raw('DATE(transactions.created_at) as date'),
                DB::raw('SUM(quantity) as total_quantity')
            )
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        // Calculate moving average
        $movingAverage = $historicalData->avg('total_quantity');

        return [
            'product_id' => $productId,
            'predicted_daily_sales' => $movingAverage,
            'confidence_score' => 0.7, // Simplified confidence score
            'predictions' => collect(range(1, $daysAhead))->map(fn($day) => [
                'date' => Carbon::now()->addDays($day)->format('Y-m-d'),
                'predicted_quantity' => $movingAverage,
            ])
        ];
    }
} 