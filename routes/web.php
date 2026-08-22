<?php

use App\Http\Controllers\Admin\AdminCouponController;
use App\Http\Controllers\Admin\AdminDashboardController;
use App\Http\Controllers\Admin\SuperAdminMenu;
use App\Http\Controllers\Admin\AdminManageCoupon;
use App\Http\Controllers\Admin\AdminEventController;
use App\Http\Controllers\Admin\AdminEventPageController;
use App\Http\Controllers\Admin\AdminLoginController;
use App\Http\Controllers\Admin\GachaController;
use App\Http\Controllers\Admin\LiveDrawPageController;
use App\Http\Controllers\CheckoutController;
use App\Http\Controllers\DataBarangController;
use App\Http\Controllers\CouponConfirmationController;
use App\Http\Controllers\CouponController;
use App\Http\Controllers\CouponPDFController;
use App\Http\Controllers\CourierController;
use App\Http\Controllers\LandingPageController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\WinnerController;
use App\Http\Middleware\SuperAdminMiddleware;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\DaftarBarangCustomerController;
use App\Http\Controllers\LaporanPenjualanController;
use Illuminate\Http\Request;
use App\Http\Controllers\OngkirController;
use App\Http\Controllers\Auth\PelangganAuthController;
use App\Http\Controllers\PelangganProfileController;

Route::get('/', [LandingPageController::class, 'index'])->name('home');

//HADEH INI NGGA TAU MAU DIAPAIN
Route::controller(CourierController::class)->group(function () {
    Route::get('/get-province-data', 'getProvince')->name('province.get');
    //route buat ngambil data kota dari provinsi_id
    Route::get('/get-city-data/{province_id}', 'getCity')->name('city.get');
    //route buat ngambil data kabupaten dari city_id
    Route::get('/get-district-data/{city_id}', 'getDistrict')->name('district.get');
    //nah, ini ngambil list total jasa kurir ama mang kurirnya
    Route::get('/get-courier/{district_id}', 'getCourier')->name('cost.get');
});

Route::post('/customer/checkout', [CheckoutController::class, 'create'])->name('order.store.popup');

Route::post('/coupon/confirm', [CouponConfirmationController::class, 'store'])->name('coupon.confirm')->middleware('throttle:10,1');

Route::get("/undian", [WinnerController::class, 'index'])->name('undian');


Route::get('/lacak', function () {
    // Nanti, tim backend akan mencari data ini di database berdasarkan input.
    // Untuk sekarang, kita buat data pura-pura (dummy data).
    $statusPesanan = null;
    if (request()->has('nomor_pesanan') && request()->input('nomor_pesanan') === 'KT-12345') {
        $statusPesanan = [
            'nomor' => 'KT-12345',
            'status' => 'Sedang Dikemas',
            'estimasi' => '25 Oktober 2025',
            'detail' => 'Pesanan Anda sedang disiapkan di gudang kami.'
        ];
    } elseif (request()->has('nomor_pesanan')) {
        // Jika nomor pesanan ada tapi salah
        $statusPesanan = ['error' => 'Nomor pesanan tidak ditemukan.'];
    }

    // Siapkan data riwayat pesanan (dummy data)
    $riwayatPesanan = [];
    if (Auth::check()) { // Cek jika user sudah login
        $riwayatPesanan = [
            ['id' => 'KT-09876', 'tanggal' => '18 Okt 2025', 'status' => 'Selesai', 'total' => 'Rp 50.000'],
            ['id' => 'KT-09875', 'tanggal' => '15 Okt 2025', 'status' => 'Selesai', 'total' => 'Rp 25.000'],
        ];
    }

    return Inertia::render('Lacak', [
        'statusPesanan' => $statusPesanan,
        'input' => request()->only('nomor_pesanan'), // Kirim kembali input user
        'riwayatPesanan' => $riwayatPesanan
    ]);
})->name('lacak');





//cek kupon
Route::get('/coupon/check/{coupon}', [CouponConfirmationController::class, 'checkCoupon'])->name('check.coupon');

// Route Publik untuk Halaman Live Draw (Auto-detect Event)
Route::get('/live-draw', [LiveDrawPageController::class, 'indexPublic'])->name('live-draw.index');

//Route Publik untuk User (Polling Status)
Route::get('/api/live-draw/status/{event_id}', [AdminEventController::class, 'getLiveStatus'])->name('api.livedraw.status');

