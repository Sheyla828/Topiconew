<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AtencionMateriale extends Model
{
    use HasFactory;

    // Tabla asociada (por si no sigue la convención de nombres)
    protected $table = 'atencionMateriales';

    // Campos asignables
    protected $fillable = [
        'atencion_id',
        'material_id',
        'cantidad_usada',
    ];

    // Relación con la tabla Atencion
    public function atencion()
    {
        return $this->belongsTo(Atencione::class);
    }

    // Relación con la tabla Material
    public function material()
    {
        return $this->belongsTo(Materiale::class);
    }
}
