<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\DataBarangModel;
use Inertia\Inertia;
use Illuminate\Support\Facades\File; // Tambahkan ini untuk hapus file

class DataBarangController extends Controller
{
    public function index()
    {
        $barangs = DataBarangModel::latest()->get();
        return Inertia::render('Admin/AdminManageBarang', [
            'barangs' => $barangs
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'kode_barang' => 'required|unique:data_barang,kode_barang',
            'nama_barang' => 'required|string|max:255',
            'foto'        => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
            'stok'        => 'required', // Biarkan divalidasi manual di bawah
            'harga'       => 'required|numeric|min:0',
            'deskripsi'   => 'nullable|string',
        ]);

        $data = $request->all();
        // Paksa stok menjadi integer untuk menghilangkan nol di depan (009 -> 9)
        // Dan memastikan nilai minimal adalah 0 saat simpan baru
        $data['stok'] = max(0, (int) $request->stok);

        if ($request->hasFile('foto')) {
            $file = $request->file('foto');
            $nama_foto = time() . '_' . $file->getClientOriginalName();
            $file->move(public_path('uploads/barang'), $nama_foto);
            $data['foto'] = $nama_foto;
        }        
        else {
            $data['foto'] = null;
        }

        DataBarangModel::create($data);
        return redirect()->back();
    }

    public function update(Request $request, $id)
    {
        $barang = DataBarangModel::findOrFail($id);

        $request->validate([
            'nama_barang' => 'required|string|max:255',
            'harga'       => 'required|numeric|min:0',
            'foto'        => 'nullable|image|max:2048',
        ]);

        if ($request->hasFile('foto')) {
            if ($barang->foto && file_exists(public_path('uploads/barang/' . $barang->foto))) {
                unlink(public_path('uploads/barang/' . $barang->foto));
            }
            $file = $request->file('foto');
            $nama_foto = time() . '_' . $file->getClientOriginalName();
            $file->move(public_path('uploads/barang'), $nama_foto);
            $barang->foto = $nama_foto;
        }

        if ($request->filled('stok_input')) {
            $input = (string) $request->stok_input; // Pastikan string
            
            if (str_contains($input, '+')) {
                $angka = (int) filter_var($input, FILTER_SANITIZE_NUMBER_INT);
                $barang->stok += $angka;
            } elseif (str_contains($input, '-')) {
                $angka = (int) abs(filter_var($input, FILTER_SANITIZE_NUMBER_INT));
                $barang->stok -= $angka;
            } else {
                // Manual replace: (int) akan mengubah "009" menjadi 9
                $barang->stok = (int) $input;
            }

            // PROTEKSI STOK: Pastikan stok tidak pernah negatif setelah operasi di atas
            if ($barang->stok < 0) {
                $barang->stok = 0;
            }
        }

        $barang->nama_barang = $request->nama_barang;
        $barang->harga = $request->harga;
        $barang->deskripsi = $request->deskripsi;
        $barang->save();

        return redirect()->back();
    }

    public function destroy($id)
    {
        $barang = DataBarangModel::findOrFail($id);
        if ($barang->foto && File::exists(public_path('uploads/barang/' . $barang->foto))) {
            File::delete(public_path('uploads/barang/' . $barang->foto));
        }
        $barang->delete();
        return redirect()->back();
    }
}