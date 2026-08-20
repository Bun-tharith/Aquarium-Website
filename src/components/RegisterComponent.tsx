import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useUserRegisterMutation } from "../services/auth";

type RegisterFormValues = {
    confirmPassword: string;
    email: string;
    password: string;
    username: string;
};

export default function RegisterComponent() {
    const navigate = useNavigate();

    const [userRegister, { isLoading }] = useUserRegisterMutation();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterFormValues>({
        defaultValues: {
            email: "",
            password: "",
            username: "",
            confirmPassword: "",
        },
    });

    const onHandleSubmitForm = async (value: RegisterFormValues) => {
        try {
            const data = await userRegister({
                registerInfo: {
                    email: value.email,
                    password: value.password,
                    username: value.username,
                    confirmPassword: value.confirmPassword,
                },
            }).unwrap();

            console.log(data);

            navigate("/login"); // go to next page on success
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-[#a6acc9] p-6">
            <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl flex overflow-hidden">
                {/* Left: Form Panel */}
                <div className="w-1/2 flex items-center justify-center bg-[#f4f2f9] border-r border-slate-200 py-10">
                    <div className="w-full max-w-xs bg-slate-50 rounded-2xl shadow-md px-8 py-10">
                        {/* Header */}
                        <div className="flex flex-col items-center mb-8">
                            <svg
                                className="w-9 h-9 text-slate-800 mb-2"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path d="M12 12c2.7 0 4.9-2.2 4.9-4.9S14.7 2.2 12 2.2 7.1 4.4 7.1 7.1 9.3 12 12 12zm0 2.5c-3.3 0-9.8 1.6-9.8 4.9v2.4h19.6v-2.4c0-3.3-6.5-4.9-9.8-4.9z" />
                            </svg>
                            <div className="flex items-center gap-3 w-full">
                                <span className="h-[2px] flex-1 bg-blue-800" />
                                <h1 className="text-sm font-bold tracking-wide text-slate-900 whitespace-nowrap">
                                    REGISTER
                                </h1>
                                <span className="h-[2px] flex-1 bg-blue-800" />
                            </div>
                        </div>

                        {/* Form */}
                        <form
                            className="space-y-4"
                            onSubmit={handleSubmit(onHandleSubmitForm)}
                            noValidate
                        >
                            <div>
                                <input
                                    type="text"
                                    placeholder="Username"
                                    className="w-full rounded-full bg-slate-200 text-slate-700 placeholder-slate-500 px-5 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-800/40"
                                    {...register("username", {
                                        required: "Username is required",
                                        minLength: {
                                            value: 3,
                                            message: "Must be at least 3 characters",
                                        },
                                    })}
                                />
                                {errors.username && (
                                    <p className="text-xs text-red-500 mt-1 ml-2">
                                        {errors.username.message}
                                    </p>
                                )}
                            </div>

                            <div>
                                <input
                                    type="email"
                                    placeholder="Email"
                                    className="w-full rounded-full bg-slate-200 text-slate-700 placeholder-slate-500 px-5 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-800/40"
                                    {...register("email", {
                                        required: "Email is required",
                                        pattern: {
                                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                            message: "Enter a valid email",
                                        },
                                    })}
                                />
                                {errors.email && (
                                    <p className="text-xs text-red-500 mt-1 ml-2">
                                        {errors.email.message}
                                    </p>
                                )}
                            </div>

                            <div>
                                <input
                                    type="password"
                                    placeholder="Password"
                                    className="w-full rounded-full bg-slate-200 text-slate-700 placeholder-slate-500 px-5 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-800/40"
                                    {...register("password", {
                                        required: "Password is required",
                                        minLength: {
                                            value: 6,
                                            message: "Must be at least 6 characters",
                                        },
                                    })}
                                />
                                {errors.password && (
                                    <p className="text-xs text-red-500 mt-1 ml-2">
                                        {errors.password.message}
                                    </p>
                                )}
                            </div>

                            <div>
                                <input
                                    type="password"
                                    placeholder="Confirm Password"
                                    className="w-full rounded-full bg-slate-200 text-slate-700 placeholder-slate-500 px-5 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-800/40"
                                    {...register("confirmPassword", {
                                        required: "Please confirm your password",
                                    })}
                                />
                                {errors.confirmPassword && (
                                    <p className="text-xs text-red-500 mt-1 ml-2">
                                        {errors.confirmPassword.message}
                                    </p>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full rounded-full bg-[#0f2340] hover:bg-[#16305a] transition-colors text-white font-medium py-3 text-sm mt-2 disabled:opacity-60"
                            >
                                {isLoading ? "Registering..." : "Register"}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Right: Picture Panel */}
                <div className="w-1/2 relative flex items-center justify-center bg-white overflow-hidden">
                    <img
                        src="/images/Secure.jpg"
                        alt="Register illustration"
                        className="w-full h-full object-cover"
                    />
                </div>
            </div>
        </div>
    );
}