import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";

export default function Show({ auth, nombre, materiales }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Historial de {nombre}
                </h2>
            }
        >
            <Head title={`Historial de ${nombre}`} />

            <div className="py-12 bg-[#b6ffff] min-h-screen">
                <div className="max-w-5xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white border border-gray-200 shadow rounded-lg p-6">
                        {/* Encabezado */}
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-semibold text-gray-700">
                                Ingresos de {nombre}
                            </h3>
                            <Link
                                href={route("material.index")}
                                className="bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-md"
                            >
                                ⬅ Volver
                            </Link>
                        </div>

                        {/* Tabla de historial */}
                        <div className="overflow-x-auto rounded-lg shadow-inner">
                            <table className="w-full text-sm text-left text-gray-700">
                                <thead className="bg-sky-200 text-gray-800 uppercase">
                                    <tr>
                                        <th className="px-4 py-2">ID</th>
                                        <th className="px-4 py-2">Cantidad</th>
                                        <th className="px-4 py-2">Fecha Ingreso</th>
                                        <th className="px-4 py-2">Fecha Vencimiento</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {materiales.length > 0 ? (
                                        materiales.map((mat) => (
                                            <tr
                                                key={mat.id}
                                                className="border-b border-gray-200"
                                            >
                                                <td className="px-4 py-2">{mat.id}</td>
                                                <td className="px-4 py-2">{mat.cantidad}</td>
                                                <td className="px-4 py-2">{mat.fechaingreso}</td>
                                                <td className="px-4 py-2">{mat.fechavencimiento}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td
                                                colSpan="4"
                                                className="text-center py-4 text-gray-500"
                                            >
                                                No hay registros de este material.
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
