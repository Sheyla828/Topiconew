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

    if (medicamento) {
      put(route('medicamento.update', medicamento.id), { data });
    } else {
      post(route('medicamento.store'), { data });
    }
  };

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={
        <h2 className="font-semibold text-xl text-gray-800 leading-tight">
          {medicamento ? "Editar Medicamento" : "Registrar Nuevo Medicamento"}
        </h2>
      }
    >
      <Head title="Medicamento" />

      <div className="py-12 flex justify-center bg-[#b6ffff] min-h-screen px-4">
        <div className="w-full max-w-4xl bg-white border border-gray-200 rounded-lg shadow p-6 md:p-8">
          <h3 className="text-lg font-semibold mb-4">Datos del Medicamento</h3>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Campo Nombre */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre del Medicamento
              </label>
              <input
                type="text"
                value={data.nombre}
                onChange={(e) => setData('nombre', e.target.value)}
                className="block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
                required
              />
              {errors.nombre && (
                <p className="text-sm text-red-600 mt-1">{errors.nombre}</p>
              )}
            </div>

            {/* Campo Cantidad */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cantidad
              </label>
              <input
                type="number"
                value={data.cantidad}
                onChange={(e) => setData('cantidad', e.target.value)}
                className="block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
                required
              />
              {errors.cantidad && (
                <p className="text-sm text-red-600 mt-1">{errors.cantidad}</p>
              )}
            </div>

            {/* Campo Unidad de Medida */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Unidad de Medida
              </label>
              <input
                type="text"
                value={data.unidadmedida}
                onChange={(e) => setData('unidadmedida', e.target.value)}
                className="block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
                required
              />
              {errors.unidadmedida && (
                <p className="text-sm text-red-600 mt-1">{errors.unidadmedida}</p>
              )}
            </div>

            {/* Campo Fecha de Vencimiento */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha de Vencimiento
              </label>
              <input
                type="date"
                value={data.fechavencimiento}
                onChange={(e) => setData('fechavencimiento', e.target.value)}
                className="block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
                required
              />
              {errors.fechavencimiento && (
                <p className="text-sm text-red-600 mt-1">{errors.fechavencimiento}</p>
              )}
            </div>
          </form>

          {/* Botones */}
          <div className="flex flex-col md:flex-row justify-end mt-6 gap-4">
            <button
              type="submit"
              onClick={handleSubmit}
              disabled={processing}
              className="inline-flex justify-center px-6 py-2 bg-sky-600 text-white rounded-md hover:bg-sky-700 transition"
            >
              {medicamento ? "Actualizar" : "Guardar"}
            </button>
            <Link
              href={route('medicamento.index')}
              className="inline-flex justify-center px-6 py-2 bg-gray-300 text-black rounded-md hover:bg-gray-400 transition"
            >
              Cancelar
            </Link>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
