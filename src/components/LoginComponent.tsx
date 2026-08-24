import { useForm } from "react-hook-form";
import { Link, useLocation } from "react-router-dom";
import { useUserLoginMutation } from "../services/auth";

type LoginFormValues = {
    email: string;
    password: string;
};

export default function LoginComponent() {
    const location = useLocation();

    const from = (location.state as { from?: string })?.from ?? "/";

    const [userLogin, { isLoading }] = useUserLoginMutation();

    const {
        register,
        handleSubmit,
        setError,
        formState: { errors },
    } = useForm<LoginFormValues>({
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const onHandleSubmitForm = async (value: LoginFormValues) => {
        try {
            const data = await userLogin({
                loginInfo: {
                    email: value.email,
                    password: value.password,
                },
            }).unwrap();

            const accessToken = data.accessToken ?? data.token ?? data.access_token;

            if (!accessToken) {
                throw new Error("No access token returned from server");
            }

            localStorage.setItem("accessToken", accessToken);

            window.location.href = from;
        } catch (error) {
            console.log(error);
            setError("password", {
                type: "manual",
                message: "Invalid email or password",
            });
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
                                    LOGIN
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
                                <label className="block text-sm text-slate-800 mb-1">
                                    Email
                                </label>
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
                                <label className="block text-sm text-slate-800 mb-1">
                                    Password
                                </label>
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

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full rounded-full bg-[#0f2340] hover:bg-[#16305a] transition-colors text-white font-medium py-3 text-sm mt-2 disabled:opacity-60"
                            >
                                {isLoading ? "Logging in..." : "Login"}
                            </button>

                            <Link
                                to="/register"
                                className="ml-14 text-sm text-red-500 hover:underline cursor-pointer"
                            >
                                Don't have account yet
                            </Link>
                        </form>
                    </div>
                </div>

                {/* Right: Picture Panel */}
                <div className="w-1/2 relative flex items-center justify-center bg-white overflow-hidden">
                    <img
                        src="/images/Secure.jpg"
                        alt="Login illustration"
                        className="w-full h-full object-cover"
                    />
                </div>
            </div>
        </div>
    );
}