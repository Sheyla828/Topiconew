import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, useForm } from '@inertiajs/react';

export default function FormularioMaterial({ auth, materiale }) {
    const { data, setData, post, put, processing, errors } = useForm({
        nombre: materiale?.nombre || '',
        cantidad: materiale?.cantidad || '',
        fechaingreso: materiale?.fechaingreso || '',
        fechavencimiento: materiale?.fechavencimiento || '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        if (materiale) {
            put(route('material.update', materiale.id), { data });
        } else {
            post(route('material.store'), { data });
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">
                {materiale ? "Editar Material" : "Registrar Nuevo Material"}
            </h2>}
        >
            <Head title="Material" />

            <div className="py-12 flex justify-center bg-[#b6ffff] min-h-screen px-4">
                <div className="w-full max-w-4xl bg-white border border-gray-200 rounded-lg shadow p-6 md:p-8">
                    <h3 className="text-lg font-semibold mb-4">Datos del Material</h3>

                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Nombre */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Nombre del Material</label>
                            <input
                                type="text"
                                value={data.nombre}
                                onChange={(e) => setData('nombre', e.target.value)}
                                className="block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
                                required
                            />
                            {errors.nombre && <p className="text-sm text-red-600 mt-1">{errors.nombre}</p>}
                        </div>

                        {/* Cantidad */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Cantidad</label>
                            <input
                                type="number"
                                value={data.cantidad}
                                onChange={(e) => setData('cantidad', e.target.value)}
                                className="block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
                                required
                            />
                            {errors.cantidad && <p className="text-sm text-red-600 mt-1">{errors.cantidad}</p>}
                        </div>

                        {/* Fecha Ingreso */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Fecha de Ingreso</label>
                            <input
                                type="date"
                                value={data.fechaingreso}
                                onChange={(e) => setData('fechaingreso', e.target.value)}
                                className="block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
                                required
                            />
                            {errors.fechaingreso && <p className="text-sm text-red-600 mt-1">{errors.fechaingreso}</p>}
                        </div>

                        {/* Fecha Vencimiento */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Fecha de Vencimiento</label>
                            <input
                                type="date"
                                value={data.fechavencimiento}
                                onChange={(e) => setData('fechavencimiento', e.target.value)}
                                className="block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
                                required
                            />
                            {errors.fechavencimiento && <p className="text-sm text-red-600 mt-1">{errors.fechavencimiento}</p>}
                        </div>
                    </form>

                    {/* Botones */}
                    <div className="flex justify-end mt-6 gap-4">
                        <button
                            type="submit"
                            onClick={handleSubmit}
                            disabled={processing}
                            className="px-6 py-2 bg-sky-600 text-white rounded-md hover:bg-sky-700 transition"
                        >
                            {materiale ? "Actualizar" : "Guardar"}
                        </button>
                        <Link
                            href={route('material.index')}
                            className="px-6 py-2 bg-gray-300 text-black rounded-md hover:bg-gray-400 transition"
                        >
                            Cancelar
                        </Link>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
