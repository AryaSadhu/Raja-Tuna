import React from "react";

export default function AdminPage({
    expired_coupons,
    active_coupons,
    all_coupons,
}) {
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
                className="flex items-center border-b border-gray-500 bg-white px-6 shadow-sm z-10"
                style={{ gridArea: "header" }}
            >
                <h1 className="m-0 text-xl font-semibold text-gray-800">
                    Dashboard Admin
                </h1>
            </header>

            <aside
                className="overflow-y-auto bg-gray-800 p-5 text-gray-100"
                style={{ gridArea: "sidebar" }}
            >
                <h2 className="mt-0 border-b border-gray-700 pb-2 text-lg font-bold text-white">
                    Navigation Panel
                </h2>
                <ul className="m-0 mt-5 list-none p-0">
                    <li>
                        <a
                            href="#"
                            className="mb-1 block rounded-md bg-blue-500 p-3 font-bold text-white no-underline"
                        >
                            Dashboard
                        </a>
                    </li>
                    <li>
                        <a
                            href="#"
                            className="mb-1 block rounded-md p-3 text-gray-200 no-underline transition-colors duration-150 hover:bg-blue-700"
                        >
                            Buat Kupon
                        </a>
                    </li>
                    <li>
                        <a
                            href="#"
                            className="mb-1 block rounded-md p-3 text-gray-200 no-underline transition-colors duration-150 hover:bg-blue-700"
                        >
                            Undi Pemenang
                        </a>
                    </li>
                    <li>
                        <a
                            href="#"
                            className="mb-1 block rounded-md p-3 text-gray-200 no-underline transition-colors duration-150 hover:bg-blue-700"
                        >
                            Log out
                        </a>
                    </li>
                    <li>
                        <a
                            href="#"
                            className="mb-1 block rounded-md p-3 text-gray-200 no-underline transition-colors duration-150 hover:bg-blue-700"
                        >
                            Superadmin
                        </a>
                    </li>
                </ul>
            </aside>

            <main
                className="overflow-y-auto bg-gray-100 p-8"
                style={{ gridArea: "content" }}
            >
                <h2 className="mt-0 text-2xl font-semibold text-gray-800">
                    Admin Datang!!!
                </h2>
                <p className="text-gray-600">Ringkasan Kupon</p>

                <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
                    <div className="rounded-lg bg-white p-6 shadow-md transition-shadow hover:shadow-lg">
                        <h3 className="text-sm font-medium uppercase tracking-wider text-gray-500">
                            Jumlah Kupon yang Expired
                        </h3>
                        <span className="mt-2 block text-3xl font-bold text-gray-900">
                            {expired_coupons}
                        </span>
                    </div>

                    <div className="rounded-lg bg-white p-6 shadow-md transition-shadow hover:shadow-lg">
                        <h3 className="text-sm font-medium uppercase tracking-wider text-gray-500">
                            Jumlah Kupon yang Aktif saat ini
                        </h3>
                        <span className="mt-2 block text-3xl font-bold text-gray-900">
                            {active_coupons}
                        </span>
                    </div>

                    <div className="rounded-lg bg-white p-6 shadow-md transition-shadow hover:shadow-lg">
                        <h3 className="text-sm font-medium uppercase tracking-wider text-gray-500">
                            Total Semua Kupon
                        </h3>
                        <span className="mt-2 block text-3xl font-bold text-gray-900">
                            {all_coupons}
                        </span>
                    </div>
                </div>
            </main>
        </div>
    );
}
