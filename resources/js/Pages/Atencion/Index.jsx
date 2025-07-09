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
                    alert('Error al eliminar la atención.'); // Manejo de errores
                }
            });
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 bg-[#b6ffff] leading-tight">Atenciones</h2>}
        >
            <Head title="Atencion" />

            <div className="py-12">
                <div className="mb-4 flex justify-between items-center">
                    <div className="flex items-center">
                        <label htmlFor="fecha" className="mr-2 text-gray-700">Buscar por Fecha:</label>
                        <input 
                            id="fecha" 
                            type="date" 
                            value={fecha} 
                            onChange={(e) => setFecha(e.target.value)} 
                            className="border border-gray-300 p-2 rounded-lg bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <button 
                        onClick={handleSearch}
                        className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-700"
                    >
                        Buscar
                    </button>
                </div>

                <table className="w-full text-sm text-left rtl:text-right text-gray-500 bg-[#84eded]">
                    <thead className="text-sx text-gray-700 bg-[#71dada] dark:bg-gray-200">
                        <tr className="text-nowrap">
                            <th className="px-3 py-3">Nro Atención</th>
                            <th className="px-3 py-3">Enfermera</th>
                            <th className="px-3 py-3">Paciente</th>
                            <th className="px-3 py-3">Medicamentos</th>
                            <th className="px-3 py-3">Materiales</th>
                            <th className="px-3 py-3">Fecha</th>
                            <th className="px-3 py-3">Hora</th>
                            <th className="px-3 py-3">Valoración</th>
                            <th className="px-3 py-3">Diagnóstico</th>
                            <th className="px-3 py-3">Tratamiento</th>
                            <th className="px-3 py-3">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            filteredAtenciones.length > 0 ? (
                                filteredAtenciones.map((aten) => (
                                    <tr key={aten.id}>
                                        <td>{aten.id}</td>
                                        <td>{formatData(aten.user?.name)}</td>
                                        <td>{formatData(aten.paciente?.nombre)} {formatData(aten.paciente?.aPaterno)} {formatData(aten.paciente?.aMaterno)}</td>
                                        <td>{formatResources(aten.medicamentosUsados)}</td>
                                        <td>{formatResources(aten.materiales)}</td>
                                        <td>{aten.fecha}</td>
                                        <td>{aten.hora}</td>
                                        <td>{aten.valoracion}</td>
                                        <td>{aten.diagnostico}</td>
                                        <td>{aten.tratamiento}</td>
                                        <td>
                                            <Link
                                                href={route("atencion.show", aten.id)}
                                                className="text-green-500 hover:text-green-700 mr-4"
                                            >
                                                Ver
                                            </Link>
                                            <Link
                                                href={route('atencion.edit', aten.id)}
                                                className="text-blue-500 hover:text-blue-700 mr-4"
                                            >
                                                Editar
                                            </Link>
                                            
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="11" className="text-center py-4">No hay datos disponibles</td>
                                </tr>
                            )}
                    </tbody>
                </table>

              
                <div className="flex justify-center mt-4 space-x-4">
                    <Link href={route('atencion.create')} className="bg-yellow-500 text-white px-6 py-2 rounded hover:bg-yellow-700">➕ NUEVO</Link>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
