<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Admin;
use App\Models\Coupon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;

class SuperAdminMenu extends Controller
{
    //
    public function index()
    {
        $admin_data = Admin::all();
        return Inertia::render('Admin/MenuSuperAdmin', ["admins" => $admin_data]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'username' => 'required',
            'password' => 'required|min:8',
        ], [
            'required' => 'tidak boleh kosong',
            'min' => 'Minimal :min karakter',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'error',
                'data' => $validator->errors()
            ], 400);
        }

        try {
            $validatedData = $validator->validated();
            $res = Admin::create([
                "username" => $validatedData["username"],
                "password" => Hash::make($validatedData["password"]),
                "role" => 'admin'
            ]);
            return response()->json([
                'message' => 'success',
                'data' => []
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'message' => 'server error',
                'data' => $th->getMessage()
            ], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $res = Admin::find($id);
            $res->delete();
            return response()->json([
                'message' => 'success',
                'data' => []
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'message' => 'server error',
                'data' => $th->getMessage()
            ], 500);
        }
    }
}
