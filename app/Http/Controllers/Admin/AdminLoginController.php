<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\Resource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class AdminLoginController extends Controller
{
    //
    public function index()
    {
        return Inertia::render('Admin/AdminLogin');
    }

    public function adminLogin(Request $request)
    {
        $validateData = $request->validate([
            'username' => 'required|min:3',
            'password' => 'required|min:8'
        ]);

        if (!Auth::guard('admin')->attempt($validateData)) {
            return back()->withErrors([
                'username' => 'Username atau password salah.',
            ]);
        }

        $request->session()->regenerate();

        return redirect()->intended('/admin/dashboard');
    }

    public function adminLogout(Request $request)
    {
        Auth::guard('admin')->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return to_route('admin.login');
    }
}
