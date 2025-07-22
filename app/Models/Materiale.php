<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Materiale extends Model
{
    use HasFactory;

    
    protected $table = 'materiales';

    
    protected $fillable = [
        'nombre',
        'cantidad',
        'fechaingreso',
        'fechavencimiento',
    ];

   
    protected $dates = [
        'fechavencimiento',
    ];
    public function atenciones()
{
    return $this->belongsToMany(AtencionMateriale::class);
}
}
