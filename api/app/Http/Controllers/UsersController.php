<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;

class UsersController extends Controller
{
    public function register(Request $request){

        $fields = Validator::make(
            $request->all(),
            [
                'f_name' => 'required|string|regex:/(^([a-zA-Z]+)(\d+)?$)/u',
                'l_name' => 'required|string|regex:/(^([a-zA-Z]+)(\d+)?$)/u',
                'email' => 'required|email|unique:users,email',
                'password' => 'required|string|confirmed|regex:/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/'
            ]);

        if ($fields->fails()) {
                return response()->json($fields->errors(), 400);
        }

        $user = User::create([
            'f_name' => $request['f_name'],
            'l_name' => $request['l_name'],
            'email' => $request['email'],
            'password' => bcrypt($request['password'])
        ]);

        return response()->json($user, 201);
    }

    public function login(Request $request){

        $fields = Validator::make(
            $request->all(),
            [
                'email' => 'required',
                'password' => 'required'
            ]);

        if ($fields->fails()) {
                return response()->json($fields->errors(), 400);
        }
        $user = User::where('email', $request['email'])->first();

        //Check password
        if (!$user || !Hash::check($request['password'], $user->password)) {
            return response()->json(['msg'=>'Wrong credentials, please check your password and username'], 401);
        }

        return response()->json($user, 200);
    }

    public function get_user($id){
        return response()->json(User::find($id), 200);
    }
}
