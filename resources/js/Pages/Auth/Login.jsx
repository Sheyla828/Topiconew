import Checkbox from '@/Components/Checkbox';
import GuestLayout from '@/Layouts/GuestLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Iniciar sesión" />

            {/* Mensaje de estado */}
            {status && <div className="mb-4 font-medium text-sm text-green-600">{status}</div>}

            {/* Formulario */}
            <form onSubmit={submit} className="w-full max-w-md space-y-6 bg-white p-8 rounded-lg shadow-lg border border-gray-200">
                
                <h2 className="text-2xl font-semibold text-center text-blue-500 mb-6">Iniciar sesión</h2>

                {/* Campo de correo */}
                <div>
                    <InputLabel htmlFor="email" value="Correo electrónico" className="text-blue-600 font-semibold" />
                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1 block w-full bg-blue-50 border border-blue-200 rounded-lg p-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                        autoComplete="username"
                        isFocused={true}
                        onChange={(e) => setData('email', e.target.value)}
                    />
                    <InputError message={errors.email} className="mt-2" />
                </div>

                {/* Campo de contraseña */}
                <div>
                    <InputLabel htmlFor="password" value="Contraseña" className="text-blue-600 font-semibold" />
                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="mt-1 block w-full bg-blue-50 border border-blue-200 rounded-lg p-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                        autoComplete="current-password"
                        onChange={(e) => setData('password', e.target.value)}
                    />
                    <InputError message={errors.password} className="mt-2" />
                </div>

                {/* Recordarme */}
                <div className="flex items-center mt-4 text-blue-600 font-semibold">
                    <Checkbox
                        name="remember"
                        checked={data.remember}
                        onChange={(e) => setData('remember', e.target.checked)}
                    />
                    <span className="ml-2 text-sm">Recordarme</span>
                </div>

                {/* Enlace para restablecer contraseña y botón de inicio de sesión */}
                <div className="flex justify-between items-center mt-6">
                    {canResetPassword && (
                        <Link
                            href={route('password.request')}
                            className="underline text-sm text-blue-500 hover:text-blue-700"
                        >
                            ¿Olvidaste tu contraseña?
                        </Link>
                    )}

                    <PrimaryButton className="bg-blue-500 hover:bg-blue-600 text-white rounded-lg px-6 py-2 transition-colors duration-200 ease-in-out" disabled={processing}>
                        Iniciar sesión
                    </PrimaryButton>
                </div>
            </form>
        </GuestLayout>
    );
}
