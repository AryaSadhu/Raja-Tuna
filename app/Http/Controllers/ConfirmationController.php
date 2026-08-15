<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class ConfirmationController extends Controller
{
    //
    public function store()
    {
        try {
                    ConfirmationCoupon::create([
            'full_name' => request('full_name'),
            'phone_number' => request('phone_number'),
            'email' => request('email'),
            'coupon_code' => request('coupon_code'),
            'province' => request('province'),
            'city' => request('city'),
        ]);
        } catch (\Throwable $th) {
            //throw $th;
        }
    }
}
