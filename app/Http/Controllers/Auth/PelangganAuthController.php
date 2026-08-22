<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\Pelanggan;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class PelangganAuthController extends Controller
{
    /**
     * Tampilkan halaman Register.
     */
    public function showRegister(): Response
    {
        return Inertia::render('Auth/Pelanggan/Register');
    }

    /**
     * Proses Register pelanggan baru.
     */
    public function register(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'nama_lengkap'    => ['required', 'string', 'max:255'],
            'email'           => ['required', 'string', 'email', 'max:255', 'unique:pelanggans,email'],
            'nomor_whatsapp'  => ['required', 'string', 'max:20'],
            'alamat_lengkap'  => ['required', 'string'],
            'password'        => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        $pelanggan = Pelanggan::create([
            'nama_lengkap'   => $validated['nama_lengkap'],
            'email'          => $validated['email'],
            'nomor_whatsapp' => $validated['nomor_whatsapp'],
            'alamat_lengkap' => $validated['alamat_lengkap'],
            'password'       => Hash::make($validated['password']),
        ]);

        Auth::guard('pelanggan')->login($pelanggan);

        $request->session()->regenerate();

        return redirect()->route('home');
    }

    /**
     * Tampilkan halaman Login.
     */
    public function showLogin(): Response
    {
        return Inertia::render('Auth/Pelanggan/Login');
    }

    /**
     * Proses Login pelanggan.
     */
    public function login(Request $request): RedirectResponse
    {
        $credentials = $request->validate([
            'email'    => ['required', 'string', 'email'],
            'password' => ['required', 'string'],
        ]);

        if (! Auth::guard('pelanggan')->attempt($credentials, $request->boolean('remember'))) {
            return back()->withErrors([
                'email' => 'Email atau password yang Anda masukkan salah.',
            ])->onlyInput('email');
        }

        $request->session()->regenerate();

        return redirect()->intended(route('home'));
    }

    /**
     * Logout pelanggan.
     */
    public function logout(Request $request): RedirectResponse
    {
        Auth::guard('pelanggan')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('home');
    }
}
