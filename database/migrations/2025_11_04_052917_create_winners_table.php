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
        Schema::create('winners', function (Blueprint $table) {
            $table->id();
            $table->string('coupon_code');
            $table->foreign("coupon_code")->references("id")->on("coupons")->cascadeOnDelete()->cascadeOnUpdate();
            $table->unsignedBigInteger("events_id");
            $table->foreign("events_id")->references("id")->on("events")->cascadeOnDelete()->cascadeOnUpdate();
            $table->unsignedBigInteger("prize_types_id");
            $table->foreign("prize_types_id")->references("id")->on("prize_types")->cascadeOnDelete()->cascadeOnUpdate();
            $table->datetime("won_at")->nullable();
            $table->integer("mode_type");
            $table->unsignedBigInteger("prizes_id");
            $table->foreign("prizes_id")->references("id")->on("prizes")->cascadeOnDelete()->cascadeOnUpdate();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('winners');
    }
};
