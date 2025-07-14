<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('pacientes', function (Blueprint $table) {
            $table->id();
            $table->string('nombre');
            $table->string('aPaterno');
            $table->string('aMaterno');
            $table->string('sexo');
            $table->date('fechaNacimiento');
            $table->integer('edad');
            $table->string('dni')->unique();
            $table->string('ocupacion');
            $table->string('alergias')->nullable();
            $table->string('detalleAlergias')->nullable();
            $table->string('programaEducativo')->nullable();
            $table->string('semestre')->nullable();
            $table->string('telefono')->nullable();
            $table->string('parentesco')->nullable();
            $table->string('detalleParentesco')->nullable(); // ⚡ NUEVO CAMPO
            $table->string('telefonoEmergencia')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void {
        Schema::dropIfExists('pacientes');
    }
};