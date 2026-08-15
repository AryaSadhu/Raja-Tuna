<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;

class AdminProductController extends Controller
{
    //
    public function index() {}

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            "name" => 'required',
            "image_path" => 'nullable',
            "price" => 'required|numeric',
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
            //make a deafult picture if the image is null
            $validatedData = $validator->validated();
            $res = Product::store($validatedData);
            return response()->json([
                'code' => 200,
                'message' => 'success',
                'data' => $res
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'code' => 500,
                'message' => 'error',
                'data' => $th->getMessage()
            ]);
        }
    }

    public function update(Request $request)
    {
        $validator = Validator::make($request->all(), [
            "product_id" => "required",
            "name" => 'required',
            "image_path" => 'nullable',
            "price" => 'required|numeric',
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
            $res = Product::find($validatedData["product_id"]);
            $res->update([
                "name" => $validatedData["name"],
                "price" => $validatedData["price"],
                "image_path" => $validatedData["image_path"]
            ]);
            return Inertia::location(route(""));
        } catch (\Throwable $th) {
            return response()->json([
                'code' => 500,
                'message' => 'error',
                'data' => $th->getMessage()
            ]);
        }
    }

    public function destroy($product_id)
    {
        try {
            $res = Product::find($product_id);
            if (!$res) {
                return response()->json([
                    'code' => 400,
                    'message' => 'data tidak ditemukan',
                    'data' => []
                ]);
            }
            $res->delete();
            return Inertia::location(route(""));
        } catch (\Throwable $th) {
            return response()->json([
                'code' => 500,
                'message' => 'error',
                'data' => $th->getMessage()
            ]);
        }
    }

    public function changeProductQty() {
        
    }
}
