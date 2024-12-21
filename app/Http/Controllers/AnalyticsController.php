<?php

namespace App\Http\Controllers;

use App\Services\AnalyticsService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class AnalyticsController extends Controller
{
    protected $analyticsService;

    public function __construct(AnalyticsService $analyticsService)
    {
        $this->analyticsService = $analyticsService;
    }

    public function salesAnalytics(Request $request): JsonResponse
    {
        $request->validate([
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'group_by' => 'required|in:hour,day,week,month',
        ]);

        $data = $this->analyticsService->getSalesAnalytics(
            $request->start_date,
            $request->end_date,
            $request->group_by
        );

        return response()->json($data);
    }

    public function productPerformance(Request $request): JsonResponse
    {
        $request->validate([
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
        ]);

        $data = $this->analyticsService->getProductPerformance(
            $request->start_date,
            $request->end_date
        );

        return response()->json($data);
    }

    public function employeePerformance(Request $request): JsonResponse
    {
        $request->validate([
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
        ]);

        $data = $this->analyticsService->getEmployeePerformance(
            $request->start_date,
            $request->end_date
        );

        return response()->json($data);
    }

    public function salesPrediction(Request $request): JsonResponse
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'days_ahead' => 'integer|min:1|max:30',
        ]);

        $data = $this->analyticsService->predictSales(
            $request->product_id,
            $request->input('days_ahead', 7)
        );

        return response()->json($data);
    }
} 