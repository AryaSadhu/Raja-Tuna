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
        Schema::table('laporan_penjualan', function (Blueprint $table) {
            // nullable supaya tidak merusak baris lama yang sudah ada
            // (checkout tanpa login pelanggan tetap bisa jalan seperti biasa)
            $table->foreignId('pelanggan_id')
                ->nullable()
                ->after('id')
                ->constrained('pelanggans')
                ->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('laporan_penjualan', function (Blueprint $table) {
            $table->dropForeign(['pelanggan_id']);
            $table->dropColumn('pelanggan_id');
        });
    }
};
