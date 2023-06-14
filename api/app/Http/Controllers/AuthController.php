<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
    public function register(Request $request)
    {

        $message = [
            'name.required' => 'please enter your name',
            'email.required' => 'please enter your email',
            'password.required' => 'please enter a password'
        ];
        $validator = Validator::make($request->all(), [
            'name' => 'required|string',
            'email' => 'required|string|email|unique:users',
            'password' => 'required|string|min:8',
        ], $message);

        if($validator->fails()){
            return response()->json($validator->errors(), 400);
        }
        
    
        $user = new User([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        $user->save();

        $token = $user->createToken('Laravel Password Grant Client')->accessToken;

        return response()->json(['token' => $token], 201);
    }


    public function login(Request $request)
    {

        $message = [
            'email.required' => 'please enter your email',
            'password.required' => 'please enter a password'
        ];
        $validator = Validator::make($request->all(), [
            'email' => 'required|string|email',
            'password' => 'required|string',
        ], $message);

        if($validator->fails()){
            return response()->json($validator->errors(), 400);
        }

        $credentials = [
            'email' => $request->email,
            'password' => $request->password,
        ];

        if (!Auth::attempt($credentials)) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $token = Auth::user()->createToken('Laravel Password Grant Client')->accessToken;

        return response()->json(['token' => $token], 200);
    }
}
