<?php

namespace App\Http\Controllers;

use App\Mail\CheckoutTransaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class EmailController extends Controller
{
    //
    public function send($to_email, $order_no, $coupon, $grand_total)
    {

        Mail::to($to_email)->send(new CheckoutTransaction($order_no, $coupon, $grand_total));
    }
}
