<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Prize;

class Events extends Model
{
    //
    protected $fillable= [
        "title",
        "total_winners",
        "start_date",
        "last_buy_date",
        "status"
    ];

    public function prizes()
    {
        // 'events_id' adalah foreign key di tabel 'prizes'
        // 'id' adalah primary key di tabel 'events'
        return $this->hasMany(Prize::class, 'events_id', 'id');
    }
}
