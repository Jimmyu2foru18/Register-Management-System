<?php

namespace App\Http\Controllers;

use App\Services\BatchOperationService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Http\Requests\BatchProductRequest;

class BatchOperationController extends Controller
{
    protected $batchService;

    public function __construct(BatchOperationService $batchService)
    {
        $this->batchService = $batchService;
    }

    public function importProducts(BatchProductRequest $request): JsonResponse
    {
        try {
            $result = $this->batchService->importProducts($request->products);
            return response()->json([
                'message' => 'Products imported successfully',
                'imported' => $result['imported'],
                'failed' => $result['failed']
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to import products',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function updateStock(Request $request): JsonResponse
    {
        $request->validate([
            'updates' => 'required|array',
            'updates.*.id' => 'required|exists:products,id',
            'updates.*.quantity' => 'required|integer'
        ]);

        try {
            $result = $this->batchService->updateStock($request->updates);
            return response()->json([
                'message' => 'Stock updated successfully',
                'updated' => $result['updated'],
                'failed' => $result['failed']
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to update stock',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function updatePrices(Request $request): JsonResponse
    {
        $request->validate([
            'updates' => 'required|array',
            'updates.*.id' => 'required|exists:products,id',
            'updates.*.price' => 'required|numeric|min:0'
        ]);

        try {
            $result = $this->batchService->updatePrices($request->updates);
            return response()->json([
                'message' => 'Prices updated successfully',
                'updated' => $result['updated'],
                'failed' => $result['failed']
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to update prices',
                'error' => $e->getMessage()
            ], 500);
        }
    }
} 