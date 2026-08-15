<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Controllers\CouponController;
use App\Models\Coupon;
use App\Models\CouponConfirmation;
use App\Models\Events;
use App\Models\GachaDate;
use App\Models\Prize;
use App\Models\Winner;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Symfony\Contracts\EventDispatcher\Event;

class AdminEventController extends Controller
{
    //
    public function randomGacha($event_id, $num)
    {
        try {
            $event_data = Events::find($event_id);
            if ($event_data === null || $event_data->status) {
                return response()->json([
                    'code' => 403,
                    'message' => 'Event tidak ditemukan',
                    'data' => []
                ]);
            }
            $winners = [];
            $confirmation_id = DB::table('coupon_confirmations as cc')
                ->join('coupons as c', 'c.id', '=', 'cc.coupon_code')
                ->leftJoin('winners as w', 'w.coupon_code', '=', 'cc.coupon_code')
                ->where('c.status', '=', '0')
                ->where('cc.created_at', '<', $event_data->last_buy_date)
                ->whereNull('w.coupon_code')   // <-- this excludes winners
                ->select('cc.id', 'cc.coupon_code')
                ->get();


            $confirmation_array = $confirmation_id->pluck("id")->toArray();
            $coupon_code_array = $confirmation_id->pluck("coupon_code")->toArray();
            Cache::put("coupon_data", $coupon_code_array);

            if ($num > count($confirmation_array)) {
                return response()->json([
                    'code' => 400,
                    'message' => 'Jumlah kupon tidak cukup untuk mengundi',
                    'data' => []
                ], 400);
            }

            if ($num > 1) {
                $winner_keys = array_rand($confirmation_array, $num);
            } else {
                $winner_keys[] = array_rand($confirmation_array, $num);
            }

            foreach ($winner_keys as $key) {
                $winner = DB::table("coupon_confirmations")
                    ->select("id", "full_name", "coupon_code")
                    ->find($confirmation_array[$key]);
                $winners[] = $winner;
            }

            return response()->json([
                'code' => 200,
                'message' => 'success',
                'data' => $winners
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'code' => 500,
                'message' => 'error',
                'data' => $th->getMessage()
            ], 500);
        }
    }

    public function createGachaEvent(Request $request)
    {
        $validator = Validator::make($request->all(), [
            "title" => "required|string",
            "start_date" => "required|date",
            "last_buy_date" => "required|date",
            "total_winners" => "required|integer",
            "prizes" => "required|array",
            "prizes.*.prize_name" => "required|string",
            "prizes.*.qty" => "required|integer|min:1",
            "prizes.*.prize_type" => "required",
        ], [
            "required" => "tidak boleh kosong",
        ]);
        if ($validator->fails()) {
            return response()->json([
                'code' => 400,
                'message' => 'error',
                'data' => $validator->errors()
            ], 400);
        }
        try {
            $validatedData = $validator->validated();
            $not_yet_ended_event = Events::where('status', '0')->exists();
            if ($not_yet_ended_event) {
                return response()->json([
                    'code' => 400,
                    'message' => 'Ada event yang belum selesai',
                    'data' => []
                ], 400);
            }

            $events = Events::create([
                "title" => $validatedData["title"],
                "start_date" => $validatedData["start_date"],
                "last_buy_date" => $validatedData["last_buy_date"],
                "total_winners" => $validatedData["total_winners"]
            ]);

            foreach ($validatedData["prizes"] as $prize) {
                $prize = Prize::create([
                    "prize_types_id" => $prize['prize_type'],
                    "prize_name" => $prize['prize_name'],
                    "qty" => $prize['qty'],
                    "events_id" => $events->id
                ]);
            }

            return response()->json([
                'code' => 200,
                'message' => 'store success',
                'data' => ["undian" => $events, "hadiah" => $prize]
            ]);
        } catch (\Throwable $th) {
            Events::find($events->id)->delete();
            return response()->json([
                'code' => 500,
                'message' => 'server error',
                'data' => $th->getMessage()
            ], 500);
        }
    }

