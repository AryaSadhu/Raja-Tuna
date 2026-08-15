<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('checkout_histories', function (Blueprint $table) {
            $table->id();
            $table->string('email');
            $table->string('full_name');
            $table->integer('quantity');
            $table->string('province');
            $table->string('phone');
            $table->string('district');
            $table->string('city');
            $table->text('address');
            $table->enum('payment_status', ['pending', 'completed', 'cancelled'])->default('pending');
            $table->enum('tracking_status', ['dikemas', 'dikirim', 'diterima'])->nullable();
            $table->string('courier_code');
            $table->string('courier_service');
            $table->integer('courier_price');
            $table->integer('grand_total');
            $table->string('order_no')->index();
            $table->string('awb')->index()->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('checkout_history');
    }
};
