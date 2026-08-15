import React from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, router } from "@inertiajs/react";
import axios from "axios";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import {
    LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts";

const STATUS_COLOR = {
    'belum dibayar': '#9ca3af',
    'sudah bayar':   '#3b82f6',
    'di kemas':      '#f59e0b',
    'di kirim':      '#a855f7',
    'sampai':        '#22c55e',
    'di tolak':      '#ef4444',
};

const PIE_COLORS = ['#3b82f6','#22c55e','#f59e0b','#a855f7','#ef4444','#06b6d4'];

const formatRupiah = (val) => `Rp ${Number(val).toLocaleString('id-ID')}`;

const CustomTooltipRupiah = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
        <div className="bg-white border border-gray-100 rounded-2xl shadow-lg px-4 py-3 text-xs">
            <p className="font-black text-gray-500 uppercase tracking-widest mb-1">{label}</p>
            {payload.map((p, i) => (
                <p key={i} style={{ color: p.color }} className="font-bold">
                    {p.name}: {formatRupiah(p.value)}
                </p>
            ))}
        </div>
    );
};

export default function AdminDashboard({
    auth, expired_coupons, active_coupons, all_coupons, admin,
    penjualan_harian = [],
    penjualan_provinsi = [],
    produk_terlaris = [],
    status_pesanan = [],
    total_penjualan_bulan_ini = 0,
    total_order_bulan_ini = 0,
}) {
    const handleCheckCoupon = (event) => {
        event.preventDefault();
        const couponCode = event.target.elements.couponCode.value;
        if (!couponCode || couponCode.trim() === "") {
            Swal.fire({ title: "Input Kosong", text: "Harap masukkan kode kupon terlebih dahulu.", icon: "warning", confirmButtonColor: "#3085d6" });
            event.target.reset();
            return;
        }
        axios.get(route("admin.coupon.check", { coupon: couponCode }))
            .then((res) => {
                if (res.data.code === 200 && res.data.data && res.data.data[0]) {
                    Swal.fire({ title: "Kupon Ditemukan!", html: `Kupon <b>${couponCode}</b> adalah milik:<br/><b>${res.data.data[0].full_name}</b>`, icon: "success", confirmButtonColor: "#3085d6" });
                } else {
                    Swal.fire({ title: "Error!", text: res.data.message || "Kupon tidak ditemukan.", icon: "error", confirmButtonColor: "#3085d6" });
                }
            })
            .catch((err) => {
                Swal.fire({ title: "Error!", text: err.response?.data?.message || "Gagal terhubung ke server.", icon: "error", confirmButtonColor: "#3085d6" });
            });
        event.target.reset();
    };

    // Nama bulan sekarang
    const namaBulan = new Date().toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });

    return (
        <AdminLayout admin={admin} user={auth.user}>
            <Head title="Admin Dashboard" />

            {/* ── HEADER LAMA (tidak diubah) ── */}
            <h2 className="mt-0 text-2xl font-semibold text-gray-800">Selamat Datang Admin</h2>
            <p className="text-gray-600">Ringkasan Kupon</p>

            {/* ── CARD KUPON LAMA (tidak diubah) ── */}
            <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
                <div className="rounded-lg bg-white p-6 shadow-md transition-shadow hover:shadow-lg">
                    <h3 className="text-sm font-medium uppercase tracking-wider text-gray-500">Jumlah Kupon yang Sudah Digunakan</h3>
                    <span className="mt-2 block text-3xl font-bold text-gray-900">{expired_coupons}</span>
                </div>
                <div className="rounded-lg bg-white p-6 shadow-md transition-shadow hover:shadow-lg">
                    <h3 className="text-sm font-medium uppercase tracking-wider text-gray-500">Jumlah Kupon yang Belum Digunakan</h3>
                    <span className="mt-2 block text-3xl font-bold text-gray-900">{active_coupons}</span>
                </div>
                <div className="rounded-lg bg-white p-6 shadow-md transition-shadow hover:shadow-lg">
                    <h3 className="text-sm font-medium uppercase tracking-wider text-gray-500">Jumlah Kupon yang Akan di Undi</h3>
                    <span className="mt-2 block text-3xl font-bold text-gray-900">{all_coupons}</span>
                </div>
            </div>

            {/* ══════════════════════════════════════
                SECTION LAPORAN PENJUALAN
            ══════════════════════════════════════ */}
            <div className="mt-10">
                <h2 className="text-2xl font-semibold text-gray-800">Laporan Penjualan</h2>
                <p className="text-gray-500 text-sm mt-1">Data penjualan real-time dari semua transaksi</p>
            </div>

            {/* ── CARD RINGKASAN PENJUALAN ── */}
            <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 p-6 shadow-lg shadow-blue-200 text-white">
                    <p className="text-blue-200 text-xs font-black uppercase tracking-widest">Total Penjualan {namaBulan}</p>
                    <p className="mt-2 text-3xl font-black">
                        {formatRupiah(total_penjualan_bulan_ini)}
                    </p>
                </div>
                <div className="rounded-xl bg-gradient-to-br from-green-500 to-green-600 p-6 shadow-lg shadow-green-200 text-white">
                    <p className="text-green-100 text-xs font-black uppercase tracking-widest">Total Pelanggan Unik {namaBulan}</p>
                    <p className="mt-2 text-3xl font-black">{total_order_bulan_ini} pembeli</p>
                </div>
            </div>

            {/* ── GRAFIK PENJUALAN HARIAN ── */}
            <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-sm font-black text-gray-700 uppercase tracking-wider mb-1">
                    Grafik Penjualan Harian
                </h3>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-6">{namaBulan}</p>

                {penjualan_harian.length > 0 ? (
                    <ResponsiveContainer width="100%" height={260}>
                        <LineChart data={penjualan_harian} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                            <XAxis dataKey="tanggal" tick={{ fontSize: 11, fontWeight: 700, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                            <YAxis tickFormatter={(v) => `${(v/1000).toFixed(0)}k`} tick={{ fontSize: 11, fontWeight: 700, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                            <Tooltip content={<CustomTooltipRupiah />} />
                            <Line
                                type="monotone"
                                dataKey="total"
                                name="Penjualan"
                                stroke="#3b82f6"
                                strokeWidth={3}
                                dot={{ fill: '#3b82f6', r: 4, strokeWidth: 0 }}
                                activeDot={{ r: 6, fill: '#2563eb' }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="h-[260px] flex items-center justify-center text-gray-300">
                        <p className="text-xs font-black uppercase tracking-widest">Belum ada data bulan ini</p>
                    </div>
                )}
            </div>

            {/* ── BARIS 2: PROVINSI + STATUS ── */}
            <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Pembeli Terbanyak per Provinsi */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h3 className="text-sm font-black text-gray-700 uppercase tracking-wider mb-1">Daerah Pembeli Terbanyak</h3>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-6">Top 8 Provinsi</p>

                    {penjualan_provinsi.length > 0 ? (
                        <ResponsiveContainer width="100%" height={280}>
                            <BarChart data={penjualan_provinsi} layout="vertical" margin={{ top: 0, right: 20, left: 10, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" horizontal={false} />
                                <XAxis type="number" tick={{ fontSize: 10, fontWeight: 700, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                                <YAxis
                                    type="category"
                                    dataKey="provinsi"
                                    width={130}
                                    tick={{ fontSize: 10, fontWeight: 700, fill: '#6b7280' }}
                                    axisLine={false}
                                    tickLine={false}
                                    tickFormatter={(v) => v.length > 18 ? v.substring(0, 16) + '…' : v}
                                />
                                <Tooltip
                                    content={({ active, payload }) => {
                                        if (!active || !payload?.length) return null;
                                        const d = payload[0]?.payload;
                                        return (
                                            <div className="bg-white border border-gray-100 rounded-2xl shadow-lg px-4 py-3 text-xs">
                                                <p className="font-black text-gray-600 mb-1">{d.provinsi}</p>
                                                <p className="text-blue-600 font-bold">{d.jumlah_pesanan} pesanan</p>
                                                <p className="text-gray-500 font-bold">{formatRupiah(d.total_penjualan)}</p>
                                            </div>
                                        );
                                    }}
                                />
                                <Bar dataKey="jumlah_pesanan" name="Pesanan" fill="#3b82f6" radius={[0, 6, 6, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="h-[280px] flex items-center justify-center text-gray-300">
                            <p className="text-xs font-black uppercase tracking-widest">Belum ada data</p>
                        </div>
                    )}
                </div>

                {/* Status Pesanan Pie */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h3 className="text-sm font-black text-gray-700 uppercase tracking-wider mb-1">Status Pesanan</h3>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-6">Semua waktu</p>

                    {status_pesanan.length > 0 ? (
                        <>
                            <ResponsiveContainer width="100%" height={200}>
                                <PieChart>
                                    <Pie
                                        data={status_pesanan}
                                        dataKey="jumlah"
                                        nameKey="status"
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={55}
                                        outerRadius={85}
                                        paddingAngle={3}
                                    >
                                        {status_pesanan.map((entry, index) => (
                                            <Cell
                                                key={index}
                                                fill={STATUS_COLOR[entry.status] ?? PIE_COLORS[index % PIE_COLORS.length]}
                                            />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        content={({ active, payload }) => {
                                            if (!active || !payload?.length) return null;
                                            return (
                                                <div className="bg-white border border-gray-100 rounded-2xl shadow-lg px-4 py-3 text-xs">
                                                    <p className="font-black text-gray-600 capitalize">{payload[0].name}</p>
                                                    <p className="font-bold text-gray-800">{payload[0].value} pesanan</p>
                                                </div>
                                            );
                                        }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                            {/* Legend manual */}
                            <div className="grid grid-cols-2 gap-2 mt-4">
                                {status_pesanan.map((entry, index) => (
                                    <div key={index} className="flex items-center gap-2">
                                        <div
                                            className="w-2.5 h-2.5 rounded-full shrink-0"
                                            style={{ backgroundColor: STATUS_COLOR[entry.status] ?? PIE_COLORS[index % PIE_COLORS.length] }}
                                        />
                                        <span className="text-[10px] font-black text-gray-500 uppercase capitalize truncate">{entry.status}</span>
                                        <span className="text-[10px] font-black text-gray-800 ml-auto">{entry.jumlah}</span>
                                    </div>
                                ))}
                            </div>
                        </>
                    ) : (
                        <div className="h-[280px] flex items-center justify-center text-gray-300">
                            <p className="text-xs font-black uppercase tracking-widest">Belum ada data</p>
                        </div>
                    )}
                </div>
            </div>

            {/* ── PRODUK TERLARIS ── */}
            <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-sm font-black text-gray-700 uppercase tracking-wider mb-1">Produk Terlaris</h3>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-6">Top 5 berdasarkan qty terjual</p>

                {produk_terlaris.length > 0 ? (
                    <ResponsiveContainer width="100%" height={220}>
                        <BarChart data={produk_terlaris} margin={{ top: 5, right: 20, left: 10, bottom: 30 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                            <XAxis
                                dataKey="nama"
                                tick={{ fontSize: 10, fontWeight: 700, fill: '#6b7280' }}
                                axisLine={false}
                                tickLine={false}
                                angle={-20}
                                textAnchor="end"
                                interval={0}
                                tickFormatter={(v) => v.length > 15 ? v.substring(0, 13) + '…' : v}
                            />
                            <YAxis tick={{ fontSize: 10, fontWeight: 700, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                            <Tooltip
                                content={({ active, payload }) => {
                                    if (!active || !payload?.length) return null;
                                    const d = payload[0]?.payload;
                                    return (
                                        <div className="bg-white border border-gray-100 rounded-2xl shadow-lg px-4 py-3 text-xs">
                                            <p className="font-black text-gray-700 mb-1">{d.nama}</p>
                                            <p className="text-green-600 font-bold">{d.total_qty} pcs terjual</p>
                                            <p className="text-gray-500 font-bold">{formatRupiah(d.total_penjualan)}</p>
                                        </div>
                                    );
                                }}
                            />
                            <Bar dataKey="total_qty" name="Qty Terjual" radius={[6, 6, 0, 0]}>
                                {produk_terlaris.map((_, index) => (
                                    <Cell key={index} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="h-[220px] flex items-center justify-center text-gray-300">
                        <p className="text-xs font-black uppercase tracking-widest">Belum ada data</p>
                    </div>
                )}
            </div>

        </AdminLayout>
    );
}