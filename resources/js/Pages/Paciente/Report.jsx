import React, { useRef, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js/auto';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const PacienteReports = ({ ocupaciones, programas, pacientes, auth }) => {
  const [selectedOcupacion, setSelectedOcupacion] = useState('');
  const tableRef = useRef(null);

  const ocupacionChartData = {
    labels: ocupaciones.map((o) => o.ocupacion),
    datasets: [
      {
        label: 'Pacientes por Ocupación',
        data: ocupaciones.map((o) => o.total),
        backgroundColor: [
          '#38bdf8', // sky-400
          '#0ea5e9', // sky-500
          '#06b6d4', // cyan-500
          '#22d3ee', // cyan-400
          '#67e8f9', // cyan-300
        ],
      },
    ],
  };

  const programaChartData = {
    labels: programas.map((p) => p.programaEducativo),
    datasets: [
      {
        label: 'Pacientes por Programa Educativo',
        data: programas.map((p) => p.total),
        backgroundColor: [
          '#38bdf8', '#0ea5e9', '#06b6d4', '#22d3ee', '#67e8f9',
          '#7dd3fc', '#0ea5e9', '#06b6d4', '#22d3ee', '#67e8f9',
        ],
      },
    ],
  };

  const filteredPacientes = selectedOcupacion
    ? pacientes.filter((p) => p.ocupacion === selectedOcupacion)
    : pacientes;

  const handlePrint = () => {
    html2canvas(tableRef.current, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({ format: 'a4', unit: 'mm', orientation: 'portrait' });
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      const currentDate = new Date().toLocaleDateString();
      pdf.setFontSize(10);
      pdf.text(`Fecha de exportación: ${currentDate}`, 10, pdf.internal.pageSize.height - 10);

      pdf.addImage(imgData, 'PNG', 10, 10, pdfWidth - 20, pdfHeight);
      pdf.save('reporte-pacientes.pdf');
    });
  };

  return (
    <AuthenticatedLayout user={auth.user}>
      <Head title="Reportes de Pacientes" />

      <div className="py-12 px-4 max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow border border-sky-200 p-6">
          <h2 className="text-2xl font-bold text-sky-800 mb-4">📊 Reporte de Pacientes</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-sky-50 border border-sky-200 p-4 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-sky-700 mb-2">Pacientes por Ocupación</h3>
              <Bar data={ocupacionChartData} />
            </div>

            <div className="bg-sky-50 border border-sky-200 p-4 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-sky-700 mb-2">Pacientes por Programa Educativo</h3>
              <Bar data={programaChartData} />
            </div>
          </div>

          <div className="flex flex-wrap items-end gap-4 mb-6">
            <div>
              <label className="block text-sky-800 font-semibold mb-1">Filtrar por Ocupación:</label>
              <select
                className="w-52 border border-sky-200 rounded-lg p-2 focus:ring-sky-400 focus:border-sky-400"
                value={selectedOcupacion}
                onChange={(e) => setSelectedOcupacion(e.target.value)}
              >
                <option value="">Todas las Ocupaciones</option>
                {ocupaciones.map((o) => (
                  <option key={o.ocupacion} value={o.ocupacion}>
                    {o.ocupacion}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={handlePrint}
              className="bg-sky-600 hover:bg-sky-700 text-white font-bold px-4 py-2 rounded shadow"
            >
              📥 Exportar a PDF
            </button>
          </div>

          <div
            ref={tableRef}
            className="overflow-x-auto border border-sky-200 rounded-lg shadow"
          >
            <h3 className="text-lg font-semibold text-sky-800 mb-2 px-4 pt-4">
              📑 Datos de Pacientes {selectedOcupacion ? `(${selectedOcupacion})` : ''}
            </h3>

            <table className="w-full text-sm text-left border-collapse">
              <thead className="bg-sky-200 text-sky-900 sticky top-0">
                <tr>
                  {[
                    "Nombre",
                    "Apellido Paterno",
                    "Apellido Materno",
                    "Sexo",
                    "F. Nacimiento",
                    "Edad",
                    "DNI",
                    "Ocupación",
                    "Alergias",
                    "Programa Educativo",
                    "Semestre",
                    "Teléfono",
                    "Parentesco",
                    "Detalle Parentesco",
                    "Tel. Emergencia",
                  ].map((col) => (
                    <th key={col} className="px-3 py-2 border border-sky-300 font-medium">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredPacientes.length > 0 ? (
                  filteredPacientes.map((paciente) => (
                    <tr
                      key={paciente.id}
                      className="hover:bg-sky-50 border-b border-sky-100"
                    >
                      <td className="px-3 py-2">{paciente.nombre}</td>
                      <td className="px-3 py-2">{paciente.aPaterno}</td>
                      <td className="px-3 py-2">{paciente.aMaterno}</td>
                      <td className="px-3 py-2">{paciente.sexo}</td>
                      <td className="px-3 py-2">{paciente.fechaNacimiento}</td>
                      <td className="px-3 py-2">{paciente.edad}</td>
                      <td className="px-3 py-2">{paciente.dni}</td>
                      <td className="px-3 py-2">{paciente.ocupacion}</td>
                      <td className="px-3 py-2">{paciente.alergias || 'N/A'}</td>
                      <td className="px-3 py-2">{paciente.programaEducativo || 'N/A'}</td>
                      <td className="px-3 py-2">{paciente.semestre || 'N/A'}</td>
                      <td className="px-3 py-2">{paciente.telefono || 'N/A'}</td>
                      <td className="px-3 py-2">{paciente.parentesco || 'N/A'}</td>
                      <td className="px-3 py-2">{paciente.detalleParentesco || 'N/A'}</td>
                      <td className="px-3 py-2">{paciente.telefonoEmergencia || 'N/A'}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="15"
                      className="px-3 py-4 text-center text-sky-800 font-semibold"
                    >
                      No hay pacientes para mostrar.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
};

export default PacienteReports;
