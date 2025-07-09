<?php

use App\Http\Controllers\AtencioneController;
use App\Http\Controllers\CitaController;
use App\Http\Controllers\MaterialeController;
use App\Http\Controllers\MedicamentoController;
use App\Http\Controllers\PacienteController;
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Ruta principal (página de bienvenida)
Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

// Ruta para reportes de pacientes
Route::get('/paciente/report', [PacienteController::class, 'report'])->name('paciente.report');

// Rutas protegidas con middleware 'auth' y 'verified'
Route::middleware(['auth', 'verified'])->group(function () {
    // Dashboard
    Route::get('/dashboard', fn() => Inertia::render('Dashboard'))->name('dashboard');

    // Rutas de recursos (RESTful)
    Route::resource('paciente', PacienteController::class);
    Route::resource('material', MaterialeController::class);
    Route::resource('medicamento', MedicamentoController::class);
    Route::resource('atencion', AtencioneController::class);
    Route::resource('cita', CitaController::class);

    // Ruta adicional para actualizar estado de citas
    Route::put('/citas/{id}/estado', [CitaController::class, 'actualizarEstado'])->name('citas.actualizarEstado');
});

// Rutas relacionadas con el perfil del usuario autenticado
Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

// Rutas de autenticación
require __DIR__.'/auth.php';
