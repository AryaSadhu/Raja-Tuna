<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class WinnerController extends Controller
{
    //
    public $next_gacha_prizes;
    public function index()
    {
        Carbon::setLocale('id');
        $recent_winner = $this->getRecentWinners();

        $active_event= $this->getActiveEvent();
        if ($active_event) {
            $this->next_gacha_prizes = $this->getPrizes($active_event->id);
            $next_gacha_date = Carbon::parse($active_event->start_date)->translatedFormat('l, d F Y H:i');
        } else {
            $this->next_gacha_prizes = [];
            $next_gacha_date = [];
        }
        // dd($this->next_gacha_prizes);
        return Inertia::render("Undian", ["pemenang" => $recent_winner, "tanggalUndian" => $next_gacha_date, "hadiahBerikutnya" => $this->next_gacha_prizes]);
    }

    public function getActiveEvent()
    {
        $res = DB::table('events')->where('status', '0')->first();
        return $res;
    }

    public function getRecentWinners()
    {
        $recent_date = DB::table("winners")->max("created_at");
        $res = DB::table("winners as w")->join("coupon_confirmations as cc", "cc.coupon_code", "w.coupon_code")
            ->select("cc.full_name", "w.coupon_code")
            ->where("w.won_at", "!=" , null)
            ->whereDate('w.created_at', date('Y-m-d', strtotime($recent_date)))
            ->get();
        
        return $res;
    }

    public function getPrizes($events_id)
    {
        $res = DB::table('prizes as p')->join("prize_types as ps", "ps.id", "p.prize_types_id")
        ->where("p.events_id", $events_id)
        ->select("p.qty", "p.prize_name", "ps.name as prize_type", "p.id")->get();
        return $res;
    }
}
