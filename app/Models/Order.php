<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    protected $fillable = [
        'vendor_id',
        'status',
        'total_amount',
        'expected_delivery_date',
    ];

    public function products()
    {
        return $this->belongsToMany(Product::class)
            ->withPivot(['quantity', 'unit_price'])
            ->withTimestamps();
    }
} 