import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from '@inertiajs/react';
import { useState, useEffect } from 'react';

export default function Index({ auth, atenciones }) {
    const [fecha, setFecha] = useState('');
    const [filteredAtenciones, setFilteredAtenciones] = useState(atenciones?.data || []);
    const [allAtenciones, setAllAtenciones] = useState(atenciones?.data || []);

    useEffect(() => {
        if (atenciones && Array.isArray(atenciones.data)) {
            setAllAtenciones(atenciones.data);
            setFilteredAtenciones(atenciones.data);
        }
    }, [atenciones]);

    const formatData = (data, defaultValue = 'N/A') => data ? data : defaultValue;

    const formatResources = (items) => {
        if (!items || !Array.isArray(items) || items.length === 0) return 'Ninguno';
        return items.map(item => `${item.medicamento?.nombre || 'Desconocido'} (${item.cantidad_usada})`).join(', ');
    };

    const handleSearch = () => {
        if (!fecha) {
            setFilteredAtenciones(allAtenciones);
        } else {
            const filtered = allAtenciones.filter(aten => aten.fecha === fecha);
            setFilteredAtenciones(filtered);
        }
    };

    const handleDelete = (id) => {
        if (confirm("¿Estás seguro de eliminar esta atención?")) {
            fetch(route('atencion.destroy', id), {
                method: 'DELETE',
                headers: {
                    'X-CSRF-TOKEN': document.head.querySelector('meta[name="csrf-token"]').content,
                },
            }).then(response => {
                if (response.ok) {
                    setFilteredAtenciones(filteredAtenciones.filter((aten) => aten.id !== id));
                } else {
                    alert('Error al eliminar la atención.');
                }
            });
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Listado de Atenciones</h2>}
        >
            <Head title="Atenciones" />

            <div className="py-12 bg-[#b6ffff] min-h-screen">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white shadow border border-gray-200 rounded-lg p-6">
                        {/* Filtros y botón */}
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                            <div className="flex items-center space-x-2">
                                <label htmlFor="fecha" className="text-gray-700 font-medium">Buscar por Fecha:</label>
                                <input
                                    id="fecha"
                                    type="date"
                                    value={fecha}
                                    onChange={(e) => setFecha(e.target.value)}
                                    className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
                                />
                                <button
                                    onClick={handleSearch}
                                    className="bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-md ml-2"
                                >
                                    Buscar
                                </button>
                            </div>
                            <Link
                                href={route('atencion.create')}
                                className="mt-4 md:mt-0 bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-md"
                            >
                                ➕ Nueva Atención
                            </Link>
                        </div>

                        {/* Contenedor con scroll horizontal */}
                        <div className="overflow-x-auto rounded-lg shadow-inner">
                            <table className="w-full min-w-[1200px] text-sm text-left text-gray-700">
                                <thead className="bg-sky-200 text-gray-800 uppercase">
                                    <tr>
                                        <th className="px-4 py-2">Nro</th>
                                        <th className="px-4 py-2">Enfermera</th>
                                        <th className="px-4 py-2">Paciente</th>
                                        <th className="px-4 py-2">Medicamentos</th>
                                        <th className="px-4 py-2">Materiales</th>
                                        <th className="px-4 py-2">Fecha</th>
                                        <th className="px-4 py-2">Hora</th>
                                        <th className="px-4 py-2">Valoración</th>
                                        <th className="px-4 py-2">Diagnóstico</th>
                                        <th className="px-4 py-2">Tratamiento</th>
                                        <th className="px-4 py-2">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white">
                                    {filteredAtenciones.length > 0 ? (
                                        filteredAtenciones.map((aten) => (
                                            <tr key={aten.id} className="border-b border-gray-200">
                                                <td className="px-4 py-2">{aten.id}</td>
                                                <td className="px-4 py-2">{formatData(aten.user?.name)}</td>
                                                <td className="px-4 py-2">{formatData(aten.paciente?.nombre)} {formatData(aten.paciente?.aPaterno)}</td>
                                                <td className="px-4 py-2">{formatResources(aten.medicamentosUsados)}</td>
                                                <td className="px-4 py-2">{formatResources(aten.materiales)}</td>
                                                <td className="px-4 py-2">{aten.fecha}</td>
                                                <td className="px-4 py-2">{aten.hora}</td>
                                                <td className="px-4 py-2">{aten.valoracion}</td>
                                                <td className="px-4 py-2">{aten.diagnostico}</td>
                                                <td className="px-4 py-2">{aten.tratamiento}</td>
                                                <td className="px-4 py-2 space-x-2">
                                                    <Link
                                                        href={route("atencion.show", aten.id)}
                                                        className="text-green-600 hover:text-green-800 font-semibold"
                                                    >
                                                        Ver
                                                    </Link>
                                                    <Link
                                                        href={route("atencion.edit", aten.id)}
                                                        className="text-blue-600 hover:text-blue-800 font-semibold"
                                                    >
                                                        Editar
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDelete(aten.id)}
                                                        className="text-red-600 hover:text-red-800 font-semibold"
                                                    >
                                                        Eliminar
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="11" className="text-center py-4 text-gray-500">
                                                No hay atenciones disponibles.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
