<?php

namespace App\Http\Controllers;

use App\Models\Medicamento;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MedicamentoController extends Controller
{
    /**
     * Mostrar la lista de medicamentos.
     */
    public function index()
{
    $medicamentos = Medicamento::selectRaw(
        'MIN(id) as id, nombre, SUM(cantidad) as cantidad, 
        MAX(fechaingreso) as fechaingreso, 
        MAX(fechavencimiento) as fechavencimiento'
    )
    ->groupBy('nombre')
    ->paginate(10);

    return Inertia::render("Medicamento/Index", [
        'medicamentos' => $medicamentos
    ]);
}



    /**
     * Mostrar el formulario para crear un nuevo medicamento.
     */
    public function create()
    {
        return Inertia::render('Medicamento/Form');
    }

    /**
     * Almacenar un nuevo medicamento en la base de datos.
     */
    public function store(Request $request)
{
    $data = $request->validate([
        'nombre' => 'required|string|max:255',
        'cantidad' => 'required|integer|min:0',
        'fechaingreso' => 'required|date',
        'fechavencimiento' => 'required|date',
    ]);

    // Cada ingreso es un nuevo registro
    Medicamento::create($data);

    return redirect(route('medicamento.index'))
        ->with('success', 'Medicamento registrado correctamente.');
}


    /**
     * Mostrar el formulario para editar un medicamento existente.
     */
    public function edit($id)
    {
        $medicamento = Medicamento::findOrFail($id);
        return Inertia::render('Medicamento/Form', [
            'medicamento' => $medicamento
        ]);
    }

    /**
     * Actualizar un medicamento en la base de datos.
     */
    public function update(Request $request, $id)
    {
        $medicamento = Medicamento::findOrFail($id);

        $data = $request->validate([
            'nombre' => 'required|string|max:255',
            'cantidad' => 'required|integer|min:0',
            'fechaingreso' => 'required|date',
            'fechavencimiento' => 'required|date',
            
        ]);

        $medicamento->update($data);

        return redirect(route('medicamento.index'))
            ->with('success', 'Medicamento actualizado correctamente.');
    }

    /**
     * Eliminar un medicamento del inventario.
     */
    public function destroy($id)
    {
        Medicamento::findOrFail($id)->delete();

        return redirect(route('medicamento.index'))
            ->with('success', 'Medicamento eliminado correctamente.');
    }
    public function show($id)
{
    $medicamento = Medicamento::findOrFail($id);

    // Traer TODOS los registros con el mismo nombre (sin agrupar)
    $medicamentos = Medicamento::whereRaw('LOWER(nombre) = ?', [strtolower($medicamento->nombre)])
        ->orderBy('fechaingreso', 'desc')
        ->get();

    return Inertia::render('Medicamento/Show', [
        'nombre' => $medicamento->nombre,
        'medicamentos' => $medicamentos,
    ]);
}


}
