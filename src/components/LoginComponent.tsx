import { useState } from "react";
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

    const [alertMessage, setAlertMessage] = useState<string | null>(null);

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
        setAlertMessage(null);

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
            setAlertMessage("Invalid email or password. Please try again.");
        }
    };

    const onHandleInvalidForm = () => {
        setAlertMessage("Please fix the highlighted fields before continuing.");
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-[#a6acc9] p-4 sm:p-6">
            <div className="w-full max-w-4xl bg-white rounded-2xl sm:rounded-3xl shadow-2xl flex flex-col md:flex-row overflow-hidden">
                {/* Left: Form Panel */}
                <div className="w-full md:w-1/2 flex items-center justify-center bg-[#f4f2f9] border-b md:border-b-0 md:border-r border-slate-200 py-8 sm:py-10">
                    <div className="w-full max-w-xs bg-slate-50 rounded-2xl shadow-md px-6 sm:px-8 py-8 sm:py-10">
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

                        {/* Alert */}
                        {alertMessage && (
                            <div
                                role="alert"
                                className="mb-4 flex items-start gap-2 rounded-xl bg-red-50 border border-red-200 px-4 py-3"
                            >
                                <svg
                                    className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M8.257 3.099c.765-1.36 2.72-1.36 3.486 0l6.28 11.18c.75 1.335-.213 2.99-1.742 2.99H3.72c-1.53 0-2.492-1.655-1.743-2.99l6.28-11.18zM11 14a1 1 0 11-2 0 1 1 0 012 0zm-.25-6.75a.75.75 0 00-1.5 0v3.5a.75.75 0 001.5 0v-3.5z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                                <p className="text-sm text-red-600 flex-1">{alertMessage}</p>
                                <button
                                    type="button"
                                    onClick={() => setAlertMessage(null)}
                                    className="text-red-400 hover:text-red-600 text-sm leading-none"
                                    aria-label="Dismiss"
                                >
                                    ✕
                                </button>
                            </div>
                        )}

                        {/* Form */}
                        <form
                            className="space-y-4"
                            onSubmit={handleSubmit(onHandleSubmitForm, onHandleInvalidForm)}
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

                            <div className="text-center sm:text-left sm:ml-14">
                                <Link
                                    to="/register"
                                    className="text-sm text-red-500 hover:underline cursor-pointer"
                                >
                                    Don't have account yet
                                </Link>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Right: Picture Panel */}
                <div className="hidden md:flex w-full md:w-1/2 relative items-center justify-center bg-white overflow-hidden min-h-[200px] md:min-h-0">
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