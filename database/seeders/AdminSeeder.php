<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //
        DB::table('admins')->insert([
            [
                'username' => 'agus',
                'password' => Hash::make('aguscoolbangetnok'),
                'role' => 'superadmin'
            ],
            [
                'username' => 'semara',
                'password' => Hash::make('semaragopay'),
                'role' => 'superadmin'
            ],
            [
                'username' => 'pasek',
                'password' => Hash::make('pasekngodingamphoreus'),
                'role' => 'superadmin'
            ],
            [
                'username' => 'sadhu',
                'password' => Hash::make('admindatang!!!'),
                'role' => 'superadmin'
            ],
            [
                'username' => 'artha',
                'password' => Hash::make('ceotelegram'),
                'role' => 'superadmin'
            ],

        ]);
    }
}
