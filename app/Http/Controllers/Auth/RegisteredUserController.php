<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    /**
     * Display the registration view.
     */
    public function create(): Response
    {
        // Verificamos si ya hay un usuario registrado
        if (User::count() > 0) {
            // Si ya hay un usuario, retornamos la vista de login con un mensaje
            return Inertia::render('Auth/Login', [
                'status' => 'El registro está cerrado. Ya existe un usuario registrado.'
            ]);
        }

        return Inertia::render('Auth/Register');
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        // Validamos los datos de entrada
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:'.User::class,
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'aPaterno' => 'required|string|max:255',
            'aMaterno' => 'required|string|max:255',
            'telefono' => 'required|integer',
        ]);

        // Creamos al usuario
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'aPaterno' => $request->aPaterno,
            'aMaterno' => $request->aMaterno,
            'telefono' => $request->telefono,
        ]);

        // Emitimos el evento de registro
        event(new Registered($user));

        // Redirigimos al formulario de login con un mensaje de éxito
        return redirect(route('login'))->with('status', 'Tu cuenta ha sido registrada. Por favor, inicia sesión para continuar.');
    }
}