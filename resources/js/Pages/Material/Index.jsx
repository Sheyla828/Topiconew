import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from '@inertiajs/react';
import { useState, useEffect } from 'react';

export default function Index({ auth, materiales }) {
    const [searchBy, setSearchBy] = useState("nombre");
    const [searchValue, setSearchValue] = useState("");
    const [filteredMateriales, setFilteredMateriales] = useState(materiales?.data || []);

    // useEffect para inicializar los materiales filtrados
    useEffect(() => {
        if (materiales && Array.isArray(materiales.data)) {
            setFilteredMateriales(materiales.data);
        }
    }, [materiales]);

    // Maneja el cambio en los campos de búsqueda
    const handleSearchChange = (e) => {
        setSearchValue(e.target.value);
    };

    // Maneja la búsqueda de materiales
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

    // Función para eliminar un material
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

            <div className="py-12">
                {/* Sección de búsqueda */}
                <div className="flex items-center space-x-4 mb-6">
                    {/* Buscar por nombre */}
                    <label className="flex items-center">
                        <input
                            type="radio"
                            name="searchBy"
                            value="nombre"
                            checked={searchBy === "nombre"}
                            onChange={() => setSearchBy("nombre")}
                            className="mr-2"
                        />
                        Nombre Material:
                    </label>
                    {searchBy === "nombre" && (
                        <input
                            type="text"
                            placeholder="Ingrese nombre del material"
                            value={searchValue}
                            onChange={handleSearchChange}
                            className="border rounded p-2"
                        />
                    )}

                    {/* Buscar por fecha */}
                    <label className="flex items-center">
                        <input
                            type="radio"
                            name="searchBy"
                            value="fecha"
                            checked={searchBy === "fecha"}
                            onChange={() => setSearchBy("fecha")}
                            className="mr-2"
                        />
                        Fecha:
                    </label>
                    {searchBy === "fecha" && (
                        <input
                            type="date"
                            value={searchValue}
                            onChange={handleSearchChange}
                            className="border rounded p-2"
                        />
                    )}

                    {/* Buscar por unidad de medida */}
                    <label className="flex items-center">
                        <input
                            type="radio"
                            name="searchBy"
                            value="unidadmedida"
                            checked={searchBy === "unidadmedida"}
                            onChange={() => setSearchBy("unidadmedida")}
                            className="mr-2"
                        />
                        Unidad de Medida:
                    </label>
                    {searchBy === "unidadmedida" && (
                        <input
                            type="text"
                            placeholder="Ingrese unidad de medida"
                            value={searchValue}
                            onChange={handleSearchChange}
                            className="border rounded p-2"
                        />
                    )}

                    {/* Botón de búsqueda */}
                    <button
                        onClick={handleSearch}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                        Buscar
                    </button>
                </div>

                {/* Tabla de materiales */}
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 bg-[#84eded]">
                    <thead className="text-sx text-gray-700 bg-[#71dada] dark:bg-gray-200">
                        <tr className="text-nowrap">
                            <th className="px-3 py-3">ID</th>
                            <th className="px-3 py-3">Nombre Material</th>
                            <th className="px-3 py-3">Cantidad</th>
                            <th className="px-3 py-3">Unidad de Medida</th>
                            <th className="px-3 py-3">Fecha</th>
                            <th className="px-3 py-3">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredMateriales && filteredMateriales.length > 0 ? (
                            filteredMateriales.map((material) => (
                                <tr key={material.id}>
                                    <td>{material.id}</td>
                                    <td>{material.nombre}</td>
                                    <td>{material.cantidad}</td>
                                    <td>{material.unidadmedida}</td>
                                    <td>{material.fechavencimiento}</td>
                                    <td>
                                        <Link
                                            href={route('material.edit', material.id)}
                                            className="text-blue-500 hover:text-blue-700 mr-4"
                                        >
                                            Editar
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(material.id)}
                                            className="text-red-500 hover:text-red-700"
                                        >
                                            Eliminar
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="text-center py-4">No hay datos disponibles</td>
                            </tr>
                        )}
                    </tbody>
                </table>

                {/* Botón de agregar nuevo material */}
                <div className="flex justify-center mt-4 space-x-4">
                    <Link href={route('material.create')} className="bg-yellow-500 text-white px-6 py-2 rounded hover:bg-yellow-700">
                        ➕ Nuevo Material
                    </Link>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
