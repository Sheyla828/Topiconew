import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, useForm } from '@inertiajs/react';

export default function FormularioMedicamento({ auth, medicamento }) {
    const { data, setData, post, put, processing, errors } = useForm({
        nombre: medicamento?.nombre || '',
        cantidad: medicamento?.cantidad || '',
        unidadmedida: medicamento?.unidadmedida || '',
        fechavencimiento: medicamento?.fechavencimiento || '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        // Si el medicamento existe, se actualiza
        if (medicamento) {
            put(route('medicamento.update', medicamento.id), {
                data,
            });
        } else {
            // Si el medicamento no existe, se crea
            post(route('medicamento.store'), {
                data,
            });
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Agregar/Modificar Medicamento</h2>}
        >
            <Head title="Medicamento" />

            <div className="py-12 flex justify-center">
                <form onSubmit={handleSubmit} className="w-full max-w-4xl space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Campo Nombre Medicamento */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Nombre del Medicamento</label>
                            <input
                                type="text"
                                value={data.nombre}
                                onChange={(e) => setData('nombre', e.target.value)}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                required
                            />
                            {errors.nombre && <div className="text-sm text-red-600">{errors.nombre}</div>}
                        </div>

                        {/* Campo Cantidad */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Cantidad</label>
                            <input
                                type="number"
                                value={data.cantidad}
                                onChange={(e) => setData('cantidad', e.target.value)}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                required
                            />
                            {errors.cantidad && <div className="text-sm text-red-600">{errors.cantidad}</div>}
                        </div>

                        {/* Campo Unidad de Medida */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Unidad de Medida</label>
                            <input
                                type="text"
                                value={data.unidadmedida}
                                onChange={(e) => setData('unidadmedida', e.target.value)}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                required
                            />
                            {errors.unidadmedida && <div className="text-sm text-red-600">{errors.unidadmedida}</div>}
                        </div>

                        {/* Campo Fecha de Vencimiento */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Fecha de Vencimiento</label>
                            <input
                                type="date"
                                value={data.fechavencimiento}
                                onChange={(e) => setData('fechavencimiento', e.target.value)}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                required
                            />
                            {errors.fechavencimiento && <div className="text-sm text-red-600">{errors.fechavencimiento}</div>}
                        </div>
                    </div>

                    {/* Botones de acción */}
                    <div className="flex justify-end space-x-2">
                        <button
                            type="submit"
                            disabled={processing}
                            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md"
                        >
                            {medicamento ? 'Actualizar Medicamento' : 'Guardar Medicamento'}
                        </button>
                        <Link href={route('medicamento.index')} className="inline-flex items-center px-4 py-2 bg-gray-300 text-black rounded-md">
                            Cancelar
                        </Link>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
