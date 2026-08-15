<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Coupon;
use App\Models\LaporanPenjualanModel;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Carbon\Carbon;

class AdminDashboardController extends Controller
{
    public function index()
    {
        $used_coupons = DB::table("coupon_confirmations as cc")
            ->join("coupons as c", "cc.coupon_code", "c.id")
            ->count();
        $all_coupons    = Coupon::all();
        $expired_coupons = 0;
        $active_coupons  = 0;
        foreach ($all_coupons as $coupon) {
            if ($coupon->status) { $expired_coupons++; } else { $active_coupons++; }
        }
        $expired_coupons = $used_coupons;

        // ── PENJUALAN BULAN INI (per hari) ──
        $startOfMonth = Carbon::now()->startOfMonth();
        $endOfMonth   = Carbon::now()->endOfMonth();

        $penjualanHarian = LaporanPenjualanModel::selectRaw('DATE(created_at) as tanggal, SUM(total_bayar) as total')
            ->whereBetween('created_at', [$startOfMonth, $endOfMonth])
            ->groupBy('tanggal')
            ->orderBy('tanggal')
            ->get()
            ->map(fn($row) => [
                'tanggal' => Carbon::parse($row->tanggal)->format('d M'),
                'total'   => (int) $row->total,
            ]);

        // ── PENJUALAN PER PROVINSI (top 8) ──
        $penjualanProvinsi = LaporanPenjualanModel::selectRaw('provinsi_nama, COUNT(*) as jumlah_pesanan, SUM(total_harga) as total_penjualan')
            ->whereNotNull('provinsi_nama')
            ->groupBy('provinsi_nama')
            ->orderByDesc('jumlah_pesanan')
            ->limit(8)
            ->get()
            ->map(fn($row) => [
                'provinsi'        => $row->provinsi_nama,
                'jumlah_pesanan'  => (int) $row->jumlah_pesanan,
                'total_penjualan' => (int) $row->total_penjualan,
            ]);

        // ── PRODUK TERLARIS (top 5) ──
        $produkTerlaris = LaporanPenjualanModel::selectRaw('product_id, SUM(qty) as total_qty, SUM(total_harga) as total_penjualan')
            ->with('product:id,nama_barang')
            ->groupBy('product_id')
            ->orderByDesc('total_qty')
            ->limit(5)
            ->get()
            ->map(fn($row) => [
                'nama'            => $row->product?->nama_barang ?? 'Produk dihapus',
                'total_qty'       => (int) $row->total_qty,
                'total_penjualan' => (int) $row->total_penjualan,
            ]);

        // ── STATUS PESANAN ──
        $statusPesanan = LaporanPenjualanModel::selectRaw('status, COUNT(*) as jumlah')
            ->groupBy('status')
            ->get()
            ->map(fn($row) => [
                'status' => $row->status,
                'jumlah' => (int) $row->jumlah,
            ]);

        // ── RINGKASAN BULAN INI ──
        $totalPenjualanBulanIni = LaporanPenjualanModel::whereBetween('created_at', [$startOfMonth, $endOfMonth])
            ->sum('total_bayar');
        $totalOrderBulanIni = LaporanPenjualanModel::whereBetween('created_at', [$startOfMonth, $endOfMonth])
            ->distinct('nomor_whatsapp')
            ->count('nomor_whatsapp');

        return Inertia::render('Admin/AdminDashboard', [
            'all_coupons'               => count($all_coupons),
            'expired_coupons'           => $expired_coupons,
            'active_coupons'            => $active_coupons,
            'penjualan_harian'          => $penjualanHarian,
            'penjualan_provinsi'        => $penjualanProvinsi,
            'produk_terlaris'           => $produkTerlaris,
            'status_pesanan'            => $statusPesanan,
            'total_penjualan_bulan_ini' => (int) $totalPenjualanBulanIni,
            'total_order_bulan_ini'     => $totalOrderBulanIni,
        ]);
    }
}