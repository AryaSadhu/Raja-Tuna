<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('data_barang', function (Blueprint $table) {
            $table->id();
            $table->string('kode_barang')->unique();
            $table->string('nama_barang');
            $table->integer('stok')->default(0);
            $table->integer('harga')->default(0); // 15 digit, 2 di belakang koma
            $table->text('deskripsi')->nullable();
            $table->string('foto')->nullable();
            $table->timestamps(); // create_at & updated_at
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('data_barang');
    }
};