    public function updateGachaEvent(Request $request)
    {
        $validator = Validator::make($request->all(), [
            "id" => "required|integer|exists:events,id",
            "title" => "required|string",
            "start_date" => "required|date",
            "last_buy_date" => "required|date",
            "total_winners" => "required|integer",
            "prizes" => "required|array",
            "prizes.*.prize_name" => "required|string",
            "prizes.*.qty" => "required|integer|min:1",
            "prizes.*.prize_type" => "required",
        ], [
            "required" => "tidak boleh kosong",
            "exists" => "Event tidak ditemukan",
        ]);

        if ($validator->fails()) {
            return response()->json([
                'code' => 400,
                'message' => 'error',
                'data' => $validator->errors()
            ], 400);
        }

        try {
            $validatedData = $validator->validated();

            $event = Events::find($validatedData["id"]);

            if (!$event) {
                return response()->json([
                    'code' => 404,
                    'message' => 'Event tidak ditemukan',
                    'data' => []
                ], 404);
            }

            $event->update([
                "title" => $validatedData["title"],
                "start_date" => $validatedData["start_date"],
                "last_buy_date" => $validatedData["last_buy_date"],
                "total_winners" => $validatedData["total_winners"]
            ]);

            Prize::where("events_id", $event->id)->delete();

            $newPrizes = [];
            foreach ($validatedData["prizes"] as $p) {
                $newPrizes[] = Prize::create([
                    "prize_types_id" => $p['prize_type'],
                    "prize_name" => $p['prize_name'],
                    "qty" => $p['qty'],
                    "events_id" => $event->id
                ]);
            }

            return response()->json([
                'code' => 200,
                'message' => 'Update success',
                'data' => [
                    "event" => $event,
                    "prizes" => $newPrizes
                ]
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'code' => 500,
                'message' => 'server error',
                'data' => $th->getMessage()
            ], 500);
        }
    }

    public function storeWinners(Request $request)
    {
        $validator = Validator::make($request->all(), [
            "events_id" => "required|integer|exists:events,id",
            "winners" => "required|array",
            "winners.*.coupon_code" => "required",
            "winners.*.prize_types_id" => "required|integer",
            "winners.*.mode_type" => "required|integer|in:0,1", // Add validation for mode_type in each winner
            "winners.*.prizes_id" => "required|integer|exists:prizes,id",
        ], [
            "required" => "tidak boleh kosong",
            "exists" => "Event tidak ditemukan",
            "winners.*.mode_type.in" => "Mode type harus 0 (random) atau 1 (manual)",
        ]);

        if ($validator->fails()) {
            return response()->json([
                'code' => 400,
                'message' => 'error',
                'data' => $validator->errors()
            ], 400);
        }

        try {
            $validatedData = $validator->validated();
            $event_res = Events::find($validatedData["events_id"]);

            if (!$event_res) {
                return response()->json([
                    "code" => 404,
                    "message" => "Event tidak ditemukan",
                    "data" => []
                ], 404); // Don't forget HTTP status code
            }

            $sent_total_winners = count($validatedData["winners"]);
            $res_winner = Winner::where('events_id', $validatedData["events_id"])->count();

            // Check if adding new winners would exceed total capacity
            if ($res_winner + $sent_total_winners > $event_res->total_winners) {
                return response()->json([
                    "code" => 400,
                    "message" => "Total pemenang melebihi kapasitas. Sudah ada $res_winner pemenang, ingin tambah $sent_total_winners, kapasitas total: $event_res->total_winners",
                    "data" => []
                ], 400);
            }

            // Check if already have enough winners
            if ($res_winner == $event_res->total_winners) {
                return response()->json([
                    "code" => 400,
                    "message" => "Total pemenang sudah mencukupi",
                    "data" => []
                ], 400);
            }

            $to_store_winners_data = [];
            $coupon_controller = new CouponController();

            // Check for duplicates in current batch
            $couponCodesInBatch = [];

            foreach ($validatedData["winners"] as $winner) {
                // Check duplicate in current batch
                if (in_array($winner["coupon_code"], $couponCodesInBatch)) {
                    return response()->json([
                        "code" => 400,
                        "message" => "Kupon duplikat dalam batch yang sama: " . $winner["coupon_code"],
                        "data" => []
                    ], 400);
                }

                // Check if coupon exists
                $check_res = $coupon_controller->isCouponExists($winner["coupon_code"]);
                if (!$check_res) {
                    return response()->json([
                        "code" => 404,
                        "message" => "Kupon tidak ditemukan",
                        "data" => [$winner["coupon_code"]]
                    ], 404);
                }

                // Check if coupon already a winner for this event
                $existingWinner = Winner::where('events_id', $validatedData["events_id"])
                    ->where('coupon_code', $winner["coupon_code"])
                    ->first();

                if ($existingWinner) {
                    return response()->json([
                        "code" => 400,
                        "message" => "Kupon sudah terdaftar sebagai pemenang",
                        "data" => [$winner["coupon_code"]]
                    ], 400);
                }

                $to_store_winners_data[] = [
                    "coupon_code" => $winner["coupon_code"],
                    "events_id" => $validatedData["events_id"],
                    "prize_types_id" => $winner["prize_types_id"],
                    "mode_type" => $winner["mode_type"], // Use mode_type from each winner
                    "prizes_id" => $winner["prizes_id"],   // <<< ADD THIS
                    "created_at" => Carbon::now(),
                    "updated_at" => Carbon::now()
                ];

                $couponCodesInBatch[] = $winner["coupon_code"];
            }

            $store_res = Winner::insert($to_store_winners_data);

            return response()->json([
                "code" => 200,
                "message" => "success",
                "data" => [
                    'inserted_count' => count($to_store_winners_data),
                    'total_winners_now' => $res_winner + count($to_store_winners_data)
                ]
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                "code" => 500,
                "message" => "server error",
                "data" => $th->getMessage()
            ], 500);
        }
    }

