import React, { useState } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head } from "@inertiajs/react";
import Swal from "sweetalert2";
import axios from "axios";

export default function SuperAdminMenu({ auth, admins }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [searchTerm, setSearchTerm] = useState("");

    // CREATE ADMIN
    const submitCreateAdmin = (e) => {
        e.preventDefault();

        Swal.fire({
            title: "Membuat admin...",
            allowOutsideClick: false,
            didOpen: () => Swal.showLoading(),
        });

        axios
            .post(route("admin.create-admin"), {
                username,
                password,
            })
            .then(() => {
                Swal.fire({
                    icon: "success",
                    title: "Admin berhasil dibuat!",
                }).then(() => window.location.reload());
            })
            .catch((error) => {
                const backend = error?.response?.data;

                Swal.fire({
                    icon: "error",
                    title: "Gagal membuat admin!",
                    text:
                        backend?.data?.username?.[0] ||
                        backend?.data?.password?.[0] ||
                        backend?.message ||
                        "Terjadi kesalahan.",
                });
            });
    };

    // DELETE ADMIN
    const handleDelete = (id, username) => {
        Swal.fire({
            title: `Hapus admin "${username}"?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Ya, hapus!",
            cancelButtonText: "Batal",
        }).then((result) => {
            if (!result.isConfirmed) return;

            Swal.fire({
                title: "Menghapus admin...",
                allowOutsideClick: false,
                didOpen: () => Swal.showLoading(),
            });

            axios
                .delete(route("admin.delete-admin", id))
                .then(() => {
                    Swal.fire({
                        icon: "success",
                        title: "Admin berhasil dihapus!",
                    }).then(() => window.location.reload());
                })
                .catch(() => {
                    Swal.fire({
                        icon: "error",
                        title: "Gagal menghapus admin!",
                    });
                });
        });
    };

    // search filter
    const filteredAdmins = admins.filter((a) =>
        a.username.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <AdminLayout user={auth.user}>
            <Head title="Super Admin" />

            <h2 className="mt-0 text-2xl font-semibold text-gray-800">
                Selamat Datang Admin
            </h2>
            <p className="text-gray-600 mb-6">Buat dan kelola akun admin.</p>

            {/* Create Admin Form */}
            <div className="p-6 bg-white rounded-lg shadow-md max-w-2xl">
                <h3 className="text-xl font-semibold mb-4">Buat Admin Baru</h3>

                <form onSubmit={submitCreateAdmin}>
                    <div className="mb-4">
                        <label className="block text-sm text-gray-700 mb-1">
                            Username
                        </label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full rounded-md border-gray-300 shadow-sm"
                            placeholder="contoh: admin_baru"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm text-gray-700 mb-1">
                            Password (8 karakter)
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full rounded-md border-gray-300 shadow-sm"
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        className="px-5 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700"
                    >
                        Buat Akun Admin
                    </button>
                </form>
            </div>

            {/* Admin Table — ORIGINAL STYLE KEPT */}
            <div className="mt-8 bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6 flex justify-between items-center">
                    <h3 className="text-xl font-semibold">Daftar Admin</h3>

                    <input
                        type="text"
                        placeholder="Cari username..."
                        className="rounded-md border-gray-300 shadow-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    ID
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Username
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Aksi
                                </th>
                            </tr>
                        </thead>

                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredAdmins.map((admin) => (
                                <tr key={admin.id}>
                                    <td className="px-6 py-4 text-sm text-gray-700">
                                        {admin.id}
                                    </td>

                                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                        {admin.username}
                                    </td>

                                    <td className="px-6 py-4 text-right text-sm">
                                        <button
                                            onClick={() =>
                                                handleDelete(
                                                    admin.id,
                                                    admin.username
                                                )
                                            }
                                            className="text-red-600 hover:text-red-900"
                                        >
                                            Hapus
                                        </button>
                                    </td>
                                </tr>
                            ))}

                            {admins.length === 0 && (
                                <tr>
                                    <td
                                        colSpan="3"
                                        className="px-6 py-4 text-center text-gray-500 text-sm"
                                    >
                                        Belum ada admin.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    );
}
