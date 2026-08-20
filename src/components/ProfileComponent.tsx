import { Component, useEffect, useRef, useState, type ChangeEvent, type ErrorInfo, type FormEvent, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";

import {
    useGetMeQuery,
    useUpdateUserMutation,
    useUpdatePasswordMutation,
    useUploadAvatarMutation,
    useDeleteUserByIdMutation,
} from "../services/user";
import { SidebarComponent } from "./SideBarComponent";

interface BoundaryState {
    error: Error | null;
}

class ProfileErrorBoundary extends Component<{ children: ReactNode }, BoundaryState> {
    state: BoundaryState = { error: null };

    static getDerivedStateFromError(error: Error): BoundaryState {
        return { error };
    }

    componentDidCatch(error: Error, info: ErrorInfo) {
        console.error("ProfileComponent crashed:", error, info.componentStack);
    }

    render() {
        if (this.state.error) {
            return (
                <div className="flex h-screen w-full items-center justify-center bg-slate-50 p-4 text-slate-900 transition-colors duration-300 dark:bg-[#0A0F1F] dark:text-white sm:p-8">
                    <div className="w-full max-w-xl rounded-2xl border border-red-300 bg-red-50 p-4 dark:border-red-500/30 dark:bg-red-500/10 sm:p-6">
                        <h2 className="text-base font-bold text-red-600 dark:text-red-400 sm:text-lg">
                            Profile page crashed
                        </h2>
                        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                            {this.state.error.message}
                        </p>
                        <pre className="mt-3 max-h-64 overflow-auto whitespace-pre-wrap rounded-lg bg-slate-100 p-3 text-[11px] text-red-600 dark:bg-black/40 dark:text-red-300">
                            {this.state.error.stack}
                        </pre>
                    </div>
                </div>
            );
        }
        return this.props.children;
    }
}

interface UserProfile {
    id: number;
    displayName: string;
    email: string;
    bio?: string;
    profileImage?: string;
}

type SettingsTab = "general" | "security";

const API_ORIGIN = (
    import.meta.env.VITE_FORUM_BASE_URL ??
    "https://forum-istad-api.cheat.casa/api/v1"
).replace(/\/api\/v1\/?$/, "");

function resolveMediaUrl(path?: string): string | undefined {
    if (!path) return undefined;
    if (/^https?:\/\//i.test(path)) return path;
    return `${API_ORIGIN}/${path.replace(/^\//, "")}`;
}

interface ApiError {
    status?: number | string;
    data?: { message?: string };
}

function getErrorMessage(error: unknown, fallback: string): string {
    const err = error as ApiError;
    if (err?.data?.message) return err.data.message;
    if (err?.status) return `${fallback} (status ${err.status})`;
    return fallback;
}

const UserIcon = () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
        <path d="M12 12c2.7 0 4.9-2.2 4.9-4.9S14.7 2.2 12 2.2 7.1 4.4 7.1 7.1 9.3 12 12 12zm0 2.5c-3.3 0-9.8 1.6-9.8 4.9v2.4h19.6v-2.4c0-3.3-6.5-4.9-9.8-4.9z" />
    </svg>
);

const LockIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
        <rect x="4" y="10" width="16" height="10" rx="2" />
        <path d="M8 10V7a4 4 0 0 1 8 0v3" />
    </svg>
);

const LogoutIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
        <path d="M16 17l5-5-5-5" />
        <path d="M21 12H9" />
    </svg>
);