    public function removeEvent($event_id)
    {
        try {
            $event_data = Events::find($event_id);
            if (!$event_data) {
                return response()->json([
                    "code" => 200,
                    "message" => "Event tidak ditemukan",
                    "data" => []
                ]);
            }
            $res = $event_data->delete();
            Cache::forget("coupon_data");
            Cache::forget("winners");
            return response()->json([
                "code" => 200,
                "message" => "success",
                "data" => $res
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                "code" => 500,
                "message" => "server error",
                "data" => $th->getMessage()
            ]);
        }
    }

    public function endGachaEvent($event_id)
    {
        $event_data = Events::find($event_id);
        try {
            if (!$event_data) {
                return response()->json([
                    "code" => 403,
                    "message" => "Event tidak ditemukan",
                    "data" => []
                ]);
            }
            $coupon_data_cache = Cache::get("coupon_data");
            if (!$coupon_data_cache) {
                return response()->json([
                    "code" => 403,
                    "message" => "Data pemenang tidak ditemukan",
                    "data" => []
                ]);
            }
            Coupon::whereIn("id", $coupon_data_cache)->chunkById(500, function ($coupons) {
                foreach ($coupons as $coupon) {
                    $coupon->update(["status" => '1']);
                }
            });
            $res = Events::find($event_id)->update(["status" => '1']);
            Cache::forget("coupon_data");
            return response()->json([
                "code" => 200,
                "message" => "success",
                "data" => $res
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                "code" => 500,
                "message" => "server error",
                "data" => $th->getMessage()
            ]);
        }
    }

    public function checkCoupon($cp_code)
    {
        $res = CouponConfirmation::where("coupon_code", $cp_code)->select("id", "full_name")->first();
        if (!$res) {
            return response()->json([
                'code' => 400,
                'message' => 'Pemilik kupon tidak ditemukan',
                'data' => [$cp_code]
            ]);
        }
        $res_winner = Winner::where("coupon_code", $cp_code)->exists();
        if ($res_winner) {
            return response()->json([
                'code' => 400,
                'message' => 'Pemilik kupon sudah menjadi pemenang',
                'data' => [$cp_code]
            ]);
        }
        return response()->json([
            'code' => 200,
            'message' => 'success',
            'data' => [$res]
        ]);
    }

