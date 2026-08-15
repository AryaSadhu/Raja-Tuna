import React, { useState } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { useForm, Head, router } from "@inertiajs/react";
import Swal from "sweetalert2";

export default function ManageBarang({ barangs }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [previewImage, setPreviewImage] = useState(null);

    const { data, setData, post, reset, processing, errors } = useForm({
        id: "",
        kode_barang: "",
        nama_barang: "",
        foto: null,
        stok: "",
        stok_input: "",
        harga: "",
        deskripsi: "",
        _method: "POST", // Penting untuk spoofing method PUT saat ada file
    });

    const toast = (message, icon = "success") => {
        Swal.fire({
            title: message,
            icon: icon,
            timer: 2000,
            showConfirmButton: false,
            toast: true,
            position: 'top-end',
            customClass: {
                container: '!z-[99999]'  // ✅ Override z-index with Tailwind
            }
        });
    };

    const openModal = (barang = null) => {
        if (barang) {
            setEditMode(true);
            setPreviewImage(barang.foto ? `/uploads/barang/${barang.foto}` : null);
            setData({
                id: barang.id,
                kode_barang: barang.kode_barang,
                nama_barang: barang.nama_barang,
                foto: null, 
                stok: barang.stok,
                stok_input: "",
                harga: barang.harga,
                deskripsi: barang.deskripsi ?? "",
                _method: "PUT", // Spoofing PUT agar Laravel mengenali update
            });
        } else {
            setEditMode(false);
            setPreviewImage(null);
            reset();
            setData("_method", "POST");
        }
        setIsModalOpen(true);
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setData("foto", file);
        if (file) {
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    const handleDelete = (id) => {
        Swal.fire({
            title: "Apakah anda yakin?",
            text: "Data yang dihapus tidak dapat dikembalikan!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Ya, Hapus!",
            cancelButtonText: "Batal",
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(route("admin.barang.destroy", id), {
                    onSuccess: () => {
                        Swal.fire({
                            title: "Terhapus!",
                            text: "Barang berhasil dihapus.",
                            icon: "success",
                            timer: 1500,
                            showConfirmButton: false,
                        });
                    },
                });
            }
        });
    };

    const submit = (e) => {
        e.preventDefault();

        // VALIDASI FOTO: Menggunakan toast agar muncul di atas (pojok kanan)
        if (!editMode && !data.foto) {
            toast("Peringatan: Foto barang wajib diunggah!", "error");
            return; 
        }

        // VALIDASI PENGURANGAN STOK (Hanya saat Edit)
        if (editMode && data.stok_input.toString().includes('-')) {
            // Ambil angka saja dari input (contoh: "-90" jadi 90)
            const jumlahKurangi = Math.abs(parseInt(data.stok_input.replace(/[^0-9-]/g, '')));
            const stokSaatIni = parseInt(data.stok);

            if (jumlahKurangi > stokSaatIni) {
                toast(`Gagal! Pengurangan (${jumlahKurangi}) melebihi stok yang ada (${stokSaatIni})`, "error");
                return; // Batalkan kirim data
            }
        }

        if (editMode) {
            post(route("admin.barang.update", data.id), {
                forceFormData: true,
                onBefore: () => { data._method = 'PUT' }, 
                onSuccess: () => {
                    setIsModalOpen(false);
                    reset();
                    toast("Data barang berhasil diperbarui!");
                },
            });
        } else {
            post(route("admin.barang.store"), {
                forceFormData: true,
                onSuccess: () => {
                    setIsModalOpen(false);
                    reset();
                    toast("Barang baru berhasil ditambahkan!");
                },
            });
        }
    };

    return (
        <AdminLayout>
            <Head title="Manage Barang" />

            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Daftar Barang</h2>
                <button
                    onClick={() => openModal()}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-bold shadow-md transition"
                >
                    + Tambah Barang
                </button>
            </div>

            {/* Table Area */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="p-4 font-semibold text-gray-600">Foto</th>
                            <th className="p-4 font-semibold text-gray-600">Kode</th>
                            <th className="p-4 font-semibold text-gray-600">Nama Barang</th>
                            <th className="p-4 font-semibold text-gray-600">Harga</th>
                            <th className="p-4 font-semibold text-gray-600">Stok</th>
                            <th className="p-4 font-semibold text-gray-600 text-center">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {barangs.length > 0 ? (
                            barangs.map((item) => (
                                <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                                    <td className="p-4">
                                        <img 
                                            src={
                                                item.foto === 'logo1.png' 
                                                ? '/images/logo1.png' 
                                                : item.foto 
                                                ? `/uploads/barang/${item.foto}` 
                                                : '/images/logo1.png'
                                            } 
                                            alt={item.nama_barang} 
                                            className="w-12 h-12 object-cover rounded-lg border border-gray-200 shadow-sm"
                                            onError={(e) => { e.target.src = "/images/logo1.png"; }}
                                        />
                                    </td>
                                    <td className="p-4 font-mono text-sm text-blue-600 font-bold">
                                        {item.kode_barang}
                                    </td>
                                    <td className="p-4 font-medium text-gray-800">
                                        {item.nama_barang}
                                    </td>
                                    <td className="p-4 text-gray-700 font-semibold">
                                        Rp {parseFloat(item.harga).toLocaleString('id-ID')}
                                    </td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded text-[10px] font-black uppercase shadow-sm ${
                                            item.stok > 5 
                                            ? 'bg-green-100 text-green-700 border border-green-200' 
                                            : 'bg-red-100 text-red-700 border border-red-200'
                                        }`}>
                                            {item.stok} unit
                                        </span>
                                    </td>
                                    <td className="p-4 text-center space-x-3">
                                        <button 
                                            onClick={() => openModal(item)} 
                                            className="text-amber-600 hover:text-amber-700 font-bold transition text-sm uppercase tracking-wider"
                                        >
                                            Edit
                                        </button>
                                        <button 
                                            onClick={() => handleDelete(item.id)} 
                                            className="text-red-600 hover:text-red-700 font-bold transition text-sm uppercase tracking-wider"
                                        >
                                            Hapus
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="p-10 text-center text-gray-400 italic bg-gray-50/50">
                                    Belum ada data barang tersedia.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* MODAL TAMBAH/EDIT */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                            <h3 className="text-xl font-bold text-gray-800">
                                {editMode ? "Edit Barang" : "Tambah Barang Baru"}
                            </h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
                        </div>

                        <form onSubmit={submit} className="p-6 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Bagian Foto */}
                                <div className="space-y-2">
                                    <label className="block text-sm font-bold text-gray-700">Foto Barang</label>
                                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition h-48 relative overflow-hidden">
                                        {previewImage ? (
                                            <img src={previewImage} alt="Preview" className="h-full w-full object-contain" />
                                        ) : (
                                            <div className="text-center text-gray-400">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                                <span className="text-xs">Klik untuk upload foto</span>
                                            </div>
                                        )}
                                        <input 
                                            type="file" 
                                            onChange={handleFileChange} 
                                            className="absolute inset-0 opacity-0 cursor-pointer"
                                            accept="image/*"
                                        />
                                    </div>
                                    {errors.foto && <p className="text-red-500 text-xs mt-1">{errors.foto}</p>}
                                </div>

                                {/* Bagian Input Teks */}
                                <div className="space-y-4">
                                    {!editMode && (
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700">Kode Barang</label>
                                            <input type="text" value={data.kode_barang} onChange={e => setData('kode_barang', e.target.value)} className="w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 text-sm" placeholder="BRG-001" required />
                                            {errors.kode_barang && <p className="text-red-500 text-xs mt-1">{errors.kode_barang}</p>}
                                        </div>
                                    )}

                                    <div>
                                        <label className="block text-sm font-bold text-gray-700">Nama Barang</label>
                                        <input type="text" value={data.nama_barang} onChange={e => setData('nama_barang', e.target.value)} className="w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 text-sm" required />
                                        {errors.nama_barang && <p className="text-red-500 text-xs mt-1">{errors.nama_barang}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-gray-700">Harga (Rp)</label>
                                        <input type="number" value={data.harga} onChange={e => setData('harga', e.target.value)} className="w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 text-sm" required />
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700">
                                        {editMode ? "Update Stok (+/- otomatis)" : "Stok Awal"}
                                    </label>
                                    <input type="text" placeholder={editMode ? `Stok saat ini: ${data.stok}` : "0"} value={editMode ? data.stok_input : data.stok} onChange={e => setData(editMode ? 'stok_input' : 'stok', e.target.value)} className="w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 text-sm" required={!editMode} />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700">Deskripsi</label>
                                    <textarea rows="2" value={data.deskripsi} onChange={e => setData('deskripsi', e.target.value)} className="w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 text-sm" placeholder="Penjelasan singkat..."></textarea>
                                </div>
                            </div>

                            <div className="pt-4 flex gap-3">
                                <button type="submit" disabled={processing} className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition disabled:bg-blue-300">
                                    {processing ? "Memproses..." : "Simpan Data"}
                                </button>
                                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 bg-gray-100 text-gray-600 py-3 rounded-lg font-bold hover:bg-gray-200 transition">
                                    Batal
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}