import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import { useState, useEffect } from "react";

export default function Index({ auth, pacientes }) {
  const [searchBy, setSearchBy] = useState("dni");
  const [searchValue, setSearchValue] = useState("");
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [selectedProgram, setSelectedProgram] = useState("");
  const [selectedOcupacion, setSelectedOcupacion] = useState("");

  useEffect(() => {
    setFilteredPatients(pacientes);
  }, [pacientes]);

  const handleSearchChange = (e) => setSearchValue(e.target.value);

  const handleSearch = () => {
    const results = pacientes.filter((p) => {
      if (searchBy === "dni")
        return p.dni?.toString().includes(searchValue.trim());
      if (searchBy === "aPaterno")
        return p.aPaterno
          ?.toLowerCase()
          .includes(searchValue.trim().toLowerCase());
      if (searchBy === "ocupacion" && selectedOcupacion)
        return p.ocupacion
          ?.toLowerCase()
          .includes(selectedOcupacion.trim().toLowerCase());
      if (searchBy === "programaEducativo" && selectedProgram)
        return p.programaEducativo
          ?.toLowerCase()
          .includes(selectedProgram.trim().toLowerCase());
      return false;
    });
    setFilteredPatients(results);
  };

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={
        <h2 className="font-semibold text-xl text-sky-800 leading-tight">
          🗂️ Pacientes
        </h2>
      }
    >
      <Head title="Pacientes" />

      <div className="py-12 px-4 max-w-7xl mx-auto">
        {/* 📌 Filtros */}
        <div className="bg-white p-4 rounded shadow mb-6 border border-sky-100">
          <div className="flex flex-wrap gap-4 items-center mb-4">
            <label className="font-semibold text-sky-800">Buscar por:</label>
            {["dni", "aPaterno", "ocupacion", "programaEducativo"].map((opt) => (
              <label key={opt} className="flex items-center space-x-1 text-sky-700">
                <input
                  type="radio"
                  name="searchBy"
                  value={opt}
                  checked={searchBy === opt}
                  onChange={() => setSearchBy(opt)}
                  className="accent-sky-600"
                />
                <span className="capitalize">
                  {opt === "aPaterno"
                    ? "Apellido Paterno"
                    : opt === "programaEducativo"
                    ? "Programa Educativo"
                    : opt.charAt(0).toUpperCase() + opt.slice(1)}
                </span>
              </label>
            ))}
          </div>

          <div className="flex flex-wrap gap-4 items-center">
            {(searchBy === "dni" || searchBy === "aPaterno") && (
              <input
                type="text"
                placeholder={`Ingrese ${
                  searchBy === "dni" ? "DNI" : "Apellido Paterno"
                }`}
                value={searchValue}
                onChange={handleSearchChange}
                className="border border-sky-200 rounded p-2 w-64 focus:ring-sky-400 focus:border-sky-400"
              />
            )}

            {searchBy === "ocupacion" && (
              <select
                value={selectedOcupacion}
                onChange={(e) => setSelectedOcupacion(e.target.value)}
                className="border border-sky-200 rounded p-2 w-64 focus:ring-sky-400 focus:border-sky-400"
              >
                <option value="">Seleccione Ocupación...</option>
                <option value="Docente">Docente</option>
                <option value="Estudiante">Estudiante</option>
                <option value="Área Administrativa">Área Administrativa</option>
              </select>
            )}

            {searchBy === "programaEducativo" && (
              <select
                value={selectedProgram}
                onChange={(e) => setSelectedProgram(e.target.value)}
                className="border border-sky-200 rounded p-2 w-64 focus:ring-sky-400 focus:border-sky-400"
              >
                <option value="">Seleccione Programa...</option>
                <option value="Desarrollo de Sistema de Información">
                  Desarrollo de Sistema de Información
                </option>
                <option value="Enfermería Técnica">Enfermería Técnica</option>
                <option value="Electricidad Industrial">
                  Electricidad Industrial
                </option>
                <option value="Electrónica Industrial">
                  Electrónica Industrial
                </option>
                <option value="Mecánica de Producción Industrial">
                  Mecánica de Producción Industrial
                </option>
                <option value="Mecatrónica Automotriz">
                  Mecatrónica Automotriz
                </option>
                <option value="Laboratorio Clínico y Anatomía Patológica">
                  Laboratorio Clínico y Anatomía Patológica
                </option>
                <option value="Guía Oficial de Turismo">
                  Guía Oficial de Turismo
                </option>
                <option value="Administración de Servicios de Hostelería y Restaurantes">
                  Administración de Servicios de Hostelería y Restaurantes
                </option>
                <option value="Contabilidad">Contabilidad</option>
              </select>
            )}

            <button
              onClick={handleSearch}
              className="bg-sky-600 text-white px-4 py-2 rounded hover:bg-sky-700"
            >
              🔍 Buscar
            </button>

            <Link
              href={route("paciente.report")}
              className="bg-teal-500 text-white px-4 py-2 rounded hover:bg-teal-600"
            >
              📊 Ver estadística
            </Link>
          </div>
        </div>

        {/* 📌 Tabla */}
        <div className="border border-sky-200 rounded shadow h-[500px] overflow-y-auto overflow-x-auto">
          <table className="min-w-full text-sm text-left text-gray-700">
            <thead className="sticky top-0 z-10 bg-sky-200">
              <tr>
                {[
                  "ID",
                  "Nombre",
                  "Sexo",
                  "Edad",
                  "DNI",
                  "Ocupación",
                  "Programa",
                  "Teléfono",
                  "Acciones",
                ].map((col) => (
                  <th
                    key={col}
                    className="px-4 py-3 border-b font-semibold text-sky-800"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white">
              {filteredPatients.length > 0 ? (
                filteredPatients.map((p) => (
                  <tr key={p.id} className="hover:bg-sky-50">
                    <td className="px-4 py-2 border-b">{p.id}</td>
                    <td className="px-4 py-2 border-b">
                      {`${p.nombre} ${p.aPaterno} ${p.aMaterno}`}
                    </td>
                    <td className="px-4 py-2 border-b">{p.sexo}</td>
                    <td className="px-4 py-2 border-b">{p.edad}</td>
                    <td className="px-4 py-2 border-b">{p.dni}</td>
                    <td className="px-4 py-2 border-b">{p.ocupacion}</td>
                    <td className="px-4 py-2 border-b">
                      {p.programaEducativo || "-"}
                    </td>
                    <td className="px-4 py-2 border-b">{p.telefono || "-"}</td>
                    <td className="px-4 py-2 border-b flex gap-2">
                      <Link
                        href={route("paciente.show", p.id)}
                        className="inline-flex items-center px-2 py-1 text-xs bg-sky-500 text-white rounded hover:bg-sky-600"
                      >
                        👁️ Ver
                      </Link>
                      <Link
                        href={route("paciente.edit", p.id)}
                        className="inline-flex items-center px-2 py-1 text-xs bg-teal-500 text-white rounded hover:bg-teal-600"
                      >
                        ✏️ Editar
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="9"
                    className="text-center py-4 text-gray-500 font-medium"
                  >
                    No hay datos disponibles
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex justify-center mt-6">
          <Link
            href={route("paciente.create")}
            className="inline-flex items-center gap-1 bg-sky-600 text-white px-6 py-2 rounded hover:bg-sky-700"
          >
            ➕ Nuevo Paciente
          </Link>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
