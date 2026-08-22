<?php

namespace App\Http\Controllers;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class PelangganProfileController extends Controller
{
    /**
     * Tampilkan halaman edit profile pelanggan yang sedang login.
     */
    public function edit(Request $request): Response
    {
        return Inertia::render('Profile/PelangganEdit', [
            'pelanggan' => $request->user('pelanggan'),
        ]);
    }

    /**
     * Update data profile (termasuk alamat) pelanggan yang sedang login.
     */
    public function update(Request $request): RedirectResponse
    {
        $pelanggan = $request->user('pelanggan');

        $validated = $request->validate([
            'nama_lengkap'   => ['required', 'string', 'max:255'],
            'email'          => [
                'required', 'string', 'email', 'max:255',
                Rule::unique('pelanggans', 'email')->ignore($pelanggan->id),
            ],
            'nomor_whatsapp' => ['required', 'string', 'max:20'],
            'alamat_lengkap' => ['required', 'string'],
        ]);

        $pelanggan->fill($validated);
        $pelanggan->save();

        return redirect()->route('pelanggan.profile.edit')
            ->with('success', 'Profil berhasil diperbarui.');
    }

    /**
     * Update password pelanggan yang sedang login.
     */
    public function updatePassword(Request $request): RedirectResponse
    {
        $pelanggan = $request->user('pelanggan');

        $validated = $request->validate([
            'current_password' => ['required', 'string'],
            'password'         => ['required', 'string', 'confirmed', 'min:8'],
        ]);

        if (! Hash::check($validated['current_password'], $pelanggan->password)) {
            return back()->withErrors([
                'current_password' => 'Password lama tidak sesuai.',
            ]);
        }

        $pelanggan->update([
            'password' => Hash::make($validated['password']),
        ]);

        return redirect()->route('pelanggan.profile.edit')
            ->with('success', 'Password berhasil diperbarui.');
    }
}
