<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use App\Services\ProductService;

class ProductController extends Controller
{
    protected $productService;

    public function __construct(ProductService $productService)
    {
        $this->productService = $productService;
    }

    public function index(Request $request)
    {
        $query = Product::query();

        if ($request->has('category')) {
            $query->where('category', $request->category);
        }

        if ($request->has('search')) {
            $query->where('name', 'like', "%{$request->search}%")
                  ->orWhere('barcode', 'like', "%{$request->search}%");
        }

        if ($request->boolean('lowStock')) {
            $query->whereColumn('stock_quantity', '<=', 'min_stock_level');
        }

        return response()->json($query->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'category' => 'required|string|max:100',
            'price' => 'required|numeric|min:0',
            'stockQuantity' => 'required|integer|min:0',
            'minStockLevel' => 'required|integer|min:0',
            'reorderQuantity' => 'required|integer|min:0',
            'barcode' => 'required|string|unique:products',
        ]);

        $product = $this->productService->createProduct($validated);
        return response()->json($product, 201);
    }

    public function show(Product $product)
    {
        return response()->json($product);
    }

    public function update(Request $request, Product $product)
    {
        $validated = $request->validate([
            'name' => 'string|max:255',
            'category' => 'string|max:100',
            'price' => 'numeric|min:0',
            'stockQuantity' => 'integer|min:0',
            'minStockLevel' => 'integer|min:0',
            'reorderQuantity' => 'integer|min:0',
            'barcode' => 'string|unique:products,barcode,' . $product->id,
        ]);

        $product = $this->productService->updateProduct($product, $validated);
        return response()->json($product);
    }

    public function destroy(Product $product)
    {
        $this->productService->deleteProduct($product);
        return response()->json(null, 204);
    }

    public function updateStock(Request $request, Product $product)
    {
        $validated = $request->validate([
            'quantity' => 'required|integer|min:0',
        ]);

        $product = $this->productService->updateStock($product, $validated['quantity']);
        return response()->json($product);
    }

    public function searchByBarcode(Request $request)
    {
        $validated = $request->validate([
            'barcode' => 'required|string',
        ]);

        $product = Product::where('barcode', $validated['barcode'])->firstOrFail();
        return response()->json($product);
    }
} 