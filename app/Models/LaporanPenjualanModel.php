<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LaporanPenjualanModel extends Model
{
    use HasFactory;

    protected $table = 'laporan_penjualan';

    protected $fillable = [
    'nama_lengkap', 'email', 'nomor_whatsapp', 'alamat_lengkap', 'catatan',
    'provinsi_id', 'provinsi_nama', 'kabupaten_id', 'kabupaten_nama',
    'kecamatan_id', 'kecamatan_nama', 'kurir', 'total_ongkir', 'total_bayar',
    'product_id', 'qty', 'harga_satuan', 'total_harga', 'status', 'nomor_pesanan',
];

    public function product()
    {
        return $this->belongsTo(DataBarangModel::class, 'product_id');
    }
}