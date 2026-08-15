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
            // Menambahkan kolom status setelah kolom catatan
            $table->string('status')->default('belum dibayar')->after('catatan');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('laporan_penjualan', function (Blueprint $table) {
            // Menghapus kolom status jika migration di-rollback
            $table->dropColumn('status');
        });
    }
};