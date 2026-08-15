<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DataBarangModel extends Model
{
    use HasFactory;

    // Nama tabel yang digunakan
    protected $table = 'data_barang';

    // Kolom yang boleh diisi secara massal (Mass Assignment)
    protected $fillable = [
        'kode_barang',
        'nama_barang',
        'stok',
        'harga',
        'deskripsi',
        'foto',
    ];

    // Casting tipe data (opsional, untuk memastikan tipe data konsisten)
    protected $casts = [
        'stok' => 'integer',
        'harga' => 'decimal:2',
    ];
}