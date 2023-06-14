<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Aquarium;

class Fish extends Model
{
    use HasFactory;

    protected $fillable = [
        'aquarium_id',
        'species',
        'fins'
    ];

    public function aquarium(){
        return $this->belongsTo(Aquarium::class);
    }
}
