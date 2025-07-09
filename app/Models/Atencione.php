<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Atencione extends Model
{
    use HasFactory;

    protected $table = 'atenciones';

    protected $fillable = [
        'user_id',
        'paciente_id',
        'peso',
        'talla',
        'IMC',
        'frecuenciaCardiaca',
        'presionArterial',
        'temperatura',
        'saturacionOxigeno',
        'frecuenciaRespiratoria',
        'fecha',
        'hora',
        'valoracion',
        'diagnostico',
        'tratamiento',
    ];

    /**
     * Las fechas que deben ser tratadas como objetos de Carbon.
     *
     * @var array
     */
    protected $dates = [
        'fecha',
    ];

    /**
     * Relación con el modelo User.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Relación con el modelo Paciente.
     */
    public function paciente()
    {
        return $this->belongsTo(Paciente::class);
    }

    /**
     * Relación con el modelo Medicamento.
     */
    public function medicamentosUsados()
{
    return $this->hasMany(AtencionMedicamento::class);
}

    



public function materialesUsados()
{
    return $this->hasMany(AtencionMateriale::class);
}
}
