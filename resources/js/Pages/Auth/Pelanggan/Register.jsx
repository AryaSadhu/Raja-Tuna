import { useForm, Head, Link } from "@inertiajs/react";

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        nama_lengkap: "",
        email: "",
        nomor_whatsapp: "",
        alamat_lengkap: "",
        password: "",
        password_confirmation: "",
    });

    const submit = (e) => {
        e.preventDefault();
        post(route("pelanggan.register"), {
            onFinish: () => reset("password", "password_confirmation"),
        });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-12">
            <Head title="Register Pelanggan" />

            <div className="w-full max-w-md bg-white shadow-md rounded-lg p-8">
                <h1 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
                    Daftar Akun Pelanggan
                </h1>

                <form onSubmit={submit} className="space-y-4">
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
                            value={data.alamat_lengkap}
                            onChange={(e) => setData("alamat_lengkap", e.target.value)}
                            rows={3}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
                            required
                        />
                        {errors.alamat_lengkap && (
                            <p className="mt-1 text-sm text-red-600">{errors.alamat_lengkap}</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={data.password}
                            onChange={(e) => setData("password", e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
                            autoComplete="new-password"
                            required
                        />
                        {errors.password && (
                            <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700">
                            Konfirmasi Password
                        </label>
                        <input
                            id="password_confirmation"
                            type="password"
                            value={data.password_confirmation}
                            onChange={(e) => setData("password_confirmation", e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
                            autoComplete="new-password"
                            required
                        />
                        {errors.password_confirmation && (
                            <p className="mt-1 text-sm text-red-600">{errors.password_confirmation}</p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full bg-yellow-500 hover:bg-yellow-400 text-slate-900 font-medium py-2 px-4 rounded-md transition disabled:opacity-50"
                    >
                        Daftar
                    </button>
                </form>

                <p className="mt-6 text-center text-sm text-gray-600">
                    Sudah punya akun?{" "}
                    <Link href={route("pelanggan.login")} className="text-yellow-600 hover:underline">
                        Masuk di sini
                    </Link>
                </p>
            </div>
        </div>
    );
}
