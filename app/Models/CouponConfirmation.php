<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CouponConfirmation extends Model
{
    //
    protected $fillable = [
        'coupon_code',
        'full_name',
        'email',
        'address',
        'district',
        'buy_platform',
        'phone'
    ];

}
