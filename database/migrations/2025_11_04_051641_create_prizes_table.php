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
        Schema::create('prizes', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger("prize_types_id");
            $table->foreign("prize_types_id")->references("id")->on("prize_types")->cascadeOnDelete()->cascadeOnUpdate();
            $table->string("prize_name");
            $table->integer("qty");
            $table->unsignedBigInteger("events_id");
            $table->foreign("events_id")->references("id")->on("events")->cascadeOnDelete()->cascadeOnUpdate();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('prizes');
    }
};
