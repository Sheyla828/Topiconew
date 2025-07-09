<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    
    public function up(): void
    {
        Schema::create('medicamentos', function (Blueprint $table) {
            $table->id(); 
            $table->string('nombre'); 
            $table->integer('cantidad'); 
            $table->string('unidadmedida'); 
            $table->date('fechavencimiento'); 
            $table->timestamps(); 
        });
    }

    
    public function down(): void
    {
        Schema::dropIfExists('medicamentos');
    }
};
