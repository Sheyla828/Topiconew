<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Paciente extends Model
{
    use HasFactory;
    
    /**
     * Tabla asociada al modelo.
     *
     * @var string
     */
    protected $table = 'pacientes';

    /**
     * Los atributos que se pueden asignar masivamente.
     *
     * @var array
     */
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
        'programaEducativo',
        'semestre',
        'telefono',
        'parentesco',
        'telefonoEmergencia',
    ];

    /**
     * Las fechas que deben ser tratadas como objetos de Carbon.
     *
     * @var array
     */
    protected $dates = [
        'fechaNacimiento',
    ];
}
