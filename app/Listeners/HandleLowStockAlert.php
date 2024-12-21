<?php

namespace App\Listeners;

use App\Events\LowStockAlert;
use App\Models\User;
use App\Notifications\LowStockNotification;
use Illuminate\Contracts\Queue\ShouldQueue;

class HandleLowStockAlert implements ShouldQueue
{
    public function handle(LowStockAlert $event): void
    {
        // Notify all supervisors and admins
        User::whereIn('role', ['supervisor', 'admin'])
            ->get()
            ->each(function ($user) use ($event) {
                $user->notify(new LowStockNotification($event->product));
            });
    }
} 