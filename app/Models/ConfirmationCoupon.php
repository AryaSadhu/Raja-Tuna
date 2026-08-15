<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ConfirmationCoupon extends Model
{
    //
    protected $fillable = [
        'full_name',
            'phone_number',
            'email',
            'coupon_code',
            'province',
            'city',

            
    ];


}
