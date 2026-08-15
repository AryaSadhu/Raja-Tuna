<?php

namespace App\Http\Controllers;

use App\Models\Coupon;
use App\Models\CouponConfirmation;
use Carbon\Carbon;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use phpDocumentor\Reflection\PseudoTypes\False_;

class CouponController extends Controller
{
    //
    // protected $coupon_length = 8;

    // public function couponsGetter(Int $num)
    // {
    //     try {
    //         $cp_pdf_cntrl = new CouponPDFController();
    //         $res = $this->generateCoupons($num);
    //         return $cp_pdf_cntrl->createFile($res, $num);
    //     } catch (QueryException $e) {
    //         if ($e->errorInfo[1] == 1062) {
    //             $this->generateCoupons($num);
    //         } else {
    //             return response()->json([
    //                 'code' => 500,
    //                 'message' => 'server error',
    //                 'data' => $e->getMessage()
    //             ]);
    //         }
    //     }
    // }

    // public function generateCoupons(Int $num): array
    // {
    //     $chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ0123456789';
    //     $coupon_code_arr = [];

    //     for ($x = 0; $x < $num; $x++) {
    //         $coupon_code = '';
    //         for ($i = 0; $i < $this->coupon_length; $i++) {
    //             $rand_int = random_int(0, strlen($chars) - 1);
    //             $coupon_code .= $chars[$rand_int];
    //         }
    //         $timestamps = Carbon::now();
    //         array_push($coupon_code_arr, ["id" => $coupon_code, 'created_at' => $timestamps, 'updated_at' => $timestamps]);
    //     }
    //     Coupon::insert($coupon_code_arr);
    //     return $coupon_code_arr;
    // }

    public function checkCoupon($cp_code): array
    {
        $coupon_exist = $this->isCouponExists($cp_code);
        if ($coupon_exist) {
            $coupon_confirmed = $this->isCouponConfirmed($cp_code);
            if ($coupon_confirmed[0]) {
                return [
                    "status" => True,
                    "message" => [],
                    "data" => []
                ];
            } else {
                $redeem_date = $coupon_confirmed[1];
                return [
                    'status' => False,
                    "data" => [
                        'message' => "Kupon sudah diredeem tanggal $redeem_date",
                        "data" => [$cp_code]
                    ]
                ];
            }
        } else {
            return [
                'status' => False,
                "data" => [
                    "message" => "Kupon tidak ditemukan",
                    "data" => [$cp_code]
                ]
            ];
        }
    }

    public function isCouponExists($coupon_code): bool
    {
        $coupon_exists = Coupon::find($coupon_code);
        if (!$coupon_exists) {
            return False;
        }
        return True;
    }

    public function isCouponConfirmed($coupon_code): array
    {
        $coupon_confirmed = CouponConfirmation::where('coupon_code', $coupon_code)->first();

        if ($coupon_confirmed) {
            return [false, $coupon_confirmed->created_at->format('Y-m-d')];
        }
        return [true];
    }
}
