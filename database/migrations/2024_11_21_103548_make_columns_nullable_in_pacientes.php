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
        Schema::table('pacientes', function (Blueprint $table) {
            $table->string('programaEducativo')->nullable()->change();
            $table->string('semestre')->nullable()->change(); // Permitir nulos
            $table->string('parentesco')->nullable()->change(); // Permitir nulos
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('pacientes', function (Blueprint $table) {
            $table->string('programaEducativo')->nullable(false)->change(); // Restablecer a NOT NULL
            $table->string('semestre')->nullable(false)->change(); // Restablecer a NOT NULL
            $table->string('parentesco')->nullable(false)->change(); // Restablecer a NOT NULL
        });
    }
};

