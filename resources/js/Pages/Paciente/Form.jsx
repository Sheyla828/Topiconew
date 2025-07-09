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
        detalleAlergias: paciente?.detalleAlergias || '',
        programaEducativo: paciente?.programaEducativo || '',  // Asegurarse de que el programa educativo esté correctamente asignado
        semestre: paciente?.semestre || '',
        telefono: paciente?.telefono || '',
        parentesco: paciente?.parentesco || '',
        telefonoEmergencia: paciente?.telefonoEmergencia || '',
    });

    // Estado para controlar la visibilidad de los campos de Semestre y Programa Educativo
    const [showSemestrePrograma, setShowSemestrePrograma] = useState(data.ocupacion === 'Estudiante');
    const [showAlergiasDetail, setShowAlergiasDetail] = useState(data.alergias === 'Sí');

    // Cambiar visibilidad de los campos de semestre y programa educativo según la ocupación
    useEffect(() => {
        setShowSemestrePrograma(data.ocupacion === 'Estudiante');
    }, [data.ocupacion]);

    // Cambiar visibilidad del campo de detalles de alergias
    useEffect(() => {
        setShowAlergiasDetail(data.alergias === 'Sí');
    }, [data.alergias]);

    // Calcular edad automáticamente cuando cambia la fecha de nacimiento
    useEffect(() => {
        if (data.fechaNacimiento) {
            const birthDate = new Date(data.fechaNacimiento);
            const today = new Date();
            let age = today.getFullYear() - birthDate.getFullYear();
            const month = today.getMonth();
            const day = today.getDate();

            // Ajustar la edad si aún no ha llegado el cumpleaños este año
            if (month < birthDate.getMonth() || (month === birthDate.getMonth() && day < birthDate.getDate())) {
                age--;
            }

            setData('edad', age.toString());
        }
    }, [data.fechaNacimiento]);

    const handleSubmit = (e) => {
        e.preventDefault();

        // Si el paciente existe, se actualiza
        if (paciente) {
            put(route('paciente.update', paciente.id), {
                data,
                onSuccess: () => {
                    alert("Paciente actualizado exitosamente!");
                },
                onError: () => {
                    alert("Hubo un error al actualizar el paciente.");
                },
            });
        } else {
            // Si el paciente no existe, se crea
            post(route('paciente.store'), {
                data,
                onSuccess: () => {
                    alert("Paciente creado exitosamente!");
                },
                onError: () => {
                    alert("Hubo un error al crear el paciente.");
                },
            });
        }
    };

    // Lista de programas educativos
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

    // Semestres (1 a 6)
    const semestres = [1, 2, 3, 4, 5, 6];

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Agregar/Modificar Paciente</h2>}
        >
            <Head title="Paciente" />

            <div className="py-12 flex justify-center">
                <form onSubmit={handleSubmit} className="w-full max-w-4xl space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Nombre */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Nombre</label>
                            <input
                                type="text"
                                value={data.nombre}
                                onChange={(e) => setData('nombre', e.target.value)}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                required
                            />
                            {errors.nombre && <div className="text-sm text-red-600">{errors.nombre}</div>}
                        </div>

                        {/* Apellido Paterno */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Apellido Paterno</label>
                            <input
                                type="text"
                                value={data.aPaterno}
                                onChange={(e) => setData('aPaterno', e.target.value)}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                required
                            />
                            {errors.aPaterno && <div className="text-sm text-red-600">{errors.aPaterno}</div>}
                        </div>

                        {/* Apellido Materno */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Apellido Materno</label>
                            <input
                                type="text"
                                value={data.aMaterno}
                                onChange={(e) => setData('aMaterno', e.target.value)}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                required
                            />
                            {errors.aMaterno && <div className="text-sm text-red-600">{errors.aMaterno}</div>}
                        </div>

                        {/* Sexo */}
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
                            {errors.sexo && <div className="text-sm text-red-600">{errors.sexo}</div>}
                        </div>

                        {/* Fecha de Nacimiento */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Fecha de Nacimiento</label>
                            <input
                                type="date"
                                value={data.fechaNacimiento}
                                onChange={(e) => setData('fechaNacimiento', e.target.value)}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                required
                                readOnly={!!paciente} // Solo lectura si se está editando
                            />
                            {errors.fechaNacimiento && <div className="text-sm text-red-600">{errors.fechaNacimiento}</div>}
                        </div>

                        {/* Edad */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Edad</label>
                            <input
                                type="text"
                                value={data.edad}
                                onChange={(e) => setData('edad', e.target.value)}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                required
                                readOnly
                            />
                            {errors.edad && <div className="text-sm text-red-600">{errors.edad}</div>}
                        </div>

                        {/* DNI */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">DNI</label>
                            <input
                                type="text"
                                value={data.dni}
                                onChange={(e) => setData('dni', e.target.value)}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                required
                                readOnly={!!paciente} // Solo lectura si se está editando
                            />
                            {errors.dni && <div className="text-sm text-red-600">{errors.dni}</div>}
                        </div>

                        {/* Ocupación */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Ocupación</label>
                            <select
                                value={data.ocupacion}
                                onChange={(e) => setData('ocupacion', e.target.value)}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                required
                                disabled={!!paciente} // Deshabilitado si es edición
                            >
                                <option value="">Seleccione...</option>
                                <option value="Estudiante">Estudiante</option>
                                <option value="Docente">Docente</option>
                                <option value="AreaAdministrativa">AreaAdministrativa</option>
                            </select>
                            {errors.ocupacion && <div className="text-sm text-red-600">{errors.ocupacion}</div>}
                        </div>

                        {/* Programa Educativo y Semestre */}
                        {showSemestrePrograma && (
                            <>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Programa Educativo</label>
                                    <select
                                        value={data.programaEducativo}
                                        onChange={(e) => setData('programaEducativo', e.target.value)}
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                        required
                                        disabled={!!paciente} // Deshabilitado si es edición
                                    >
                                        {/* Si ya existe el programa educativo, lo mostramos como seleccionado */}
                                        <option value={data.programaEducativo}>{data.programaEducativo}</option>
                                        <option value="">Seleccione...</option>
                                        {programas.map((programa, index) => (
                                            <option key={index} value={programa}>
                                                {programa}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.programaEducativo && <div className="text-sm text-red-600">{errors.programaEducativo}</div>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Semestre</label>
                                    <select
                                        value={data.semestre}
                                        onChange={(e) => setData('semestre', e.target.value)}
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                        required
                                        disabled={!!paciente} // Deshabilitado si es edición
                                    >
                                        <option value="">Seleccione...</option>
                                        {semestres.map((semestre) => (
                                            <option key={semestre} value={semestre}>
                                                {semestre}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.semestre && <div className="text-sm text-red-600">{errors.semestre}</div>}
                                </div>
                            </>
                        )}
                    </div>

                    {/* Alergias */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">¿Tiene alergias?</label>
                        <select
                            value={data.alergias}
                            onChange={(e) => setData('alergias', e.target.value)}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                            required
                        >
                            <option value="">Seleccione...</option>
                            <option value="Sí">Sí</option>
                            <option value="No">No</option>
                        </select>
                        {errors.alergias && <div className="text-sm text-red-600">{errors.alergias}</div>}
                    </div>

                    {/* Detalles de alergias */}
                    {showAlergiasDetail && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Detalles de Alergias</label>
                            <textarea
                                value={data.detalleAlergias}
                                onChange={(e) => setData('detalleAlergias', e.target.value)}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                            />
                            {errors.detalleAlergias && <div className="text-sm text-red-600">{errors.detalleAlergias}</div>}
                        </div>
                    )}

                    {/* Teléfono */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Teléfono</label>
                        <input
                            type="text"
                            value={data.telefono}
                            onChange={(e) => setData('telefono', e.target.value)}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                            required
                        />
                        {errors.telefono && <div className="text-sm text-red-600">{errors.telefono}</div>}
                    </div>

                    {/* Parentesco */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Parentesco</label>
                        <input
                            type="text"
                            value={data.parentesco}
                            onChange={(e) => setData('parentesco', e.target.value)}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                            required
                        />
                        {errors.parentesco && <div className="text-sm text-red-600">{errors.parentesco}</div>}
                    </div>

                    {/* Teléfono de Emergencia */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Teléfono de Emergencia</label>
                        <input
                            type="text"
                            value={data.telefonoEmergencia}
                            onChange={(e) => setData('telefonoEmergencia', e.target.value)}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                            required
                        />
                        {errors.telefonoEmergencia && <div className="text-sm text-red-600">{errors.telefonoEmergencia}</div>}
                    </div>

                    <div className="mt-6 text-center">
                        <button
                            type="submit"
                            disabled={processing}
                            className="px-4 py-2 bg-blue-500 text-white rounded-md"
                        >
                            {paciente ? 'Actualizar Paciente' : 'Registrar Paciente'}
                        </button>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
