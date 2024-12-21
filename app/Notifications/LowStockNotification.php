<?php

namespace App\Notifications;

use App\Models\Product;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;

class LowStockNotification extends Notification
{
    use Queueable;

    protected $product;

    public function __construct(Product $product)
    {
        $this->product = $product;
    }

    public function via($notifiable): array
    {
        return ['mail', 'database'];
    }

    public function toMail($notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Low Stock Alert')
            ->line("Product {$this->product->name} is running low on stock.")
            ->line("Current stock: {$this->product->stock_quantity}")
            ->line("Minimum level: {$this->product->min_stock_level}")
            ->line("Suggested reorder quantity: {$this->product->reorder_quantity}")
            ->action('View Product', url("/inventory/products/{$this->product->id}"));
    }

    public function toArray($notifiable): array
    {
        return [
            'product_id' => $this->product->id,
            'product_name' => $this->product->name,
            'current_stock' => $this->product->stock_quantity,
            'min_stock_level' => $this->product->min_stock_level,
            'reorder_quantity' => $this->product->reorder_quantity,
        ];
    }
} 