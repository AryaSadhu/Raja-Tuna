<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="utf-8" />
<title>Template Cetak Kupon</title>
<style>
    @page {
        size: A4 portrait;
        margin: 10mm;
    }

    body {
        font-family: Arial, sans-serif;
        margin: 0;
        padding: 0;
        background-color: #fff;
    }

    .page {
        width: 100%;
        page-break-after: always;
    }

    .page:last-child {
        page-break-after: auto;
    }

    table {
        width: 100%;
        border-collapse: separate;
        border-spacing: 8px 2px;
    }

    .coupon {
        width: 48%;
        height: 35mm;
        border: 2px solid #00ff00;
        border-radius: 8px;
        text-align: center;
        vertical-align: middle;
        background: #fff;
        padding: 4px;
        position: relative;
    }

    .coupon::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-image: url('images/DESIGN LOGO RAJATUNA.png');
        background-size: 60%;
        background-position: center;
        background-repeat: no-repeat;
        opacity: 0.4;
        border-radius: 6px;
        z-index: 0;
        pointer-events: none;
    }

    .coupon-content {
        padding: 4px 8px;
        position: relative;
        z-index: 1;
    }

    .label {
        font-size: 10px;
        color: #333;
        margin-bottom: 2px;
    }

    .code {
        font-size: 18px;
        font-weight: bold;
        margin: 3px 0;
    }

    .divider {
        width: 100%;
        height: 1px;
        background: #000;
        margin: 2px auto 4px auto;
    }

    .info {
        font-size: 10px;
        color: #333;
        line-height: 1.2;
    }

    .website {
        font-size: 12px;
        font-weight: bold;
        font-style: italic;
        margin-top: 2px;
    }

    .empty {
        visibility: hidden;
    }
</style>
</head>
<body>

@foreach (array_chunk($coupon_codes, 12) as $pageIndex => $page)
    <div class="page">
        <table>
            @foreach (array_chunk($page, 2) as $row)
                <tr>
                    @foreach ($row as $coupon)
                        <td class="coupon">
                            <div class="coupon-content">
                                <div class="label">Kode Kupon</div>
                                <div class="code">{{ $coupon['id'] }}</div>
                                <div class="divider"></div>
                                <div class="info">Masukkan kode kupon di website resmi kami:</div>
                                <div class="website">www.rajatuna.com</div>
                            </div>
                        </td>
                    @endforeach
                    @if (count($row) < 2)
                        <td class="coupon empty"></td>
                    @endif
                </tr>
            @endforeach
            
            @php
                $remainingCoupons = 12 - count($page);
                $remainingRows = ceil($remainingCoupons / 2);
            @endphp
            
            @for ($i = 0; $i < $remainingRows; $i++)
                <tr>
                    <td class="coupon empty"></td>
                    <td class="coupon empty"></td>
                </tr>
            @endfor
        </table>
    </div>
@endforeach

</body>
</html>