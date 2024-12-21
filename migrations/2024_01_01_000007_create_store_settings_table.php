<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('store_settings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('branch_id')->constrained();
            $table->string('key');
            $table->text('value');
            $table->string('type')->default('string'); // string, number, boolean, json
            $table->timestamps();

            $table->unique(['branch_id', 'key']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('store_settings');
    }
}; 