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

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">📅 Listado de Citas</h2>}
        >
            <Head title="Citas" />

            <div className="py-12 px-4 bg-[#b6ffff] min-h-screen">
                <div className="max-w-7xl mx-auto bg-white shadow-md rounded-lg p-6">
                    {/* Filtro */}
                    <div className="flex flex-col md:flex-row md:items-center md:space-x-4 mb-6">
                        <div className="flex items-center space-x-2 mb-4 md:mb-0">
                            <label htmlFor="fecha" className="font-medium text-gray-700">📆 Fecha:</label>
                            <input
                                type="date"
                                id="fecha"
                                value={fecha}
                                onChange={(e) => setFecha(e.target.value)}
                                className="border border-gray-300 rounded-md p-2 focus:ring focus:ring-blue-200"
                            />
                        </div>
                        <button
                            onClick={handleSearch}
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                        >
                            🔍 Buscar
                        </button>
                        <Link href={route('cita.create')} className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition md:ml-auto">
                            ➕ Nueva Cita
                        </Link>
                    </div>

                    {/* Tabla */}
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-sm text-left text-gray-700 border">
                            <thead className="bg-[#7cdaf9] text-gray-800">
                                <tr className="text-nowrap">
                                    <th className="px-4 py-3">Nro</th>
                                    <th className="px-4 py-3">Enfermera</th>
                                    <th className="px-4 py-3">Paciente</th>
                                    <th className="px-4 py-3">Motivo</th>
                                    <th className="px-4 py-3">Fecha</th>
                                    <th className="px-4 py-3">Hora</th>
                                    <th className="px-4 py-3">Estado</th>
                                    <th className="px-4 py-3">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white">
                                {filteredCitas.length > 0 ? (
                                    filteredCitas.map((cit) => (
                                        <tr key={cit.id} className="border-b hover:bg-gray-50">
                                            <td className="px-4 py-3">{cit.id}</td>
                                            <td className="px-4 py-3">{formatData(cit.user?.name)}</td>
                                            <td className="px-4 py-3">
                                                {formatData(cit.paciente?.nombre)} {formatData(cit.paciente?.aPaterno)} {formatData(cit.paciente?.aMaterno)}
                                            </td>
                                            <td className="px-4 py-3">{formatData(cit.motivo)}</td>
                                            <td className="px-4 py-3">{cit.fechacita}</td>
                                            <td className="px-4 py-3">{cit.horacita}</td>
                                            <td className="px-4 py-3">{formatData(cit.estado)}</td>
                                            <td className="px-4 py-3">
                                                <Link
                                                    href={route('cita.edit', cit.id)}
                                                    className="text-blue-600 hover:text-blue-800 font-semibold"
                                                >
                                                    Editar
                                                </Link>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="8" className="text-center py-6 text-gray-500">No hay citas para mostrar.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
