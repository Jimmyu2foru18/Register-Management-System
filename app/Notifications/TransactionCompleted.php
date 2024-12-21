<?php

namespace App\Notifications;

use App\Models\Transaction;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;

class TransactionCompleted extends Notification
{
    use Queueable;

    protected $transaction;

    public function __construct(Transaction $transaction)
    {
        $this->transaction = $transaction;
    }

    public function via($notifiable): array
    {
        return ['mail', 'database'];
    }

    public function toMail($notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Transaction Completed')
            ->line('Transaction #' . $this->transaction->id . ' has been completed.')
            ->line('Total Amount: $' . number_format($this->transaction->total_amount, 2))
            ->line('Payment Method: ' . $this->transaction->payment_method)
            ->action('View Transaction', url("/transactions/{$this->transaction->id}"));
    }

    public function toArray($notifiable): array
    {
        return [
            'transaction_id' => $this->transaction->id,
            'total_amount' => $this->transaction->total_amount,
            'payment_method' => $this->transaction->payment_method,
            'created_at' => $this->transaction->created_at,
        ];
    }
} 