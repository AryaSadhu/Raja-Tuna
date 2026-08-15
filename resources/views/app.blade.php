<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title inertia>{{ config('app.name', 'Laravel') }}</title>

        <link rel="icon" type="image/png" href="{{ asset('/images/favicon.png') }}">

        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />

        <!-- Scripts -->
        @routes
        @viteReactRefresh
        @vite(['resources/js/app.jsx', "resources/js/Pages/{$page['component']}.jsx"])
        @inertiaHead

        <style>
    #splash-screen {
        position: fixed;
        inset: 0;
        z-index: 99999;
        background-color: #ffffff; /* Latar putih */
        display: flex;
        align-items: center;
        justify-content: center;
        transition: opacity 0.5s ease-out; /* Efek fade-out */
    }
    #splash-screen img {
        width: 75%;
        max-width: 320px;
        animation: pulse 1.5s ease-in-out infinite;
    }
    /* Class untuk menyembunyikan (fade-out) */
    #splash-screen.hidden {
        opacity: 0;
    }
    /* Animasi denyut (pulse) */
    @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.7; }
    }
</style>
    </head>
    <body class="font-sans antialiased">
        <div id="splash-screen">
        <img src="/images/DESIGN LOGO RAJATUNA.png" alt="Logo Kerupuk Tuna" />
    </div>
        @inertia
    </body>
</html>
