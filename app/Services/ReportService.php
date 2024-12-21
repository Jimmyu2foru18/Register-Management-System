<?php

namespace App\Services;

use App\Models\Product;
use App\Models\Transaction;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class ReportService
{
    public function generateSalesReport(string $startDate, string $endDate, string $groupBy): array
    {
        $query = Transaction::query()
            ->whereBetween('created_at', [$startDate, $endDate]);

        switch ($groupBy) {
            case 'day':
                $format = '%Y-%m-%d';
                break;
            case 'week':
                $format = '%Y-%u';
                break;
            case 'month':
                $format = '%Y-%m';
                break;
        }

        $sales = $query->select(
            DB::raw("DATE_FORMAT(created_at, '$format') as period"),
            DB::raw('COUNT(*) as total_transactions'),
            DB::raw('SUM(total_amount) as total_sales')
        )
            ->groupBy('period')
            ->orderBy('period')
            ->get();

        return [
            'data' => $sales,
            'summary' => [
                'total_sales' => $sales->sum('total_sales'),
                'total_transactions' => $sales->sum('total_transactions'),
                'average_transaction_value' => $sales->avg('total_sales'),
            ],
        ];
    }

    public function generateInventoryReport(?string $category, bool $lowStockOnly): array
    {
        $query = Product::query()
            ->select(
                'category',
                DB::raw('COUNT(*) as total_products'),
                DB::raw('SUM(stock_quantity) as total_stock'),
                DB::raw('SUM(stock_quantity * price) as total_value')
            );

        if ($category) {
            $query->where('category', $category);
        }

        if ($lowStockOnly) {
            $query->whereColumn('stock_quantity', '<=', 'min_stock_level');
        }

        $summary = $query->groupBy('category')->get();

        $details = Product::query()
            ->when($category, fn($q) => $q->where('category', $category))
            ->when($lowStockOnly, fn($q) => $q->whereColumn('stock_quantity', '<=', 'min_stock_level'))
            ->get();

        return [
            'summary' => $summary,
            'details' => $details,
            'total_value' => $summary->sum('total_value'),
            'low_stock_count' => $details->where('stock_quantity', '<=', DB::raw('min_stock_level'))->count(),
        ];
    }

    public function generateProductPerformanceReport(
        string $startDate,
        string $endDate,
        int $limit
    ): array {
        $topProducts = DB::table('transaction_product')
            ->join('products', 'transaction_product.product_id', '=', 'products.id')
            ->join('transactions', 'transaction_product.transaction_id', '=', 'transactions.id')
            ->whereBetween('transactions.created_at', [$startDate, $endDate])
            ->select(
                'products.id',
                'products.name',
                'products.category',
                DB::raw('SUM(transaction_product.quantity) as total_quantity'),
                DB::raw('SUM(transaction_product.quantity * transaction_product.price) as total_revenue')
            )
            ->groupBy('products.id', 'products.name', 'products.category')
            ->orderByDesc('total_revenue')
            ->limit($limit)
            ->get();

        return [
            'top_products' => $topProducts,
            'period' => [
                'start' => $startDate,
                'end' => $endDate,
            ],
            'summary' => [
                'total_revenue' => $topProducts->sum('total_revenue'),
                'total_quantity' => $topProducts->sum('total_quantity'),
            ],
        ];
    }
} 