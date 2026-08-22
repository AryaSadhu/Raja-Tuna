import React from "react";
import { Link, useForm, usePage } from "@inertiajs/react";

export default function AdminLayout({ children }) {
    const { post } = useForm();
    const { props } = usePage();
    const admin = props.admin; // now this works!
    const role = props.auth.user;
    console.log("FULL PAGE PROPS:", props);
    console.log("ADMIN FROM PROPS:", admin);
    console.log("ADMIN ROLE:", admin?.role);

    // Fungsi untuk Log out
    // const handleLogout = (e) => {
    //     e.preventDefault();
    //     // Asumsi nama route logout-nya 'admin.logout'
    //     post(route("admin.logout"));
    // };

    return (
        <div
            className="grid h-screen grid-cols-[240px_1fr] grid-rows-[60px_1fr]"
            style={{
                gridTemplateAreas: `
          "header header"
          "sidebar content"
        `,
            }}
        >
            <header
                className="flex items-center justify-between border-b border-gray-500 bg-white px-6 shadow-sm z-10"
                style={{ gridArea: "header" }}
            >
                <h1 className="m-0 text-xl font-semibold text-gray-800">
                    Dashboard Admin
                </h1>
                <div className="text-sm text-gray-700">
                    Selamat datang,{" "}
                    <span className="font-bold">{admin ?? "Admin"}</span>!
                </div>
            </header>

            <aside
                className="overflow-y-auto bg-gray-800 p-5 text-gray-100"
                style={{ gridArea: "sidebar" }}
            >
                <h2 className="mt-0 border-b border-gray-700 pb-2 text-lg font-bold text-white">
                    Navigation Panel
                </h2>
                <ul className="m-0 mt-5 list-none p-0 space-y-2">
                    {/* 1. DASHBOARD */}
                    <li>
                        <Link
                            href={route("admin.dashboard")}
                            className={`flex items-center gap-3 mb-1 rounded-md p-3 font-bold no-underline transition-colors duration-150 ${
                                route().current("admin.dashboard")
                                    ? "bg-blue-600 text-white shadow-lg"
                                    : "text-gray-300 hover:bg-gray-700 hover:text-white"
                            }`}
                        >
                            {/* Icon Home/Dashboard */}
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                                />
                            </svg>
                            Dashboard
                        </Link>
                    </li>

                    {/* 2. MENU SUPER ADMIN (Hanya muncul kalau role superadmin) */}
                    {role.role === "superadmin" && (
                        <li>
                            <Link
                                href={route("admin.superadmin")}
                                className={`flex items-center gap-3 mb-1 rounded-md p-3 font-bold no-underline transition-colors duration-150 ${
                                    route().current("admin.superadmin")
                                        ? "bg-blue-600 text-white shadow-lg"
                                        : "text-gray-300 hover:bg-gray-700 hover:text-white"
                                }`}
                            >
                                {/* Icon User Shield */}
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                                    />
                                </svg>
                                Menu Super Admin
                            </Link>
                        </li>
                    )}

                    {/* 3. MANAGE KUPON */}
                    <li>
                        <Link
                            href={route("admin.manage-kupon")}
                            className={`flex items-center gap-3 mb-1 rounded-md p-3 font-bold no-underline transition-colors duration-150 ${
                                route().current("admin.manage-kupon")
                                    ? "bg-blue-600 text-white shadow-lg"
                                    : "text-gray-300 hover:bg-gray-700 hover:text-white"
                            }`}
                        >
                            {/* Icon Ticket */}
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15 5v2a2 2 0 002 2h2a2 2 0 012 2v6a2 2 0 01-2 2h-2a2 2 0 00-2 2v2m-6 0h6m-6 0H6a2 2 0 01-2-2v-2a2 2 0 00-2-2H0v-6h2a2 2 0 002-2V7a2 2 0 012-2h6z"
                                />
                            </svg>
                            Manajemen Kupon
                        </Link>
                    </li>

                    {/* ... Menu Manage Kupon di atas ... */}

{/* 3.5. MANAGE BARANG (Tambahan Baru) */}
<li>
    <Link
        href={route("admin.barang.index")}
        className={`flex items-center gap-3 mb-1 rounded-md p-3 font-bold no-underline transition-colors duration-150 ${
            route().current("admin.barang.index")
                ? "bg-blue-600 text-white shadow-lg"
                : "text-gray-300 hover:bg-gray-700 hover:text-white"
        }`}
    >
        {/* Icon Box/Barang */}
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
        Manajemen Barang
    </Link>
</li>

<li>
    <Link
        href={route("admin.laporan.index")} // Pastikan nama route ini sesuai di web.php
        className={`flex items-center gap-3 mb-1 rounded-md p-3 font-bold no-underline transition-colors duration-150 ${
            route().current("admin.laporan.index")
                ? "bg-blue-600 text-white shadow-lg"
                : "text-gray-300 hover:bg-gray-700 hover:text-white"
        }`}
    >
        {/* Icon Document/Chart */}
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 2v-6m10 10V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2z" />
        </svg>
        Penjualan Transaksi
    </Link>
</li>


{/* ... Menu Undi Pemenang di bawah ... */}

                    {/* 4. UNDI PEMENANG */}
                    <li>
                        <Link
                            href={route("admin.event")}
                            className={`flex items-center gap-3 mb-1 rounded-md p-3 font-bold no-underline transition-colors duration-150 ${
                                route().current("admin.event")
                                    ? "bg-blue-600 text-white shadow-lg"
                                    : "text-gray-300 hover:bg-gray-700 hover:text-white"
                            }`}
                        >
                            {/* Icon Gift/Hadiah */}
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"
                                />
                            </svg>
                            Undi Pemenang
                        </Link>
                    </li>

                    {/* 5. LAYAR LIVE DRAW */}
                    <li>
                        <a
                            href={route("live-draw.index")}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 mb-1 rounded-md p-3 font-bold no-underline transition-colors duration-150 text-gray-300 hover:bg-purple-600 hover:text-white"
                        >
                            {/* Icon Desktop/Monitor */}
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                />
                            </svg>
                            Layar Live Draw
                        </a>
                    </li>

                    {/* 6. RIWAYAT PEMENANG */}
                    <li>
                        <Link
                            href={route("admin.winners")}
                            className={`flex items-center gap-3 mb-1 rounded-md p-3 font-bold no-underline transition-colors duration-150 ${
                                route().current("admin.winners")
                                    ? "bg-blue-600 text-white shadow-lg"
                                    : "text-gray-300 hover:bg-gray-700 hover:text-white"
                            }`}
                        >
                            {/* Icon Clipboard List */}
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                                />
                            </svg>
                            Riwayat Pemenang
                        </Link>
                    </li>

                    {/* 7. LOGOUT */}
                    <li className="mt-8 border-t border-gray-700 pt-4">
                        <Link
                            href={route("admin.logout")}
                            method="post"
                            as="button"
                            className="w-full text-left flex items-center gap-3 rounded-md p-3 font-bold text-red-400 no-underline transition-colors duration-150 hover:bg-red-500/10 hover:text-red-300"
                        >
                            {/* Icon Logout */}
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                                />
                            </svg>
                            Log out
                        </Link>
                    </li>
                </ul>
            </aside>

            {/* Di sinilah konten halaman (children) akan ditampilkan */}
            <main
                className="overflow-y-auto bg-gray-100 p-8"
                style={{ gridArea: "content" }}
            >
                {children}
            </main>
        </div>
    );
}
