<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class Pelanggan extends Authenticatable
{
    use Notifiable;

    protected $fillable = [
        'nama_lengkap',
        'email',
        'nomor_whatsapp',
        'alamat_lengkap',
        'password',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'password' => 'hashed',
        ];
    }

    /**
     * Semua laporan penjualan (pesanan) milik pelanggan ini.
     */
    public function laporanPenjualan(): HasMany
    {
        return $this->hasMany(LaporanPenjualanModel::class, 'pelanggan_id');
    }
}
