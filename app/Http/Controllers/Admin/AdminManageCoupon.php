<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Coupon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class AdminManageCoupon extends Controller
{
    //
    public function index()
    {
        $coupon_files = DB::table("coupon_files")->limit(5)->orderBy("id", 'desc')->get();

        return Inertia::render('Admin/AdminManageKupon', ["couponFiles" => $coupon_files]);
    }
}
