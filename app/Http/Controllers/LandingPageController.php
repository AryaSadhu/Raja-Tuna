<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use Illuminate\Http\Request;
use GuzzleHttp\Client;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class LandingPageController extends Controller
{
    //
    public function index()
    {
        Carbon::setLocale('id');
        $coupon_deadline = DB::table('events')->select("last_buy_date")->where("status", '0')->first();
        if ($coupon_deadline) {
            $hr_coupon_deadline = Carbon::parse($coupon_deadline->last_buy_date)->translatedFormat('l, d F Y H:i');
        } else {
            $hr_coupon_deadline = [];
        }
        // dd($user);
        return Inertia::render('Welcome', ['terakhirInput' => $hr_coupon_deadline]);
    }
}
