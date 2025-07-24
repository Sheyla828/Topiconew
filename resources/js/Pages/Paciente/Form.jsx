import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm } from '@inertiajs/react';
import { useState, useEffect } from 'react';

export default function FormularioPaciente({ auth, paciente }) {
    const { data, setData, post, put, processing, errors } = useForm({
        nombre: paciente?.nombre || '',
        aPaterno: paciente?.aPaterno || '',
        aMaterno: paciente?.aMaterno || '',
        sexo: paciente?.sexo || '',
        fechaNacimiento: paciente?.fechaNacimiento || '',
        edad: paciente?.edad || '',
        dni: paciente?.dni || '',
        ocupacion: paciente?.ocupacion || '',
        alergias: paciente?.alergias || '',
        programaEducativo: paciente?.programaEducativo || '',
        semestre: paciente?.semestre || '',
        telefono: paciente?.telefono || '', // 👉 Teléfono del paciente
        parentesco: paciente?.parentesco || '', // 👉 Parentesco del contacto
        detalleParentesco: paciente?.detalleParentesco || '',
        telefonoEmergencia: paciente?.telefonoEmergencia || '', // 👉 Teléfono del contacto
    });

    const [showSemestrePrograma, setShowSemestrePrograma] = useState(data.ocupacion === 'Estudiante');
    const [showParentescoOtro, setShowParentescoOtro] = useState(data.parentesco === 'Otro');

    useEffect(() => {
        setShowSemestrePrograma(data.ocupacion === 'Estudiante');
    }, [data.ocupacion]);

    useEffect(() => {
        setShowParentescoOtro(data.parentesco === 'Otro');
    }, [data.parentesco]);

    useEffect(() => {
        if (data.fechaNacimiento) {
            const birthDate = new Date(data.fechaNacimiento);
            const today = new Date();
            let age = today.getFullYear() - birthDate.getFullYear();
            if (
                today.getMonth() < birthDate.getMonth() ||
                (today.getMonth() === birthDate.getMonth() && today.getDate() < birthDate.getDate())
            ) {
                age--;
            }
            setData('edad', age.toString());
            if (age < 16) {
                alert("El paciente debe ser mayor de 16 años.");
                setData('fechaNacimiento', '');
                setData('edad', '');
            }
        }
    }, [data.fechaNacimiento]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const finalData = { ...data };

        if (paciente) {
            put(route('paciente.update', paciente.id), {
                data: finalData,
                onSuccess: () => alert("Paciente actualizado exitosamente!"),
                onError: () => alert("Hubo un error al actualizar el paciente."),
            });
        } else {
            post(route('paciente.store'), {
                data: finalData,
                onSuccess: () => alert("Paciente registrado exitosamente!"),
                onError: () => alert("Hubo un error al registrar el paciente."),
            });
        }
    };

    const programas = [
        "Desarrollo de Sistema de Información",
        "Enfermería Técnica",
        "Electricidad Industrial",
        "Electrónica Industrial",
        "Mecánica de Producción Industrial",
        "Mecatrónica Automotriz",
        "Laboratorio Clínico y Anatomía Patológica",
        "Guía Oficial de Turismo",
        "Administración de Servicios de Hostelería y Restaurantes",
        "Contabilidad"
    ];

    const semestres = [1, 2, 3, 4, 5, 6];
    const parentescos = ["Hermano(a)", "Padre", "Madre", "Tío(a)", "Otro"];

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">
                {paciente ? "Editar Paciente" : "Registrar Paciente"}
            </h2>}
        >
            <Head title="Paciente" />

            <div className="py-12 flex justify-center">
                <form
                    onSubmit={handleSubmit}
                    className="w-full max-w-4xl bg-white p-8 rounded-lg shadow-md space-y-8"
                >
                    {/* 📌 SECCIÓN: Datos del Paciente */}
                    <fieldset className="border border-gray-300 rounded-md p-6">
                        <legend className="text-base font-semibold text-gray-700 px-2">Datos del Paciente</legend>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Nombre</label>
                                <input
                                    type="text"
                                    value={data.nombre}
                                    onChange={(e) => setData('nombre', e.target.value)}
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Apellido Paterno</label>
                                <input
                                    type="text"
                                    value={data.aPaterno}
                                    onChange={(e) => setData('aPaterno', e.target.value)}
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Apellido Materno</label>
                                <input
                                    type="text"
                                    value={data.aMaterno}
                                    onChange={(e) => setData('aMaterno', e.target.value)}
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Sexo</label>
                                <select
                                    value={data.sexo}
                                    onChange={(e) => setData('sexo', e.target.value)}
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                    required
                                >
                                    <option value="">Seleccione...</option>
                                    <option value="M">Masculino</option>
                                    <option value="F">Femenino</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Fecha de Nacimiento</label>
                                <input
                                    type="date"
                                    value={data.fechaNacimiento}
                                    onChange={(e) => setData('fechaNacimiento', e.target.value)}
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Edad</label>
                                <input
                                    type="text"
                                    value={data.edad}
                                    readOnly
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm bg-gray-100"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">DNI</label>
                                <input
                                    type="text"
                                    value={data.dni}
                                    onChange={(e) => setData('dni', e.target.value)}
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Ocupación</label>
                                <select
                                    value={data.ocupacion}
                                    onChange={(e) => setData('ocupacion', e.target.value)}
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                    required
                                >
                                    <option value="">Seleccione...</option>
                                    <option value="Estudiante">Estudiante</option>
                                    <option value="Docente">Docente</option>
                                    <option value="Área Administrativa">Área Administrativa</option>
                                </select>
                            </div>

                            {showSemestrePrograma && (
                                <>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Programa Educativo</label>
                                        <select
                                            value={data.programaEducativo}
                                            onChange={(e) => setData('programaEducativo', e.target.value)}
                                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                            required
                                        >
                                            <option value="">Seleccione...</option>
                                            {programas.map((p, i) => (
                                                <option key={i} value={p}>{p}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Semestre</label>
                                        <select
                                            value={data.semestre}
                                            onChange={(e) => setData('semestre', e.target.value)}
                                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                            required
                                        >
                                            <option value="">Seleccione...</option>
                                            {semestres.map(s => (
                                                <option key={s} value={s}>{s}</option>
                                            ))}
                                        </select>
                                    </div>
                                </>
                            )}

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700">Alergias</label>
                                <input
                                    type="text"
                                    value={data.alergias}
                                    onChange={(e) => setData('alergias', e.target.value)}
                                    placeholder="Ej. Ninguna o Especificar"
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700">Teléfono del Paciente</label>
                                <input
                                    type="text"
                                    value={data.telefono}
                                    onChange={(e) => setData('telefono', e.target.value)}
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                    required
                                />
                            </div>
                        </div>
                    </fieldset>

                    {/* 📌 SECCIÓN: Contacto de Emergencia */}
                    <fieldset className="border border-gray-300 rounded-md p-6">
                        <legend className="text-base font-semibold text-gray-700 px-2">Contacto de Emergencia</legend>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Parentesco</label>
                                <select
                                    value={data.parentesco}
                                    onChange={(e) => setData('parentesco', e.target.value)}
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                    
                                >
                                    <option value="">Seleccione...</option>
                                    {parentescos.map((p, i) => (
                                        <option key={i} value={p}>{p}</option>
                                    ))}
                                </select>
                            </div>

                            {showParentescoOtro && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Especifique Parentesco</label>
                                    <input
                                        type="text"
                                        value={data.detalleParentesco}
                                        onChange={(e) => setData('detalleParentesco', e.target.value)}
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                        
                                    />
                                </div>
                            )}

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700">Teléfono de Emergencia</label>
                                <input
                                    type="text"
                                    value={data.telefonoEmergencia}
                                    onChange={(e) => setData('telefonoEmergencia', e.target.value)}
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                    
                                />
                            </div>
                        </div>
                    </fieldset>

                    <div className="mt-8 text-center">
                        <button
                            type="submit"
                            disabled={processing}
                            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 shadow"
                        >
                            {paciente ? "Actualizar Paciente" : "Registrar Paciente"}
                        </button>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
