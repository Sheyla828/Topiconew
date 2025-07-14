import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { useState } from "react";

export default function Show({ auth, paciente }) {
  const [ocupacion] = useState(paciente.ocupacion || "Estudiante");

  const handleGoBack = () => {
    window.history.back();
  };

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={
        <h2 className="font-semibold text-xl text-sky-800 leading-tight">
          Detalles del Paciente
        </h2>
      }
    >
      <Head title={`Paciente: ${paciente.nombre}`} />

      <div className="py-12 px-4">
        <div className="max-w-4xl mx-auto bg-white shadow rounded-lg border border-sky-100">
          <div className="bg-gradient-to-r from-sky-200 to-sky-300 px-6 py-4 rounded-t-lg">
            <h3 className="text-lg font-bold text-sky-900">
              Información del Paciente
            </h3>
          </div>

          <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4 text-sm text-gray-700">
            <div><strong className="text-sky-700">ID:</strong> {paciente.id}</div>
            <div><strong className="text-sky-700">Nombre:</strong> {paciente.nombre}</div>
            <div><strong className="text-sky-700">Apellido Paterno:</strong> {paciente.aPaterno}</div>
            <div><strong className="text-sky-700">Apellido Materno:</strong> {paciente.aMaterno}</div>
            <div><strong className="text-sky-700">Sexo:</strong> {paciente.sexo}</div>
            <div><strong className="text-sky-700">Fecha de Nacimiento:</strong> {paciente.fechaNacimiento}</div>
            <div><strong className="text-sky-700">Edad:</strong> {paciente.edad}</div>
            <div><strong className="text-sky-700">DNI:</strong> {paciente.dni}</div>
            <div><strong className="text-sky-700">Ocupación:</strong> {ocupacion}</div>

            {ocupacion === "Estudiante" ? (
              <>
                <div><strong className="text-sky-700">Programa Educativo:</strong> {paciente.programaEducativo || "No registrado"}</div>
                <div><strong className="text-sky-700">Semestre:</strong> {paciente.semestre || "No registrado"}</div>
              </>
            ) : (
              <>
                <div><strong className="text-sky-700">Programa Educativo:</strong> No aplicable</div>
                <div><strong className="text-sky-700">Semestre:</strong> No aplicable</div>
              </>
            )}

            <div><strong className="text-sky-700">Alergias:</strong> {paciente.alergias || "Ninguna"}</div>
            <div><strong className="text-sky-700">Teléfono:</strong> {paciente.telefono || "No registrado"}</div>
            <div><strong className="text-sky-700">Parentesco:</strong> {paciente.parentesco || "No registrado"}</div>
            <div><strong className="text-sky-700">Detalle Parentesco:</strong> {paciente.detalleParentesco || "No registrado"}</div>
            <div><strong className="text-sky-700">Teléfono Emergencia:</strong> {paciente.telefonoEmergencia || "No registrado"}</div>
          </div>

          <div className="px-6 pb-6 mt-4 flex justify-end">
            <button
              onClick={handleGoBack}
              className="inline-block px-6 py-2 bg-sky-600 text-white rounded hover:bg-sky-700 transition-colors shadow-sm"
            >
              Volver
            </button>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
