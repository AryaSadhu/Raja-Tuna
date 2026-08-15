<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Winner extends Model
{
    //
    protected $fillable = [
        "coupon_code",
        "events_id",
        "prize_types_id",
        'won_at',
        "mode_type",
        "prizes_id"
    ];
}
