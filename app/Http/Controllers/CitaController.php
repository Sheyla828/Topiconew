<?php
namespace App\Http\Controllers;

use App\Models\Cita;
use App\Models\User;
use App\Models\Paciente;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CitaController extends Controller
{
    public function index()
    {
        $citas = Cita::with(['user', 'paciente'])->paginate(10);

        return Inertia::render('Cita/Index', [
            'citas' => $citas
        ]);
    }

    public function create()
    {
        $users = User::all();
        $pacientes = Paciente::all();

        return Inertia::render("Cita/Form", [
            'users' => $users,
            'pacientes' => $pacientes,
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'user_id' => 'required|integer|exists:users,id',
            'paciente_id' => 'required|integer|exists:pacientes,id',
            'motivo' => 'required|string|max:255',
            'fechacita' => 'required|date|after_or_equal:today',
            'horacita' => 'required|date_format:H:i',
            'estado' => 'required|string|max:50', 
        ]);

        // Verificar si ya existe una cita en la misma fecha y hora o dentro de 30 minutos
        $fechaHora = $data['fechacita'] . ' ' . $data['horacita'];
        $citaExistente = Cita::where('fechacita', $data['fechacita'])
            ->whereBetween('horacita', [date('H:i', strtotime($data['horacita'])), date('H:i', strtotime($data['horacita']) + 1800)])
            ->exists();

        if ($citaExistente) {
            return redirect()->back()->withErrors(['horacita' => 'Ya existe una cita en este horario.'])->withInput();
        }

        Cita::create($data);

        return redirect()->route('cita.index')->with('success', 'Cita creada con éxito.');
    }

    public function edit($id)
{
    $cita = Cita::findOrFail($id);

    // Verificar si la cita está cancelada
    if ($cita->estado === 'canceled') {
        return redirect()->route('cita.index')->withErrors(['cita' => 'No se puede editar una cita cancelada.']);
    }

    $users = User::all();
    $pacientes = Paciente::all();

    return Inertia::render("Cita/Form", [
        'cita' => $cita,
        'users' => $users,
        'pacientes' => $pacientes,
    ]);
}


public function update(Request $request, $id)
{
    $cita = Cita::findOrFail($id);

    if ($cita->estado === 'canceled') {
        return redirect()->route('cita.index')->withErrors(['cita' => 'No se puede editar una cita cancelada.']);
    }

    $data = $request->validate([
        'user_id' => 'required|integer|exists:users,id',
        'paciente_id' => 'required|integer|exists:pacientes,id',
        'motivo' => 'required|string|max:255',
        'fechacita' => 'required|date|after_or_equal:today',
        'horacita' => 'required|date_format:H:i',
        'estado' => 'required|string|max:50', 
    ]);

    $cita->update($data);

    return redirect(route('cita.index'))
        ->with('success', 'Cita actualizada correctamente.');
}

    

    
    

    public function destroy(Cita $cita)
    {
        $cita->delete();
        return redirect()->route('cita.index')->with('success', 'Cita eliminada con éxito.');
    }
    
}

