import {
    useState,
    type KeyboardEvent,
    type ChangeEvent,
} from "react";
import { useParams } from "react-router-dom";

import {
    useGetPostByIdQuery,
    useUpdatePostByIdMutation,
    useDeletePostByIdMutation,
} from "../services/post";

import { useCreateVoteMutation } from "../services/vote";

import { useAddBookmarkMutation } from "../services/bookmark";

import {
    useCreateCommentMutation,
    useGetCommentsByPostQuery,
    useUpdateCommentByIdMutation,
    useDeleteCommentByIdMutation,
} from "../services/comment";

interface Tag {
    id: number | string;
    tagName: string;
}

interface Post {
    id: number;
    title: string;
    body: string;
    score: number;
    ownerDisplayName: string;
    tagResponses?: Tag[];
    comments?: unknown[];
}

interface Comment {
    id: number;
    text: string;
    score: number;
    userDisplayName: string;
}

export const PostDetailComponent = () => {
    const { postId: postIdParam } = useParams<{ postId: string }>();

    const postId = postIdParam ? Number(postIdParam) : undefined;

    const validPostId =
        typeof postId === "number" && !Number.isNaN(postId);

    const {
        data: post,
        isLoading: postLoading,
        isError: postIsError,
        isFetching: postFetching,
    } = useGetPostByIdQuery(postId, {
        skip: !validPostId,
    });

    const [createVote, { isLoading: voting }] =
        useCreateVoteMutation();

    const [addBookmark, { isLoading: bookmarking }] =
        useAddBookmarkMutation({
            fixedCacheKey: "shared-add-bookmark",
        });

    const [bookmarked, setBookmarked] =
        useState<boolean>(false);

    const [bookmarkJustSaved, setBookmarkJustSaved] =
        useState<boolean>(false);

    const [updatePostById, { isLoading: updating }] =
        useUpdatePostByIdMutation();

    const [deletePostById, { isLoading: deleting }] =
        useDeletePostByIdMutation();

    const [isEditing, setIsEditing] =
        useState<boolean>(false);

    const [editTitle, setEditTitle] =
        useState<string>("");

    const [editBody, setEditBody] =
        useState<string>("");

    const [deleted, setDeleted] =
        useState<boolean>(false);

    function handleEditStart(current: Post) {
        setIsEditing(true);
        setEditTitle(current.title);
        setEditBody(current.body);
    }

    function handleEditCancel() {
        setIsEditing(false);
        setEditTitle("");
        setEditBody("");
    }

    async function handleEditSave(current: Post) {
        if (!editTitle.trim() || !editBody.trim()) {
            return;
        }

        try {
            await updatePostById({
                postId: current.id,
                updatedPost: {
                    ...current,
                    title: editTitle.trim(),
                    body: editBody.trim(),
                },
            }).unwrap();

            handleEditCancel();
        } catch (error) {
            console.error("Failed to update post:", error);
        }
    }

    async function handleDelete(id: number) {
        const confirmed = window.confirm(
            "Delete this question? This can't be undone."
        );

        if (!confirmed) {
            return;
        }

        try {
            await deletePostById({
                postId: id,
            }).unwrap();

            setDeleted(true);
        } catch (error) {
            console.error("Failed to delete post:", error);
        }
    }

    async function handleLike(id: number) {
        if (voting) {
            return;
        }

        try {
            await createVote({
                newVote: {
                    postId: id,
                    voteTypeId: 1,
                },
            }).unwrap();
        } catch (error) {
            console.error("Failed to vote:", error);
        }
    }

    async function handleBookmark(id: number) {
        if (bookmarking || bookmarked) {
            return;
        }

        try {
            await addBookmark([id]).unwrap();

            setBookmarked(true);
            setBookmarkJustSaved(true);

            setTimeout(() => {
                setBookmarkJustSaved(false);
            }, 600);
        } catch (error) {
            console.error("Failed to bookmark post:", error);
        }
    }

    const [showComments, setShowComments] =
        useState<boolean>(false);

    const [newCommentText, setNewCommentText] =
        useState<string>("");

    const [editingCommentId, setEditingCommentId] =
        useState<number | null>(null);

    const [editingCommentText, setEditingCommentText] =
        useState<string>("");

    const {
        data: postCommentsData,
        isLoading: commentsLoading,
        isFetching: commentsFetching,
        isError: commentsIsError,
    } = useGetCommentsByPostQuery(post?.id, {
        skip: !showComments || !post,
    });

    const postComments: Comment[] =
        postCommentsData ?? [];

    const [createComment, { isLoading: creatingComment }] =
        useCreateCommentMutation();

    const [updateCommentById, { isLoading: updatingComment }] =
        useUpdateCommentByIdMutation();

    const [deleteCommentById, { isLoading: deletingComment }] =
        useDeleteCommentByIdMutation();

    function handleToggleComments() {
        setShowComments((previous) => !previous);
    }

    async function handleAddComment() {
        const text = newCommentText.trim();

        if (!text || !post) {
            return;
        }

        try {
            await createComment({
                newComment: {
                    postId: post.id,
                    text,
                },
            }).unwrap();

            setNewCommentText("");
        } catch (error) {
            console.error("Failed to post comment:", error);
        }
    }

    function handleNewCommentKeyDown(
        event: KeyboardEvent<HTMLInputElement>
    ) {
        if (event.key === "Enter") {
            event.preventDefault();
            handleAddComment();
        }
    }

    function handleEditCommentStart(comment: Comment) {
        setEditingCommentId(comment.id);
        setEditingCommentText(comment.text);
    }

    function handleEditCommentCancel() {
        setEditingCommentId(null);
        setEditingCommentText("");
    }

    async function handleEditCommentSave(
        comment: Comment
    ) {
        const text = editingCommentText.trim();

        if (!text) {
            return;
        }

        try {
            await updateCommentById({
                commentId: comment.id,
                updatedComment: {
                    ...comment,
                    text,
                },
            }).unwrap();

            handleEditCommentCancel();
        } catch (error) {
            console.error(
                "Failed to update comment:",
                error
            );
        }
    }

    async function handleDeleteComment(
        commentId: number
    ) {
        const confirmed = window.confirm(
            "Delete this comment? This can't be undone."
        );

        if (!confirmed) {
            return;
        }

        try {
            await deleteCommentById({
                commentId,
            }).unwrap();
        } catch (error) {
            console.error(
                "Failed to delete comment:",
                error
            );
        }
    }

    return (
        <div className="flex h-screen w-full flex-col overflow-hidden bg-slate-50 transition-colors duration-300 dark:bg-slate-900">
            <div className="flex min-h-0 w-full flex-1 flex-col lg:flex-row">
                <main className="min-h-0 flex-1 overflow-y-auto bg-slate-50 px-4 py-6 transition-colors duration-300 dark:bg-slate-900 sm:px-6 lg:px-10">

                    {/* BANNER */}
                    <div className="relative h-36 w-full overflow-hidden rounded-2xl bg-slate-900 sm:h-44 lg:h-56">
                        <img
                            src="https://d3vnc3w6v6jm99.cloudfront.net/the-crore-club-chase--india-s-ai-talent-war-skews-salaries.webp"
                            alt=""
                            className="absolute inset-0 h-full w-full object-cover"
                        />

                        <div className="relative flex h-full flex-col justify-center px-5">
                            <h1 className="text-xl font-extrabold text-blue-400 sm:text-2xl lg:text-4xl">
                                Question
                            </h1>

                            <h2 className="text-lg font-extrabold text-blue-300 sm:text-xl lg:text-3xl">
                                And
                            </h2>

                            <h1 className="text-xl font-extrabold text-blue-400 sm:text-2xl lg:text-4xl">
                                Answer
                            </h1>
                        </div>
                    </div>

                    {/* TITLE */}
                    <div className="mt-6">
                        <h3 className="text-xl font-bold text-blue-700 dark:text-blue-400">
                            Detail Question
                        </h3>
                    </div>

                    {/* POST */}
                    <div className="mt-5">

                        {!validPostId && (
                            <p className="text-sm text-red-500 dark:text-red-400">
                                No valid post ID.
                            </p>
                        )}

                        {validPostId &&
                            postLoading && (
                                <p className="text-sm text-slate-500 dark:text-slate-400">
                                    Loading question...
                                </p>
                            )}

                        {validPostId &&
                            postFetching &&
                            !postLoading && (
                                <p className="mb-2 text-xs text-slate-500 dark:text-slate-400">
                                    Updating question...
                                </p>
                            )}

                        {validPostId && postIsError && (
                            <p className="text-sm text-red-500 dark:text-red-400">
                                Couldn't load this question.
                            </p>
                        )}

                        {deleted && (
                            <p className="rounded-xl bg-slate-100 p-4 text-sm text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                                This question was deleted.
                            </p>
                        )}

                        {validPostId &&
                            !postLoading &&
                            !postIsError &&
                            !deleted &&
                            post && (
                                <div className="rounded-2xl border border-slate-200 bg-white p-4 text-slate-800 shadow-lg transition-colors duration-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 sm:p-5">

                                    {/* USER */}
                                    <div className="flex items-center gap-2">
                                        <svg
                                            className="h-7 w-7 text-slate-400 dark:text-slate-300"
                                            fill="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path d="M12 12c2.7 0 4.9-2.2 4.9-4.9S14.7 2.2 12 2.2 7.1 4.4 7.1 7.1 9.3 12 12 12zm0 2.5c-3.3 0-9.8 1.6-9.8 4.9v2.4h19.6v-2.4c0-3.3-6.5-4.9-9.8-4.9z" />
                                        </svg>

                                        <span className="text-sm font-medium">
                                            {post.ownerDisplayName}
                                        </span>
                                    </div>

                                    {/* EDIT */}
                                    {isEditing ? (
                                        <div className="mt-4 space-y-3">
                                            <input
                                                type="text"
                                                value={editTitle}
                                                onChange={(
                                                    event: ChangeEvent<HTMLInputElement>
                                                ) =>
                                                    setEditTitle(
                                                        event.target.value
                                                    )
                                                }
                                                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-blue-500 dark:border-slate-500 dark:bg-slate-700 dark:text-white"
                                            />

                                            <textarea
                                                value={editBody}
                                                onChange={(
                                                    event: ChangeEvent<HTMLTextAreaElement>
                                                ) =>
                                                    setEditBody(
                                                        event.target.value
                                                    )
                                                }
                                                rows={5}
                                                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-blue-500 dark:border-slate-500 dark:bg-slate-700 dark:text-white"
                                            />
                                        </div>
                                    ) : (
                                        <>
                                            <h2 className="mt-3 text-lg font-bold text-slate-900 dark:text-white sm:text-xl">
                                                {post.title}
                                            </h2>

                                            <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                                                {post.body}
                                            </p>
                                        </>
                                    )}

                                    {/* TAGS */}
                                    {post.tagResponses &&
                                        post.tagResponses.length > 0 && (
                                            <div className="mt-4 flex flex-wrap gap-2">
                                                {(
                                                    post.tagResponses as Tag[]
                                                ).map(
                                                    (
                                                        tag: Tag
                                                    ) => (
                                                        <span
                                                            key={
                                                                tag.id
                                                            }
                                                            className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600 dark:bg-slate-700 dark:text-slate-200"
                                                        >
                                                            {
                                                                tag.tagName
                                                            }
                                                        </span>
                                                    )
                                                )}
                                            </div>
                                        )}

                                    {/* ACTION BUTTONS */}
                                    <div className="mt-5 flex flex-wrap items-center gap-2">
                                        {isEditing ? (
                                            <>
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleEditSave(
                                                            post
                                                        )
                                                    }
                                                    disabled={
                                                        updating
                                                    }
                                                    className="rounded-full bg-blue-600 px-4 py-2 text-xs font-medium text-white hover:bg-blue-500 disabled:opacity-50"
                                                >
                                                    {updating
                                                        ? "Saving..."
                                                        : "Save Changes"}
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={
                                                        handleEditCancel
                                                    }
                                                    className="rounded-full border border-slate-300 px-4 py-2 text-xs text-slate-600 hover:bg-slate-100 dark:border-slate-500 dark:text-slate-200 dark:hover:bg-slate-700"
                                                >
                                                    Cancel
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleEditStart(
                                                            post
                                                        )
                                                    }
                                                    className="rounded-full border border-slate-300 px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 dark:border-slate-500 dark:text-slate-200 dark:hover:bg-slate-700"
                                                >
                                                    Edit
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleLike(
                                                            post.id
                                                        )
                                                    }
                                                    disabled={voting}
                                                    className="rounded-full border border-slate-300 px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 disabled:opacity-50 dark:border-slate-500 dark:text-slate-200 dark:hover:bg-slate-700"
                                                >
                                                    {voting
                                                        ? "Liking..."
                                                        : `Likes (${post.score})`}
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={
                                                        handleToggleComments
                                                    }
                                                    className="rounded-full border border-slate-300 px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 dark:border-slate-500 dark:text-slate-200 dark:hover:bg-slate-700"
                                                >
                                                    {showComments
                                                        ? "Hide comments"
                                                        : `Comments (${post.comments?.length ?? 0})`}
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleBookmark(
                                                            post.id
                                                        )
                                                    }
                                                    disabled={
                                                        bookmarking ||
                                                        bookmarked
                                                    }
                                                    className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-medium transition-all duration-300 disabled:cursor-default ${bookmarked
                                                            ? "border border-amber-400 bg-amber-400/15 text-amber-600 dark:text-amber-300"
                                                            : "border border-slate-300 text-slate-600 hover:bg-slate-100 disabled:opacity-50 dark:border-slate-500 dark:text-slate-200 dark:hover:bg-slate-700"
                                                        } ${bookmarkJustSaved
                                                            ? "scale-110"
                                                            : "scale-100"
                                                        }`}
                                                >
                                                    <svg
                                                        className="h-3.5 w-3.5"
                                                        viewBox="0 0 24 24"
                                                        fill={
                                                            bookmarked
                                                                ? "currentColor"
                                                                : "none"
                                                        }
                                                        stroke="currentColor"
                                                        strokeWidth={2}
                                                    >
                                                        <path
                                                            d="M6 3h12a1 1 0 011 1v17l-7-4-7 4V4a1 1 0 011-1z"
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                        />
                                                    </svg>

                                                    {bookmarking
                                                        ? "Saving..."
                                                        : bookmarked
                                                            ? "Saved"
                                                            : "Save"}
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleDelete(
                                                            post.id
                                                        )
                                                    }
                                                    disabled={
                                                        deleting
                                                    }
                                                    className="rounded-full border border-red-300 px-4 py-2 text-xs font-medium text-red-600 hover:bg-red-50 disabled:opacity-50 dark:border-red-500/50 dark:text-red-400 dark:hover:bg-red-950/40"
                                                >
                                                    {deleting
                                                        ? "Deleting..."
                                                        : "Delete"}
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            )}

                        {/* COMMENTS */}
                        {showComments && post && (
                            <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-colors duration-300 dark:border-slate-700 dark:bg-slate-800 sm:p-5">

                                <h3 className="font-bold text-slate-900 dark:text-white">
                                    Comments
                                </h3>

                                {/* ADD COMMENT */}
                                <div className="mt-4 flex gap-2">
                                    <input
                                        type="text"
                                        value={newCommentText}
                                        onChange={(
                                            event: ChangeEvent<HTMLInputElement>
                                        ) =>
                                            setNewCommentText(
                                                event.target.value
                                            )
                                        }
                                        onKeyDown={
                                            handleNewCommentKeyDown
                                        }
                                        placeholder="Write a comment..."
                                        className="flex-1 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none placeholder:text-slate-400 focus:border-blue-500 dark:border-slate-500 dark:bg-slate-700 dark:text-white dark:placeholder:text-slate-400"
                                    />

                                    <button
                                        type="button"
                                        onClick={
                                            handleAddComment
                                        }
                                        disabled={
                                            creatingComment ||
                                            !newCommentText.trim()
                                        }
                                        className="rounded-full bg-blue-600 px-4 py-2 text-xs font-medium text-white hover:bg-blue-500 disabled:opacity-50"
                                    >
                                        {creatingComment
                                            ? "Posting..."
                                            : "Post"}
                                    </button>
                                </div>

                                {/* COMMENTS LIST */}
                                <div className="mt-5 space-y-3">
                                    {commentsLoading ||
                                        commentsFetching ? (
                                        <p className="text-sm text-slate-500 dark:text-slate-400">
                                            Loading comments...
                                        </p>
                                    ) : commentsIsError ? (
                                        <p className="text-sm text-red-500 dark:text-red-400">
                                            Failed to load comments.
                                        </p>
                                    ) : postComments.length ===
                                        0 ? (
                                        <p className="text-sm text-slate-500 dark:text-slate-400">
                                            No comments yet.
                                        </p>
                                    ) : (
                                        postComments.map(
                                            (
                                                comment: Comment
                                            ) => (
                                                <div
                                                    key={
                                                        comment.id
                                                    }
                                                    className="rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-600 dark:bg-slate-700"
                                                >
                                                    <div className="flex justify-between">
                                                        <span className="text-sm font-medium text-slate-900 dark:text-white">
                                                            {
                                                                comment.userDisplayName
                                                            }
                                                        </span>

                                                        <span className="text-xs text-slate-500 dark:text-slate-400">
                                                            Score:{" "}
                                                            {
                                                                comment.score
                                                            }
                                                        </span>
                                                    </div>

                                                    {editingCommentId ===
                                                        comment.id ? (
                                                        <div className="mt-3 space-y-2">
                                                            <input
                                                                type="text"
                                                                value={
                                                                    editingCommentText
                                                                }
                                                                onChange={(
                                                                    event: ChangeEvent<HTMLInputElement>
                                                                ) =>
                                                                    setEditingCommentText(
                                                                        event
                                                                            .target
                                                                            .value
                                                                    )
                                                                }
                                                                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-blue-500 dark:border-slate-500 dark:bg-slate-800 dark:text-white"
                                                            />

                                                            <div className="flex gap-2">
                                                                <button
                                                                    type="button"
                                                                    onClick={() =>
                                                                        handleEditCommentSave(
                                                                            comment
                                                                        )
                                                                    }
                                                                    disabled={
                                                                        updatingComment
                                                                    }
                                                                    className="rounded-full bg-blue-600 px-3 py-1.5 text-xs text-white disabled:opacity-50"
                                                                >
                                                                    {updatingComment
                                                                        ? "Saving..."
                                                                        : "Save"}
                                                                </button>

                                                                <button
                                                                    type="button"
                                                                    onClick={
                                                                        handleEditCommentCancel
                                                                    }
                                                                    className="rounded-full border border-slate-300 px-3 py-1.5 text-xs text-slate-600 dark:border-slate-500 dark:text-slate-200"
                                                                >
                                                                    Cancel
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <>
                                                            <p className="mt-2 text-sm text-slate-700 dark:text-slate-200">
                                                                {
                                                                    comment.text
                                                                }
                                                            </p>

                                                            <div className="mt-3 flex gap-2">
                                                                <button
                                                                    type="button"
                                                                    onClick={() =>
                                                                        handleEditCommentStart(
                                                                            comment
                                                                        )
                                                                    }
                                                                    className="rounded-full border border-slate-300 px-3 py-1 text-xs text-slate-600 dark:border-slate-500 dark:text-slate-200"
                                                                >
                                                                    Edit
                                                                </button>

                                                                <button
                                                                    type="button"
                                                                    onClick={() =>
                                                                        handleDeleteComment(
                                                                            comment.id
                                                                        )
                                                                    }
                                                                    disabled={
                                                                        deletingComment
                                                                    }
                                                                    className="rounded-full border border-red-300 px-3 py-1 text-xs text-red-600 disabled:opacity-50 dark:border-red-500/50 dark:text-red-400"
                                                                >
                                                                    {deletingComment
                                                                        ? "Deleting..."
                                                                        : "Delete"}
                                                                </button>
                                                            </div>
                                                        </>
                                                    )}
                                                </div>
                                            )
                                        )
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default PostDetailComponent;