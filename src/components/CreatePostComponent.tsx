import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useCreatePostMutation } from "../services/post";

const MAX_TAGS = 5;

const QUESTION_POST_TYPE_ID = 1;
const TITLE_MIN = 10;
const TITLE_MAX = 300;
const BODY_MIN = 20;

export const CreatePostComponent = () => {
    const navigate = useNavigate();

    const isLoggedIn = Boolean(localStorage.getItem("accessToken"));

    useEffect(() => {
        if (!isLoggedIn) {
            navigate("/login");
        }
    }, [isLoggedIn, navigate]);

    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");
    const [tagInput, setTagInput] = useState("");
    const [tags, setTags] = useState<string[]>([]);
    const [formError, setFormError] = useState<string | null>(null);

    const [createPost, { isLoading: isSubmitting }] = useCreatePostMutation();

    function addTag() {
        const next = tagInput.trim().toLowerCase();
        if (!next) return;
        if (tags.includes(next)) {
            setTagInput("");
            return;
        }
        if (tags.length >= MAX_TAGS) {
            setFormError(`You can add up to ${MAX_TAGS} tags.`);
            return;
        }
        setTags((prev) => [...prev, next]);
        setTagInput("");
    }

    function removeTag(tag: string) {
        setTags((prev) => prev.filter((t) => t !== tag));
    }

    function handleTagKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
        if (e.key === "Enter" || e.key === ",") {
            e.preventDefault();
            addTag();
        } else if (e.key === "Backspace" && !tagInput && tags.length > 0) {
            setTags((prev) => prev.slice(0, -1));
        }
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setFormError(null);

        const trimmedTitle = title.trim();
        const trimmedBody = body.trim();

        if (trimmedTitle.length < TITLE_MIN || trimmedTitle.length > TITLE_MAX) {
            setFormError(`Title must be between ${TITLE_MIN} and ${TITLE_MAX} characters.`);
            return;
        }
        if (trimmedBody.length < BODY_MIN) {
            setFormError(`Body must be at least ${BODY_MIN} characters.`);
            return;
        }

        try {
            const created = await createPost({
                postTypeId: QUESTION_POST_TYPE_ID,
                title: trimmedTitle,
                body: trimmedBody,
                tags,
            }).unwrap();

            const newPostId = created?.id;
            navigate(newPostId ? `/${newPostId}` : "/");
        } catch (err) {
            const apiError = err as {
                data?: { message?: string; validationErrors?: Record<string, string> };
            };
            const validationErrors = apiError?.data?.validationErrors;
            const firstValidationMessage = validationErrors
                ? Object.values(validationErrors)[0]
                : undefined;

            setFormError(
                firstValidationMessage ||
                    apiError?.data?.message ||
                    "Couldn't create your post. Please try again."
            );
        }
    }

    function handleCancel() {
        navigate(-1);
    }

    if (!isLoggedIn) {
        return null;
    }

    return (
        <div className="flex h-screen w-full flex-col overflow-hidden bg-slate-50 transition-colors duration-300 dark:bg-slate-900">
            <main className="min-h-0 flex-1 overflow-y-auto px-4 py-6 sm:px-6 lg:px-10">
                <div className="mx-auto w-full max-w-2xl">
                    <button
                        type="button"
                        onClick={handleCancel}
                        className="mb-4 flex items-center gap-1.5 text-sm font-medium text-slate-500 transition-colors hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400"
                    >
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        Back
                    </button>

                    <h1 className="text-xl font-extrabold text-blue-700 dark:text-blue-400 sm:text-2xl">
                        Create a Post
                    </h1>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                        Ask a clear question and give enough detail for the community to help.
                    </p>

                    <form
                        onSubmit={handleSubmit}
                        className="mt-6 space-y-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-colors duration-300 dark:border-slate-700 dark:bg-slate-800 sm:p-6"
                    >
                        <div>
                            <label
                                htmlFor="post-title"
                                className="mb-1.5 flex items-baseline justify-between text-sm font-semibold text-slate-700 dark:text-slate-200"
                            >
                                <span>Title</span>
                                <span className="text-xs font-normal text-slate-400 dark:text-slate-500">
                                    {title.trim().length}/{TITLE_MIN} min
                                </span>
                            </label>
                            <input
                                id="post-title"
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="e.g. How do I center a div in Tailwind?"
                                disabled={isSubmitting}
                                maxLength={TITLE_MAX}
                                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-800 outline-none transition-colors focus:border-blue-500 disabled:opacity-50 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="post-body"
                                className="mb-1.5 flex items-baseline justify-between text-sm font-semibold text-slate-700 dark:text-slate-200"
                            >
                                <span>Body</span>
                                <span className="text-xs font-normal text-slate-400 dark:text-slate-500">
                                    {body.trim().length}/{BODY_MIN} min
                                </span>
                            </label>
                            <textarea
                                id="post-body"
                                value={body}
                                onChange={(e) => setBody(e.target.value)}
                                placeholder="Include what you've tried, any error messages, and relevant code."
                                disabled={isSubmitting}
                                rows={8}
                                className="w-full resize-y rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm leading-relaxed text-slate-800 outline-none transition-colors focus:border-blue-500 disabled:opacity-50 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="post-tags"
                                className="mb-1.5 block text-sm font-semibold text-slate-700 dark:text-slate-200"
                            >
                                Tags
                                <span className="ml-1.5 font-normal text-slate-400 dark:text-slate-500">
                                    (up to {MAX_TAGS}, press Enter to add)
                                </span>
                            </label>

                            {tags.length > 0 && (
                                <div className="mb-2 flex flex-wrap gap-2">
                                    {tags.map((tag) => (
                                        <span
                                            key={tag}
                                            className="flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 dark:bg-blue-950 dark:text-blue-300"
                                        >
                                            {tag}
                                            <button
                                                type="button"
                                                onClick={() => removeTag(tag)}
                                                aria-label={`Remove ${tag} tag`}
                                                className="text-blue-400 hover:text-blue-700 dark:text-blue-500 dark:hover:text-blue-200"
                                            >
                                                <svg className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                                                    <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
                                                </svg>
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            )}

                            <input
                                id="post-tags"
                                type="text"
                                value={tagInput}
                                onChange={(e) => setTagInput(e.target.value)}
                                onKeyDown={handleTagKeyDown}
                                onBlur={addTag}
                                placeholder="e.g. react, typescript"
                                disabled={isSubmitting || tags.length >= MAX_TAGS}
                                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-800 outline-none transition-colors focus:border-blue-500 disabled:opacity-50 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500"
                            />
                        </div>

                        {formError && (
                            <p className="rounded-lg bg-red-50 p-2.5 text-sm text-red-600 dark:bg-red-950/50 dark:text-red-300">
                                {formError}
                            </p>
                        )}

                        <div className="flex items-center justify-end gap-3 pt-2">
                            <button
                                type="button"
                                onClick={handleCancel}
                                disabled={isSubmitting}
                                className="rounded-full px-4 py-2 text-sm font-semibold text-slate-500 transition-colors hover:bg-slate-100 disabled:opacity-50 dark:text-slate-400 dark:hover:bg-slate-700"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="flex items-center gap-2 rounded-full bg-blue-600 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {isSubmitting && (
                                    <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                                    </svg>
                                )}
                                {isSubmitting ? "Posting..." : "Post Question"}
                            </button>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
};