    // UPDATED: Use prizes_id instead of prize_types_id
    public function drawOneWinner(Request $request)
    {
        // Validasi input - CHANGED to prizes_id
        $validator = Validator::make($request->all(), [
            'event_id' => 'required|integer|exists:events,id',
            'prizes_id' => 'required|integer|exists:prizes,id'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => $validator->errors()->first()
            ], 400);
        }

        $eventId = $request->event_id;
        $prizesId = $request->prizes_id;

        // Get the prize details
        $prize = \App\Models\Prize::find($prizesId);
        if (!$prize) {
            return response()->json([
                'status' => 'error',
                'message' => 'Hadiah tidak ditemukan!'
            ], 404);
        }

        // 1. Check if there are any participants for this specific prize
        $totalPeserta = \App\Models\Winner::where('events_id', $eventId)
            ->where('prizes_id', $prizesId) // CHANGED
            ->count();

        if ($totalPeserta == 0) {
            return response()->json([
                'status' => 'error',
                'message' => 'Admin belum input data peserta untuk hadiah ini!'
            ], 404);
        }

        // 2. Find a candidate who hasn't won yet for this prize
        $candidate = \App\Models\Winner::where('events_id', $eventId)
            ->where('prizes_id', $prizesId) // CHANGED
            ->whereNull('won_at')
            ->inRandomOrder()
            ->first();

        // 3. If no candidate found, all prizes have been distributed
        if (!$candidate) {
            return response()->json([
                'status' => 'error',
                'message' => 'Semua hadiah sudah dibagikan (Kuota Habis)!'
            ], 404);
        }

        // Mark as won
        $candidate->won_at = now();
        $candidate->save();

        // Convert to array
        $winnerData = $candidate->toArray();

        // Get participant profile
        $profilePeserta = \App\Models\CouponConfirmation::where('coupon_code', $candidate->coupon_code)->first();

        $fullName = $profilePeserta ? $profilePeserta->full_name : null;
        $phone = $profilePeserta ? $profilePeserta->phone : null;

        // Censoring
        $censoredName = $fullName
            ? substr($fullName, 0, 4) . str_repeat('*', max(strlen($fullName) - 4, 1))
            : 'Nama Tidak Ditemukan';

        $censoredPhone = $phone
            ? str_repeat('*', max(strlen($phone) - 4, 1)) . substr($phone, -4)
            : '****';

        // Add to array
        $winnerData['name'] = $censoredName;
        $winnerData['phone'] = $censoredPhone;

        // Calculate remaining for this specific prize
        $remaining = \App\Models\Winner::where('events_id', $eventId)
            ->where('prizes_id', $prizesId) // CHANGED
            ->whereNull('won_at')
            ->count();

        // 4. Return data
        return response()->json([
            'status' => 'success',
            'winner' => $winnerData,
            'remaining' => $remaining
        ]);
    }

    public function getLiveStatus($event_id)
    {
        $latest = \App\Models\Winner::where('events_id', $event_id)
            ->whereNotNull('won_at')
            ->latest('won_at')
            ->first();

        if (!$latest) {
            return response()->json([
                'latest_winner' => null,
                'server_time' => now()->timestamp
            ]);
        }

        // Fetch profile
        $profile = \App\Models\CouponConfirmation::where('coupon_code', $latest->coupon_code)->first();

        $fullName = $profile?->full_name;
        $phone = $profile?->phone;

        // Censored name & phone
        $censoredName = $fullName
            ? substr($fullName, 0, 4) . str_repeat('*', max(strlen($fullName) - 4, 1))
            : "Nama Tidak Ditemukan";

        $censoredPhone = $phone
            ? str_repeat('*', max(strlen($phone) - 4, 1)) . substr($phone, -4)
            : "****";

        // Transform into array
        $latestArr = $latest->toArray();
        $latestArr['name'] = $censoredName;
        $latestArr['phone'] = $censoredPhone;

        return response()->json([
            'latest_winner' => $latestArr,
            'server_time' => now()->timestamp
        ]);
    }
}
