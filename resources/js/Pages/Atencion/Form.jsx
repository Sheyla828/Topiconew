import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm } from '@inertiajs/react';
import { useState, useEffect } from "react";

export default function AtencionForm({ auth, atencion, pacientes, medicamentos, materiales }) {
  const { data, setData, post, put, processing, errors, reset } = useForm({
    user_id: auth.user.id,
    paciente_id: atencion?.paciente_id || '',
    valoracion: atencion?.valoracion || '',
    diagnostico: atencion?.diagnostico || '',
    tratamiento: atencion?.tratamiento || '',
    peso: atencion?.peso || '',
    talla: atencion?.talla || '',
    IMC: atencion?.IMC || '',
    frecuenciaCardiaca: atencion?.frecuenciaCardiaca || '',
    presionArterial: atencion?.presionArterial || '',
    temperatura: atencion?.temperatura || '',
    saturacionOxigeno: atencion?.saturacionOxigeno || '',
    frecuenciaRespiratoria: atencion?.frecuenciaRespiratoria || '',
    medicamentos: atencion?.medicamentos_usados?.map(item => ({
      id: item.medicamento.id,
      cantidad_usada: item.cantidad_usada
    })) || [],
    materiales: atencion?.materiales_usados?.map(item => ({
      id: item.materiale.id,
      cantidad_usada: item.cantidad_usada
    })) || [],
  });

  const [medicamentoFields, setMedicamentoFields] = useState(data.medicamentos);
  const [materialFields, setMaterialFields] = useState(data.materiales);
  const [dni, setDni] = useState('');
  const [pacienteEncontrado, setPacienteEncontrado] = useState(null);

  useEffect(() => {
    setData('medicamentos', medicamentoFields);
    setData('materiales', materialFields);
  }, [medicamentoFields, materialFields]);

  const handleDniSearch = () => {
    const paciente = pacientes.find(p => p.dni.toString() === dni);
    if (paciente) {
      setPacienteEncontrado(paciente);
      setData('paciente_id', paciente.id);
    } else {
      alert('Paciente no encontrado');
      setPacienteEncontrado(null);
      setData('paciente_id', '');
    }
  };

  const calculateIMC = (peso, talla) => {
    if (peso > 0 && talla > 0) {
      return (peso / ((talla / 100) ** 2)).toFixed(2);
    }
    return '';
  };

  useEffect(() => {
    const imc = calculateIMC(data.peso, data.talla);
    setData('IMC', imc);
  }, [data.peso, data.talla]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (atencion) {
      put(route('atencion.update', atencion.id));
    } else {
      post(route('atencion.store'));
    }
  };

  const addMedicamentoField = () => setMedicamentoFields([...medicamentoFields, { id: '', cantidad_usada: '' }]);
  const addMaterialField = () => setMaterialFields([...materialFields, { id: '', cantidad_usada: '' }]);
  const removeMedicamentoField = (index) => setMedicamentoFields(medicamentoFields.filter((_, i) => i !== index));
  const removeMaterialField = (index) => setMaterialFields(materialFields.filter((_, i) => i !== index));

  const handleMedicamentoChange = (index, field, value) => {
    const updated = [...medicamentoFields];
    updated[index][field] = value;
    setMedicamentoFields(updated);
  };

  const handleMaterialChange = (index, field, value) => {
    const updated = [...materialFields];
    updated[index][field] = value;
    setMaterialFields(updated);
  };

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={<h2 className="font-semibold text-xl text-sky-800 leading-tight">Formulario de Atención</h2>}
    >
      <Head title="Atención" />

      <div className="py-12">
        <div className="max-w-5xl mx-auto bg-white border border-sky-100 shadow sm:rounded-lg p-8">
          <h3 className="text-lg font-bold text-sky-800 mb-6">Datos de la Atención</h3>

          {/* Buscar Paciente */}
          <div className="mb-6">
            <label className="block text-gray-700 mb-2">Buscar Paciente por DNI</label>
            <div className="flex space-x-4">
              <input
                type="text"
                value={dni}
                onChange={(e) => setDni(e.target.value)}
                className="border border-sky-300 rounded px-3 py-2 w-full"
                placeholder="Ingrese el DNI"
              />
              <button
                type="button"
                onClick={handleDniSearch}
                className="px-4 py-2 bg-sky-600 text-white rounded hover:bg-sky-700"
              >
                Buscar
              </button>
            </div>
            {pacienteEncontrado && (
              <div className="mt-4 p-4 bg-sky-50 border border-sky-100 rounded">
                <strong>Paciente:</strong> {pacienteEncontrado.nombre} {pacienteEncontrado.aPaterno} {pacienteEncontrado.aMaterno}
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Datos Clínicos */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                ['Peso (kg)', 'peso'],
                ['Talla (cm)', 'talla'],
                ['IMC', 'IMC', true],
                ['Frecuencia Cardiaca', 'frecuenciaCardiaca'],
                ['Presión Arterial', 'presionArterial'],
                ['Temperatura', 'temperatura'],
                ['Saturación de Oxígeno', 'saturacionOxigeno'],
                ['Frecuencia Respiratoria', 'frecuenciaRespiratoria'],
                ['Valoración', 'valoracion'],
                ['Diagnóstico', 'diagnostico'],
                ['Tratamiento', 'tratamiento']
              ].map(([label, key, readOnly]) => (
                <div key={key}>
                  <label className="block text-gray-700 mb-1">{label}</label>
                  <input
                    type="text"
                    value={data[key]}
                    readOnly={readOnly}
                    onChange={(e) => setData(key, e.target.value)}
                    className={`w-full border border-sky-300 rounded px-3 py-2 ${readOnly ? 'bg-gray-100' : ''}`}
                  />
                </div>
              ))}
            </div>

            {/* Medicamentos */}
            <div>
              <label className="block text-gray-700 mb-2">Medicamentos</label>
              {medicamentoFields.map((med, i) => (
                <div key={i} className="flex gap-2 mb-2">
                  <select
                    value={med.id}
                    onChange={(e) => handleMedicamentoChange(i, 'id', e.target.value)}
                    className="flex-1 border border-sky-300 rounded px-3 py-2"
                  >
                    <option value="">Seleccionar medicamento</option>
                    {medicamentos.map(m => (
                      <option key={m.id} value={m.id}>{m.nombre}</option>
                    ))}
                  </select>
                  <input
                    type="number"
                    value={med.cantidad_usada}
                    onChange={(e) => handleMedicamentoChange(i, 'cantidad_usada', e.target.value)}
                    className="w-28 border border-sky-300 rounded px-3 py-2"
                    placeholder="Cantidad"
                  />
                  <button
                    type="button"
                    onClick={() => removeMedicamentoField(i)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Eliminar
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addMedicamentoField}
                className="px-4 py-2 bg-sky-600 text-white rounded hover:bg-sky-700 mt-2"
              >
                ➕ Agregar medicamento
              </button>
            </div>

            {/* Materiales */}
            <div>
              <label className="block text-gray-700 mb-2">Materiales</label>
              {materialFields.map((mat, i) => (
                <div key={i} className="flex gap-2 mb-2">
                  <select
                    value={mat.id}
                    onChange={(e) => handleMaterialChange(i, 'id', e.target.value)}
                    className="flex-1 border border-sky-300 rounded px-3 py-2"
                  >
                    <option value="">Seleccionar material</option>
                    {materiales.map(m => (
                      <option key={m.id} value={m.id}>{m.nombre}</option>
                    ))}
                  </select>
                  <input
                    type="number"
                    value={mat.cantidad_usada}
                    onChange={(e) => handleMaterialChange(i, 'cantidad_usada', e.target.value)}
                    className="w-28 border border-sky-300 rounded px-3 py-2"
                    placeholder="Cantidad"
                  />
                  <button
                    type="button"
                    onClick={() => removeMaterialField(i)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Eliminar
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addMaterialField}
                className="px-4 py-2 bg-sky-600 text-white rounded hover:bg-sky-700 mt-2"
              >
                ➕ Agregar material
              </button>
            </div>

            {/* Submit */}
            <div className="text-right">
              <button
                type="submit"
                disabled={processing}
                className="px-6 py-2 bg-sky-600 text-white rounded hover:bg-sky-700"
              >
                {processing ? 'Guardando...' : (atencion ? 'Actualizar Atención' : 'Crear Atención')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
