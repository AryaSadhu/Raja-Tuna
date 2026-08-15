<?php

namespace App\Http\Controllers;

use App\Http\Resources\Resource;
use App\Models\CheckoutHistory;
use App\Models\Coupon;
use App\Models\CustomerCoupon;
use Carbon\Carbon;
use GuzzleHttp\Promise\Create;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator as FacadesValidator;
use Throwable;

class CheckoutController extends Controller
{
    public $product_price = 50000;
    // public $courier_price = 0;
    protected $email = "";
    protected $coupon = "";
    protected $checkout_history_id = "";
    protected $order_no = "";
    protected $grand_total = "";
    //
    // public function create(Request $request)
    // {
    //     $validator = FacadesValidator::make($request->all(), [
    //         'email' => 'required|email',
    //     ], [
    //         'email.email' => 'Gunakan email yang terdaftar',
    //         'required' => ':attribute harus diisi'
    //     ]);

    //     if ($validator->fails()) {
    //         return response()->json([
    //             'status' => 400,
    //             'message' => 'error',
    //             'data' => [$validator->errors()]
    //         ]);
    //     }

    //     try {
    //         $validatedData = $validator->validated();
    //         $email_lowercase = strtolower($validatedData['email']);
    //         $this->email = $email_lowercase;

    //         Customer::firstOrCreate(
    //             ['email' => $email_lowercase],
    //             ['email' => $email_lowercase]
    //         );
    //         $this->createHistoryCheckout($request);
    //     } catch (\Throwable $th) {
    //         return response()->json([
    //             'status' => 500,
    //             'message' => 'error',
    //             'data' => [$th->getMessage()]
    //         ]);
    //     }
    // }

    public function createHistoryCheckout(Request $request)
    {
        try {
            $email_controller = new EmailController();
            $courier_price = 0;
            $validator = FacadesValidator::make($request->all(), [
                'email' => 'required|email',
                'full_name' => 'required|max:255',
                'quantity' => 'required|min:1',
                'district_id' => 'required',
                'courier_code' => 'required',
                'courier_service' => 'required',
                'province' => 'required|string',
                'phone' => 'required',
                'district' => 'required',
                'city' => 'required',
                'address' => 'required',
            ], [
                'email.email' => 'Bukan email!',
                'required' => ':attribute harus diisi!'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => 400,
                    'message' => 'error',
                    'data' => [$validator->errors()]
                ]);
            }

            $validatedData = $validator->validated();
            $courier_controller = new CourierController();
            $res = $courier_controller->getCourier($validatedData['district_id'])->getData();
            $courier_arr = $res->data->data;
            foreach ($courier_arr as $value) {
                if ($value->code == $validatedData['courier_code'] && $value->service == $validatedData['courier_service']) {
                    $courier_price = $value->cost;
                }
            }

            $validatedData['customer_id'] = $this->email;;
            $validatedData['courier_price'] = $courier_price;
            $validatedData['grand_total'] = ($this->product_price * (int)$validatedData['quantity']) + $courier_price;
            $validatedData['order_no'] = $this->generateOrderNo();

            $result = CheckoutHistory::create($validatedData);
            $this->checkout_history_id = $result->id;
            $this->createCoupon();
            // $this->createCustomerCouponRelation();
            $this->order_no = $result->order_no;
            $this->grand_total = $result->grand_total;

            $email_controller->send($this->email, $this->order_no, $this->coupon, $this->grand_total);

            return response()->json([
                'status' => 200,
                'message' => 'success',
                'data' => ['grand_total' => $validatedData['grand_total']]
            ]);
        } catch (\Throwable $th) {
            dd($th->getMessage());
        }
    }

    public function generateOrderNo()
    {
        $order_no = "";
        $const = 'ORD';
        $date_now = Carbon::now();
        $date_now_string = $date_now->toDateString();
        $formatted_date = $date_now->format('Ymd');
        $chistory_latest_date = DB::select('SELECT COUNT(*) as total FROM checkout_histories WHERE DATE(created_at) = ?', [$date_now_string]);
        // dd($chistory_latest_date);
        if (!$chistory_latest_date) {
            $sequencePadded = str_pad(1, 6, '0', STR_PAD_LEFT);
            $order_no = "$const-$formatted_date-$sequencePadded";
            return $order_no;
        } else {
            $sequencePadded = str_pad($chistory_latest_date[0]->total + 1, 6, '0', STR_PAD_LEFT);
            $order_no = "$const-$formatted_date-$sequencePadded";
        }

        return $order_no;
    }



    public function createCoupon()
    {
        try {
            $const = 'KPT';
            $date_now = Carbon::now();
            $date_now_string = $date_now->toDateString();
            $formatted_date = $date_now->format('Ymd');
            $data = DB::select("SELECT COUNT(*) as total_coupons FROM coupons WHERE DATE(created_at) = ?", [$date_now_string]);
            // dd($data);
            if (!$data) {
                $sequencePadded = str_pad(1, 6, '0', STR_PAD_LEFT);
                $this->coupon = "$const-$formatted_date-$sequencePadded";
            } else {
                $sequencePadded = str_pad($data[0]->total_coupons + 1, 6, '0', STR_PAD_LEFT);
                $this->coupon = "$const-$formatted_date-$sequencePadded";
            }

            Coupon::create(['id' => $this->coupon]);
        } catch (\Throwable $th) {
            dd($th);
        }
    }


    // public function createCustomerCouponRelation()
    // {
    //     try {
    //         CustomerCoupon::create([
    //             'customer_id' => $this->email,
    //             'checkout_history_id' => $this->checkout_history_id,
    //             'coupon_code' => $this->coupon
    //         ]);
    //     } catch (\Throwable $th) {
    //         dd($th);
    //     }
    // }
}
