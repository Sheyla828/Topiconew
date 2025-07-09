import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function CitaForm({ auth, cita, pacientes, users }) {
    const { data, setData, post, put, processing, errors } = useForm({
        paciente_id: cita?.paciente_id || '',
        user_id: cita?.user_id || '',
        motivo: cita?.motivo || '',
        fechacita: cita?.fechacita || '',
        horacita: cita?.horacita || '',
        estado: cita ? cita.estado : 'pending',
    });

    const [dni, setDni] = useState('');
    const [pacienteEncontrado, setPacienteEncontrado] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setData(name, value);
    };

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

    const handleSubmit = (e) => {
        e.preventDefault();
        const routeName = cita ? 'cita.update' : 'cita.store';
        const routeId = cita ? cita.id : null;
        const action = cita ? put : post;

        action(route(routeName, routeId), { data });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">{cita ? 'Modificar Cita' : 'Crear Cita'}</h2>}
        >
            <Head title={cita ? 'Modificar Cita' : 'Crear Cita'} />

            <div className="py-12">
                <div className="max-w-4xl mx-auto">
                    <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-lg p-8">
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

                        {/* Mostrar nombre completo del paciente */}
                        {pacienteEncontrado && (
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Paciente Encontrado</label>
                                <p>{pacienteEncontrado.nombre} {pacienteEncontrado.aPaterno} {pacienteEncontrado.aMaterno}</p>
                            </div>
                        )}

                        <div className="mb-4">
                            <label htmlFor="user_id" className="block text-sm font-medium text-gray-700">
                                Enfermera
                            </label>
                            <select
                                name="user_id"
                                id="user_id"
                                value={data.user_id}
                                onChange={handleChange}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                required
                            >
                                <option value="">Seleccionar Enfermera</option>
                                {users.map((user) => (
                                    <option key={user.id} value={user.id}>
                                        {user.name}
                                    </option>
                                ))}
                            </select>
                            {errors.user_id && <div className="text-red-500 text-xs">{errors.user_id}</div>}
                        </div>

                        <div className="mb-4">
                            <label htmlFor="motivo" className="block text-sm font-medium text-gray-700">
                                Motivo
                            </label>
                            <input
                                type="text"
                                name="motivo"
                                id="motivo"
                                value={data.motivo}
                                onChange={handleChange}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                placeholder="Motivo de la cita"
                                required
                            />
                            {errors.motivo && <div className="text-red-500 text-xs">{errors.motivo}</div>}
                        </div>

                        <div className="mb-4 flex space-x-4">
                            <div className="w-1/2">
                                <label htmlFor="fechacita" className="block text-sm font-medium text-gray-700">
                                    Fecha
                                </label>
                                <input
                                    type="date"
                                    name="fechacita"
                                    id="fechacita"
                                    value={data.fechacita}
                                    onChange={handleChange}
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                    required
                                />
                                {errors.fechacita && <div className="text-red-500 text-xs">{errors.fechacita}</div>}
                            </div>

                            <div className="w-1/2">
                                <label htmlFor="horacita" className="block text-sm font-medium text-gray-700">
                                    Hora
                                </label>
                                <input
                                    type="time"
                                    name="horacita"
                                    id="horacita"
                                    value={data.horacita}
                                    onChange={handleChange}
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                    required
                                />
                                {errors.horacita && <div className="text-red-500 text-xs">{errors.horacita}</div>}
                            </div>
                            <div className="mb-4">
                            <label htmlFor="estado" className="block text-sm font-medium text-gray-700">
                                Estado
                            </label>
                            <select
                                name="estado"
                                id="estado"
                                value={data.estado}
                                onChange={handleChange}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                required
                            >
                                <option value="pending">Pendiente</option>
                                <option value="canceled">Cancelada</option>
                                <option value="attended">Atendida</option>
                            </select>
                            {errors.estado && <div className="text-red-500 text-xs">{errors.estado}</div>}
                        </div>
                        </div>

                        <div className="flex justify-end">
                            <button
                                type="submit"
                                disabled={processing}
                                className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-700"
                            >
                                {processing ? 'Guardando...' : (cita ? 'Actualizar Cita' : 'Crear Cita')}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
