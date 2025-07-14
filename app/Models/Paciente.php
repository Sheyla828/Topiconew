<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Paciente extends Model
{
    use HasFactory;

    protected $table = 'pacientes';

    protected $fillable = [
        'nombre',
        'aPaterno',
        'aMaterno',
        'sexo',
        'fechaNacimiento',
        'edad',
        'dni',
        'ocupacion',
        'alergias',
        'detalleAlergias',
        'programaEducativo',
        'semestre',
        'telefono',
        'parentesco',
        'detalleParentesco', // ⚡ NUEVO
        'telefonoEmergencia',
    ];

    protected $dates = ['fechaNacimiento'];
}

