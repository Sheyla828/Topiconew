<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('pacientes', function (Blueprint $table) {
            $table->id();
            $table->string('nombre');
            $table->string('aPaterno');
            $table->string('aMaterno');
            $table->string('sexo');
            $table->date('fechaNacimiento');
            $table->integer('edad');
            $table->integer('dni');
            $table->string('ocupacion');
            $table->string('alergias')->nullable();
            $table->string('programaEducativo')->nullable();
            $table->string('semestre')->nullable();
            $table->integer('telefono')->nullable();
            $table->string('parentesco')->nullable();
            $table->integer('telefonoEmergencia')->nullable();      
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pacientes');
    }
};
