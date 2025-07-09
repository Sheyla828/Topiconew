import { useState } from 'react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import { Link, usePage } from '@inertiajs/react';

export default function Authenticated({ header, children }) {
    const user = usePage().props.auth.user;
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);

    return (
        <div className="min-h-screen bg-light-blue-100 flex">
            <nav className="bg-[#7cdaf9] border-r border-gray-100 w-64 relative">
                <div className="flex flex-col items-center p-4 bg-[#7cdaf9] text-black relative">
                    <div className="shrink-0 flex items-center">
                        <Link href="/">
                            <ApplicationLogo className="block h-9 w-auto fill-current text-gray-800" />
                        </Link>
                    </div>

                    <div className="text-center mt-2 relative">
                        <span className="font-bold">{user.name}</span><br />
                        <span className="text-sm">{user.email}</span>
                        <div className="absolute top-0 right-0">
                            <Dropdown>
                                <Dropdown.Trigger>
                                    <button>
                                        <svg className="h-4 w-4 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                                        </svg>
                                    </button>
                                </Dropdown.Trigger>
                                <Dropdown.Content>
                                    <Dropdown.Link href={route('profile.edit')}>Perfil</Dropdown.Link>
                                    <Dropdown.Link href={route('logout')} method="post" as="button">
                                        Cerrar Sesión
                                    </Dropdown.Link>
                                </Dropdown.Content>
                            </Dropdown>
                        </div>
                    </div>
                </div>

                <button
                    className="block md:hidden p-4 text-black focus:outline-none"
                    onClick={() => setShowingNavigationDropdown(!showingNavigationDropdown)}
                >
                    <svg
                        className="h-6 w-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M4 6h16M4 12h16m-7 6h7"
                        ></path>
                    </svg>
                </button>

                <div
                    className={`flex-col mt-4 space-y-4 items-center ${
                        showingNavigationDropdown ? 'flex' : 'hidden'
                    } md:flex`}
                >
                    <NavLink href={route('dashboard')} active={route().current('dashboard')} className="text-center font-bold text-xl">
                        Principal
                    </NavLink>

                    <NavLink href={route('atencion.index')} active={route().current('atencion.index')} className="text-center font-bold text-xl">
                        Atenciones
                    </NavLink>
                    <NavLink href={route('paciente.index')} active={route().current('paciente.index')} className="text-center font-bold text-xl">
                        Pacientes
                    </NavLink>
                    <NavLink href={route('medicamento.index')} active={route().current('medicamento.index')} className="text-center font-bold text-xl">
                        Medicamentos
                    </NavLink>

                    <NavLink href={route('material.index')} active={route().current('material.index')} className="text-center font-bold text-xl">
                        Materiales
                    </NavLink>
                    <NavLink href={route('cita.index')} active={route().current('cita.index')} className="text-center font-bold text-xl">
                        Citas
                    </NavLink>
                    
                </div>
            </nav>

            <div className="flex-1">
                <header className="bg-[#0cb7f2] text-white p-4 text-center">
                    <h2 className="text-lg font-bold">Unidad de Bienestar y Empleabilidad</h2>
                    <h1 className="text-3xl font-bold">SERVICIO MÉDICO (TÓPICO)</h1>
                </header>

                <main>
                    {route().current('dashboard') && (
                        <div className="flex flex-col justify-center items-center h-[calc(100vh-4rem)] bg-[#b6ffff] text-center">
                            <h1
                                className="text-8xl font-extrabold text-black mb-12 shadow-lg shadow-cyan-300 relative"
                                style={{ fontFamily: 'Times New Roman' }}
                            >
                                BIENVENIDA!!!
                                <span className="absolute inset-0 rounded-lg"></span>
                            </h1>
                            <p
                                className="text-3xl font-semibold text-gray-800 mb-8 max-w-2xl"
                                style={{ fontFamily: 'Times New Roman' }}
                            >
                                El servicio Médico (Tópico) de salud tiene la finalidad de lograr una mejor calidad de vida de los integrantes de la comunidad del Instituto Túpac Amaru,
                                brindando atención de salud por el profesional de enfermería de manera personalizada y confidencial.
                            </p>
                            <p
                                className="text-3xl font-semibold text-gray-800 max-w-2xl"
                                style={{ fontFamily: 'Times New Roman' }}
                            >
                                Promoviendo la educación en salud, entornos saludables y el autocuidado. Para ello, cuenta con la capacidad y calidad de su personal.
                            </p>
                        </div>
                    )}
                    {children}
                </main>
            </div>
        </div>
    );
}
