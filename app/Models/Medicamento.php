<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Medicamento extends Model
{
    use HasFactory;

    /**
     * La tabla asociada al modelo.
     *
     * @var string
     */
    protected $table = 'medicamentos';

    /**
     * Los atributos que se pueden asignar masivamente.
     *
     * @var array
     */
    protected $fillable = [
        'nombre',
        'cantidad',
        'unidadmedida',
        'fechavencimiento',
    ];

    /**
     * Las fechas que deben ser tratadas como objetos de Carbon.
     *
     * @var array
     */
    protected $dates = [
        'fechavencimiento',
    ];
    public function atenciones()
{
    return $this->belongsToMany(AtencionMedicamento::class);
    
}
}
