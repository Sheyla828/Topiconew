<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AtencionMateriale extends Model
{
    use HasFactory;

    // Tabla asociada (por si no sigue la convención de nombres)
    protected $table = 'atencion_materiales'; // Nombre correcto de la tabla

    // Campos asignables
    protected $fillable = [
        'atencione_id',   // Coincide con la migración
        'materiale_id',   // Coincide con la migración
        'cantidad_usada',
    ];

    // Relación con la tabla Atencion
    public function atencione()
    {
        return $this->belongsTo(Atencione::class, 'atencione_id');
    }

    public function materiale()
    {
        return $this->belongsTo(Materiale::class, 'materiale_id');
    }
}
