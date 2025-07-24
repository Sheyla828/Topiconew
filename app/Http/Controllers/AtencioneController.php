<?php

namespace App\Http\Controllers;

use App\Models\Atencione;
use App\Models\AtencionMedicamento;
use App\Models\AtencionMateriale;
use App\Models\User;
use App\Models\Paciente;
use App\Models\Medicamento;
use App\Models\Materiale;
use App\Models\Cita;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class AtencioneController extends Controller
{
    public function index()
    {
        $atenciones = Atencione::with(['user', 'paciente', 'medicamentosUsados.medicamento', 'materialesUsados.materiale'])
            ->paginate(100);

        return Inertia::render('Atencion/Index', [
            'atenciones' => $atenciones
        ]);
    }

    public function create()
    {
        return Inertia::render('Atencion/Form', [
            'users' => User::all(),
            'pacientes' => Paciente::all(),
            'medicamentos' => Medicamento::all(),
            'materiales' => Materiale::all(),
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'user_id' => 'required|exists:users,id',
            'paciente_id' => 'required|exists:pacientes,id',
            'valoracion' => 'nullable|string',
            'diagnostico' => 'nullable|string',
            'tratamiento' => 'nullable|string',
            'peso' => 'nullable|numeric',
            'talla' => 'nullable|numeric',
            'IMC' => 'nullable|numeric',
            'frecuenciaCardiaca' => 'nullable|numeric',
            'presionArterial' => 'nullable|string',
            'temperatura' => 'nullable|numeric',
            'saturacionOxigeno' => 'nullable|numeric',
            'frecuenciaRespiratoria' => 'nullable|numeric',
            'medicamentos' => 'nullable|array',
            'medicamentos.*.id' => 'required_with:medicamentos|exists:medicamentos,id',
            'medicamentos.*.cantidad_usada' => 'required_with:medicamentos|numeric|min:1',
            'materiales' => 'nullable|array',
            'materiales.*.id' => 'required_with:materiales|exists:materiales,id',
            'materiales.*.cantidad_usada' => 'required_with:materiales|numeric|min:1',
        ]);

        try {
            DB::transaction(function () use ($data) {
                // Crear la atención
                $atencion = Atencione::create(array_merge($data, [
                    'fecha' => Carbon::now()->toDateString(),
                    'hora' => Carbon::now()->toTimeString(),
                ]));

                // Guardar medicamentos
                if (!empty($data['medicamentos'])) {
                    $this->saveMedicamentos($atencion->id, $data['medicamentos']);
                }

                // Guardar materiales
                if (!empty($data['materiales'])) {
                    $this->saveMateriales($atencion->id, $data['materiales']);
                }

                // Actualizar estado de la cita
                $this->updateCitaEstado($data['paciente_id'], $atencion->fecha);
            });

            return redirect()->route('atencion.index')->with('success', 'Atención registrada con éxito');
        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['error' => 'Error al registrar la atención: ' . $e->getMessage()]);
        }
    }

    protected function saveMedicamentos($atencionId, $medicamentos)
{
    Log::info('Medicamentos a guardar:', $medicamentos); // <-- Agrega esto para depurar
    foreach ($medicamentos as $medicamento) {
        AtencionMedicamento::create([
            'atencione_id' => $atencionId,
            'medicamento_id' => $medicamento['id'],
            'cantidad_usada' => $medicamento['cantidad_usada'],
        ]);
    }
}

    protected function saveMateriales($atencionId, $materiales)
    {
        foreach ($materiales as $material) {
            AtencionMateriale::create([
                'atencione_id' => $atencionId,
                'materiale_id' => $material['id'],
                'cantidad_usada' => $material['cantidad_usada'],
            ]);
        }
    }

    protected function updateCitaEstado($pacienteId, $fecha)
    {
        $cita = Cita::where('paciente_id', $pacienteId)
            ->where('fechacita', $fecha)
            ->first();

        if ($cita) {
            $cita->update(['estado' => 'atendido']);
        }
    }

    public function edit($id)
    {
        $atencion = Atencione::with(['medicamentosUsados.medicamento', 'materialesUsados.materiale'])->findOrFail($id);

        return Inertia::render('Atencion/Form', [
            'atencion' => $atencion,
            'users' => User::all(),
            'pacientes' => Paciente::all(),
            'medicamentos' => Medicamento::all(),
            'materiales' => Materiale::all(),
        ]);
    }

    public function update(Request $request, $id)
    {
        $atencion = Atencione::findOrFail($id);
        $data = $request->validate([
            'user_id' => 'required|integer|exists:users,id',
            'paciente_id' => 'required|integer|exists:pacientes,id',
            'valoracion' => 'nullable|string',
            'diagnostico' => 'nullable|string',
            'tratamiento' => 'nullable|string',
            'peso' => 'required|numeric',
            'talla' => 'required|numeric',
            'IMC' => 'required|numeric',
            'frecuenciaCardiaca' => 'required|numeric',
            'presionArterial' => 'required|string',
            'temperatura' => 'required|numeric',
            'saturacionOxigeno' => 'required|numeric',
            'frecuenciaRespiratoria' => 'required|numeric',
            'medicamentos' => 'array',
            'medicamentos.*.id' => 'integer|exists:medicamentos,id',
            'medicamentos.*.cantidad_usada' => 'numeric|min:1',
            'materiales' => 'array',
            'materiales.*.id' => 'integer|exists:materiales,id',
            'materiales.*.cantidad_usada' => 'numeric|min:1',
        ]);

        DB::transaction(function () use ($atencion, $data, $id) {
            $atencion->update($data);

            AtencionMedicamento::where('atencione_id', $id)->delete();
            if (!empty($data['medicamentos'])) {
                $this->saveMedicamentos($id, $data['medicamentos']);
            }

            AtencionMateriale::where('atencione_id', $id)->delete();
            if (!empty($data['materiales'])) {
                $this->saveMateriales($id, $data['materiales']);
            }
        });

        return redirect()->route('atencion.index')->with('success', 'Atención actualizada correctamente.');
    }

    public function destroy(Atencione $atencion)
    {
        $atencion->delete();
        return redirect()->route('atencion.index')->with('success', 'Atención eliminada correctamente.');
    }

    public function show(Atencione $atencion)
    {
        $atencion->load(['user', 'paciente', 'medicamentosUsados.medicamento', 'materialesUsados.materiale']);
        return Inertia::render('Atencion/Show', ['atencion' => $atencion]);
    }
}
