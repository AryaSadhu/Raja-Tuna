<?php

namespace App\Http\Controllers;

use App\Models\Coupon;
use App\Models\CouponFile;
use Barryvdh\DomPDF\Facade\Pdf;

class CouponPDFController extends Controller
{
    public function createFile($coupon_codes, $title)
    {
        $pdf = Pdf::loadView('pdf.coupons-pdf', ['coupon_codes' => $coupon_codes])
            ->setPaper('a4', 'portrait');
        
        return $pdf->download("$title.pdf");
    }

    public function downloadExistingFile($id)
    {
        $res = Coupon::where("coupon_files_id", $id)->get();
        $cp_file = CouponFile::find($id);
        $title = $cp_file->title;
        $coupon_codes = $res->map(function($c){
            return ['id'=>$c->id];
        })->toArray();
        
        $pdf = Pdf::loadView('pdf.coupons-pdf', ['coupon_codes' => $coupon_codes])
            ->setPaper('a4', 'portrait');
            
        return $pdf->download("$title.pdf");
    }
}