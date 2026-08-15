import "../css/app.css";
import "./bootstrap";
import "sweetalert2/dist/sweetalert2.min.css";

import { createInertiaApp } from "@inertiajs/react";
import { resolvePageComponent } from "laravel-vite-plugin/inertia-helpers";
import { createRoot } from "react-dom/client";

const appName = import.meta.env.VITE_APP_NAME || "Laravel";

createInertiaApp({
    title: (title) => `${title}`, //- ${appName}
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.jsx`,
            import.meta.glob("./Pages/**/*.jsx")
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(<App {...props} />);

        // Panggil ini setelah app di-render
        const splash = document.getElementById("splash-screen");
        if (splash) {
            // 1. Tambah class 'hidden' untuk memulai fade-out CSS
            splash.classList.add("hidden");

            // 2. Hapus elemennya dari DOM setelah transisi selesai
            setTimeout(() => {
                splash.remove();
            }, 500); // 500ms (sesuai durasi transisi di CSS)
        }
    },
    progress: {
        color: "#4B5563",
    },
});
