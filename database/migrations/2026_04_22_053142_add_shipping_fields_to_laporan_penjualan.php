<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('laporan_penjualan', function (Blueprint $table) {
            $table->string('provinsi_id')->nullable()->after('alamat_lengkap');
            $table->string('provinsi_nama')->nullable()->after('provinsi_id');
            $table->string('kabupaten_id')->nullable()->after('provinsi_nama');
            $table->string('kabupaten_nama')->nullable()->after('kabupaten_id');
            $table->string('kecamatan_id')->nullable()->after('kabupaten_nama');
            $table->string('kecamatan_nama')->nullable()->after('kecamatan_id');
            $table->string('kurir')->nullable()->after('kecamatan_nama');
            $table->bigInteger('total_ongkir')->default(0)->after('kurir');
            $table->bigInteger('total_bayar')->default(0)->after('total_ongkir');
        });
    }

    public function down(): void
    {
        Schema::table('laporan_penjualan', function (Blueprint $table) {
            $table->dropColumn([
                'provinsi_id', 'provinsi_nama',
                'kabupaten_id', 'kabupaten_nama',
                'kecamatan_id', 'kecamatan_nama',
                'kurir', 'total_ongkir', 'total_bayar'
            ]);
        });
    }
};