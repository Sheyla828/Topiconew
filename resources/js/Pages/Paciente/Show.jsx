import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { useState, useEffect } from "react";

export default function Show({ auth, paciente }) {
    const [ocupacion, setOcupacion] = useState(paciente.ocupacion || "Estudiante");
    const [programaEducativo, setProgramaEducativo] = useState(paciente.programaEducativo || "");
    const [semestre, setSemestre] = useState(paciente.semestre || "");

    const handleGoBack = () => {
        window.history.back();
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Detalles del Paciente</h2>}
        >
            <Head title={`Paciente: ${paciente.nombre}`} />

            <div className="py-12">
                <div className="max-w-4xl mx-auto bg-white shadow sm:rounded-lg p-6">
                    <h3 className="text-lg font-bold mb-4">Información del Paciente</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div><strong>ID:</strong> {paciente.id}</div>
                        <div><strong>Nombre:</strong> {paciente.nombre}</div>
                        <div><strong>Apellido Paterno:</strong> {paciente.aPaterno}</div>
                        <div><strong>Apellido Materno:</strong> {paciente.aMaterno}</div>
                        <div><strong>Sexo:</strong> {paciente.sexo}</div>
                        <div><strong>Fecha de Nacimiento:</strong> {paciente.fechaNacimiento}</div>
                        <div><strong>Edad:</strong> {paciente.edad}</div>
                        <div><strong>DNI:</strong> {paciente.dni}</div>

                        {/* Ocupación (como texto, no editable) */}
                        <div>
                            <strong>Ocupación:</strong> {ocupacion}
                        </div>

                        {/* Si es Estudiante, mostrar Programa Educativo y Semestre */}
                        {ocupacion === "Estudiante" ? (
                            <>
                                <div><strong>Programa Educativo:</strong> {paciente.programaEducativo || "No registrado"}</div>
                                <div><strong>Semestre:</strong> {paciente.semestre || "No registrado"}</div>
                            </>
                        ) : ocupacion === "Docente" || ocupacion === "Área Administrativa" ? (
                            <>
                                <div><strong>Programa Educativo:</strong> No aplicable</div>
                                <div><strong>Semestre:</strong> No aplicable</div>
                            </>
                        ) : null}

                        <div><strong>Alergias:</strong> {paciente.alergias || "Ninguna"}</div>
                        <div><strong>Teléfono:</strong> {paciente.telefono || "No registrado"}</div>
                        <div><strong>Parentesco:</strong> {paciente.parentesco || "No registrado"}</div>
                        <div><strong>Teléfono Emergencia:</strong> {paciente.telefonoEmergencia || "No registrado"}</div>
                    </div>

                    <div className="mt-6">
                        <button
                            onClick={handleGoBack}
                            className="inline-block px-6 py-2 text-white bg-blue-600 rounded hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-300"
                        >
                            Volver
                        </button>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
