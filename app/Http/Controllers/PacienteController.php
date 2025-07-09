<?php
namespace App\Http\Controllers;

use App\Models\Paciente;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PacienteController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $pacientes = Paciente::all(); 
        return Inertia::render("Paciente/Index", ['pacientes' => $pacientes]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Paciente/Form');
        
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
{
    $data = $request->validate([
        'nombre' => 'required|string|max:255',
        'aPaterno' => 'required|string|max:255',
        'aMaterno' => 'required|string|max:255',
        'sexo' => 'required|string',
        'fechaNacimiento' => 'required|date',
'edad' => 'required|numeric|min:15|max:100',
'dni' => 'required|digits:8|unique:pacientes,dni',  
        'ocupacion' => 'required|string|max:255',
        'alergias' => 'nullable|string|max:255', 
        'programaEducativo' => 'nullable|string|max:255',
        'semestre' => 'nullable|string|max:255',
        'telefono' => 'nullable|digits:9',
        'parentesco' => 'nullable|string|max:255', 
        'telefonoEmergencia' => 'nullable|digits:9', 
    ]);

    Paciente::create($data);
    return redirect(route('paciente.index'))->with('success', 'Paciente agregado correctamente');
}


    /**
     * Display the specified resource.
     */
    /**
 * Display the specified resource.
 */
public function show(Paciente $paciente)
{
    // Renderiza la vista 'Paciente/Show' pasando los detalles del paciente
    return Inertia::render('Paciente/Show', [
        'paciente' => $paciente
    ]);
}



    /**
     * Show the form for editing the specified resource.
     */
    public function edit($id)
    {
        $paciente = Paciente::findOrFail($id);
    return Inertia::render('Paciente/Form', ['paciente' => $paciente]);
    }

    

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Paciente $paciente)
    {
        $data = $request->validate([
        'nombre' => 'required|string|max:255',
        'aPaterno' => 'required|string|max:255',
        'aMaterno' => 'required|string|max:255',
        'sexo' => 'required|string',
        'fechaNacimiento' => 'required|date',
'edad' => 'required|numeric|min:15|max:100',
'dni' => 'required|digits:8|unique:pacientes,dni', 
        'ocupacion' => 'required|string|max:255',
        'alergias' => 'nullable|string|max:255', 
        'programaEducativo' => 'nullable|string|max:255',
        'semestre' => 'nullable|string|max:255',
        'telefono' => 'nullable|digits:9',
        'parentesco' => 'nullable|string|max:255', 
        'telefonoEmergencia' => 'nullable|digits:9', 
        ]);

        $paciente->update($data);

        return redirect()->route('paciente.index')->with('success', 'Paciente actualizado correctamente');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Paciente $paciente)
    {
        $paciente->delete();
        return redirect()->route('paciente.index')->with('success', 'Paciente eliminado correctamente');
    }
    
    public function report(Request $request)
{
    $ocupaciones = Paciente::select(DB::raw('ocupacion, count(*) as total'))
                           ->groupBy('ocupacion')
                           ->get();

    $programas = Paciente::select(DB::raw('programaEducativo, count(*) as total'))
                         ->groupBy('programaEducativo')
                         ->get();

    $pacientes = Paciente::select(
        'id',
        'nombre',
        'aPaterno',
        'aMaterno',
        'sexo',
        'fechaNacimiento',
        DB::raw("TIMESTAMPDIFF(YEAR, fechaNacimiento, CURDATE()) as edad"), // Calcular edad
        'dni',
        'ocupacion',
        'alergias',
        'programaEducativo',
        'semestre',
        'telefono',
        'parentesco',
        'telefonoEmergencia'
    )->get();

    return inertia('Paciente/Report', [
        'ocupaciones' => $ocupaciones,
        'programas' => $programas,
        'pacientes' => $pacientes, // Agregamos los pacientes a la respuesta
    ]);
    }
    



    
}


