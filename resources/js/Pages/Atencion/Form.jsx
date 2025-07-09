import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm } from '@inertiajs/react';
import { useState, useEffect } from "react";

export default function AtencionForm({ auth, atencion, users, pacientes, medicamentos, materiales }) {
    const { data, setData, post, put, processing, errors, reset } = useForm({
        user_id: atencion?.user_id || '',
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
        const invalidMedicamentos = medicamentoFields.some(med => !med.id || med.cantidad_usada <= 0);
        const invalidMateriales = materialFields.some(mater => !mater.id || mater.cantidad_usada <= 0);

        if (invalidMedicamentos || invalidMateriales) {
            alert("Por favor, complete todos los campos de medicamentos y materiales.");
            return;
        }

        if (atencion) {
            put(route('atencion.update', atencion.id), {
                onSuccess: () => window.location.href = route('atencion.index'),
                onError: (errors) => console.error("Error al actualizar:", errors)
            });
        } else {
            post(route('atencion.store'), {
                onSuccess: () => window.location.href = route('atencion.index'),
                onError: (errors) => console.error("Error al crear:", errors),
                onFinish: () => reset()
            });
        }
    };

    const handleMedicamentoChange = (index, field, value) => {
        const updatedMedicamentos = [...medicamentoFields];
        updatedMedicamentos[index][field] = value;
        setMedicamentoFields(updatedMedicamentos);
    };

    const handleMaterialChange = (index, field, value) => {
        const updatedMateriales = [...materialFields];
        updatedMateriales[index][field] = value;
        setMaterialFields(updatedMateriales);
    };

    const addMedicamentoField = () => {
        setMedicamentoFields([...medicamentoFields, { id: '', cantidad_usada: '' }]);
    };

    const removeMedicamentoField = (index) => {
        const updatedMedicamentos = medicamentoFields.filter((_, i) => i !== index);
        setMedicamentoFields(updatedMedicamentos);
    };

    const addMaterialField = () => {
        setMaterialFields([...materialFields, { id: '', cantidad_usada: '' }]);
    };

    const removeMaterialField = (index) => {
        const updatedMateriales = materialFields.filter((_, i) => i !== index);
        setMaterialFields(updatedMateriales);
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Agregar/Modificar Atención</h2>}
        >
            <Head title="Atención" />

            <div className="py-12 flex justify-center">
                <form onSubmit={handleSubmit} className="w-full max-w-4xl space-y-6">
                    {/* Campo para buscar por DNI del paciente */}
                    <div className="mb-4">
                        <label htmlFor="dni" className="block text-sm font-medium text-gray-700">
                            Buscar Paciente por DNI
                        </label>
                        <div className="flex items-center">
                            <input
                                type="text"
                                value={dni}
                                onChange={(e) => setDni(e.target.value)}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                placeholder="Ingrese el DNI"
                            />
                            <button type="button" onClick={handleDniSearch} className="ml-4 bg-blue-500 text-white px-4 py-2 rounded">
                                Verificar
                            </button>
                        </div>
                    </div>

                    {/* Mostrar nombre completo del paciente encontrado */}
                    {pacienteEncontrado && (
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Paciente Encontrado</label>
                            <p>{pacienteEncontrado.nombre} {pacienteEncontrado.aPaterno} {pacienteEncontrado.aMaterno}</p>
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Enfermera */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Enfermera</label>
                            <select
                                value={data.user_id}
                                onChange={(e) => setData('user_id', e.target.value)}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                required
                            >
                                <option value="">Seleccionar enfermera</option>
                                {users.map(user => (
                                    <option key={user.id} value={user.id}>{user.name}</option>
                                ))}
                            </select>
                            {errors.user_id && <div className="text-sm text-red-600">{errors.user_id}</div>}
                        </div>

                        {/* Paciente */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Paciente</label>
                            <select
                                value={data.paciente_id}
                                onChange={(e) => setData('paciente_id', e.target.value)}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                required
                            >
                                <option value="">Seleccionar paciente</option>
                                {pacientes.map(paciente => (
                                    <option key={paciente.id} value={paciente.id}>{paciente.nombre}</option>
                                ))}
                            </select>
                            {errors.paciente_id && <div className="text-sm text-red-600">{errors.paciente_id}</div>}
                        </div>

                        {/* Peso */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Peso (kg)</label>
                            <input
                                type="number"
                                value={data.peso}
                                onChange={(e) => setData('peso', e.target.value)}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                required
                            />
                            {errors.peso && <div className="text-sm text-red-600">{errors.peso}</div>}
                        </div>

                        {/* Talla */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Talla (cm)</label>
                            <input
                                type="number"
                                value={data.talla}
                                onChange={(e) => setData('talla', e.target.value)}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                required
                            />
                            {errors.talla && <div className="text-sm text-red-600">{errors.talla}</div>}
                        </div>

                        {/* IMC */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">IMC</label>
                            <input
                                type="text"
                                value={data.IMC}
                                readOnly
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                            />
                        </div>

                        {/* Frecuencia Cardiaca */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Frecuencia Cardiaca</label>
                            <input
                                type="number"
                                value={data.frecuenciaCardiaca}
                                onChange={(e) => setData('frecuenciaCardiaca', e.target.value)}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                required
                            />
                            {errors.frecuenciaCardiaca && <div className="text-sm text-red-600">{errors.frecuenciaCardiaca}</div>}
                        </div>

                        {/* Presión Arterial */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Presión Arterial</label>
                            <input
                                type="text"
                                value={data.presionArterial}
                                onChange={(e) => setData('presionArterial', e.target.value)}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                required
                            />
                            {errors.presionArterial && <div className="text-sm text-red-600">{errors.presionArterial}</div>}
                        </div>

                        {/* Temperatura */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Temperatura</label>
                            <input
                                type="text"
                                value={data.temperatura}
                                onChange={(e) => setData('temperatura', e.target.value)}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                required
                            />
                            {errors.temperatura && <div className="text-sm text-red-600">{errors.temperatura}</div>}
                        </div>

                        {/* Saturación de Oxígeno */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Saturación de Oxígeno</label>
                            <input
                                type="text"
                                value={data.saturacionOxigeno}
                                onChange={(e) => setData('saturacionOxigeno', e.target.value)}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                required
                            />
                            {errors.saturacionOxigeno && <div className="text-sm text-red-600">{errors.saturacionOxigeno}</div>}
                        </div>

                        {/* Frecuencia Respiratoria */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Frecuencia Respiratoria</label>
                            <input
                                type="text"
                                value={data.frecuenciaRespiratoria}
                                onChange={(e) => setData('frecuenciaRespiratoria', e.target.value)}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                required
                            />
                            {errors.frecuenciaRespiratoria && <div className="text-sm text-red-600">{errors.frecuenciaRespiratoria}</div>}
                        </div>

                        {/* Valoración */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Valoración</label>
                            <input
                                type="text"
                                value={data.valoracion}
                                onChange={(e) => setData('valoracion', e.target.value)}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                            />
                            {errors.valoracion && <div className="text-sm text-red-600">{errors.valoracion}</div>}
                        </div>

                        {/* Diagnóstico */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Diagnóstico</label>
                            <input
                                type="text"
                                value={data.diagnostico}
                                onChange={(e) => setData('diagnostico', e.target.value)}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                            />
                            {errors.diagnostico && <div className="text-sm text-red-600">{errors.diagnostico}</div>}
                        </div>

                        {/* Tratamiento */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Tratamiento</label>
                            <input
                                type="text"
                                value={data.tratamiento}
                                onChange={(e) => setData('tratamiento', e.target.value)}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                            />
                            {errors.tratamiento && <div className="text-sm text-red-600">{errors.tratamiento}</div>}
                        </div>
                    </div>

                    {/* Medicamentos */}
                    <div className="mt-6">
                        <label className="block text-sm font-medium text-gray-700">Medicamentos</label>
                        {medicamentoFields.map((medicamento, index) => (
                            <div key={index} className="flex space-x-2 mb-2">
                                <select
                                    value={medicamento.id}
                                    onChange={(e) => handleMedicamentoChange(index, 'id', e.target.value)}
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                >
                                    <option value="">Seleccionar medicamento</option>
                                    {medicamentos.map(med => (
                                        <option key={med.id} value={med.id}>{med.nombre}</option>
                                    ))}
                                </select>
                                <input
                                    type="number"
                                    value={medicamento.cantidad_usada}
                                    onChange={(e) => handleMedicamentoChange(index, 'cantidad_usada', e.target.value)}
                                    placeholder="Cantidad usada"
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                />
                                <button
                                    type="button"
                                    onClick={() => removeMedicamentoField(index)}
                                    className="mt-1 px-3 py-1 text-sm text-red-600 hover:text-red-800"
                                >
                                    Eliminar
                                </button>
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={addMedicamentoField}
                            className="mt-2 px-4 py-2 text-sm bg-blue-600 text-white rounded-md"
                        >
                            Agregar medicamento
                        </button>
                    </div>

                    {/* Materiales */}
                    <div className="mt-6">
                        <label className="block text-sm font-medium text-gray-700">Materiales</label>
                        {materialFields.map((material, index) => (
                            <div key={index} className="flex space-x-2 mb-2">
                                <select
                                    value={material.id}
                                    onChange={(e) => handleMaterialChange(index, 'id', e.target.value)}
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                >
                                    <option value="">Seleccionar material</option>
                                    {materiales.map(mat => (
                                        <option key={mat.id} value={mat.id}>{mat.nombre}</option>
                                    ))}
                                </select>
                                <input
                                    type="number"
                                    value={material.cantidad_usada}
                                    onChange={(e) => handleMaterialChange(index, 'cantidad_usada', e.target.value)}
                                    placeholder="Cantidad usada"
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                />
                                <button
                                    type="button"
                                    onClick={() => removeMaterialField(index)}
                                    className="mt-1 px-3 py-1 text-sm text-red-600 hover:text-red-800"
                                >
                                    Eliminar
                                </button>
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={addMaterialField}
                            className="mt-2 px-4 py-2 text-sm bg-blue-600 text-white rounded-md"
                        >
                            Agregar material
                        </button>
                    </div>

                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={processing}
                            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-700"
                        >
                            {processing ? 'Guardando...' : (atencion ? 'Actualizar Atención' : 'Crear Atención')}
                        </button>
                    </div>|
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