//admin
//disini harus login dulu
Route::middleware('auth:admin')->group(function () {
    Route::get('/admin/laporan-penjualan', [LaporanPenjualanController::class, 'index'])->name('admin.laporan.index');
    //munculin dashboard
    Route::patch('/admin/laporan/{id}/status', [LaporanPenjualanController::class, 'updateStatus'])->name('admin.laporan.update-status');


    Route::get('/admin/laporan/generate-nomor', [LaporanPenjualanController::class, 'generateNomor'])->name('admin.laporan.generate-nomor');
    Route::post('/admin/laporan/kirim-email', [LaporanPenjualanController::class, 'kirimEmail'])->name('admin.laporan.kirim-email');

    Route::get('/admin/dashboard', [AdminDashboardController::class, 'index'])->name('admin.dashboard');
    
    Route::get('/admin/super-admin', [SuperAdminMenu::class, 'index'])->name('admin.superadmin')->middleware(SuperAdminMiddleware::class);

    Route::get('/admin/manage-kupon', [AdminManageCoupon::class, 'index'])->name('admin.manage-kupon');

    Route::post('/admin/create-admin', [SuperAdminMenu::class, 'store'])->name('admin.create-admin');

    Route::delete('/admin/delete-admin/{id}', [SuperAdminMenu::class, 'destroy'])->name('admin.delete-admin');
    //bagian event
    Route::get('/admin/event', [AdminEventPageController::class, 'index'])->name('admin.event');

    //buat cek kupon
    Route::get('/admin/coupon/check/{coupon}', [AdminEventController::class, 'checkCoupon'])->name('admin.coupon.check');

    //nyimpen semua pemenang 
    Route::post('/admin/winners/store', [AdminEventController::class, 'storeWinners'])->name('admin.winners.store');

    //random gacha
    Route::get('/admin/draw/{event_id}/{num}', [AdminEventController::class, 'randomGacha'])->name('admin.draw');

    //buat event baru
    Route::post('/admin/create-event', [AdminEventController::class, 'createGachaEvent'])->name('admin.create-event');

    //edit event 
    Route::post('/admin/update-event', [AdminEventController::class, 'updateGachaEvent'])->name('admin.update-event');

    //selesaiin event
    Route::get('/admin/end-event/{event_id}', [AdminEventController::class, 'endGachaEvent'])->name('admin.end-event');

    //hapus event
    Route::get('/admin/delete-event/{event_id}', [AdminEventController::class, 'removeEvent'])->name('admin.delete-event');

    Route::get('/admin/generate-coupons/{num}', [AdminCouponController::class, 'couponsGetter'])->name('admin.generate-coupons');

    Route::get('/admin/download-coupons/{id}', [CouponPDFController::class, 'downloadExistingFile'])->name('admin.download-coupon-file');

    Route::get('/admin/winners', [AdminEventPageController::class, 'winners'])->name('admin.winners');

    Route::get('/LIV3/{event_id}', [LiveDrawPageController::class, "index"])->name('admin.live-draw');

    Route::post('/admin/winners/left', [LiveDrawPageController::class, 'storeCache'])->name('admin.winner.store-left');

    //Route Admin (Eksekusi Undian Satu per Satu)
    Route::post('/admin/draw-one', [AdminEventController::class, 'drawOneWinner'])->name('admin.draw-one');

    Route::post('/draw-winner', [AdminEventController::class, 'drawOneWinner']);

    // --- ROUTE BARU: DATA BARANG ---
    Route::prefix('admin/barang')->name('admin.barang.')->group(function () {
        Route::get('/', [DataBarangController::class, 'index'])->name('index');
        Route::post('/', [DataBarangController::class, 'store'])->name('store');
        Route::put('/{id}', [DataBarangController::class, 'update'])->name('update');
        Route::delete('/{id}', [DataBarangController::class, 'destroy'])->name('destroy');
    });
});

Route::get('/admin/login', [AdminLoginController::class, 'index'])->name('login');
Route::post('/admin/login', [AdminLoginController::class, 'adminLogin'])->name('admin.login')->middleware('throttle:10,1');
Route::post('/admin/logout', [AdminLoginController::class, 'adminLogout'])->name('admin.logout');

Route::get('/products', [DaftarBarangCustomerController::class, 'index'])->name('product.index');

Route::post('/checkout/info', function (Request $request) {
    return inertia('BuyerInfoPage', [
        'cart' => $request->cart 
    ]);
})->name('buyer.info');

/**
 * PROTEKSI REDIRECT (Method GET)
 * Jika user mengetik URL secara manual atau me-refresh halaman checkout,
 * mereka akan otomatis dikembalikan ke halaman daftar produk.
 */
Route::get('/checkout/info', function () {
    return redirect()->route('product.index'); // Pastikan nama route ini sesuai (biasanya product.index)
});




Route::post('/checkout/store', [LaporanPenjualanController::class, 'store'])->name('laporan.store');

/**
 * PROTEKSI REDIRECT (Method GET)
 * Jika user iseng ngetik /checkout/store di bar browser atau refresh setelah bayar,
 * mereka akan otomatis dilempar ke halaman daftar produk.
 */
Route::get('/checkout/store', function () {
    return redirect()->route('product.index'); 
});

// Route halaman transfer
Route::get('/checkout/transfer', function () {
    return redirect()->route('product.index'); 
})->name('checkout.transfer');



Route::get('/api/provinces', [OngkirController::class, 'getProvinces']);
Route::get('/api/cities/{provinceId}', [OngkirController::class, 'getCities']);
Route::get('/api/districts/{cityId}', [OngkirController::class, 'getDistricts']);
Route::post('/api/check-cost', [OngkirController::class, 'checkCost']);




Route::get('/check-pesanan', [LaporanPenjualanController::class, 'checkPesanan'])->name('pesanan.check');


Route::middleware('guest:pelanggan')->group(function () {
    Route::get('/pelanggan/register', [PelangganAuthController::class, 'showRegister'])
        ->name('pelanggan.register');
    Route::post('/pelanggan/register', [PelangganAuthController::class, 'register']);

    Route::get('/pelanggan/login', [PelangganAuthController::class, 'showLogin'])
        ->name('pelanggan.login');
    Route::post('/pelanggan/login', [PelangganAuthController::class, 'login']);
});

Route::middleware('auth:pelanggan')->group(function () {
    Route::post('/pelanggan/logout', [PelangganAuthController::class, 'logout'])
        ->name('pelanggan.logout');
});

Route::middleware('auth:pelanggan')->group(function () {
    Route::post('/pelanggan/logout', [PelangganAuthController::class, 'logout'])
        ->name('pelanggan.logout');

    // Tambahan baru:
    Route::get('/pelanggan/profile', [PelangganProfileController::class, 'edit'])
        ->name('pelanggan.profile.edit');
    Route::patch('/pelanggan/profile', [PelangganProfileController::class, 'update'])
        ->name('pelanggan.profile.update');
    Route::put('/pelanggan/profile/password', [PelangganProfileController::class, 'updatePassword'])
        ->name('pelanggan.profile.password');
});
