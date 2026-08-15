<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Foundation\Auth\User as Authenticable;

class Admin extends Authenticable
{
    //
    public $fillable = [
        'username',
        'password'
    ];

    protected $guarded = [
        'password'
    ];
}
