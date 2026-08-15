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
        // Nama tabel disesuaikan menjadi laporan_penjualan agar lebih rapi
        Schema::create('laporan_penjualan', function (Blueprint $table) {
            $table->id();
            $table->string('nama_lengkap');
            $table->string('email');
            $table->string('nomor_whatsapp');
            $table->text('alamat_lengkap');
            $table->text('catatan')->nullable();
            $table->foreignId('product_id')->constrained('data_barang')->onDelete('cascade');
            $table->integer('qty');
            $table->integer('harga_satuan');
            $table->integer('total_harga');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('laporan_penjualan');
    }
};