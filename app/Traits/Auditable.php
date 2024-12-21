<?php

namespace App\Traits;

use App\Models\AuditLog;

trait Auditable
{
    protected static function bootAuditable()
    {
        static::created(function ($model) {
            self::logChanges($model, 'created');
        });

        static::updated(function ($model) {
            self::logChanges($model, 'updated');
        });

        static::deleted(function ($model) {
            self::logChanges($model, 'deleted');
        });
    }

    protected static function logChanges($model, $action)
    {
        AuditLog::create([
            'user_id' => auth()->id() ?? 1,
            'action' => $action,
            'model_type' => get_class($model),
            'model_id' => $model->id,
            'old_values' => $action !== 'created' ? $model->getOriginal() : null,
            'new_values' => $action !== 'deleted' ? $model->getAttributes() : null,
            'ip_address' => request()->ip(),
            'user_agent' => request()->userAgent(),
        ]);
    }
} 