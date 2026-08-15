<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;
use App\Models\Events;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $activeEvent = Events::latest()->first();
        // $activeEvent = [
        //     'id' => 99,
        //     'title' => 'TESTING EVENT MUNCUL! 🎉',
        //     'description' => 'Kalau kamu lihat ini, berarti Frontend sudah SUKSES!',
        //     'draw_date' => date('Y-m-d', strtotime('+5 days')), // Tanggal 5 hari lagi
        // ];

        // Kalau kolom status belum ada, bisa pakai logika tanggal:
        // $activeEvent = Events::where('draw_date', '>=', now())->orderBy('draw_date')->first();
        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user()
                    ? $request->user()->only(['id', 'username', 'role'])
                    : null,
            ],
            // Data ini akan bisa diakses di semua halaman React via usePage().props.globalEvent
            'globalEvent' => $activeEvent,
        ];
    }
}
