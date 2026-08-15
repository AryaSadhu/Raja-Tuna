<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class Resource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public $code, $status, $message, $error, $resource;
    public function __construct($code,$status , $message, $error, $resource)
    {
        $this->code = $code;
        $this->status = $status;
        $this->message = $message;
        $this->error = $error;
        $this->resource = $resource;
    }

    public function toArray(Request $request): array
    {
        return [
            'code' => $this->code,
            'status' => $this->status,
            'message' => $this->message,
            'error' => $this->error,
            'resource' => $this->resource
        ];
    }
}
