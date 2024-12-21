<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Product extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'name',
        'category',
        'price',
        'stock_quantity',
        'min_stock_level',
        'reorder_quantity',
        'barcode',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'stock_quantity' => 'integer',
        'min_stock_level' => 'integer',
        'reorder_quantity' => 'integer',
    ];

    public function transactions(): BelongsToMany
    {
        return $this->belongsToMany(Transaction::class)
            ->withPivot(['quantity', 'price'])
            ->withTimestamps();
    }

    public function needsReorder(): bool
    {
        return $this->stock_quantity <= $this->min_stock_level;
    }
} 