const ProfileComponentInner = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<SettingsTab>("general");

    const {
        data: me,
        isLoading: meLoading,
        isFetching: meFetching,
        isError: meIsError,
    } = useGetMeQuery(undefined);

    const user = me as UserProfile | undefined;

    const [displayName, setDisplayName] = useState("");
    const [bio, setBio] = useState("");
    const [profileError, setProfileError] = useState<string | null>(null);
    const [profileSuccess, setProfileSuccess] = useState(false);

    const [updateUser, { isLoading: savingProfile }] = useUpdateUserMutation();

    useEffect(() => {
        if (user) {
            setDisplayName(user.displayName ?? "");
            setBio(user.bio ?? "");
        }
    }, [user?.id]);

    async function saveProfile() {
        const trimmedName = displayName.trim();
        if (!trimmedName) {
            setProfileError("Display name can't be empty.");
            return;
        }

        setProfileError(null);
        setProfileSuccess(false);

        try {
            await updateUser({
                updatedUser: {
                    displayName: trimmedName,
                    bio: bio.trim(),
                },
            }).unwrap();

            setProfileSuccess(true);
        } catch (error) {
            console.error("Failed to update profile:", error);
            setProfileError(getErrorMessage(error, "Couldn't update your profile."));
        }
    }

    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordError, setPasswordError] = useState<string | null>(null);
    const [passwordSuccess, setPasswordSuccess] = useState(false);

    const [updatePassword, { isLoading: changingPassword }] = useUpdatePasswordMutation();

    async function handleChangePassword(event: FormEvent) {
        event.preventDefault();
        setPasswordError(null);
        setPasswordSuccess(false);

        if (!oldPassword || !newPassword || !confirmPassword) {
            setPasswordError("Fill in all fields.");
            return;
        }

        if (newPassword !== confirmPassword) {
            setPasswordError("New passwords don't match.");
            return;
        }

        try {
            await updatePassword({
                passwordInfo: { oldPassword, newPassword, confirmPassword },
            }).unwrap();

            setPasswordSuccess(true);
            setOldPassword("");
            setNewPassword("");
            setConfirmPassword("");
        } catch (error) {
            console.error("Failed to update password:", error);
            setPasswordError(getErrorMessage(error, "Couldn't update your password. Check your current password and try again."));
        }
    }

    const avatarInputRef = useRef<HTMLInputElement>(null);
    const [avatarError, setAvatarError] = useState<string | null>(null);
    const [avatarLoadFailed, setAvatarLoadFailed] = useState(false);
    const [avatarVersion, setAvatarVersion] = useState(0);
    const [uploadAvatar, { isLoading: uploadingAvatar }] = useUploadAvatarMutation();

    const avatarCacheKey = user ? `avatarPreview:${user.id}` : null;
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

    useEffect(() => {
        if (!avatarCacheKey) return;
        const cached = localStorage.getItem(avatarCacheKey);
        if (cached) setAvatarPreview(cached);
    }, [avatarCacheKey]);

    const resolvedAvatarBase = resolveMediaUrl(user?.profileImage);
    const serverAvatarSrc = resolvedAvatarBase
        ? `${resolvedAvatarBase}${resolvedAvatarBase.includes("?") ? "&" : "?"}v=${avatarVersion}`
        : undefined;

    const avatarSrc = avatarPreview ?? serverAvatarSrc;

    useEffect(() => {
        setAvatarLoadFailed(false);
    }, [user?.profileImage]);

    function handleAvatarButtonClick() {
        avatarInputRef.current?.click();
    }

    function readFileAsDataUrl(file: File): Promise<string> {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = () => reject(reader.error);
            reader.readAsDataURL(file);
        });
    }

    async function handleAvatarChange(event: ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.[0];
        if (!file) return;

        setAvatarError(null);
        setAvatarLoadFailed(false);

        try {
            const dataUrl = await readFileAsDataUrl(file);
            setAvatarPreview(dataUrl);
            if (avatarCacheKey) {
                localStorage.setItem(avatarCacheKey, dataUrl);
                window.dispatchEvent(
                    new CustomEvent("avatar-updated", {
                        detail: { userId: user?.id, dataUrl },
                    })
                );
            }

            await uploadAvatar({ file }).unwrap();
            setAvatarVersion((v) => v + 1);
        } catch (error) {
            console.error("Failed to upload avatar:", error);
            setAvatarError(getErrorMessage(error, "Couldn't upload your photo."));
        } finally {
            event.target.value = "";
        }
    }

    const [deleteUserById, { isLoading: deletingAccount }] = useDeleteUserByIdMutation();
    const [deleteError, setDeleteError] = useState<string | null>(null);

    async function handleDeleteAccount(userId: number) {
        const confirmed = window.confirm("Delete your account? This can't be undone.");
        if (!confirmed) return;

        setDeleteError(null);

        try {
            await deleteUserById({ userId }).unwrap();
            localStorage.removeItem("accessToken");
            navigate("/login");
        } catch (error) {
            console.error("Failed to delete account:", error);
            setDeleteError(getErrorMessage(error, "Couldn't delete your account."));
        }
    }

    function handleLogout() {
        localStorage.removeItem("accessToken");
        navigate("/login");
    }

    const inputClass =
        "w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-[#8B5CF6]/50 transition-colors duration-300 dark:border-white/10 dark:bg-[#141B33] dark:text-white dark:placeholder:text-slate-500 sm:px-4 sm:py-3";
    const labelClass = "mb-2 block text-xs font-semibold text-slate-600 dark:text-slate-300";

    return (
        <div className="flex h-screen w-full flex-col overflow-hidden bg-slate-50 text-slate-900 transition-colors duration-300 dark:bg-[#0A0F1F] dark:text-white lg:flex-row">
            <SidebarComponent />

            <main className="min-h-0 flex-1 overflow-y-auto px-4 py-6 sm:px-6 sm:py-8 lg:px-10">
                {meLoading && <p className="text-sm text-slate-500 dark:text-slate-400">Loading profile...</p>}
                {meIsError && <p className="text-sm text-red-500 dark:text-red-400">Couldn't load your profile.</p>}

                {!meLoading && !meIsError && user && (
                    <div className="mx-auto flex max-w-6xl flex-col gap-6 sm:gap-8 lg:flex-row lg:items-start">
                        {/* ============================================
                            LEFT — SETTINGS CONTENT
                        ============================================ */}
                        <div className="min-w-0 flex-1">
                            {activeTab === "general" && (
                                <>
                                    <div className="flex flex-col items-start gap-3 sm:flex-row sm:flex-wrap sm:items-start sm:justify-between sm:gap-4">
                                        <div>
                                            <h2 className="text-lg font-bold text-slate-900 dark:text-white sm:text-xl">General</h2>
                                            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                                Use the form below to update your profile.
                                            </p>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={saveProfile}
                                            disabled={savingProfile || !displayName.trim()}
                                            className="w-full shrink-0 rounded-xl bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-purple-900/30 transition-opacity hover:opacity-90 disabled:opacity-50 sm:w-auto"
                                        >
                                            {savingProfile ? "Saving..." : "Save Profile"}
                                        </button>
                                    </div>

                                    {profileError && (
                                        <p className="mt-3 text-xs text-red-500 dark:text-red-400">{profileError}</p>
                                    )}
                                    {profileSuccess && !profileError && (
                                        <p className="mt-3 text-xs text-emerald-600 dark:text-emerald-400">Profile updated.</p>
                                    )}

                                    {/* avatar */}
                                    <div className="mt-6 flex items-center gap-3 sm:gap-4">
                                        <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full border border-slate-200 bg-slate-100 transition-colors duration-300 dark:border-white/10 dark:bg-[#141B33] sm:h-16 sm:w-16">
                                            {avatarSrc && !avatarLoadFailed ? (
                                                <img
                                                    src={avatarSrc}
                                                    alt={user.displayName}
                                                    className="h-full w-full object-cover"
                                                    onError={() => setAvatarLoadFailed(true)}
                                                />
                                            ) : (
                                                <div className="p-3 text-slate-400 dark:text-slate-500">
                                                    <UserIcon />
                                                </div>
                                            )}
                                            {meFetching && (
                                                <div className="absolute inset-0 animate-pulse bg-black/10 dark:bg-black/40" />
                                            )}
                                        </div>

                                        <div className="min-w-0">
                                            <input
                                                ref={avatarInputRef}
                                                type="file"
                                                accept="image/*"
                                                onChange={handleAvatarChange}
                                                className="hidden"
                                            />
                                            <button
                                                type="button"
                                                onClick={handleAvatarButtonClick}
                                                disabled={uploadingAvatar}
                                                className="rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs font-semibold text-slate-600 transition-colors duration-300 hover:border-slate-400 disabled:opacity-50 dark:border-white/10 dark:bg-[#141B33] dark:text-slate-200 dark:hover:border-white/20 sm:px-4"
                                            >
                                                {uploadingAvatar ? "Uploading..." : "Change Photo"}
                                            </button>
                                            {avatarError && (
                                                <p className="mt-2 text-xs text-red-500 dark:text-red-400">{avatarError}</p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="mt-6 grid gap-4 sm:grid-cols-2">
                                        <div>
                                            <label className={labelClass}>Display Name</label>
                                            <input
                                                type="text"
                                                value={displayName}
                                                onChange={(e) => {
                                                    setDisplayName(e.target.value);
                                                    setProfileError(null);
                                                    setProfileSuccess(false);
                                                }}
                                                className={inputClass}
                                            />
                                        </div>

                                        <div>
                                            <label className={labelClass}>Email</label>
                                            <input
                                                type="email"
                                                value={user.email}
                                                disabled
                                                className={`${inputClass} cursor-not-allowed opacity-60`}
                                            />
                                        </div>
                                    </div>
                                    <p className="mt-2 text-xs text-slate-500 dark:text-slate-500">
                                        Your email is used to sign in and can't be changed here.
                                    </p>

                                    <div className="my-8 border-t border-slate-200 dark:border-white/5 sm:my-10" />

                                    <div>
                                        <h2 className="text-lg font-bold text-slate-900 dark:text-white sm:text-xl">Profile Section</h2>
                                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                            Use the form below to update your profile.
                                        </p>
                                    </div>

                                    <div className="mt-6">
                                        <label className={labelClass}>Bio</label>
                                        <textarea
                                            value={bio}
                                            onChange={(e) => {
                                                setBio(e.target.value);
                                                setProfileError(null);
                                                setProfileSuccess(false);
                                            }}
                                            rows={4}
                                            className={inputClass}
                                        />
                                        <p className="mt-2 text-xs text-slate-500 dark:text-slate-500">
                                            A short bio shown on your public profile.
                                        </p>
                                    </div>
                                </>
                            )}

                            {activeTab === "security" && (
                                <>
                                    <div>
                                        <h2 className="text-lg font-bold text-slate-900 dark:text-white sm:text-xl">Security</h2>
                                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                            Update your password to keep your account secure.
                                        </p>
                                    </div>

                                    <form onSubmit={handleChangePassword} className="mt-6 space-y-4">
                                        <div>
                                            <label className={labelClass}>Current Password</label>
                                            <input
                                                type="password"
                                                value={oldPassword}
                                                onChange={(e) => setOldPassword(e.target.value)}
                                                className={inputClass}
                                            />
                                        </div>

                                        <div className="grid gap-4 sm:grid-cols-2">
                                            <div>
                                                <label className={labelClass}>New Password</label>
                                                <input
                                                    type="password"
                                                    value={newPassword}
                                                    onChange={(e) => setNewPassword(e.target.value)}
                                                    className={inputClass}
                                                />
                                            </div>
                                            <div>
                                                <label className={labelClass}>Confirm New Password</label>
                                                <input
                                                    type="password"
                                                    value={confirmPassword}
                                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                                    className={inputClass}
                                                />
                                            </div>
                                        </div>

                                        {passwordError && (
                                            <p className="text-xs text-red-500 dark:text-red-400">{passwordError}</p>
                                        )}
                                        {passwordSuccess && (
                                            <p className="text-xs text-emerald-600 dark:text-emerald-400">Password updated.</p>
                                        )}

                                        <button
                                            type="submit"
                                            disabled={changingPassword}
                                            className="w-full rounded-xl bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-purple-900/30 transition-opacity hover:opacity-90 disabled:opacity-50 sm:w-auto"
                                        >
                                            {changingPassword ? "Updating..." : "Update Password"}
                                        </button>
                                    </form>

                                    <div className="my-8 border-t border-slate-200 dark:border-white/5 sm:my-10" />

                                    <div>
                                        <h2 className="text-lg font-bold text-red-600 dark:text-red-400 sm:text-xl">Danger Zone</h2>
                                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                            Permanently delete your account and all associated data.
                                        </p>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => handleDeleteAccount(user.id)}
                                        disabled={deletingAccount}
                                        className="mt-6 w-full rounded-xl border border-red-300 bg-red-50 px-6 py-2.5 text-sm font-semibold text-red-600 transition-colors duration-300 hover:bg-red-100 disabled:opacity-50 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-500/20 sm:w-auto"
                                    >
                                        {deletingAccount ? "Deleting..." : "Delete Account"}
                                    </button>
                                    {deleteError && (
                                        <p className="mt-2 text-xs text-red-500 dark:text-red-400">{deleteError}</p>
                                    )}
                                </>
                            )}
                        </div>

                        {/* ============================================
                            RIGHT — SETTINGS NAV
                        ============================================ */}
                        <aside className="w-full shrink-0 lg:sticky lg:top-8 lg:w-72">
                            <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm transition-colors duration-300 dark:border-transparent dark:bg-[#111834] dark:shadow-none">
                                <button
                                    type="button"
                                    onClick={() => setActiveTab("general")}
                                    className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors duration-300 ${
                                        activeTab === "general"
                                            ? "bg-slate-100 dark:bg-[#1B2340]"
                                            : "hover:bg-slate-100 dark:hover:bg-white/5"
                                    }`}
                                >
                                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-200 text-slate-600 transition-colors duration-300 dark:bg-[#232B4D] dark:text-slate-200">
                                        <UserIcon />
                                    </span>
                                    <span className="min-w-0">
                                        <span className="block text-sm font-semibold text-slate-900 dark:text-white">General</span>
                                        <span className="block truncate text-xs text-slate-500 dark:text-slate-400">
                                            Profile name, bio
                                        </span>
                                    </span>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setActiveTab("security")}
                                    className={`mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors duration-300 ${
                                        activeTab === "security"
                                            ? "bg-slate-100 dark:bg-[#1B2340]"
                                            : "hover:bg-slate-100 dark:hover:bg-white/5"
                                    }`}
                                >
                                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-200 text-slate-600 transition-colors duration-300 dark:bg-[#232B4D] dark:text-slate-200">
                                        <LockIcon />
                                    </span>
                                    <span className="min-w-0">
                                        <span className="block text-sm font-semibold text-slate-900 dark:text-white">Security</span>
                                        <span className="block truncate text-xs text-slate-500 dark:text-slate-400">
                                            Password, delete account
                                        </span>
                                    </span>
                                </button>

                                <div className="mt-2 border-t border-slate-200 pt-2 dark:border-white/5">
                                    <button
                                        type="button"
                                        onClick={handleLogout}
                                        className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors duration-300 hover:bg-slate-100 dark:hover:bg-white/5"
                                    >
                                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-500/10 dark:text-red-400">
                                            <LogoutIcon />
                                        </span>
                                        <span className="text-sm font-semibold text-red-600 dark:text-red-400">Log Out</span>
                                    </button>
                                </div>
                            </div>
                        </aside>
                    </div>
                )}
            </main>
        </div>
    );
};

export const ProfileComponent = () => (
    <ProfileErrorBoundary>
        <ProfileComponentInner />
    </ProfileErrorBoundary>
);

export default ProfileComponent;
