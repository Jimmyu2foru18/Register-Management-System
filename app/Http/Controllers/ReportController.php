<?php

namespace App\Http\Controllers;

use App\Services\ReportService;
use App\Services\ReportExportService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;

class ReportController extends Controller
{
    protected $reportService;
    protected $exportService;

    public function __construct(ReportService $reportService, ReportExportService $exportService)
    {
        $this->reportService = $reportService;
        $this->exportService = $exportService;
    }

    public function sales(Request $request): JsonResponse
    {
        $request->validate([
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'group_by' => 'required|in:day,week,month',
        ]);

        $data = $this->reportService->generateSalesReport(
            $request->start_date,
            $request->end_date,
            $request->group_by
        );

        return response()->json($data);
    }

    public function inventory(Request $request): JsonResponse
    {
        $request->validate([
            'category' => 'nullable|string',
            'low_stock_only' => 'nullable|boolean',
        ]);

        $data = $this->reportService->generateInventoryReport(
            $request->category,
            $request->boolean('low_stock_only')
        );

        return response()->json($data);
    }

    public function productPerformance(Request $request): JsonResponse
    {
        $request->validate([
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'limit' => 'nullable|integer|min:1|max:100',
        ]);

        $data = $this->reportService->generateProductPerformanceReport(
            $request->start_date,
            $request->end_date,
            $request->input('limit', 10)
        );

        return response()->json($data);
    }

    public function export(Request $request): JsonResponse
    {
        $request->validate([
            'type' => 'required|in:sales,inventory,product-performance',
            'format' => 'required|in:excel,csv',
            'start_date' => 'required_if:type,sales,product-performance|date',
            'end_date' => 'required_if:type,sales,product-performance|date|after_or_equal:start_date',
        ]);

        $data = match ($request->type) {
            'sales' => $this->reportService->generateSalesReport(
                $request->start_date,
                $request->end_date,
                'day'
            ),
            'inventory' => $this->reportService->generateInventoryReport(
                $request->category,
                $request->boolean('low_stock_only')
            ),
            'product-performance' => $this->reportService->generateProductPerformanceReport(
                $request->start_date,
                $request->end_date,
                10
            ),
        };

        $filename = Str::slug("report-{$request->type}-" . now()->format('Y-m-d'));
        
        $path = match ($request->format) {
            'excel' => $this->exportService->exportToExcel($data['data'], $filename),
            'csv' => $this->exportService->exportToCsv($data['data'], $filename),
        };

        return response()->json([
            'download_url' => url(Storage::url($path)),
        ]);
    }
} 