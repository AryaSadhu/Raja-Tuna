<!DOCTYPE html>
<html>
<body>
    <h2 style="color: #2563eb;">{{ $dataEmail['judul'] }}</h2>
    <hr>
    <p>Halo, pesanan Anda sedang diproses.</p>
    <p><strong>Nomor/Resi:</strong> {{ $dataEmail['nomor'] }}</p>
    <p>{{ $dataEmail['pesan'] }}</p>
    <br>
    <p>Salam hangat, <br> Management Toko</p>
</body>
</html>