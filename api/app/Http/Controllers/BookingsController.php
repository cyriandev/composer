<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Booking;
use Illuminate\Support\Facades\Validator;

class BookingsController extends Controller
{
    //
    public function store(Request $request)
    {
        $message = [
            'reason.required' => 'please enter your reason',
            'date.required' => 'please choose date'
        ];
        $validator = Validator::make($request->all(), [
            'reason' => 'required|string',
            'date' => 'required|string',
        ], $message);

        if($validator->fails()){
            return response()->json($validator->errors(), 400);
        }
        
        $booking = Booking::create([
            'reason' => $request->reason,
            'date' => $request->date,
        ]);

        return response()->json($booking, 201);
    }

    public function getBookings() {
        return response()->json(Booking::all());
    }
}
