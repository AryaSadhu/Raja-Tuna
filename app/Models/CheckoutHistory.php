<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CheckoutHistory extends Model
{
    //


    protected $fillable = [
        'email',
        'full_name',
        'customer_id',
        'quantity',
        'payment_status',
        'tracking_status',
        'courier_code',
        'courier_service',
        'courier_price',
        'grand_total',
        'order_no',
        'awb',
        'user_id',
        'province',
        'phone',
        'district',
        'city',
        'address',
    ];
}
