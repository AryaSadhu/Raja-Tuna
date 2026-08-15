<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use App\Models\Events; 
use Illuminate\Support\Facades\Auth; 

use function Symfony\Component\Clock\now;

class LiveDrawPageController extends Controller
{

    public function indexPublic()
    {
        // 1. Cari Event yang sedang AKTIF
        // Asumsi: status '1' atau '0' menandakan aktif (sesuaikan dengan logic databasemu)
        // Kita ambil event terakhir yang dibuat atau yang statusnya aktif
        $activeEvent = Events::with('prizes')
                        ->where('status', '0') // Misal 0 itu aktif (sesuaikan!)
                        ->latest()
                        ->first();
        // 2. Cek apakah yang akses adalah Admin?
        $isAdmin = Auth::guard('admin')->check();

        // 3. Render halaman Inertia
        return Inertia::render('Admin/LiveDraw', [
            'event' => $activeEvent,
            // Jika event ada, kirim prizes, jika tidak kirim array kosong
            'prizes' => $activeEvent ? $activeEvent->prizes : [],
            'isAdmin' => $isAdmin
        ]);
    }



}
