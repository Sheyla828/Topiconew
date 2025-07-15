import { useState } from 'react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import { Link, usePage } from '@inertiajs/react';

export default function Authenticated({ header, children }) {
  const user = usePage().props.auth.user;
  const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-cyan-50">
      {/* Sidebar */}
      <nav className={`bg-[#7cdaf9] border-r border-gray-200 
        ${showingNavigationDropdown ? 'block' : 'hidden'} md:block 
        w-full md:w-64 md:h-auto absolute md:relative z-20`}>
        <div className="flex flex-col items-center p-4">
          <Link href="/" className="mb-2">
            <ApplicationLogo className="block h-10 w-auto" />
          </Link>

          <div className="text-center mb-4">
            <span className="block font-bold">{user.name}</span>
            <span className="text-sm">{user.email}</span>
          </div>

          <Dropdown>
            <Dropdown.Trigger>
              <button className="mt-1">
                <svg className="h-5 w-5 text-gray-700" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                </svg>
              </button>
            </Dropdown.Trigger>
            <Dropdown.Content>
              <Dropdown.Link href={route('profile.edit')}>Perfil</Dropdown.Link>
              <Dropdown.Link href={route('logout')} method="post" as="button">Cerrar Sesión</Dropdown.Link>
            </Dropdown.Content>
          </Dropdown>

          <div className="flex flex-col space-y-4 mt-6 w-full">
            <NavLink href={route('dashboard')} active={route().current('dashboard')}>Principal</NavLink>
            <NavLink href={route('atencion.index')} active={route().current('atencion.index')}>Atenciones</NavLink>
            <NavLink href={route('paciente.index')} active={route().current('paciente.index')}>Pacientes</NavLink>
            <NavLink href={route('medicamento.index')} active={route().current('medicamento.index')}>Medicamentos</NavLink>
            <NavLink href={route('material.index')} active={route().current('material.index')}>Materiales</NavLink>
            <NavLink href={route('cita.index')} active={route().current('cita.index')}>Citas</NavLink>
          </div>
        </div>
      </nav>

      {/* Botón Hamburguesa */}
      <button
        className="md:hidden p-4 bg-[#7cdaf9] text-black focus:outline-none z-30"
        onClick={() => setShowingNavigationDropdown(!showingNavigationDropdown)}
      >
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
        </svg>
      </button>

      {/* Contenido principal */}
      <div className="flex-1 flex flex-col overflow-x-hidden">
        <header className="bg-[#0cb7f2] text-white p-4 text-center">
          <h2 className="text-lg font-bold">Unidad de Bienestar y Empleabilidad</h2>
          <h1 className="text-2xl md:text-3xl font-bold">SERVICIO MÉDICO (TÓPICO)</h1>
        </header>

        <main className="flex-1 overflow-y-auto p-4">
          {route().current('dashboard') && (
            <div className="flex flex-col justify-center items-center text-center bg-[#b6ffff] rounded-lg p-8">
              <h1 className="text-4xl md:text-8xl font-extrabold mb-6">¡BIENVENIDA!</h1>
              <p className="text-lg md:text-2xl mb-4 max-w-3xl">
                El servicio Médico (Tópico) de salud tiene la finalidad de lograr una mejor calidad de vida de los integrantes de la comunidad del Instituto Túpac Amaru...
              </p>
            </div>
          )}
          {children}
        </main>
      </div>
    </div>
  );
}
