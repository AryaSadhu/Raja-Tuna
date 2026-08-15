<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Controllers\CouponPDFController;
use App\Models\Coupon;
use App\Models\CouponFile;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Pest\Support\Str;

class AdminCouponController extends Controller
{
    //
    protected $coupon_length = 8;

    public function couponsGetter(Int $num)
    {
        try {
            $cp_pdf_cntrl = new CouponPDFController();
            $file = $this->createCouponFile();
            $res = $this->generateCoupons($num, $file);
        } catch (QueryException $e) {
            if ($e->errorInfo[1] == 1062) {
                $file = $this->createCouponFile();
                $this->generateCoupons($num, $file);
            } else {
                return response()->json([
                    'code' => 500,
                    'message' => 'server error',
                    'data' => $e->getMessage()
                ]);
            }
        }
        return $cp_pdf_cntrl->createFile($res, $file->title);
    }

    public function generateCoupons(Int $num, $file): array
    {
        $chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ0123456789';
        $coupon_code_arr = [];
        for ($x = 0; $x < $num; $x++) {
            $coupon_code = '';
            for ($i = 0; $i < $this->coupon_length; $i++) {
                $rand_int = random_int(0, strlen($chars) - 1);
                $coupon_code .= $chars[$rand_int];
            }
            $timestamps = Carbon::now();
            array_push($coupon_code_arr, ["id" => $coupon_code, "coupon_files_id"=>$file->id , 'created_at' => $timestamps, 'updated_at' => $timestamps]);
        }
        Coupon::insert($coupon_code_arr);
        return $coupon_code_arr;
    }

    public function createCouponFile()
    {
        $today = Carbon::now()->toDateString();
        $today_formatted = Carbon::now()->format('Ymd');
        $next_num = DB::table("coupon_files")
            ->whereDate("created_at", $today)
            ->count() + 1;

        $number_formatted = str_pad($next_num, 4, '0', STR_PAD_LEFT);
        $file_name = "kupon-$number_formatted-$today_formatted";

        $res = CouponFile::create([
            "title" => $file_name
        ]);

        return $res;
    }
}
