import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useGetAllPostsQuery } from "../services/post";
import { SidebarComponent } from "./SideBarComponent";
import { useTheme } from "../ThemeProvider";

type TagResponse = {
    id: number;
    tagName: string;
    count: number;
    excerptPostId: string;
    wikiPostId: number;
};

type Comment = {
    id: number;
    postId: number;
    text: string;
    score: number;
    userId: number;
    userDisplayName: string;
    creationDate: string;
    lastEditDate: string;
};

type Post = {
    id: number;
    title: string;
    body: string;
    postTypeId: number;
    score: number;
    viewCount: number;
    ownerId: number;
    ownerDisplayName: string;
    parentId: number;
    tagResponses: TagResponse[];
    comments: Comment[];
    creationDate: string;
    lastActivityDate: string;
    lastEditDate: string;
};

export const SectionComponent = () => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState("");

    const { theme } = useTheme();
    void theme; // kept for readability; `dark:` classes below react automatically

    const isLoggedIn = Boolean(localStorage.getItem("accessToken"));

    const [pendingRedirect, setPendingRedirect] = useState<string | null>(null);
    const [showAuthPrompt, setShowAuthPrompt] = useState(false);

    function requireAuth(action: () => void, redirectTo?: string) {
        if (isLoggedIn) {
            action();
            return;
        }
        setPendingRedirect(redirectTo ?? null);
        setShowAuthPrompt(true);
    }

    function confirmAuthPrompt() {
        if (pendingRedirect) {
            sessionStorage.setItem("postLoginRedirect", pendingRedirect);
        }
        setShowAuthPrompt(false);
        setPendingRedirect(null);
        navigate("/login");
    }

    function dismissAuthPrompt() {
        setShowAuthPrompt(false);
        setPendingRedirect(null);
    }

    function handleCreatePostClick() {
        requireAuth(() => navigate("/create-post"), "/create-post");
    }

    function handlePostClick(postId: number) {
        requireAuth(() => navigate(`/${postId}`), `/${postId}`);
    }

    const {
        data: allPostsData,
        isLoading: allPostsLoading,
        isError: allPostsIsError,
    } = useGetAllPostsQuery(undefined);

    const posts = (allPostsData ?? []) as Post[];

    const filteredPosts = searchQuery.trim()
        ? posts.filter(
              (p) =>
                  p.title.toLowerCase().includes(searchQuery.trim().toLowerCase()) ||
                  p.body.toLowerCase().includes(searchQuery.trim().toLowerCase())
          )
        : posts;

    return (
        <div className="flex h-screen w-full flex-col overflow-hidden bg-slate-50 transition-colors duration-300 dark:bg-slate-900">
            <div className="flex min-h-0 w-full flex-1 flex-col lg:flex-row">
                <SidebarComponent />

                <main className="min-h-0 flex-1 overflow-y-auto bg-slate-50 px-4 py-6 transition-colors duration-300 dark:bg-slate-900 sm:px-6 lg:px-10">
                    <div className="bg-slate-50 pb-2 pt-0 transition-colors duration-300 dark:bg-slate-900">
                        <div className="relative h-36 w-full overflow-hidden rounded-2xl bg-slate-900 sm:h-44 lg:h-56 lg:rounded-3xl">
                            <img
                                src="https://d3vnc3w6v6jm99.cloudfront.net/the-crore-club-chase--india-s-ai-talent-war-skews-salaries.webp"
                                alt=""
                                className="absolute inset-0 h-full w-full object-cover"
                            />
                            <div className="relative flex h-full flex-col justify-center px-5 sm:px-8 lg:px-10">
                                <h1 className="text-xl font-extrabold leading-tight text-blue-400 drop-shadow-lg sm:text-2xl lg:text-4xl">
                                    Question
                                </h1>
                                <h2 className="text-lg font-extrabold text-blue-300 drop-shadow-lg sm:text-xl lg:text-3xl">
                                    And
                                </h2>
                                <h1 className="text-xl font-extrabold leading-tight text-blue-400 drop-shadow-lg sm:text-2xl lg:text-4xl">
                                    Answer
                                </h1>
                            </div>
                        </div>

                        <div className="mt-4 h-px w-full bg-slate-300 transition-colors duration-300 dark:bg-slate-700 lg:mt-6" />

                        <div className="mt-4 flex flex-col gap-3 lg:mt-6">
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                <h3 className="text-lg font-bold text-blue-700 transition-colors duration-300 dark:text-blue-400 lg:text-xl">
                                    Popular Question
                                    {searchQuery && (
                                        <span className="ml-2 block text-sm font-normal text-slate-500 dark:text-slate-400 sm:inline">
                                            — results for "{searchQuery}"
                                        </span>
                                    )}
                                </h3>

                                <button
                                    type="button"
                                    onClick={handleCreatePostClick}
                                    className="flex items-center justify-center gap-2 rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors duration-300 hover:bg-blue-500 sm:w-auto"
                                >
                                    <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                        <path d="M12 5v14M5 12h14" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                    Create Post
                                </button>
                            </div>

                            <div className="flex w-full items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2 transition-colors duration-300 dark:border-slate-700 dark:bg-slate-800 sm:max-w-sm">
                                <svg
                                    className="h-4 w-4 shrink-0 text-blue-500 dark:text-blue-400"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                    viewBox="0 0 24 24"
                                >
                                    <circle cx={11} cy={11} r={7} />
                                    <path d="M21 21l-4.3-4.3" strokeLinecap="round" />
                                </svg>
                                <input
                                    type="text"
                                    placeholder="Search questions, tags, or people"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full bg-transparent text-sm text-slate-600 outline-none placeholder:text-slate-400 dark:text-slate-200 dark:placeholder:text-slate-500"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="mt-5 space-y-4 sm:space-y-6">
                        {allPostsLoading && (
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                Loading questions...
                            </p>
                        )}

                        {allPostsIsError && (
                            <p className="text-sm text-red-500 dark:text-red-400">
                                Couldn't load questions. Please try again.
                            </p>
                        )}

                        {!allPostsLoading && !allPostsIsError && filteredPosts.length === 0 && (
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                {searchQuery
                                    ? `No questions match "${searchQuery}".`
                                    : "No questions yet."}
                            </p>
                        )}

                        {filteredPosts.map((post) => (
                            <button
                                key={post.id}
                                onClick={() => handlePostClick(post.id)}
                                className="block w-full rounded-2xl border border-slate-200 bg-white p-4 text-left text-slate-800 shadow-lg transition-colors duration-300 hover:border-blue-400 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:hover:border-blue-500 sm:p-5"
                            >
                                <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
                                    <div className="flex items-center gap-2">
                                        <svg className="h-6 w-6 shrink-0 text-slate-400 dark:text-slate-300 sm:h-7 sm:w-7" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 12c2.7 0 4.9-2.2 4.9-4.9S14.7 2.2 12 2.2 7.1 4.4 7.1 7.1 9.3 12 12 12zm0 2.5c-3.3 0-9.8 1.6-9.8 4.9v2.4h19.6v-2.4c0-3.3-6.5-4.9-9.8-4.9z" />
                                        </svg>
                                        <span className="text-sm font-medium">{post.ownerDisplayName}</span>
                                    </div>
                                    <span className="text-sm text-slate-500 dark:text-slate-300">{post.title}</span>
                                </div>

                                <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                                    {post.body}
                                </p>

                                {post.tagResponses.length > 0 && (
                                    <div className="mt-3 flex flex-wrap gap-2">
                                        {post.tagResponses.map((tag) => (
                                            <span
                                                key={tag.id}
                                                className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600 dark:bg-slate-700 dark:text-slate-200"
                                            >
                                                {tag.tagName}
                                            </span>
                                        ))}
                                    </div>
                                )}

                                <div className="mt-4 flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                                    <span>Likes ({post.score})</span>
                                    <span>Comments ({post.comments.length})</span>
                                </div>
                            </button>
                        ))}
                    </div>
                </main>
            </div>

            {/* Auth-required modal */}
            {showAuthPrompt && (
                <div
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="auth-modal-title"
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
                    onClick={dismissAuthPrompt}
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl transition-colors duration-300 dark:bg-slate-800"
                    >
                        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-slate-700 dark:text-blue-400">
                            <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                <path d="M12 12c2.7 0 4.9-2.2 4.9-4.9S14.7 2.2 12 2.2 7.1 4.4 7.1 7.1 9.3 12 12 12zm0 2.5c-3.3 0-9.8 1.6-9.8 4.9v2.4h19.6v-2.4c0-3.3-6.5-4.9-9.8-4.9z" />
                            </svg>
                        </div>
                        <h2
                            id="auth-modal-title"
                            className="text-center text-lg font-bold text-slate-900 dark:text-white"
                        >
                            Account required
                        </h2>
                        <p className="mt-2 text-center text-sm text-slate-600 dark:text-slate-300">
                            You need to be signed in to do that. Log in or create an account to continue.
                        </p>
                        <div className="mt-6 flex gap-3">
                            <button
                                type="button"
                                onClick={dismissAuthPrompt}
                                className="flex-1 rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-800 transition-colors duration-300 hover:bg-slate-100 dark:border-slate-600 dark:text-slate-100 dark:hover:bg-slate-700"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={confirmAuthPrompt}
                                className="flex-1 rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors duration-300 hover:bg-blue-500"
                            >
                                Log In
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
