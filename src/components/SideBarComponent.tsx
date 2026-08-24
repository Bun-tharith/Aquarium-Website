import type { ReactNode } from "react";
import { useLocation, useNavigate } from "react-router-dom";

type NavItem = {
    label: string;
    path: string;
    bg: string;
    icon: ReactNode;

    requiresAuth?: boolean;
};

const navItems: NavItem[] = [
    {
        label: "Question",
        path: "/home",
        bg: "bg-blue-500",
        icon: (
            <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <circle cx={12} cy={12} r={9} />
                <path d="M9.5 9a2.5 2.5 0 115 .5c0 1.5-2.5 1.5-2.5 3.5" strokeLinecap="round" />
                <circle cx={12} cy={17} r="0.5" fill="currentColor" />
            </svg>
        ),
    },
    {
        label: "AI Assist",
        path: "/ai",
        bg: "bg-indigo-500",
        icon: <span className="text-[9px] font-bold">AI</span>,
    },
    {
        label: "Saves",
        path: "/saves",
        bg: "bg-blue-600",
        requiresAuth: true,
        icon: (
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 3h12a1 1 0 011 1v17l-7-4-7 4V4a1 1 0 011-1z" />
            </svg>
        ),
    },
     {
        label: "Tags",
        path: "/tag",
        bg: "bg-teal-500",
        requiresAuth: true,
        icon: (
            <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path
                    d="M20.59 13.41 11 3.83A2 2 0 0 0 9.59 3.24L4 3a1 1 0 0 0-1 1l.24 5.59a2 2 0 0 0 .59 1.41l9.58 9.58a2 2 0 0 0 2.83 0l4.35-4.35a2 2 0 0 0 0-2.82Z"
                    strokeLinejoin="round"
                />
                <circle cx="7.5" cy="7.5" r="1.2" fill="currentColor" stroke="none" />
            </svg>
        ),
    },
    {
        label: "Profile",
        path: "/profile",
        bg: "bg-slate-400",
        requiresAuth: true,
        icon: (
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 12c2.7 0 4.9-2.2 4.9-4.9S14.7 2.2 12 2.2 7.1 4.4 7.1 7.1 9.3 12 12 12zm0 2.5c-3.3 0-9.8 1.6-9.8 4.9v2.4h19.6v-2.4c0-3.3-6.5-4.9-9.8-4.9z" />
            </svg>
        ),
    },
];

export const SidebarComponent = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const isLoggedIn = Boolean(localStorage.getItem("accessToken"));

    function handleItemClick(item: NavItem) {
        if (item.requiresAuth && !isLoggedIn) {
            sessionStorage.setItem("postLoginRedirect", item.path);
            navigate("/login");
            return;
        }
        navigate(item.path);
    }

    return (
        <aside className="w-full shrink-0 overflow-x-auto overflow-y-visible border-b border-slate-200 bg-white py-3 transition-colors duration-300 dark:border-b-0 dark:border-r dark:border-slate-800/80 dark:bg-slate-950 dark:shadow-[inset_-1px_0_0_rgba(255,255,255,0.03)] lg:h-full lg:w-64 lg:overflow-x-visible lg:overflow-y-auto lg:py-6">
            <nav className="flex gap-2 px-4 lg:block lg:space-y-2 lg:px-0">
                {navItems.map((item, index) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <div key={`${item.path}-${index}`} className="shrink-0 lg:px-4">
                            <button
                                onClick={() => handleItemClick(item)}
                                className={`flex items-center gap-3 whitespace-nowrap rounded-full px-4 py-2.5 text-sm font-semibold transition-colors duration-300 lg:w-full lg:px-5 lg:py-3 ${
                                    isActive
                                        ? "bg-slate-100 font-bold text-slate-900 dark:bg-slate-800 dark:text-white dark:ring-1 dark:ring-inset dark:ring-slate-700"
                                        : "text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-slate-100"
                                }`}
                            >
                                <span
                                    className={`flex h-7 w-7 items-center justify-center rounded-full text-white ${item.bg} dark:shadow-[0_0_0_3px_rgba(15,23,42,0.6)]`}
                                >
                                    {item.icon}
                                </span>
                                <span className="hidden sm:inline lg:inline">{item.label}</span>
                            </button>
                            <div className="mt-3 hidden h-px w-full bg-slate-200 dark:bg-slate-800 lg:block" />
                        </div>
                    );
                })}
            </nav>
        </aside>
    );
};