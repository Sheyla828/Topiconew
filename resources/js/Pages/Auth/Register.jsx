import GuestLayout from '@/Layouts/GuestLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Register({ status }) { // Recibe 'status' como prop
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        aPaterno: '',
        aMaterno: '',
        telefono: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Registro" />

            {/* Mensaje de estado si el registro está cerrado */}
            {status && (
                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-md" role="alert">
                    <p className="font-bold">Registro cerrado</p>
                    <p>{status}</p>
                </div>
            )}

            {/* Formulario de registro solo si no hay un mensaje de estado */}
            {!status && (
                <form onSubmit={submit} className="bg-white p-8 rounded-lg shadow-lg max-w-lg mx-auto mt-10 border border-gray-200">
                    <h2 className="text-2xl font-bold text-center text-blue-500 mb-6">Registro de Usuario</h2>

                    {/* Nombre completo */}
                    <div>
                        <InputLabel htmlFor="name" value="Nombre Completo" />
                        <TextInput
                            id="name"
                            name="name"
                            value={data.name}
                            className="mt-1 block w-full"
                            autoComplete="name"
                            isFocused
                            onChange={(e) => setData('name', e.target.value)}
                            required
                        />
                        <InputError message={errors.name} className="mt-2" />
                    </div>

                    {/* Apellido Paterno */}
                    <div className="mt-4">
                        <InputLabel htmlFor="aPaterno" value="Apellido Paterno" />
                        <TextInput
                            id="aPaterno"
                            name="aPaterno"
                            value={data.aPaterno}
                            className="mt-1 block w-full"
                            onChange={(e) => setData('aPaterno', e.target.value)}
                            required
                        />
                        <InputError message={errors.aPaterno} className="mt-2" />
                    </div>

                    {/* Apellido Materno */}
                    <div className="mt-4">
                        <InputLabel htmlFor="aMaterno" value="Apellido Materno" />
                        <TextInput
                            id="aMaterno"
                            name="aMaterno"
                            value={data.aMaterno}
                            className="mt-1 block w-full"
                            onChange={(e) => setData('aMaterno', e.target.value)}
                            required
                        />
                        <InputError message={errors.aMaterno} className="mt-2" />
                    </div>

                    {/* Teléfono */}
                    <div className="mt-4">
                        <InputLabel htmlFor="telefono" value="Teléfono" />
                        <TextInput
                            id="telefono"
                            type="tel"
                            name="telefono"
                            value={data.telefono}
                            className="mt-1 block w-full"
                            onChange={(e) => setData('telefono', e.target.value)}
                            required
                        />
                        <InputError message={errors.telefono} className="mt-2" />
                    </div>

                    {/* Correo Electrónico */}
                    <div className="mt-4">
                        <InputLabel htmlFor="email" value="Correo Electrónico" />
                        <TextInput
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            className="mt-1 block w-full"
                            autoComplete="username"
                            onChange={(e) => setData('email', e.target.value)}
                            required
                        />
                        <InputError message={errors.email} className="mt-2" />
                    </div>

                    {/* Contraseña */}
                    <div className="mt-4">
                        <InputLabel htmlFor="password" value="Contraseña" />
                        <TextInput
                            id="password"
                            type="password"
                            name="password"
                            value={data.password}
                            className="mt-1 block w-full"
                            autoComplete="new-password"
                            onChange={(e) => setData('password', e.target.value)}
                            required
                        />
                        <InputError message={errors.password} className="mt-2" />
                    </div>

                    {/* Confirmar Contraseña */}
                    <div className="mt-4">
                        <InputLabel htmlFor="password_confirmation" value="Confirmar Contraseña" />
                        <TextInput
                            id="password_confirmation"
                            type="password"
                            name="password_confirmation"
                            value={data.password_confirmation}
                            className="mt-1 block w-full"
                            autoComplete="new-password"
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                            required
                        />
                        <InputError message={errors.password_confirmation} className="mt-2" />
                    </div>

                    {/* Botones */}
                    <div className="flex items-center justify-between mt-6">
                        <Link
                            href={route('login')}
                            className="text-sm text-blue-500 underline hover:text-blue-700"
                        >
                            ¿Ya tienes cuenta?
                        </Link>
                        <PrimaryButton className="ml-4" disabled={processing}>
                            Registrar
                        </PrimaryButton>
                    </div>
                </form>
            )}
        </GuestLayout>
    );
}