import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from '@inertiajs/react';
import { useState, useEffect } from 'react';

export default function Index({ auth, medicamentos }) {
    const [searchBy, setSearchBy] = useState("nombre");
    const [searchValue, setSearchValue] = useState("");
    const [filteredMedicamentos, setFilteredMedicamentos] = useState(medicamentos?.data || []);

    useEffect(() => {
        if (medicamentos && Array.isArray(medicamentos.data)) {
            setFilteredMedicamentos(medicamentos.data);
        }
    }, [medicamentos]);

    const handleSearchChange = (e) => {
        setSearchValue(e.target.value);
    };

    const handleSearch = () => {
        if (medicamentos && Array.isArray(medicamentos.data)) {
            const results = medicamentos.data.filter((medi) => {
                if (searchBy === "nombre") {
                    return medi.nombre.toLowerCase().includes(searchValue.toLowerCase());
                } else if (searchBy === "fecha") {
                    return medi.fechavencimiento === searchValue;
                }
                return true;
            });
            setFilteredMedicamentos(results);
        }
    };

    const handleDelete = (id) => {
        if (confirm("¿Estás seguro de eliminar este medicamento?")) {
            fetch(route('medicamento.destroy', id), {
                method: 'DELETE',
                headers: {
                    'X-CSRF-TOKEN': document.head.querySelector('meta[name="csrf-token"]').content,
                },
            }).then(() => {
                setFilteredMedicamentos(filteredMedicamentos.filter((medi) => medi.id !== id));
            });
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Listado de Medicamentos</h2>}
        >
            <Head title="Medicamentos" />

            <div className="py-12 bg-[#b6ffff] min-h-screen">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white border border-gray-200 shadow rounded-lg p-6">
                        
                        {/* Filtros de búsqueda */}
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 space-y-4 md:space-y-0">
                            <div className="flex flex-wrap items-center gap-4">
                                <label className="flex items-center text-gray-700 font-medium">
                                    <input
                                        type="radio"
                                        name="searchBy"
                                        value="nombre"
                                        checked={searchBy === "nombre"}
                                        onChange={() => setSearchBy("nombre")}
                                        className="mr-2"
                                    />
                                    Nombre:
                                </label>
                                {searchBy === "nombre" && (
                                    <input
                                        type="text"
                                        placeholder="Nombre del medicamento"
                                        value={searchValue}
                                        onChange={handleSearchChange}
                                        className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
                                    />
                                )}

                                <label className="flex items-center text-gray-700 font-medium">
                                    <input
                                        type="radio"
                                        name="searchBy"
                                        value="fecha"
                                        checked={searchBy === "fecha"}
                                        onChange={() => setSearchBy("fecha")}
                                        className="mr-2"
                                    />
                                    Fecha Vencimiento:
                                </label>
                                {searchBy === "fecha" && (
                                    <input
                                        type="date"
                                        value={searchValue}
                                        onChange={handleSearchChange}
                                        className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
                                    />
                                )}

                                <button
                                    onClick={handleSearch}
                                    className="bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-md"
                                >
                                    Buscar
                                </button>
                            </div>

                            <Link
                                href={route('medicamento.create')}
                                className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-md"
                            >
                                ➕ Nuevo Medicamento
                            </Link>
                        </div>

                        {/* Tabla con contenedor scroll */}
                        <div className="overflow-x-auto rounded-lg shadow-inner">
                            <table className="w-full min-w-[800px] text-sm text-left text-gray-700">
                                <thead className="bg-sky-200 text-gray-800 uppercase">
                                    <tr>
                                        <th className="px-4 py-2">ID</th>
                                        <th className="px-4 py-2">Nombre</th>
                                        <th className="px-4 py-2">Cantidad</th>
                                        <th className="px-4 py-2">Fecha Ingreso</th>
                                        <th className="px-4 py-2">Fecha Vencimiento</th>
                                        <th className="px-4 py-2">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white">
                                    {filteredMedicamentos.length > 0 ? (
                                        filteredMedicamentos.map((medi) => (
                                            <tr key={medi.id} className="border-b border-gray-200">
                                                <td className="px-4 py-2">{medi.id}</td>
                                                <td className="px-4 py-2">{medi.nombre}</td>
                                                <td className="px-4 py-2">{medi.cantidad}</td>
                                                <td className="px-4 py-2">{medi.fechaingreso}</td>
                                                <td className="px-4 py-2">{medi.fechavencimiento}</td>
                                                <td className="px-4 py-2 space-x-2">
                                                    <Link
                                                        href={route('medicamento.edit', medi.id)}
                                                        className="text-blue-600 hover:text-blue-800 font-semibold"
                                                    >
                                                        Editar
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDelete(medi.id)}
                                                        className="text-red-600 hover:text-red-800 font-semibold"
                                                    >
                                                        Eliminar
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="6" className="text-center py-4 text-gray-500">
                                                No hay medicamentos registrados.
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
