<?php

namespace App\Http\Controllers;

use App\Models\LaporanPenjualanModel;
use App\Models\DataBarangModel;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;
use Inertia\Inertia;
use App\Mail\NotifikasiPesanan;
use Illuminate\Support\Facades\Mail;
use Carbon\Carbon;

class LaporanPenjualanController extends Controller
{
    public function index()
    {
        $laporan = LaporanPenjualanModel::with('product')
                    ->latest()
                    ->get();

        return Inertia::render('Admin/AdminLaporanPenjualan', [
            'laporan' => $laporan
        ]);
    }

    public function generateNomor(Request $request)
    {
        $hurufAcak     = strtoupper(Str::random(4));
        $tanggal       = Carbon::now()->format('Ymd');
        $urutanHariIni = LaporanPenjualanModel::whereDate('created_at', Carbon::today())->count() + 1;
        $nomorPesanan  = $hurufAcak . $tanggal . $urutanHariIni;

        return response()->json(['nomor' => $nomorPesanan]);
    }

    public function store(Request $request)
    {
        // DEBUG — hapus setelah masalah solved
        Log::info('STORE REQUEST:', $request->all());

        $validated = $request->validate([
            'nama_lengkap'   => 'required|string|max:255',
            'email'          => 'required|email',
            'nomor_whatsapp' => 'required|string',
            'alamat_lengkap' => 'required|string',
            'provinsi_id'    => 'nullable|string',
            'provinsi_nama'  => 'nullable|string',
            'kabupaten_id'   => 'nullable|string',
            'kabupaten_nama' => 'nullable|string',
            'kecamatan_id'   => 'nullable|string',
            'kecamatan_nama' => 'nullable|string',
            'kurir'          => 'nullable|string',
            'total_ongkir'   => 'nullable|numeric',
            'total_bayar'    => 'nullable|numeric',
            'catatan'        => 'nullable|string',
            'items'          => 'required|array|min:1',
            'items.*.id'     => 'required|integer',
            'items.*.qty'    => 'required|integer|min:1',
        ]);

        $totalKeseluruhan = 0;
        $firstOrderId     = null;

        DB::beginTransaction();
        try {
            foreach ($validated['items'] as $item) {
                $produk = DataBarangModel::lockForUpdate()->findOrFail($item['id']);

                if ($produk->stok < $item['qty']) {
                    throw new \Exception("Stok {$produk->nama_barang} tidak mencukupi.");
                }

                $totalHarga        = $produk->harga * $item['qty'];
                $totalKeseluruhan += $totalHarga;

                $laporan = LaporanPenjualanModel::create([
                    'nama_lengkap'   => $validated['nama_lengkap'],
                    'email'          => $validated['email'],
                    'nomor_whatsapp' => $validated['nomor_whatsapp'],
                    'alamat_lengkap' => $validated['alamat_lengkap'],
                    'catatan'        => $validated['catatan'] ?? null,
                    'provinsi_id'    => $validated['provinsi_id']   ?? null,
                    'provinsi_nama'  => $validated['provinsi_nama'] ?? null,
                    'kabupaten_id'   => $validated['kabupaten_id']   ?? null,
                    'kabupaten_nama' => $validated['kabupaten_nama'] ?? null,
                    'kecamatan_id'   => $validated['kecamatan_id']   ?? null,
                    'kecamatan_nama' => $validated['kecamatan_nama'] ?? null,
                    'kurir'          => $validated['kurir']        ?? null,
                    'total_ongkir'   => $validated['total_ongkir'] ?? 0,
                    'total_bayar'    => $validated['total_bayar']  ?? ($totalKeseluruhan + ($validated['total_ongkir'] ?? 0)),
                    'product_id'     => $produk->id,
                    'qty'            => $item['qty'],
                    'harga_satuan'   => $produk->harga,
                    'total_harga'    => $totalHarga,
                    'status'         => 'belum dibayar',
                ]);

                if (!$firstOrderId) $firstOrderId = $laporan->id;

                $produk->decrement('stok', $item['qty']);
            }

            DB::commit();

            Log::info('ORDER BERHASIL, ID: ' . $firstOrderId);

            // Inertia render langsung ke TransferPage
            return Inertia::render('TransferPage', [
                'total_bayar'  => $validated['total_bayar'] ?? $totalKeseluruhan,
                'total_ongkir' => $validated['total_ongkir'] ?? 0,
                'order_id'     => $firstOrderId,
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('ORDER GAGAL: ' . $e->getMessage());

            return redirect()->back()->withErrors(['error' => $e->getMessage()]);
        }
    }

    public function updateStatus(Request $request, $id)
    {
        $request->validate(['status' => 'required|string']);

        $laporan = LaporanPenjualanModel::findOrFail($id);
        $laporan->update(['status' => $request->status]);

        return redirect()->back()->with('success', 'Status berhasil diperbarui!');
    }

    public function kirimEmail(Request $request)
{
    $request->validate([
        'email_tujuan'  => 'required|email',
        'judul'         => 'required|string',
        'nomor'         => 'required|string',
        'pesan'         => 'required|string',
        'nomor_whatsapp'=> 'nullable|string', // untuk identifikasi grup
        'tanggal'       => 'nullable|string', // untuk identifikasi grup
    ]);

    $dataEmail = [
        'judul' => $request->judul,
        'nomor' => $request->nomor,
        'pesan' => $request->pesan,
    ];

    try {
        Mail::to($request->email_tujuan)->send(new NotifikasiPesanan($dataEmail));

        // Simpan nomor pesanan ke semua transaksi dalam grup yang sama
        if ($request->nomor_whatsapp && $request->tanggal) {
            LaporanPenjualanModel::where('nomor_whatsapp', $request->nomor_whatsapp)
                ->whereDate('created_at', $request->tanggal)
                ->update(['nomor_pesanan' => $request->nomor]);
        }

        return redirect()->back()->with('success', 'Email berhasil dikirim!');
    } catch (\Exception $e) {
        Log::error('Gagal Kirim Email: ' . $e->getMessage());
        return redirect()->back()->withErrors(['error' => 'Gagal mengirim email: ' . $e->getMessage()]);
    }
}



public function checkPesanan(Request $request)
{
    $pesanan = null;
    $notFound = false;

    if ($request->has('id') && $request->id !== '') {
        // Cari berdasarkan nomor_pesanan (yang dikirim lewat email)
        // ATAU berdasarkan id numerik sebagai fallback
        $pesanan = LaporanPenjualanModel::with('product')
            ->where('nomor_pesanan', $request->id)
            ->orWhere('id', is_numeric($request->id) ? $request->id : -1)
            ->first();

        if (!$pesanan) {
            $notFound = true;
        }
    }

    return Inertia::render('CheckPesanan', [
        'pesanan'   => $pesanan,
        'not_found' => $notFound,
    ]);
}
}