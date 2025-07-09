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
        Schema::create('atenciones', function (Blueprint $table) {
            $table->engine = "InnoDB";
            $table->id();
            $table->bigInteger('user_id')->unsigned();
            $table->bigInteger('paciente_id')->unsigned();
            $table->string('peso');
            $table->string('talla');
            $table->string('IMC');
            $table->string('frecuenciaCardiaca');
            $table->string('presionArterial');
            $table->string('temperatura');
            $table->string('saturacionOxigeno');
            $table->string('frecuenciaRespiratoria');
            $table->date('fecha');
            $table->time('hora');
            $table->string('valoracion')->nullable();
            $table->string('diagnostico')->nullable();
            $table->string('tratamiento')->nullable();
            $table->timestamps();

            $table->foreign('user_id')->references('id')->on('users')->onDelete("cascade");
            $table->foreign('paciente_id')->references('id')->on('pacientes')->onDelete("cascade");
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('atenciones');
    }
};
