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
        Schema::create('coupons', function (Blueprint $table) {
            $table->string('id')->primary()->unique()->index();
            $table->enum('status', [0, 1, 2])->default(0);
            $table->unsignedBigInteger("coupon_files_id");
            $table->foreign("coupon_files_id")->references("id")->on("coupon_files");
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('coupon');
    }
};
