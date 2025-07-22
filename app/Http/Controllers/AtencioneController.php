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

class AtencioneController extends Controller
{
    public function index()
    {
        $atenciones = Atencione::with(['user', 'paciente', 'medicamentosUsados.medicamento'])->paginate(100);

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
            'medicamentos.*.id' => 'required|exists:medicamentos,id',
            'medicamentos.*.cantidad_usada' => 'required|numeric',
            'materiales' => 'nullable|array',
            'materiales.*.id' => 'exists:materiales,id',
            'materiales.*.cantidad_usada' => 'required|numeric',
        ]);

        try {
            DB::transaction(function () use ($data) {
                 $atencion = Atencione::create(array_merge($data, [
                    'fecha' => Carbon::now()->format('Y-m-d'),
                    'hora' => Carbon::now()->format('H:i:s'),
                ]));
    
                 $this->saveMedicamentos($atencion->id, $data['medicamentos']);
    
                 $this->saveMateriales($atencion->id, $data['materiales']);
                 $this->updateCitaEstado($data['paciente_id'], $atencion->fecha, $atencion->hora);
            });

            return redirect()->route('atencion.index')->with('success', 'Atención registrada con éxito');
        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['error' => 'Error al registrar la atención: ' . $e->getMessage()]);
        }
    }

    protected function saveMedicamentos($atencionId, $medicamentos)
{
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


    protected function updateCitaEstado($pacienteId, $fecha, $hora)
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
        return Inertia::render('Atencion/Form', [
            'atencion' => Atencione::with(['medicamentosUsados', 'materiales'])->findOrFail($id),
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
            'peso' => 'required|string',
            'talla' => 'required|string',
            'IMC' => 'required|string',
            'frecuenciaCardiaca' => 'required|string',
            'presionArterial' => 'required|string',
            'temperatura' => 'required|string',
            'saturacionOxigeno' => 'required|string',
            'frecuenciaRespiratoria' => 'required|string',
            'medicamentos' => 'array',
            'medicamentos.*.id' => 'integer|exists:medicamentos,id',
            'medicamentos.*.cantidad_usada' => 'numeric|min:1',
            'materiales' => 'array',
            'materiales.*.id' => 'integer|exists:materiales,id',
            'materiales.*.cantidad_usada' => 'numeric|min:1',
        ]);

        $atencion->update($data);

        DB::transaction(function () use ($id, $request) {
            AtencionMedicamento::where('atencione_id', $id)->delete();
            if ($request->has('medicamentos')) {
                $this->saveMedicamentos($id, $request->medicamentos);
            }

            AtencionMateriale::where('atencione_id', $id)->delete();
            if ($request->has('materiales')) {
                $this->saveMateriales($id, $request->materiales);
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
        $atencion->load(['user', 'paciente', 'medicamentosUsados.medicamento']);

        return Inertia::render('Atencion/Show', [
            'atencion' => $atencion
        ]);
    }

    
}
