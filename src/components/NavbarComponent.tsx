import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useGetMeQuery } from "../services/user";
import logo from "/images/Logo.png";

type NavbarProps = {
    isDark: boolean;
    onToggleTheme: () => void;
};

const API_ORIGIN = (
    import.meta.env.VITE_FORUM_BASE_URL ??
    "https://forum-istad-api.cheat.casa/api/v1"
).replace(/\/api\/v1\/?$/, "");

function resolveMediaUrl(path?: string | null): string | undefined {
    if (!path) return undefined;
    if (/^https?:\/\//i.test(path)) return path;
    return `${API_ORIGIN}/${path.replace(/^\//, "")}`;
}

interface CurrentUser {
    id: number;
    username?: string;
    displayName?: string;
    name?: string;
    email?: string;
    profileImage?: string;
}

const NAV_LINKS = [
    { label: "Home", href: "/" },
    { label: "Question", href: "/home" },
    { label: "About", href: "/" },
];

const UserFallbackIcon = () => (
    <svg className="h-7 w-7 text-slate-400 lg:h-8 lg:w-8" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 12c2.7 0 4.9-2.2 4.9-4.9S14.7 2.2 12 2.2 7.1 4.4 7.1 7.1 9.3 12 12 12zm0 2.5c-3.3 0-9.8 1.6-9.8 4.9v2.4h19.6v-2.4c0-3.3-6.5-4.9-9.8-4.9z" />
    </svg>
);

export const NavbarComponent = ({ isDark, onToggleTheme }: NavbarProps) => {
    const location = useLocation();
    const isLoggedIn = Boolean(localStorage.getItem("accessToken"));

    const { data: currentUser, isLoading: loadingUser } = useGetMeQuery(undefined, {
        skip: !isLoggedIn,
    }) as { data: CurrentUser | undefined; isLoading: boolean };

    const displayName =
        currentUser?.username ??
        currentUser?.displayName ??
        currentUser?.name ??
        currentUser?.email ??
        "My Account";

    const [avatarLoadFailed, setAvatarLoadFailed] = useState(false);
    const [cachedAvatar, setCachedAvatar] = useState<string | null>(null);

    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {

        setMobileMenuOpen(false);
    }, [location.pathname]);

    useEffect(() => {
        if (!currentUser?.id) {
            setCachedAvatar(null);
            return;
        }
        setCachedAvatar(localStorage.getItem(`avatarPreview:${currentUser.id}`));
    }, [currentUser?.id]);

    useEffect(() => {
        function handleAvatarUpdated(event: Event) {
            const detail = (event as CustomEvent<{ userId?: number; dataUrl: string }>).detail;
            if (!detail || !currentUser?.id) return;
            if (detail.userId === currentUser.id) {
                setCachedAvatar(detail.dataUrl);
            }
        }

        function handleStorageEvent(event: StorageEvent) {
            if (!currentUser?.id) return;
            if (event.key === `avatarPreview:${currentUser.id}`) {
                setCachedAvatar(event.newValue);
            }
        }

        window.addEventListener("avatar-updated", handleAvatarUpdated);
        window.addEventListener("storage", handleStorageEvent);
        return () => {
            window.removeEventListener("avatar-updated", handleAvatarUpdated);
            window.removeEventListener("storage", handleStorageEvent);
        };
    }, [currentUser?.id]);

    const serverAvatarSrc = resolveMediaUrl(currentUser?.profileImage);
    const avatarSrc = cachedAvatar ?? serverAvatarSrc;

    useEffect(() => {
        setAvatarLoadFailed(false);
    }, [avatarSrc]);

    const handleLogout = () => {
        localStorage.removeItem("accessToken");

        window.location.href = location.pathname + location.search;
    };

    return (
        <header className="sticky top-0 z-30 w-full border-b border-slate-200 bg-white shadow-sm transition-colors duration-300 dark:border-slate-800 dark:bg-slate-900 dark:shadow-none">
            <div className="flex h-16 w-full items-center justify-between gap-2 px-3 sm:gap-3 sm:px-6 lg:h-20 lg:px-8">
                <div className="flex min-w-0 shrink-0 items-center gap-2">
                    <img
                        src={logo}
                        alt="Cartora Logo"
                        className="h-14 w-14 shrink-0 object-contain sm:h-18 sm:w-18 lg:h-23 lg:w-23"
                    />
                    <span className="truncate text-base font-extrabold tracking-wide text-slate-900 transition-colors duration-300 dark:text-white sm:text-lg lg:text-xl">
                        AQUARIUM
                    </span>
                </div>

                <nav className="hidden items-center gap-10 xl:flex">
                    {NAV_LINKS.map((link) => (
                        <a
                            key={link.label}
                            href={link.href}
                            className="text-sm font-semibold text-slate-800 transition-colors duration-300 hover:text-blue-700 dark:text-slate-200 dark:hover:text-blue-400"
                        >
                            {link.label}
                        </a>
                    ))}
                </nav>

                <div className="flex shrink-0 items-center gap-2 sm:gap-3 lg:gap-6">
                    {isLoggedIn ? (
                        <div className="flex items-center gap-2 sm:gap-3">
                            <div className="flex items-center gap-2">
                                {avatarSrc && !avatarLoadFailed ? (
                                    <img
                                        src={avatarSrc}
                                        alt={displayName}
                                        className="h-7 w-7 rounded-full object-cover lg:h-8 lg:w-8"
                                        onError={() => setAvatarLoadFailed(true)}
                                    />
                                ) : (
                                    <UserFallbackIcon />
                                )}
                                <span className="hidden max-w-[8rem] truncate text-sm font-semibold text-slate-800 transition-colors duration-300 dark:text-slate-100 sm:inline lg:max-w-none">
                                    {loadingUser ? "Loading..." : displayName}
                                </span>
                            </div>
                            <button
                                type="button"
                                onClick={handleLogout}
                                className="flex items-center gap-1.5 rounded-full border border-slate-300 px-2.5 py-1.5 text-sm font-semibold text-slate-800 transition-colors duration-300 hover:bg-slate-100 dark:border-slate-600 dark:text-slate-100 dark:hover:bg-slate-800 sm:px-3"
                            >
                                <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                <span className="hidden sm:inline">Log Out</span>
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2 sm:gap-3">
                            <Link
                                to="/register"
                                state={{ from: location.pathname + location.search }}
                                className="hidden rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-800 transition-colors duration-300 hover:bg-slate-100 dark:border-slate-600 dark:text-slate-100 dark:hover:bg-slate-800 sm:inline-block"
                            >
                                Sign Up
                            </Link>
                            <Link
                                to="/login"
                                state={{ from: location.pathname + location.search }}
                                className="flex items-center gap-2 rounded-full bg-blue-600 px-3 py-2 text-sm font-semibold text-white transition-colors duration-300 hover:bg-blue-500 sm:px-4"
                            >
                                <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4M10 17l5-5-5-5M15 12H3" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                <span className="hidden sm:inline">Sign In</span>
                            </Link>
                        </div>
                    )}

                    <button
                        type="button"
                        aria-label="Toggle theme"
                        onClick={onToggleTheme}
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-700 transition-colors duration-300 hover:bg-blue-200 dark:bg-slate-800 dark:text-yellow-300 dark:hover:bg-slate-700"
                    >
                        {isDark ? (
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path d="M12 4V2m0 20v-2m8-8h2M2 12h2m14.14-6.14l1.42-1.42M4.44 19.56l1.42-1.42M19.56 19.56l-1.42-1.42M4.44 4.44L5.86 5.86M12 7a5 5 0 100 10 5 5 0 000-10z" strokeLinecap="round" />
                            </svg>
                        ) : (
                            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M21 12.8A9 9 0 1111.2 3a7 7 0 009.8 9.8z" />
                            </svg>
                        )}
                    </button>

                    {/* Hamburger — only needed below xl, where the inline nav is hidden */}
                    <button
                        type="button"
                        aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
                        aria-expanded={mobileMenuOpen}
                        onClick={() => setMobileMenuOpen((open) => !open)}
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-slate-700 transition-colors duration-300 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800 xl:hidden"
                    >
                        {mobileMenuOpen ? (
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        ) : (
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        )}
                    </button>
                </div>
            </div>

            {/* Mobile nav panel */}
            {mobileMenuOpen && (
                <nav className="border-t border-slate-200 bg-white px-4 py-3 transition-colors duration-300 dark:border-slate-800 dark:bg-slate-900 xl:hidden">
                    <ul className="flex flex-col gap-1">
                        {NAV_LINKS.map((link) => (
                            <li key={link.label}>
                                <a
                                    href={link.href}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="block rounded-lg px-3 py-2.5 text-sm font-semibold text-slate-800 transition-colors duration-300 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
                                >
                                    {link.label}
                                </a>
                            </li>
                        ))}
                    </ul>
                </nav>
            )}
        </header>
    );
};
