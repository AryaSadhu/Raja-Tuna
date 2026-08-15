<?php

namespace App\Http\Controllers;

use App\Http\Resources\Resource;
use App\Models\Coupon;
use App\Models\CouponConfirmation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class CouponConfirmationController extends Controller
{
    //
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'coupon_code' => 'required|array',
            'coupon_code.*' => 'required|min:8|max:8',
            'full_name' => 'required',
            'email' => 'required|email',
            'address' => 'required',
            'phone' => 'required',
            'buy_platform' => 'required',
        ], [
            'required' => 'tidak boleh kosong',
            'email.email' => 'Bukan email',
            'coupon_code.*.min' => 'Kode kupon minimal 8 digit',
            'coupon_code.*.max' => 'Kode kupon maksimal 8 digit'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => False,
                'message' => 'error',
                'data' => $validator->errors()
            ], 400);
        }

        try {
            $coupon_controller = new CouponController();
            $data = [];
            $validatedData = $validator->validated();
            foreach ($validatedData["coupon_code"] as $cp_code) {
                $res = $coupon_controller->checkCoupon($cp_code);
                $status = $res["status"];
                if (!$status) {
                    return response()->json($res);
                    break;
                } 
                $dataToStore = $validatedData;
                $dataToStore['coupon_code'] = $cp_code;
                $store_res = CouponConfirmation::create($dataToStore);
                $data[] = [
                    'status' => $status,
                    'message' => 'Kupon sudah disimpan',
                    'data' => [$store_res]
                ];
            }
            return response()->json([
                'code' => 200,
                'message' => 'success',
                'data' => $data
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'code' => 500,
                'message' => 'server error',
                'data' => $th->getMessage()
            ], 500);
        }
    }

    public function checkCoupon($coupon_code)
    {
        $coupon_controller = new CouponController();
        $res = $coupon_controller->checkCoupon($coupon_code);
        return response()->json($res);
    }
}
