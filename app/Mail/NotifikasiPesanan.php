<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Queue\SerializesModels;
use Illuminate\Mail\Mailables\Envelope;

class NotifikasiPesanan extends Mailable
{
    use Queueable, SerializesModels;

    public $dataEmail; // Variabel untuk menampung isi modal

    public function __construct($dataEmail)
    {
        $this->dataEmail = $dataEmail;
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: $this->dataEmail['judul'], // Judul sesuai input modal
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'email.notifikasi', // Kita akan buat file view-nya
        );
    }
}