<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AtencionMedicamento extends Model
{
    use HasFactory;

    protected $table = 'atencion_medicamentos';

    protected $fillable = ['atencione_id', 'medicamento_id', 'cantidad_usada'];

    public function atencione()
    {
        return $this->belongsTo(Atencione::class);
    }

    public function medicamento()
    {
        return $this->belongsTo(Medicamento::class);
    }
}

