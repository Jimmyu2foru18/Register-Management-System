<?php

namespace App\Providers;

use App\Events\LowStockAlert;
use App\Listeners\HandleLowStockAlert;
use Illuminate\Foundation\Support\Providers\EventServiceProvider as ServiceProvider;

class EventServiceProvider extends ServiceProvider
{
    protected $listen = [
        LowStockAlert::class => [
            HandleLowStockAlert::class,
        ],
    ];
} 