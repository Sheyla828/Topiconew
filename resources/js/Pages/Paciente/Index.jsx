import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import { useState, useEffect } from "react";

export default function Index({ auth, pacientes }) {
    const [searchBy, setSearchBy] = useState("dni"); // Opción inicial de búsqueda
    const [searchValue, setSearchValue] = useState("");
    const [filteredPatients, setFilteredPatients] = useState([]);
    const [selectedProgram, setSelectedProgram] = useState(""); // Estado para el programa educativo seleccionado
    const [selectedOcupacion, setSelectedOcupacion] = useState(""); // Estado para la ocupación seleccionada

    useEffect(() => {
        // Inicializa la lista filtrada con todos los pacientes
        setFilteredPatients(pacientes);
    }, [pacientes]);

    const handleSearchChange = (e) => {
        setSearchValue(e.target.value);
    };

    const handleSearch = () => {
        const results = pacientes.filter((patient) => {
            // Búsqueda por DNI
            if (searchBy === "dni") {
                const dni = patient.dni ? patient.dni.toString() : "";
                return dni.includes(searchValue.trim());
            }
            // Búsqueda por Apellido Paterno
            else if (searchBy === "aPaterno") {
                const apellidoPaterno = patient.aPaterno ? patient.aPaterno.toLowerCase() : "";
                return apellidoPaterno.includes(searchValue.trim().toLowerCase());
            }
            // Búsqueda por Ocupación (Docente, Estudiante, Área Administrativa)
            else if (searchBy === "ocupacion" && selectedOcupacion) {
                const ocupacion = patient.ocupacion ? patient.ocupacion.toLowerCase() : "";
                return ocupacion.includes(selectedOcupacion.trim().toLowerCase());
            }
            // Búsqueda por Programa Educativo (carrera)
            else if (searchBy === "programaEducativo" && selectedProgram) {
                const programaEducativo = patient.programaEducativo ? patient.programaEducativo.toLowerCase() : "";
                return programaEducativo.includes(selectedProgram.trim().toLowerCase());
            }
            return false; // Si no coincide, excluir
        });
        setFilteredPatients(results);
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Pacientes</h2>}
        >
            <Head title="Pacientes" />

            <div className="py-12">
                <div className="flex items-center space-x-4 mb-6">
                    {/* Único label "Buscar por" */}
                    <label className="flex items-center">
                        Buscar por:
                    </label>

                    {/* Opciones de búsqueda */}
                    <label className="flex items-center">
                        <input
                            type="radio"
                            name="searchBy"
                            value="dni"
                            checked={searchBy === "dni"}
                            onChange={() => setSearchBy("dni")}
                            className="mr-2"
                        />
                        DNI
                    </label>

                    <label className="flex items-center">
                        <input
                            type="radio"
                            name="searchBy"
                            value="aPaterno"
                            checked={searchBy === "aPaterno"}
                            onChange={() => setSearchBy("aPaterno")}
                            className="mr-2"
                        />
                        Apellido Paterno
                    </label>

                    <label className="flex items-center">
                        <input
                            type="radio"
                            name="searchBy"
                            value="ocupacion"
                            checked={searchBy === "ocupacion"}
                            onChange={() => setSearchBy("ocupacion")}
                            className="mr-2"
                        />
                        Ocupación
                    </label>

                    <label className="flex items-center">
                        <input
                            type="radio"
                            name="searchBy"
                            value="programaEducativo"
                            checked={searchBy === "programaEducativo"}
                            onChange={() => setSearchBy("programaEducativo")}
                            className="mr-2"
                        />
                        Programa Educativo
                    </label>
                </div>

                {/* Input field depending on the search option */}
                <div className="flex items-center space-x-4 mb-6">
                    {searchBy === "dni" && (
                        <input
                            type="text"
                            placeholder="Ingrese el DNI"
                            value={searchValue}
                            onChange={handleSearchChange}
                            className="border rounded p-2"
                        />
                    )}

                    {searchBy === "aPaterno" && (
                        <input
                            type="text"
                            placeholder="Ingrese el apellido paterno"
                            value={searchValue}
                            onChange={handleSearchChange}
                            className="border rounded p-2"
                        />
                    )}

                    {searchBy === "ocupacion" && (
                        <select
                            value={selectedOcupacion}
                            onChange={(e) => setSelectedOcupacion(e.target.value)}
                            className="border rounded p-2"
                        >
                            <option value="">Seleccione...</option>
                            <option value="Docente">Docente</option>
                            <option value="Estudiante">Estudiante</option>
                            <option value="Área Administrativa">Área Administrativa</option>
                        </select>
                    )}

                    {searchBy === "programaEducativo" && (
                        <select
                            value={selectedProgram}
                            onChange={(e) => setSelectedProgram(e.target.value)}
                            className="border rounded p-2"
                        >
                            <option value="">Seleccione...</option>
                            <option value="Desarrollo de Sistema de Informacion">Desarrollo de Sistema de Información</option>
                            <option value="Enfermería Técnica">Enfermería Técnica</option>
                            <option value="Electricidad Industrial">Electricidad Industrial</option>
                            <option value="Electrónica Industrial">Electrónica Industrial</option>
                            <option value="Mecánica de Producción Industrial">Mecánica de Producción Industrial</option>
                            <option value="Mecatrónica Automotriz">Mecatrónica Automotriz</option>
                            <option value="Laboratorio Clínico y Anatomía Patológica">Laboratorio Clínico y Anatomía Patológica</option>
                            <option value="Guía Oficial de Turismo">Guía Oficial de Turismo</option>
                            <option value="Administración de Servicios de Hostelería y Restaurantes">Administración de Servicios de Hostelería y Restaurantes</option>
                            <option value="Contabilidad">Contabilidad</option>
                        </select>
                    )}

                    <button
                        onClick={handleSearch}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                        Buscar
                    </button>

                    {/* Estadística link next to the search button */}
                    <Link
                        href={route("paciente.report")}
                        className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-700"
                    >
                        Ver estadística
                    </Link>
                </div>

                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-200">
                    <thead className="text-xs text-gray-700 bg-gray-50 dark:bg-gray-200">
                        <tr>
                            <th className="px-3 py-3">ID</th>
                            <th className="px-3 py-3">Nombre</th>
                            <th className="px-3 py-3">Apellido Paterno</th>
                            <th className="px-3 py-3">Apellido Materno</th>
                            <th className="px-3 py-3">Sexo</th>
                            <th className="px-3 py-3">Fecha de Nacimiento</th>
                            <th className="px-3 py-3">Edad</th>
                            <th className="px-3 py-3">DNI</th>
                            <th className="px-3 py-3">Ocupación</th>
                            <th className="px-3 py-3">Alergias</th>
                            <th className="px-3 py-3">Programa Educativo</th>
                            <th className="px-3 py-3">Semestre</th>
                            <th className="px-3 py-3">Teléfono</th>
                            <th className="px-3 py-3">Parentesco</th>
                            <th className="px-3 py-3">Teléfono Emergencia</th>
                            <th className="px-3 py-3">Acciones</th>
                        </tr>
                    </thead>

                    <tbody>
                        {filteredPatients.length > 0 ? (
                            filteredPatients.map((patient) => (
                                <tr key={patient.id}>
                                    <td>{patient.id}</td>
                                    <td>{patient.nombre}</td>
                                    <td>{patient.aPaterno}</td>
                                    <td>{patient.aMaterno}</td>
                                    <td>{patient.sexo}</td>
                                    <td>{patient.fechaNacimiento}</td>
                                    <td>{patient.edad}</td>
                                    <td>{patient.dni}</td>
                                    <td>{patient.ocupacion}</td>
                                    <td>{patient.alergias}</td>
                                    <td>{patient.programaEducativo}</td>
                                    <td>{patient.semestre}</td>
                                    <td>{patient.telefono}</td>
                                    <td>{patient.parentesco}</td>
                                    <td>{patient.telefonoEmergencia}</td>
                                    <td>
                                        <Link
                                            href={route("paciente.show", patient.id)}
                                            className="text-green-500 hover:text-green-700 mr-4"
                                        >
                                            Ver
                                        </Link>
                                        <Link
                                            href={route("paciente.edit", patient.id)}
                                            className="text-blue-500 hover:text-blue-700 mr-4"
                                        >
                                            Editar
                                        </Link>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="14" className="text-center py-4">
                                    No hay datos disponibles
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>

                <div className="flex justify-center mt-4 space-x-4">
                    <Link
                        href={route("paciente.create")}
                        className="bg-yellow-500 text-white px-6 py-2 rounded hover:bg-yellow-700"
                    >
                        ➕ NUEVO
                    </Link>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
