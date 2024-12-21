<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\TransactionController;
use App\Http\Controllers\BatchOperationController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// Public routes
Route::post('/auth/login', [AuthController::class, 'login']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    // Auth routes
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/user', [AuthController::class, 'user']);

    // Product routes
    Route::apiResource('products', ProductController::class);
    Route::put('/products/{product}/stock', [ProductController::class, 'updateStock']);
    Route::get('/products/barcode/{barcode}', [ProductController::class, 'searchByBarcode']);

    // Transaction routes
    Route::apiResource('transactions', TransactionController::class)->except(['update', 'destroy']);

    // Admin only routes
    Route::middleware('role:admin')->group(function () {
        Route::get('/reports/sales', [ReportController::class, 'sales']);
        Route::get('/reports/inventory', [ReportController::class, 'inventory']);
    });

    // Add these routes inside the auth:sanctum middleware group
    Route::middleware(['auth:sanctum', 'role:admin,supervisor'])->group(function () {
        Route::post('/batch/products/import', [BatchOperationController::class, 'importProducts']);
        Route::post('/batch/products/stock', [BatchOperationController::class, 'updateStock']);
        Route::post('/batch/products/prices', [BatchOperationController::class, 'updatePrices']);
    });
});

// Health check endpoint
Route::get('/health-check', function () {
    return response()->json(['status' => 'ok']);
});