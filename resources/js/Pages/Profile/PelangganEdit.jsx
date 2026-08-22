import { Head, Link, router, useForm } from "@inertiajs/react";
import Swal from "sweetalert2";

export default function PelangganEdit({ pelanggan }) {
    const { data, setData, patch, processing, errors } = useForm({
        nama_lengkap: pelanggan?.nama_lengkap ?? "",
        email: pelanggan?.email ?? "",
        nomor_whatsapp: pelanggan?.nomor_whatsapp ?? "",
        alamat_lengkap: pelanggan?.alamat_lengkap ?? "",
    });

    const {
        data: passwordData,
        setData: setPasswordData,
        put: putPassword,
        processing: processingPassword,
        errors: passwordErrors,
        reset: resetPassword,
    } = useForm({
        current_password: "",
        password: "",
        password_confirmation: "",
    });

    const submitProfile = (e) => {
        e.preventDefault();
        patch(route("pelanggan.profile.update"), {
            preserveScroll: true,
            onSuccess: () => {
                Swal.fire("Berhasil", "Profil berhasil diperbarui.", "success");
            },
        });
    };

    const submitPassword = (e) => {
        e.preventDefault();
        putPassword(route("pelanggan.profile.password"), {
            preserveScroll: true,
            onSuccess: () => {
                resetPassword();
                Swal.fire("Berhasil", "Password berhasil diperbarui.", "success");
            },
            onError: () => {
                resetPassword("current_password", "password", "password_confirmation");
            },
        });
    };

    const handleLogout = (e) => {
        e.preventDefault();
        router.post(route("pelanggan.logout"));
    };

    return (
        <div className="min-h-screen bg-gray-100 px-4 py-12">
            <Head title="Profil Saya" />

            <div className="max-w-2xl mx-auto space-y-6">
                <div className="flex items-center justify-between">
                    <Link
                        href={route("home")}
                        className="text-sm font-medium text-gray-600 hover:text-gray-900"
                    >
                        &larr; Kembali ke Beranda
                    </Link>
                    <button
                        onClick={handleLogout}
                        className="text-sm font-medium text-gray-600 hover:text-gray-900"
                    >
                        Logout
                    </button>
                </div>

                {/* INFORMASI PROFIL & ALAMAT */}
                <div className="bg-white shadow-md rounded-lg p-8">
                    <h1 className="text-xl font-semibold text-gray-800 mb-6">
                        Informasi Profil
                    </h1>

                    <form onSubmit={submitProfile} className="space-y-4">
                        <div>
                            <label htmlFor="nama_lengkap" className="block text-sm font-medium text-gray-700">
                                Nama Lengkap
                            </label>
                            <input
                                id="nama_lengkap"
                                type="text"
                                value={data.nama_lengkap}
                                onChange={(e) => setData("nama_lengkap", e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
                                autoComplete="name"
                                required
                            />
                            {errors.nama_lengkap && (
                                <p className="mt-1 text-sm text-red-600">{errors.nama_lengkap}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={data.email}
                                onChange={(e) => setData("email", e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
                                autoComplete="username"
                                required
                            />
                            {errors.email && (
                                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="nomor_whatsapp" className="block text-sm font-medium text-gray-700">
                                Nomor WhatsApp
                            </label>
                            <input
                                id="nomor_whatsapp"
                                type="text"
                                value={data.nomor_whatsapp}
                                onChange={(e) => setData("nomor_whatsapp", e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
                                autoComplete="tel"
                                required
                            />
                            {errors.nomor_whatsapp && (
                                <p className="mt-1 text-sm text-red-600">{errors.nomor_whatsapp}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="alamat_lengkap" className="block text-sm font-medium text-gray-700">
                                Alamat Lengkap
                            </label>
                            <textarea
                                id="alamat_lengkap"
                                rows={3}
                                value={data.alamat_lengkap}
                                onChange={(e) => setData("alamat_lengkap", e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
                                required
                            />
                            {errors.alamat_lengkap && (
                                <p className="mt-1 text-sm text-red-600">{errors.alamat_lengkap}</p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="bg-yellow-500 hover:bg-yellow-400 text-slate-900 font-medium py-2 px-6 rounded-md transition disabled:opacity-50"
                        >
                            Simpan Perubahan
                        </button>
                    </form>
                </div>

                {/* GANTI PASSWORD */}
                <div className="bg-white shadow-md rounded-lg p-8">
                    <h2 className="text-xl font-semibold text-gray-800 mb-6">
                        Ubah Password
                    </h2>

                    <form onSubmit={submitPassword} className="space-y-4">
                        <div>
                            <label htmlFor="current_password" className="block text-sm font-medium text-gray-700">
                                Password Saat Ini
                            </label>
                            <input
                                id="current_password"
                                type="password"
                                value={passwordData.current_password}
                                onChange={(e) => setPasswordData("current_password", e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
                                autoComplete="current-password"
                                required
                            />
                            {passwordErrors.current_password && (
                                <p className="mt-1 text-sm text-red-600">{passwordErrors.current_password}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Password Baru
                            </label>
                            <input
                                id="password"
                                type="password"
                                value={passwordData.password}
                                onChange={(e) => setPasswordData("password", e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
                                autoComplete="new-password"
                                required
                            />
                            {passwordErrors.password && (
                                <p className="mt-1 text-sm text-red-600">{passwordErrors.password}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700">
                                Konfirmasi Password Baru
                            </label>
                            <input
                                id="password_confirmation"
                                type="password"
                                value={passwordData.password_confirmation}
                                onChange={(e) => setPasswordData("password_confirmation", e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
                                autoComplete="new-password"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={processingPassword}
                            className="bg-yellow-500 hover:bg-yellow-400 text-slate-900 font-medium py-2 px-6 rounded-md transition disabled:opacity-50"
                        >
                            Perbarui Password
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
