<?php

use App\Http\Controllers\AquariumController;
use App\Http\Controllers\UsersController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::post('/register', [UsersController::class, 'register']);
Route::post('/login', [UsersController::class, 'login']);
Route::get('/get_user/{id}', [UsersController::class, 'get_user']);
Route::get('/get_aquariums', [AquariumController::class, 'aquarium']);
Route::post('/add_fish/{id}', [AquariumController::class, 'add_fish']);
Route::get('/get_fish/{id}', [AquariumController::class, 'get_fish']);
Route::delete('/remove/{id}', [AquariumController::class, 'remove']);
Route::post('/update_fish/{id}', [AquariumController::class, 'update_fish']);

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});
