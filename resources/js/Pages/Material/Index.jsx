import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from '@inertiajs/react';
import { useState, useEffect } from 'react';

export default function Index({ auth, materiales }) {
    const [searchBy, setSearchBy] = useState("nombre");
    const [searchValue, setSearchValue] = useState("");
    const [filteredMateriales, setFilteredMateriales] = useState(materiales?.data || []);

    useEffect(() => {
        if (materiales && Array.isArray(materiales.data)) {
            setFilteredMateriales(materiales.data);
        }
    }, [materiales]);

    const handleSearchChange = (e) => {
        setSearchValue(e.target.value);
    };

    const handleSearch = () => {
        if (materiales && Array.isArray(materiales.data)) {
            const results = materiales.data.filter((material) => {
                if (searchBy === "nombre") {
                    return material.nombre.toLowerCase().includes(searchValue.toLowerCase());
                } else if (searchBy === "fecha") {
                    return material.fechavencimiento === searchValue;
                } else if (searchBy === "unidadmedida") {
                    return material.unidadmedida.toLowerCase().includes(searchValue.toLowerCase());
                }
                return true;
            });
            setFilteredMateriales(results);
        }
    };

    const handleDelete = (id) => {
        if (confirm("¿Estás seguro de eliminar este material?")) {
            fetch(route('material.destroy', id), {
                method: 'DELETE',
                headers: {
                    'X-CSRF-TOKEN': document.head.querySelector('meta[name="csrf-token"]').content,
                },
            }).then(() => {
                setFilteredMateriales(filteredMateriales.filter((material) => material.id !== id));
            });
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Listado de Materiales</h2>}
        >
            <Head title="Materiales" />

            <div className="py-12 bg-[#b6ffff] min-h-screen">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white border border-gray-200 shadow rounded-lg p-6">

                        {/* Sección de búsqueda */}
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
                            <div className="flex flex-wrap items-center gap-4">
                                {/* Buscar por nombre */}
                                <label className="flex items-center font-medium text-gray-700">
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
                                        placeholder="Nombre del material"
                                        value={searchValue}
                                        onChange={handleSearchChange}
                                        className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
                                    />
                                )}

                                {/* Buscar por fecha */}
                                <label className="flex items-center font-medium text-gray-700">
                                    <input
                                        type="radio"
                                        name="searchBy"
                                        value="fecha"
                                        checked={searchBy === "fecha"}
                                        onChange={() => setSearchBy("fecha")}
                                        className="ml-4 mr-2"
                                    />
                                    Fecha:
                                </label>
                                {searchBy === "fecha" && (
                                    <input
                                        type="date"
                                        value={searchValue}
                                        onChange={handleSearchChange}
                                        className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
                                    />
                                )}

                                {/* Buscar por unidad de medida */}
                                <label className="flex items-center font-medium text-gray-700">
                                    <input
                                        type="radio"
                                        name="searchBy"
                                        value="unidadmedida"
                                        checked={searchBy === "unidadmedida"}
                                        onChange={() => setSearchBy("unidadmedida")}
                                        className="ml-4 mr-2"
                                    />
                                    Unidad Medida:
                                </label>
                                {searchBy === "unidadmedida" && (
                                    <input
                                        type="text"
                                        placeholder="Unidad de medida"
                                        value={searchValue}
                                        onChange={handleSearchChange}
                                        className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
                                    />
                                )}

                                {/* Botón Buscar */}
                                <button
                                    onClick={handleSearch}
                                    className="bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-md"
                                >
                                    Buscar
                                </button>
                            </div>

                            <Link
                                href={route('material.create')}
                                className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-md"
                            >
                                ➕ Nuevo Material
                            </Link>
                        </div>

                        {/* Tabla */}
                        <div className="overflow-x-auto rounded-lg shadow-inner">
                            <table className="w-full min-w-[800px] text-sm text-left text-gray-700">
                                <thead className="bg-sky-200 text-gray-800 uppercase">
                                    <tr>
                                        <th className="px-4 py-2">ID</th>
                                        <th className="px-4 py-2">Nombre</th>
                                        <th className="px-4 py-2">Cantidad</th>
                                        <th className="px-4 py-2">Unidad Medida</th>
                                        <th className="px-4 py-2">Fecha</th>
                                        <th className="px-4 py-2">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white">
                                    {filteredMateriales && filteredMateriales.length > 0 ? (
                                        filteredMateriales.map((material) => (
                                            <tr key={material.id} className="border-b border-gray-200">
                                                <td className="px-4 py-2">{material.id}</td>
                                                <td className="px-4 py-2">{material.nombre}</td>
                                                <td className="px-4 py-2">{material.cantidad}</td>
                                                <td className="px-4 py-2">{material.unidadmedida}</td>
                                                <td className="px-4 py-2">{material.fechavencimiento}</td>
                                                <td className="px-4 py-2 space-x-2">
                                                    <Link
                                                        href={route('material.edit', material.id)}
                                                        className="text-blue-600 hover:text-blue-800 font-semibold"
                                                    >
                                                        Editar
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDelete(material.id)}
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
                                                No hay materiales registrados.
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
