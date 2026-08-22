import AuthenticatedLayout from '@/Layouts/AuthenticatedLayoutOld';
import { Head, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import axios from 'axios';

// ✅ API Komerce pakai field 'id' dan 'name' langsung
const normalizeProvince = (p) => ({
    id:   String(p.id   ?? ''),
    name: p.name ?? '(Tidak Diketahui)',
});

const normalizeCity = (c) => ({
    id:   String(c.id   ?? ''),
    name: c.name ?? '(Tidak Diketahui)',
});

const normalizeDistrict = (d) => ({
    id:   String(d.id   ?? ''),
    name: d.name ?? '(Tidak Diketahui)',
});

export default function BuyerInfoPage({ auth, cart }) {
    const parsedCart = (() => {
        let rawData = [];
        if (Array.isArray(cart)) rawData = cart;
        else if (typeof cart === 'string') {
            try { rawData = JSON.parse(cart); } catch { rawData = []; }
        }
        return Array.isArray(rawData) ? rawData.filter(item => item && typeof item === 'object') : [];
    })();

    const subtotal = parsedCart.reduce((sum, item) => sum + (Number(item.harga || 0) * Number(item.qty || 0)), 0);

    const [processing, setProcessing]           = useState(false);
    const [provinces, setProvinces]             = useState([]);
    const [cities, setCities]                   = useState([]);
    const [districts, setDistricts]             = useState([]);
    const [courierOptions, setCourierOptions]   = useState([]);
    const [shippingCost, setShippingCost]       = useState(0);
    const [loadingOngkir, setLoadingOngkir]     = useState(false);
    const [loadingProvinsi, setLoadingProvinsi] = useState(true);

    const [namaWilayah, setNamaWilayah] = useState({
        provinsi:  '',
        kabupaten: '',
        kecamatan: '',
    });

    // ✅ Data pelanggan yang sedang login (guard 'pelanggan'), kalau ada
    const pelanggan = auth?.pelanggan ?? null;

    // ✅ Perbaikan: gunakan optional chaining + fallback string kosong
    // ✅ TAMBAHAN: kalau pelanggan sedang login, prioritaskan data dari akunnya
    //    (nama, email, whatsapp, alamat) supaya otomatis terisi.
    //    Kalau tidak login sebagai pelanggan, perilaku lama tetap dipakai
    //    (isi dari auth.user kalau ada, atau kosong).
    const [formData, setFormData] = useState({
        nama_lengkap:   pelanggan?.nama_lengkap  ?? auth?.user?.name  ?? '',
        email:          pelanggan?.email         ?? auth?.user?.email ?? '',
        nomor_whatsapp: pelanggan?.nomor_whatsapp ?? '',
        provinsi_id:    '',
        kabupaten_id:   '',
        kecamatan_id:   '',
        kurir:          '',
        alamat_lengkap: pelanggan?.alamat_lengkap ?? '',
        catatan:        '',
    });

    const totalPrice = subtotal + shippingCost;

    // --- FETCH PROVINSI ---
    useEffect(() => {
        setLoadingProvinsi(true);
        axios.get('/api/provinces')
            .then(res => {
                const raw = Array.isArray(res.data) ? res.data : [];
                const normalized = raw.map(normalizeProvince).filter(p => p.id !== '');
                setProvinces(normalized);
            })
            .catch(err => {
                console.error('Gagal fetch provinsi:', err);
                Swal.fire('Error', 'Gagal memuat data provinsi. Refresh halaman.', 'error');
            })
            .finally(() => setLoadingProvinsi(false));
    }, []);

    const handleProvinsiChange = (id) => {
        const selected = provinces.find(p => p.id === String(id));
        setNamaWilayah({ provinsi: selected?.name ?? '', kabupaten: '', kecamatan: '' });
        setFormData(prev => ({ ...prev, provinsi_id: id, kabupaten_id: '', kecamatan_id: '', kurir: '' }));
        setCities([]); setDistricts([]); setCourierOptions([]); setShippingCost(0);
        if (id) {
            axios.get(`/api/cities/${id}`)
                .then(res => {
                    const raw = Array.isArray(res.data) ? res.data : [];
                    setCities(raw.map(normalizeCity).filter(c => c.id !== ''));
                })
                .catch(err => console.error('Gagal fetch kota:', err));
        }
    };

    const handleCityChange = (id) => {
        const selected = cities.find(c => c.id === String(id));
        setNamaWilayah(prev => ({ ...prev, kabupaten: selected?.name ?? '', kecamatan: '' }));
        setFormData(prev => ({ ...prev, kabupaten_id: id, kecamatan_id: '', kurir: '' }));
        setDistricts([]); setCourierOptions([]); setShippingCost(0);
        if (id) {
            axios.get(`/api/districts/${id}`)
                .then(res => {
                    const raw = Array.isArray(res.data) ? res.data : [];
                    setDistricts(raw.map(normalizeDistrict).filter(d => d.id !== ''));
                })
                .catch(err => console.error('Gagal fetch kecamatan:', err));
        }
    };

    const handleDistrictChange = (id) => {
        const selected = districts.find(d => d.id === String(id));
        setNamaWilayah(prev => ({ ...prev, kecamatan: selected?.name ?? '' }));
        setFormData(prev => ({ ...prev, kecamatan_id: id, kurir: '' }));
        setCourierOptions([]); setShippingCost(0);
        if (id) {
            setLoadingOngkir(true);
            axios.post('/api/check-cost', { destination: id })
                .then(res => {
                    console.log('RAW COURIER RESPONSE:', JSON.stringify(res.data, null, 2));
                    const rawData = res.data?.data ?? res.data ?? [];
                    const validCouriers = [];

                    if (Array.isArray(rawData)) {
                        rawData.forEach((c) => {
                            if (c?.courier && Array.isArray(c?.costs) && c.costs.length > 0) {
                                c.costs.forEach((cost) => {
                                    if (cost?.service && cost?.cost !== undefined) {
                                        validCouriers.push({
                                            label: `${String(c.courier).toUpperCase()} - ${cost.service} (Rp ${Number(cost.cost).toLocaleString('id-ID')})`,
                                            value: `${String(c.courier).toUpperCase()} ${cost.service}|${cost.cost}`
                                        });
                                    }
                                });
                            } else if (c?.courier_name && c?.service) {
                                const price = c?.price ?? c?.cost ?? 0;
                                validCouriers.push({
                                    label: `${String(c.courier_name).toUpperCase()} - ${c.service} (Rp ${Number(price).toLocaleString('id-ID')})`,
                                    value: `${String(c.courier_name).toUpperCase()} ${c.service}|${price}`
                                });
                            } else if (c?.name && c?.cost !== undefined) {
                                const svc = c?.service ?? '';
                                validCouriers.push({
                                    label: `${String(c.name).toUpperCase()} ${svc} (Rp ${Number(c.cost).toLocaleString('id-ID')})`,
                                    value: `${String(c.name).toUpperCase()} ${svc}|${c.cost}`
                                });
                            } else {
                                console.warn('Format kurir tidak dikenal:', c);
                            }
                        });
                    }

                    setCourierOptions(validCouriers);
                })
                .catch(err => {
                    console.error('Gagal cek ongkir:', err);
                    Swal.fire('Error', 'Gagal mengambil data ongkir. Coba lagi.', 'error');
                })
                .finally(() => setLoadingOngkir(false));
        }
    };

    const handleCourierSelect = (e) => {
        const val = e.target.value;
        if (!val) {
            setFormData(prev => ({ ...prev, kurir: '' }));
            setShippingCost(0);
            return;
        }
        const lastPipe = val.lastIndexOf('|');
        const name     = val.substring(0, lastPipe);
        const price    = val.substring(lastPipe + 1);
        setFormData(prev => ({ ...prev, kurir: name }));
        setShippingCost(Number(price));
    };

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // ✅ Validasi manual sebelum kirim agar error jelas
        if (!formData.email) {
            return Swal.fire('Error', 'Email tidak boleh kosong. Cek data akun kamu.', 'error');
        }
        if (!formData.kurir) {
            return Swal.fire('Info', 'Pilih kurir dulu.', 'info');
        }

        setProcessing(true);
        router.post(route('laporan.store'), {
            nama_lengkap:   formData.nama_lengkap,
            email:          formData.email,
            nomor_whatsapp: formData.nomor_whatsapp,
            provinsi_id:    formData.provinsi_id,
            kabupaten_id:   formData.kabupaten_id,
            kecamatan_id:   formData.kecamatan_id,
            kurir:          formData.kurir,
            alamat_lengkap: formData.alamat_lengkap,
            catatan:        formData.catatan ?? '',
            provinsi_nama:  namaWilayah.provinsi,
            kabupaten_nama: namaWilayah.kabupaten,
            kecamatan_nama: namaWilayah.kecamatan,
            items:          parsedCart.map(item => ({ id: item.id, qty: Number(item.qty) || 1 })),
            total_ongkir:   shippingCost,
            total_bayar:    totalPrice,
        }, {
            onFinish: () => setProcessing(false),
            onError: (errors) => {
                console.error('Validation errors:', errors);
                const pesanError = Object.values(errors).join('\n');
                Swal.fire('Gagal', pesanError || 'Terjadi kesalahan.', 'error');
            }
        });
    };

    return (
        <AuthenticatedLayout auth={auth}>
            <Head title="Informasi Pengiriman" />
            <div className="py-12 bg-gray-50/50 min-h-screen font-sans">
                <div className="max-w-5xl mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                        {/* FORM KIRI */}
                        <div className="lg:col-span-2 space-y-6">
                            <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 p-8 sm:p-10">
                                <h2 className="text-2xl font-black text-gray-800 uppercase mb-2 italic">Data Pengiriman</h2>
                                <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] mb-8 border-b pb-4">Isi alamat lengkap untuk cek ongkir</p>

                                <form onSubmit={handleSubmit} className="space-y-6">

                                    {/* NAMA & WHATSAPP */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <input
                                            type="text"
                                            name="nama_lengkap"
                                            value={formData.nama_lengkap}
                                            onChange={handleChange}
                                            className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 font-bold text-gray-700"
                                            placeholder="Nama Lengkap"
                                            required
                                        />
                                        <input
                                            type="text"
                                            name="nomor_whatsapp"
                                            value={formData.nomor_whatsapp}
                                            onChange={handleChange}
                                            className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 font-bold text-gray-700"
                                            placeholder="WhatsApp (08xx)"
                                            required
                                        />
                                    </div>

                                    {/* ✅ EMAIL — tampilkan sebagai input agar user bisa isi/edit jika kosong */}
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 font-bold text-gray-700"
                                        placeholder="Alamat Email"
                                        required
                                    />

                                    {/* PROVINSI - KOTA - KECAMATAN */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <select
                                            value={formData.provinsi_id}
                                            onChange={(e) => handleProvinsiChange(e.target.value)}
                                            className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 font-bold text-gray-700 text-sm"
                                            required
                                        >
                                            <option value="">
                                                {loadingProvinsi ? 'Memuat Provinsi...' : 'Pilih Provinsi'}
                                            </option>
                                            {provinces.map((p) => (
                                                <option key={`prov-${p.id}`} value={p.id}>{p.name}</option>
                                            ))}
                                        </select>

                                        <select
                                            value={formData.kabupaten_id}
                                            onChange={(e) => handleCityChange(e.target.value)}
                                            className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 font-bold text-gray-700 text-sm"
                                            disabled={!cities.length}
                                            required
                                        >
                                            <option value="">Pilih Kota</option>
                                            {cities.map((c) => (
                                                <option key={`city-${c.id}`} value={c.id}>{c.name}</option>
                                            ))}
                                        </select>

                                        <select
                                            value={formData.kecamatan_id}
                                            onChange={(e) => handleDistrictChange(e.target.value)}
                                            className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 font-bold text-gray-700 text-sm"
                                            disabled={!districts.length}
                                            required
                                        >
                                            <option value="">Pilih Kecamatan</option>
                                            {districts.map((d) => (
                                                <option key={`dist-${d.id}`} value={d.id}>{d.name}</option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* KURIR */}
                                    <div>
                                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
                                            Pilih Layanan Kurir
                                        </label>
                                        <select
                                            onChange={handleCourierSelect}
                                            className="w-full bg-blue-50 border-2 border-blue-100 rounded-2xl py-4 px-6 font-black text-blue-700 text-sm"
                                            disabled={!courierOptions.length || loadingOngkir}
                                            required
                                        >
                                            <option value="">
                                                {loadingOngkir
                                                    ? 'Sedang Menghitung Ongkir...'
                                                    : !courierOptions.length
                                                        ? 'Pilih kecamatan terlebih dahulu'
                                                        : '--- Pilih Kurir ---'}
                                            </option>
                                            {courierOptions.map((c, idx) => (
                                                <option key={`courier-${idx}`} value={c.value}>
                                                    {c.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* ALAMAT */}
                                    <textarea
                                        rows="3"
                                        name="alamat_lengkap"
                                        value={formData.alamat_lengkap}
                                        onChange={handleChange}
                                        className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 font-bold text-gray-700"
                                        placeholder="Alamat Lengkap (Blok/No Rumah)"
                                        required
                                    />

                                    {/* CATATAN */}
                                    <input
                                        type="text"
                                        name="catatan"
                                        value={formData.catatan}
                                        onChange={handleChange}
                                        className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 font-bold text-gray-700"
                                        placeholder="Catatan (Opsional)"
                                    />

                                    {/* TOMBOL SUBMIT */}
                                    <button
                                        type="submit"
                                        disabled={processing || loadingOngkir || !formData.kurir}
                                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-5 rounded-[1.5rem] font-black uppercase tracking-widest shadow-xl shadow-blue-200 disabled:bg-gray-300 disabled:shadow-none transition-all"
                                    >
                                        {processing ? 'Memproses...' : 'Konfirmasi Pesanan'}
                                    </button>
                                </form>
                            </div>
                        </div>

                        {/* RINGKASAN KANAN */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 p-8 sticky top-24">
                                <h3 className="text-lg font-black text-gray-800 uppercase mb-6 italic border-b pb-4">Ringkasan</h3>

                                <div className="space-y-4 mb-6">
                                    {parsedCart.map((item) => (
                                        <div key={`item-${item.id}`} className="flex justify-between items-center text-sm">
                                            <div className="flex flex-col">
                                                <span className="font-bold text-gray-700">{item.nama_barang}</span>
                                                <span className="text-[10px] text-gray-400 font-bold uppercase">
                                                    {item.qty} x Rp {Number(item.harga).toLocaleString('id-ID')}
                                                </span>
                                            </div>
                                            <span className="font-black text-gray-900">
                                                Rp {(item.harga * item.qty).toLocaleString('id-ID')}
                                            </span>
                                        </div>
                                    ))}
                                </div>

                                <div className="space-y-3 pt-4 border-t border-gray-100">
                                    <div className="flex justify-between text-xs">
                                        <span className="text-gray-400 font-black uppercase">Subtotal</span>
                                        <span className="font-bold text-gray-700">Rp {subtotal.toLocaleString('id-ID')}</span>
                                    </div>
                                    <div className="flex justify-between text-xs">
                                        <span className="text-gray-400 font-black uppercase">Ongkir</span>
                                        <span className="font-black text-blue-600">
                                            {shippingCost > 0
                                                ? `Rp ${shippingCost.toLocaleString('id-ID')}`
                                                : <span className="text-gray-300 italic normal-case font-bold text-[10px]">Belum dipilih</span>
                                            }
                                        </span>
                                    </div>

                                    {namaWilayah.kecamatan && (
                                        <div className="pt-2 border-t border-gray-50 space-y-1">
                                            <div className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Tujuan</div>
                                            <div className="text-xs font-bold text-gray-600">
                                                {namaWilayah.kecamatan}, {namaWilayah.kabupaten}
                                            </div>
                                            <div className="text-xs font-bold text-gray-500">{namaWilayah.provinsi}</div>
                                        </div>
                                    )}
                                    {formData.kurir && (
                                        <div className="pt-1">
                                            <div className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Kurir</div>
                                            <div className="text-xs font-bold text-blue-600">{formData.kurir}</div>
                                        </div>
                                    )}
                                </div>

                                <div className="mt-6 bg-blue-50 rounded-2xl p-4 flex justify-between items-center">
                                    <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Total Bayar</span>
                                    <span className="text-lg font-black text-blue-700 italic">
                                        Rp {totalPrice.toLocaleString('id-ID')}
                                    </span>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
