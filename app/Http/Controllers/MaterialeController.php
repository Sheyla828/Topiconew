<?php

namespace App\Http\Controllers;

use App\Models\Materiale;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MaterialeController extends Controller
{
    /**
     * Mostrar la lista de materiales (agrupando por nombre).
     */
    public function index()
    {
        $materiales = Materiale::selectRaw(
            'MIN(id) as id, nombre, SUM(cantidad) as cantidad, 
            MAX(fechaingreso) as fechaingreso, 
            MAX(fechavencimiento) as fechavencimiento'
        )
        ->groupBy('nombre')
        ->paginate(10);

        return Inertia::render("Material/Index", [
            'materiales' => $materiales
        ]);
    }

    /**
     * Mostrar el formulario para crear un nuevo material.
     */
    public function create()
    {
        return Inertia::render('Material/Form');
    }

    /**
     * Almacenar un nuevo material en la base de datos.
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
        Materiale::create($data);

        return redirect(route('material.index'))
            ->with('success', 'Material registrado correctamente.');
    }

    /**
     * Mostrar el formulario para editar un material existente.
     */
    public function edit($id)
    {
        $materiale = Materiale::findOrFail($id);
        return Inertia::render('Material/Form', [
            'materiale' => $materiale
        ]);
    }

    /**
     * Actualizar un material en la base de datos.
     */
    public function update(Request $request, $id)
    {
        $materiale = Materiale::findOrFail($id);

        $data = $request->validate([
            'nombre' => 'required|string|max:255',
            'cantidad' => 'required|integer|min:0',
            'fechaingreso' => 'required|date',
            'fechavencimiento' => 'required|date',
        ]);

        $materiale->update($data);

        return redirect(route('material.index'))
            ->with('success', 'Material actualizado correctamente.');
    }

    /**
     * Eliminar un material del inventario.
     */
    public function destroy($id)
    {
        Materiale::findOrFail($id)->delete();

        return redirect(route('material.index'))
            ->with('success', 'Material eliminado correctamente.');
    }

    /**
     * Mostrar el detalle de todos los registros de un mismo material.
     */
    public function show($id)
    {
        $material = Materiale::findOrFail($id);

        // Traer todos los registros con el mismo nombre (sin agrupar)
        $materiales = Materiale::whereRaw('LOWER(nombre) = ?', [strtolower($material->nombre)])
            ->orderBy('fechaingreso', 'desc')
            ->get();

        return Inertia::render('Material/Show', [
            'nombre' => $material->nombre,
            'materiales' => $materiales,
        ]);
    }
}
