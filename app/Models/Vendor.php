<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Vendor extends Model
{
    protected $fillable = [
        'name',
        'email',
        'phone',
        'address',
        'api_key',
        'api_secret',
    ];

    public function orders()
    {
        return $this->hasMany(Order::class);
    }
} 