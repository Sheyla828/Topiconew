import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from '@inertiajs/react';
import { useState, useEffect } from 'react';

export default function Index({ auth, medicamentos }) {
    const [searchBy, setSearchBy] = useState("nombre");
    const [searchValue, setSearchValue] = useState("");
    const [filteredMedicamentos, setFilteredMedicamentos] = useState(medicamentos?.data || []);

    // useEffect para inicializar los medicamentos filtrados
    useEffect(() => {
        if (medicamentos && Array.isArray(medicamentos.data)) {
            setFilteredMedicamentos(medicamentos.data);
        }
    }, [medicamentos]);

    // Maneja el cambio en los campos de búsqueda
    const handleSearchChange = (e) => {
        setSearchValue(e.target.value);
    };

    // Maneja la búsqueda de medicamentos
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

    // Maneja la eliminación de un medicamento
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
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Medicamentos</h2>}
        >
            <Head title="Medicamentos" />

            <div className="py-12">
                {/* Sección de búsqueda */}
                <div className="flex items-center space-x-4 mb-6">
                    {/* Opción para buscar por nombre */}
                    <label className="flex items-center">
                        <input
                            type="radio"
                            name="searchBy"
                            value="nombre"
                            checked={searchBy === "nombre"}
                            onChange={() => setSearchBy("nombre")}
                            className="mr-2"
                        />
                        Nombre Medicamento:
                    </label>
                    {searchBy === "nombre" && (
                        <input
                            type="text"
                            placeholder="Ingrese nombre del medicamento"
                            value={searchValue}
                            onChange={handleSearchChange}
                            className="border rounded p-2"
                        />
                    )}

                    {/* Opción para buscar por fecha */}
                    <label className="flex items-center">
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

                {/* Tabla de medicamentos */}
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 bg-[#84eded]">
                    <thead className="text-sx text-gray-700 bg-[#71dada] dark:bg-gray-200">
                        <tr className="text-nowrap">
                            <th className="px-3 py-3">ID</th>
                            <th className="px-3 py-3">Nombre Medicamento</th>
                            <th className="px-3 py-3">Cantidad</th>
                            <th className="px-3 py-3">Unidad Medida</th>
                            <th className="px-3 py-3">Fecha de Vencimiento</th>
                            <th className="px-3 py-3">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            filteredMedicamentos.length > 0 ? (
                                filteredMedicamentos.map((medi) => (
                                    <tr key={medi.id}>
                                        <td>{medi.id}</td>
                                        <td>{medi.nombre}</td>
                                        <td>{medi.cantidad}</td>
                                        <td>{medi.unidadmedida}</td>
                                        <td>{medi.fechavencimiento}</td>
                                        <td>
                                            <Link
                                                href={route('medicamento.edit', medi.id)}
                                                className="text-blue-500 hover:text-blue-700 mr-4"
                                            >
                                                Editar
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(medi.id)}
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

                {/* Botón para crear un nuevo medicamento */}
                <div className="flex justify-center mt-4">
                    <Link href={route('medicamento.create')} className="bg-yellow-500 text-white px-6 py-2 rounded hover:bg-yellow-700">
                        ➕ Nuevo Medicamento
                    </Link>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
