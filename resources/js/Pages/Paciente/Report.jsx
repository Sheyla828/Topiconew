import React, { useRef, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js/auto';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const PacienteReports = ({ ocupaciones, programas, pacientes }) => {
  const [selectedOcupacion, setSelectedOcupacion] = useState(''); // Estado para el filtro de ocupación
  const tableRef = useRef(null);

  // Datos para las gráficas
  const ocupacionChartData = {
    labels: ocupaciones.map((o) => o.ocupacion),
    datasets: [
      {
        label: 'Pacientes por Ocupación',
        data: ocupaciones.map((o) => o.total),
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
      },
    ],
  };

  const programaChartData = {
    labels: programas.map((p) => p.programaEducativo),
    datasets: [
      {
        label: 'Pacientes por Programa Educativo',
        data: programas.map((p) => p.total),
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
      },
    ],
  };

  // Manejo del filtro por ocupación
  const filteredPacientes = selectedOcupacion
    ? pacientes.filter((p) => p.ocupacion === selectedOcupacion)
    : pacientes;

  // Exportar a PDF
  const handlePrint = () => {
    html2canvas(tableRef.current, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({ format: 'a4', unit: 'mm', orientation: 'portrait' }); // Cambio de orientación a vertical
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
  
      // Agregar la fecha de exportación
      const currentDate = new Date().toLocaleDateString(); // Formato de fecha local (puedes personalizarlo si lo necesitas)
      pdf.setFontSize(10);
      pdf.text(`Fecha de exportación: ${currentDate}`, 10, pdf.internal.pageSize.height - 10);
  
      // Añadir la imagen de la tabla al PDF
      pdf.addImage(imgData, 'PNG', 10, 10, pdfWidth - 20, pdfHeight);
      pdf.save('reporte-pacientes.pdf');
    });
  };
  return (
    <AuthenticatedLayout>
      <Head title="Reportes de Pacientes" />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6 bg-white border-b border-gray-200">
              <h2 className="text-2xl font-bold mb-4">Reporte de Pacientes</h2>
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="text-xl font-bold mb-2">Pacientes por Ocupación</h3>
                  <Bar data={ocupacionChartData} />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Pacientes por Programa Educativo</h3>
                  <Bar data={programaChartData} />
                </div>
              </div>
              <div className="mt-4">
                <div className="flex items-center space-x-4">
                  <div className="mb-6">
                    <label className="block text-gray-700 font-bold mb-2">
                      Filtrar por Ocupación:
                    </label>
                    <select
                      className="w-150 border border-gray-300 rounded-lg p-2"
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
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  >
                    Exportar a PDF
                  </button>
                </div>
              </div>

              <div ref={tableRef}>
                <h3 className="text-xl font-bold mb-2">
                  Datos de Pacientes {selectedOcupacion ? `(${selectedOcupacion})` : ''}
                </h3>
                <table className="w-full table-auto border-collapse border border-gray-300 text-sm">
                  <thead>
                    <tr className="bg-gray-200 border border-gray-300">
                      <th className="px-2 py-1">Nombre</th>
                      <th className="px-2 py-1">Apellido Paterno</th>
                      <th className="px-2 py-1">Apellido Materno</th>
                      <th className="px-2 py-1">Sexo</th>
                      <th className="px-2 py-1">Fecha de Nacimiento</th>
                      <th className="px-2 py-1">Edad</th>
                      <th className="px-2 py-1">DNI</th>
                      <th className="px-2 py-1">Ocupación</th>
                      <th className="px-2 py-1">Alergias</th>
                      <th className="px-2 py-1">Programa Educativo</th>
                      <th className="px-2 py-1">Semestre</th>
                      <th className="px-2 py-1">Teléfono</th>
                      <th className="px-2 py-1">Parentesco</th>
                      <th className="px-2 py-1">Tel. Emergencia</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPacientes.map((paciente) => (
                      <tr key={paciente.id} className="border border-gray-300">
                        <td className="px-2 py-1">{paciente.nombre}</td>
                        <td className="px-2 py-1">{paciente.aPaterno}</td>
                        <td className="px-2 py-1">{paciente.aMaterno}</td>
                        <td className="px-2 py-1">{paciente.sexo}</td>
                        <td className="px-2 py-1">{paciente.fechaNacimiento}</td>
                        <td className="px-2 py-1">{paciente.edad}</td>
                        <td className="px-2 py-1">{paciente.dni}</td>
                        <td className="px-2 py-1">{paciente.ocupacion}</td>
                        <td className="px-2 py-1">{paciente.alergias || 'N/A'}</td>
                        <td className="px-2 py-1">{paciente.programaEducativo || 'N/A'}</td>
                        <td className="px-2 py-1">{paciente.semestre || 'N/A'}</td>
                        <td className="px-2 py-1">{paciente.telefono || 'N/A'}</td>
                        <td className="px-2 py-1">{paciente.parentesco || 'N/A'}</td>
                        <td className="px-2 py-1">{paciente.telefonoEmergencia || 'N/A'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
};

export default PacienteReports;
