<?php

namespace App\Http\Controllers;

use GuzzleHttp\Client;
use Illuminate\Support\Facades\Cache;

class CourierController extends Controller
{
    //
    public function getProvince()
    {
        $province_cache = Cache::get('province');

        if ($province_cache) {

            return response()->json([
                'status' => 200,
                'message' => 'success from cache',
                'data' => $province_cache
            ]);
        } else {
            $client = new Client();
            $url = "https://rajaongkir.komerce.id/api/v1/destination/province";

            try {
                $province_raw = $client->request('GET', $url, [
                    'headers' => [
                        'accept' => 'application/json',
                        'key' => env('RAJA_ONGKIR_API_KEY_COST')
                    ]
                ]);
                $province = json_decode($province_raw->getBody()->getContents());
                Cache::put('province', $province);
                return response()->json([
                    'status' => 200,
                    'message' => 'success',
                    'data' => $province
                ]);
            } catch (\Throwable $th) {
                return response()->json([
                    'status' => 400,
                    'message' => $th->getMessage(),
                    'data' => []
                ]);
            }
        }
    }

    public function getCity($province_id)
    {
        $cityCached = Cache::get('city');
        if ($cityCached) {
            return response()->json([
                'status' => 200,
                'message' => 'success from cache',
                'data' => $cityCached
            ]);
        } else {
            $client = new Client();
            $url = "https://rajaongkir.komerce.id/api/v1/destination/city/$province_id";

            try {
                $city_raw = $client->request('GET', $url, [
                    'headers' => [
                        'accept' => 'application/json',
                        'key' => env('RAJA_ONGKIR_API_KEY_COST')
                    ]
                ]);
                $city = json_decode($city_raw->getBody()->getContents());
                Cache::put('city', $city);
                return response()->json([
                    'status' => 200,
                    'message' => 'success',
                    'data' => $city
                ]);
            } catch (\Throwable $th) {
                return response()->json([
                    'status' => 400,
                    'message' => $th->getMessage(),
                    'data' => []
                ]);
            }
        }
    }

    public function getDistrict($city_id)
    {
        $districtCached = Cache::get('district');
        if ($districtCached) {
            return response()->json([
                'status' => 200,
                'message' => 'success',
                'data' => $districtCached
            ]);
        } else {
            $client = new Client();
            $url = "https://rajaongkir.komerce.id/api/v1/destination/district/$city_id";

            try {
                $district_raw = $client->request('GET', $url, [
                    'headers' => [
                        'accept' => 'application/json',
                        'key' => env('RAJA_ONGKIR_API_KEY_COST')
                    ]
                ]);
                $district = json_decode($district_raw->getBody()->getContents());
                Cache::put('district', $district);
                return response()->json([
                    'status' => 200,
                    'message' => 'success',
                    'data' => $district
                ]);
            } catch (\Throwable $th) {
                return response()->json([
                    'status' => 400,
                    'message' => $th->getMessage(),
                    'data' => []
                ]);
            }
        }
    }

    public function getCourier($district_id)
    {
        $courierCached = Cache::get('courier');
        if ($courierCached) {
            return response()->json([
                'status' => 200,
                'message' => 'success from cache',
                'data' => $courierCached
            ]);
        } else {
            $client = new Client();
            $url = "https://rajaongkir.komerce.id/api/v1/calculate/district/domestic-cost";

            try {
                $courier_raw = $client->request('POST', $url, [
                    'headers' => [
                        'accept' => 'application/json',
                        'key' => env('RAJA_ONGKIR_API_KEY_COST'),
                        'content-type' => 'application/x-www-form-urlencoded'
                    ],
                    'form_params' => [
                        'origin' => 1391,
                        'destination' => $district_id,
                        'weight' => 1000,
                        'courier' => 'jne:sicepat:ide:sap:jnt:ninja:tiki:lion:anteraja:pos:ncs:rex:rpx:sentral:star:wahana:dse',
                        'price' => 'lowest'
                    ]
                ]);
                $couriers = json_decode($courier_raw->getBody()->getContents());
                Cache::put('courier', $couriers);
                return response()->json([
                    'status' => 200,
                    'message' => 'success',
                    'data' => $couriers
                ]);
            } catch (\Throwable $th) {
                return response()->json([
                    'status' => 400,
                    'message' => $th->getMessage(),
                    'data' => []
                ]);
            }
        }
    }
}
