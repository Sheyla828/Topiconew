import { Link, Head } from '@inertiajs/react';

export default function Welcome({ auth, laravelVersion, phpVersion }) {
    const handleImageError = () => {
        document.getElementById('screenshot-container')?.classList.add('!hidden');
        document.getElementById('docs-card')?.classList.add('!row-span-1');
        document.getElementById('docs-card-content')?.classList.add('!flex-row');
        document.getElementById('background')?.classList.add('!hidden');
    };

    return (
        <>
            <Head title="Welcome" />
            <div className="bg-gray-50 text-black/50 dark:bg-black dark:text-white/50">
                <img
                    id="background"
                    className="absolute inset-0 w-full h-full object-cover opacity-80"
                    src="https://iesta.edu.pe/portal/wp-content/uploads/2022/11/ADMICION-GALERIA.png"
                    alt="Background image"
                />

                <div className="absolute top-0 left-0 ml-4 mt-4 flex flex-col items-start">
    <img
        className="h-50 w-auto text-white lg:h-50 lg:text-[#51a1ac]"
        src="../imag/istta.png"                                 
        alt="Logo"
    />
    <h2 className="text-4xl font-bold text-[#9e2a2a] mt-2 w-full text-center">IESTA</h2> 
</div>      
                <div className="relative min-h-screen flex flex-col items-center justify-center selection:bg-[#61c9c9] selection:text-white">
                    <div className="relative w-full max-w-2xl px-6 lg:max-w-7xl">
                        <header className="grid grid-cols-2 items-center gap-2 py-10 lg:grid-cols-3">
                            <div className="flex lg:justify-center lg:col-start-2">
                                <img
                                    className="h-50 w-auto text-white lg:h-50 lg:text-[#51a1ac]"
                                    src="../imag/cruzlogo.png"                                 
                                    alt="Logo"
                                />
                            </div>
                            <nav className="-mx-3 flex flex-1 justify-end">
                                {auth.user ? (
                                    <Link
                                        href={route('dashboard')}
                                        className="rounded-md px-3 py-2 text-black ring-1 ring-transparent transition hover:text-black/70 focus:outline-none focus-visible:ring-[#629daf] dark:text-white dark:hover:text-white/80 dark:focus-visible:ring-white"
                                    >
                                        Pagina Principal
                                    </Link>
                                ) : (
                                    <>
                                        <Link
                                            href={route('login')}
                                            className="rounded-md px-3 py-2 text-black ring-1 ring-transparent transition hover:text-black/70 focus:outline-none focus-visible:ring-[#66a0c2] dark:text-white dark:hover:text-white/80 dark:focus-visible:ring-white"
                                        >
                                            Iniciar
                                        </Link>
                                        <Link
                                            href={route('register')}
                                            className="rounded-md px-3 py-2 text-black ring-1 ring-transparent transition hover:text-black/70 focus:outline-none focus-visible:ring-[#77c4c4] dark:text-white dark:hover:text-white/80 dark:focus-visible:ring-white"
                                        >
                                            Registrar
                                        </Link>
                                    </>
                                )}
                            </nav>
                        </header>

                        <h1 className="text-7xl font-extrabold text-center mb-6 text-[#185e67] tracking-tight leading-tight" style={{ fontFamily: 'Times New Roman' }}>
                            Tópico
                        </h1>
                        <p className="text-3xl text-center font-light text-[#061118] dark:text-gray-200 max-w-lg mx-auto" style={{ fontFamily: 'Times New Roman' }}>
                            "Promoviendo el cuidado de la salud para el bienestar académico y personal."
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}
