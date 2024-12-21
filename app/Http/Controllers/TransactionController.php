<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use Illuminate\Http\Request;
use App\Services\TransactionService;
use Illuminate\Support\Facades\DB;

class TransactionController extends Controller
{
    protected $transactionService;

    public function __construct(TransactionService $transactionService)
    {
        $this->transactionService = $transactionService;
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'products' => 'required|array',
            'products.*.productId' => 'required|exists:products,id',
            'products.*.quantity' => 'required|integer|min:1',
            'paymentMethod' => 'required|string',
        ]);

        DB::beginTransaction();
        try {
            $transaction = $this->transactionService->createTransaction(
                $request->user(),
                $validated['products'],
                $validated['paymentMethod']
            );
            DB::commit();
            return response()->json($transaction, 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => $e->getMessage()], 400);
        }
    }

    public function index(Request $request)
    {
        $query = Transaction::with(['products', 'user']);

        if ($request->has('startDate')) {
            $query->whereDate('created_at', '>=', $request->startDate);
        }

        if ($request->has('endDate')) {
            $query->whereDate('created_at', '<=', $request->endDate);
        }

        return response()->json($query->latest()->paginate(15));
    }

    public function show(Transaction $transaction)
    {
        return response()->json($transaction->load(['products', 'user']));
    }
} 