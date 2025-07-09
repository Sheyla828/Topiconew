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
        $medicamentos = Medicamento::paginate(10);
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
        'unidadmedida' => 'required|string|max:50',
        'fechavencimiento' => 'required|date',
    ]);

    // Buscar si ya existe un medicamento con el mismo nombre (sin importar mayúsculas/minúsculas)
    $medicamentoExistente = Medicamento::whereRaw('LOWER(nombre) = ?', [strtolower($data['nombre'])])->first();

    if ($medicamentoExistente) {
        // Acumular la cantidad existente con la nueva cantidad
        $medicamentoExistente->cantidad += $data['cantidad'];
        $medicamentoExistente->save();
    } else {
        // Crear un nuevo medicamento si no existe
        Medicamento::create($data);
    }

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
            'unidadmedida' => 'required|string|max:50',
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
}
