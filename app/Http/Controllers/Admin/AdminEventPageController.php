<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Events;
use App\Models\PrizeType;
use App\Models\Winner;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB; // Tambahkan ini untuk query builder

class AdminEventPageController extends Controller
{
    public function index()
    {
        $total_events = Events::all()->count();
        $next_events_num = $total_events + 1;

        $activeEvent = Events::with('prizes')->where('status', '0')->first();
        $prize_types = PrizeType::all();

        $data = [
            'prizeTypes' => $prize_types,
            'undianTitle' => "Undian $next_events_num",
            'activeEvent' => null,
            'sisaPemenang' => 0
        ];

        if ($activeEvent) {
            $total_winners = $activeEvent->total_winners;
            $current_total_winners = Winner::where("events_id", $activeEvent->id)->count();
            $total_winners_left = $total_winners - $current_total_winners;

            // NEW LOGIC: Simply count how many winners each prize has in database
            $activeEvent->prizes->transform(function ($prize) use ($activeEvent) {
                // Count winners in database for this specific prize
                $usedCount = Winner::where('events_id', $activeEvent->id)
                    ->where('prizes_id', $prize->id)
                    ->count();

                // Calculate remaining
                $prize->remaining_qty = max(0, $prize->qty - $usedCount);

                return $prize;
            });

            $data['activeEvent'] = $activeEvent;
            $data['sisaPemenang'] = $total_winners_left;
        }

        return Inertia::render('Admin/Event', $data);
    }

    /**
     * Fungsi baru untuk Halaman Daftar Pemenang
     */
    public function winners()
    {
        $winnersData = DB::table('winners')
            ->join('coupon_confirmations', 'winners.coupon_code', '=', 'coupon_confirmations.coupon_code')
            ->join('events', 'winners.events_id', '=', 'events.id')
            ->join('prizes as p', 'p.id', '=', 'winners.prizes_id') // ← FIXED: Join on prizes_id
            ->join('prize_types as pt', 'pt.id', '=', 'winners.prize_types_id')
            ->select(
                'coupon_confirmations.full_name as nama',
                'winners.coupon_code as kupon',
                'events.title as event',
                'winners.created_at as tanggal',
                'winners.prize_types_id as tipe_hadiah',
                'p.prize_name as hadiah',
                'winners.mode_type as mode',
                'pt.name as jenis_hadiah'
            )
            ->orderBy('winners.created_at', 'desc')
            ->get();

        return Inertia::render('Admin/WinnerList', [
            'winners' => $winnersData
        ]);
    }
}
