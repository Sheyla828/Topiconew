import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";

export default function AtencionShow({ auth, atencion }) {
    const handleGoBack = () => {
        window.history.back();
    };

    const InfoRow = ({ label, value }) => (
        <div>
            <strong>{label}:</strong> {value || "No disponible"}
        </div>
    );

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Detalles de la Atención</h2>}
        >
            <Head title={`Atención: ${atencion.id}`} />

            <div className="py-12">
                <div className="max-w-4xl mx-auto bg-white shadow sm:rounded-lg p-6">
                    <h3 className="text-lg font-bold mb-4">Información de la Atención</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <InfoRow label="ID" value={atencion.id} />
                        <InfoRow label="Enfermera" value={atencion.user?.name} />
                        <InfoRow label="Paciente" value={atencion.paciente ? atencion.paciente.nombre : 'No disponible'} />
                        <div>
                            <strong>Medicamentos:</strong>
                            {atencion.medicamentosUsados && atencion.medicamentosUsados.length > 0 ? (
                                <ul>
                                    {atencion.medicamentosUsados.map((medicamento) => (
                                        <li key={medicamento.id}>
                                            {medicamento.medicamento?.nombre || 'Desconocido'}: {medicamento.cantidad_usada} unidades
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                "No disponible"
                            )}
                        </div>
                        <InfoRow label="Material" value={atencion.materiale_id} />
                        <InfoRow label="Peso" value={atencion.peso} />
                        <InfoRow label="Talla" value={atencion.talla} />
                        <InfoRow label="IMC" value={atencion.IMC} />
                        <InfoRow label="Frecuencia Cardiaca" value={atencion.frecuenciaCardiaca} />
                        <InfoRow label="Presión Arterial" value={atencion.presionArterial} />
                        <InfoRow label="Temperatura" value={atencion.temperatura} />
                        <InfoRow label="Saturación de Oxígeno" value={atencion.saturacionOxigeno} />
                        <InfoRow label="Frecuencia Respiratoria" value={atencion.frecuenciaRespiratoria} />
                        <InfoRow label="Fecha" value={atencion.fecha} />
                        <InfoRow label="Hora" value={atencion.hora} />
                        <InfoRow label="Valoración" value={atencion.valoracion} />
                        <InfoRow label="Diagnóstico" value={atencion.diagnostico} />
                        <InfoRow label="Tratamiento" value={atencion.tratamiento} />
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
