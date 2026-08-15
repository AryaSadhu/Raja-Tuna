<?php

namespace App\Http\Controllers;

use App\Models\DataBarangModel;
use Inertia\Inertia;

class DaftarBarangCustomerController extends Controller
{
    /**
     * Menampilkan daftar produk untuk sisi customer.
     */
    public function index()
    {
        $products = DataBarangModel::latest()->get();

        return Inertia::render('ProductList', [
            'products' => $products
        ]);
    }
}