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
        Schema::create('coupon_confirmations', function (Blueprint $table) {
            $table->id();
            $table->string("full_name");
            $table->string("email");
            $table->string("phone");
            $table->string("coupon_code")->index("coupon_code");
            $table->foreign("coupon_code")->references('id')->on("coupons")->cascadeOnDelete()->cascadeOnUpdate();
            $table->string("address");
            $table->enum("buy_platform", ["online", "offline"]);
            // $table->unsignedBigInteger('product_id');
            // $table->foreign("product_id")->references('id')->on('products')->cascadeOnDelete()->cascadeOnUpdate();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('coupon_confirmation');
    }
};
