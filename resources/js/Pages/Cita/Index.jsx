import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from '@inertiajs/react';
import { useState, useEffect } from 'react';

export default function Index({ auth, citas }) {
    const [fecha, setFecha] = useState('');
    const [filteredCitas, setFilteredCitas] = useState(citas?.data || []);
    const [allCitas, setAllCitas] = useState(citas?.data || []);

    useEffect(() => {
        if (citas && Array.isArray(citas.data)) {
            setAllCitas(citas.data);
            setFilteredCitas(citas.data);
        }
    }, [citas]);

    const formatData = (data, defaultValue = 'N/A') => data ? data : defaultValue;

    const handleSearch = () => {
        let filtered = allCitas;

        if (fecha) {
            filtered = filtered.filter(cit => cit.fechacita === fecha);
        }

        setFilteredCitas(filtered);
    };

    const handleDelete = (id) => {
        if (confirm("¿Estás seguro de eliminar esta cita?")) {
            fetch(route('cita.destroy', id), {
                method: 'DELETE',
                headers: {
                    'X-CSRF-TOKEN': document.head.querySelector('meta[name="csrf-token"]').content,
                },
            }).then(() => {
                setFilteredCitas(filteredCitas.filter((cit) => cit.id !== id));
            });
        }
    };

   
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Citas</h2>}
        >
            <Head title="Citas" />

            <div className="py-12">
                <div className="mb-4 flex justify-between items-center">
                    <div className="flex items-center space-x-4">
                        <label htmlFor="fecha" className="font-medium text-gray-700">Fecha:</label>
                        <input
                            type="date"
                            id="fecha"
                            value={fecha}
                            onChange={(e) => setFecha(e.target.value)}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                        />
                        
                        <button
                            onClick={handleSearch}
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
                        >
                            Buscar
                        </button>
                    </div>
                </div>

                {/* Sección de la tabla */}
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 bg-gray-50">
                    <thead className="text-sx text-gray-700 bg-gray-200">
                        <tr className="text-nowrap">
                            <th className="px-3 py-3">Nro Cita</th>
                            <th className="px-3 py-3">Enfermera</th>
                            <th className="px-3 py-3">Paciente</th>
                            <th className="px-3 py-3">Motivo</th>
                            <th className="px-3 py-3">Fecha Cita</th>
                            <th className="px-3 py-3">Hora Cita</th>
                            <th className="px-3 py-3">Estado</th>
                            <th className="px-3 py-3">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            filteredCitas.length > 0 ? (
                                filteredCitas.map((cit) => (
                                    <tr key={cit.id}>
                                        <td>{cit.id}</td>
                                        <td>{formatData(cit.user?.name)}</td>
                                        <td>{formatData(cit.paciente?.nombre)} {formatData(cit.paciente?.aPaterno)} {formatData(cit.paciente?.aMaterno)}</td>
                                        <td>{formatData(cit.motivo)}</td>
                                        <td>{cit.fechacita}</td>
                                        <td>{cit.horacita}</td>
                                        <td>{formatData(cit.estado)}</td>

                                        
                                        <td>
                                            <Link
                                                href={route('cita.edit', cit.id)}
                                                className="text-blue-500 hover:text-blue-700 mr-4"
                                            >
                                                Editar
                                            </Link>
                                           
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="8" className="text-center py-4">No hay datos disponibles</td>
                                </tr>
                            )}
                    </tbody>
                </table>

                <div className="flex justify-center mt-4 space-x-4">
                    <Link href={route('cita.create')} className="bg-yellow-500 text-white px-6 py-2 rounded hover:bg-yellow-700">➕ NUEVO</Link>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
