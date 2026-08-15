<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class OngkirController extends Controller
{
    private $apiKey = "UBdAnTxs1cba52654ef35f1anPCwziWQ";

public function getProvinces()
{
    try {
        $response = Http::timeout(15)
            ->withHeaders(['key' => $this->apiKey])
            ->get('https://rajaongkir.komerce.id/api/v1/destination/province');

        Log::info('Province response status: ' . $response->status());
        Log::info('Province body: ' . $response->body());

        $body = $response->json();
        return response()->json($body['data'] ?? []);
    } catch (\Exception $e) {
        Log::error('Province error: ' . $e->getMessage());
        return response()->json([], 500);
    }
}

    public function getCities($provinceId)
    {
        $response = Http::withHeaders(['key' => $this->apiKey])
            ->get("https://rajaongkir.komerce.id/api/v1/destination/city/{$provinceId}");

        $body = $response->json();
        Log::info('CITIES RAW:', ['body' => $body]);

        return response()->json($body['data'] ?? []);
    }

    public function getDistricts($cityId)
    {
        $response = Http::withHeaders(['key' => $this->apiKey])
            ->get("https://rajaongkir.komerce.id/api/v1/destination/district/{$cityId}");

        $body = $response->json();
        Log::info('DISTRICTS RAW:', ['body' => $body]);

        return response()->json($body['data'] ?? []);
    }

    public function checkCost(Request $request)
    {
        $response = Http::withHeaders([
            'key' => $this->apiKey,
            'Content-Type' => 'application/x-www-form-urlencoded'
        ])->asForm()->post('https://rajaongkir.komerce.id/api/v1/calculate/district/domestic-cost', [
            'origin'      => '1391',
            'destination' => $request->destination,
            'weight'      => $request->weight ?? 1000,
            'courier'     => 'jne:sicepat:jnt:pos:tiki:anteraja',
            'price'       => 'lowest'
        ]);

        return $response->json();
    }
}