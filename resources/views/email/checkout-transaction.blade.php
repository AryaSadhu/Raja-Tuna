<!DOCTYPE html>
<html lang="id">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Konfirmasi Pesanan</title>
    <style>
        /* ... (Semua style CSS dari bodyEmail.html taruh di sini) ... */
        body,
        table,
        td,
        a {
            -webkit-text-size-adjust: 100%;
            -ms-text-size-adjust: 100%;
        }
        table,
        td {
            mso-table-lspace: 0pt;
            mso-table-rspace: 0pt;
        }
        img {
            -ms-interpolation-mode: bicubic;
            border: 0;
            height: auto;
            line-height: 100%;
            outline: none;
            text-decoration: none;
        }
        body {
            height: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            width: 100% !important;
        }
    </style>
</head>

<body style="margin: 0 !important; padding: 0 !important; background-color: #f4f4f4;">

    <div
        style="display: none; font-size: 1px; color: #fefefe; line-height: 1px; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;">
        Pesanan Anda #{{ $order_no }} sedang diproses. Silakan lakukan pembayaran.
    </div>

    <table border="0" cellpadding="0" cellspacing="0" width="100%">
        <tr>
            <td bgcolor="#f4f4f4" align="center" style="padding: 20px 0;">
                <table border="0" cellpadding="0" cellspacing="0" width="100%"
                    style="max-width: 600px; border-radius: 8px; overflow: hidden;">
                    
                    <tr>
                        <td align="center" bgcolor="#ffffff" style="padding: 24px;">
                            <img src="https://i.ibb.co.com/HpkSSmWL/logo1.png" alt="Logo Krupuk Tuna" width="150"
                                style="display: block; width: 150px;">
                        </td>
                    </tr>

                    <tr>
                        <td bgcolor="#ffffff" align="left"
                            style="padding: 24px; font-family: Arial, sans-serif; font-size: 16px; line-height: 24px; color: #333;">

                            <h1 style="font-size: 22px; font-weight: bold; margin: 0 0 20px 0;">
                                Terima Kasih Atas Pesanan Anda!
                            </h1>
                            <p style="margin: 0 0 20px 0;">
                                Silakan lakukan pembayaran sejumlah:
                            </p>

                            <p
                                style="font-size: 32px; font-weight: bold; color: #D9534F; margin: 0 0 24px 0; letter-spacing: -1px;">
                                Rp {{ number_format($grand_total, 0, ',', '.') }}
                            </p>

                            <div
                                style="background-color: #f9f9f9; padding: 16px; border-radius: 4px; margin-bottom: 24px;">
                                <p style="margin: 0 0 4px 0; font-size: 14px; color: #555;">
                                    Ke rekening:
                                </p>
                                <p style="margin: 0 0 4px 0; font-size: 18px; font-weight: bold;">
                                    123 456 789 (BCA)
                                </p>
                                <p style="margin: 0; font-size: 16px;">
                                    A/N: PT Apa Saja Bisa
                                </p>
                            </div>

                            <table border="0" cellspacing="0" cellpadding="0" width="100%" style="margin-bottom: 24px;">
                                <tr>
                                    <td align="center">
                                        <table border="0" cellspacing="0" cellpadding="0">
                                            <tr>
                                                <td align="center" style="border-radius: 6px;" bgcolor="#007bff">
                                                    <a href="{{ route('lacak') }}" target="_blank"
                                                        style="font-size: 16px; font-family: Arial, sans-serif; color: #ffffff; text-decoration: none; border-radius: 6px; padding: 12px 24px; display: inline-block; font-weight: bold;">
                                                        Lacak Pesanan Anda
                                                    </a>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>

                            <table border="0" cellspacing="0" cellpadding="0" width="100%" style="margin: 24px 0;">
                                <tr>
                                    <td height="1" style="background-color: #eeeeee; line-height: 1px; font-size: 1px;">
                                        &nbsp; </td>
                                </tr>
                            </table>

                            <p style="margin: 0 0 8px 0; font-size: 14px; color: #555;">
                                Nomor Order Pesanan Anda:
                            </p>
                            <p style="margin: 0 0 16px 0; font-size: 18px; font-weight: bold;">
                                {{ $order_no }}
                            </p>

                            <p style="margin: 0 0 8px 0; font-size: 14px; color: #555;">
                                Kode Kupon Undian Anda:
                            </p>
                            <p style="margin: 0 0 24px 0; font-size: 18px; font-weight: bold;">
                                {{ $coupon }}
                            </p>
                        </td>
                    </tr>

                    <tr>
                        <td bgcolor="#f4f4f4" align="center"
                            style="padding: 24px; font-family: Arial, sans-serif; font-size: 12px; line-height: 18px; color: #777;">
                            <p style="margin: 0;">
                                Anda menerima email ini karena Anda melakukan pemesanan di Krupuk Tuna.
                            </p>
                            <p style="margin: 10px 0 0 0;">
                                &copy; 2025 PT Apa Saja Bisa. All rights reserved.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>

</body>
</html>