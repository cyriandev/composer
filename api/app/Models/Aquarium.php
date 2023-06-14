<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Fish;

class Aquarium extends Model
{
    use HasFactory;

    public function fishes(){
        return $this->hasMany(Fish::class);
    }
}
