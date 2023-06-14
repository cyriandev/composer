<?php

namespace App\Http\Controllers;

use App\Models\Aquarium;
use App\Models\Fish;
use Illuminate\Http\Request;

class AquariumController extends Controller
{
    public function aquarium(){

        return response()->json(Aquarium::all(), 200);
    }

    public function add_fish(Request $request, $id){

        $request->validate([
            'species' => 'required|string|regex:/(^([a-zA-Z]+)(\d+)?$)/u',
            'fins' => 'required|integer|min:0'
        ]);

        $aqua = Aquarium::find($id);
        if(!$aqua){
            return response()->json(['msg404'=>'This aquarium does not exist'], 404);
        }else{

            $fishes = $aqua->fishes;

            if(strtolower($request->species) == 'guppy'){
                foreach ($fishes as $key => $fish) {
                    if (strtolower($fish->species) == 'goldfish') {
                        return response()->json(['msg401'=>'You cannot add Guppy and Goldfish in the same aquarium'], 401);
                    }
                }
            }elseif (strtolower($request->species) == 'goldfish') {
                foreach ($fishes as $key => $fish) {
                    if (strtolower($fish->species) == 'guppy') {
                        return response()->json(['msg401'=>'You cannot add Guppy and Goldfish in the same aquarium'], 401);
                    }
                }
            }

            if($aqua->size <= 75){
                if ($request->fins >= 3) {
                    return response()->json(['msg400'=>'Fish with three fins or more don\'t go in aquariums of 75 litres or less.'], 400);
                }
            }

            return response()->json($aqua->fishes()->create($request->all()));
        }

    }

    public function get_fish(Request $request, $id){

        $aqua = Aquarium::find($id);
        if(!$aqua){
            return response()->json('This aquarium does not exist', 404);
        }else{
            $fish = $aqua->fishes;
            if (!$fish) {
                return response()->json(200);
            }
            return response()->json($fish);
        }

    }

    public function update_fish(Request $request, $id){

        $request->validate([
            'species' => 'required|string|regex:/(^([a-zA-Z]+)(\d+)?$)/u',
            'fins' => 'required|integer|min:0'
        ]);

        $fish = Fish::find($id);

        if(!$fish){
            return response()->json('The fish you are trying to update does not exist');
        }

        $fishes = $fish->aquarium->fishes;

        if ($request->fins > 2 && $fish->aquarium_id === 1) {
            return response()->json(['msg401' => 'Fish with three fins or more don\'t go in aquariums of 75 litres or less.'], 401);
        }

        if(strtolower($request->species) == 'guppy'){
            foreach ($fishes as $key => $fish) {
                if (strtolower($fish->species) == 'goldfish') {
                    return response()->json(['msg400'=>'You cannot add Guppy and Goldfish in the same aquarium'], 401);
                }
            }
        }elseif (strtolower($request->species) == 'goldfish') {
            foreach ($fishes as $key => $fish) {
                if (strtolower($fish->species) == 'guppy') {
                    return response()->json(['msg400'=>'You cannot add Guppy and Goldfish in the same aquarium'], 400);
                }
            }
        }

        $fish->species = $request->species;
        $fish->fins = $request->fins;
        $fish->save();

        return response()->json($fish, 200);
        
    }

    public function remove($id){
        return response()->json(Fish::destroy($id), 200);
    }
}
