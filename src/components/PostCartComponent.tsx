import { useDeletePostByIdMutation } from "../services/post";

type TagResponse = { id: string | number; tagName: string };
type CommentResponse = { id: string | number };
// PostCard.tsx
export type Post = {
  id: string | number;
  title: string;
  body: string;
  score?: number;
  ownerDisplayName?: string;
  tagResponses?: TagResponse[];
  comments?: CommentResponse[];
};

type PostCardProps = {
  post: Post;
  currentUserDisplayName?: string;
  isSaved?: boolean;
  onEdit?: (post: Post) => void;
  onSave?: (post: Post) => void;
  onLike?: (post: Post) => void;
  onCommentsClick?: (post: Post) => void;
};

export const PostCard = ({
  post,
  currentUserDisplayName,
  isSaved = false,
  onEdit,
  onSave,
  onLike,
  onCommentsClick,
}: PostCardProps) => {
  const [deletePostById, { isLoading: isDeleting }] = useDeletePostByIdMutation();

  const isOwner =
    currentUserDisplayName != null &&
    post.ownerDisplayName === currentUserDisplayName;

  const commentCount = post.comments?.length ?? 0;
  const likeCount = post.score ?? 0;

  const handleDelete = async () => {
    if (!window.confirm("Delete this post?")) return;
    await deletePostById({ postId: post.id }).unwrap();
  };

  return (
    <div className="w-full rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900 dark:shadow-none sm:p-5">
      {/* Author row */}
      <div className="mb-3 flex items-center gap-2">
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-200 text-slate-500 dark:bg-slate-700 dark:text-slate-300">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="h-4 w-4"
          >
            <path d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm0 2c-4.42 0-8 2.24-8 5v1a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-1c0-2.76-3.58-5-8-5Z" />
          </svg>
        </div>
        <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
          {post.ownerDisplayName ?? "Unknown"}
        </span>
      </div>

      {/* Title + body */}
      <h3 className="mb-1 break-words text-lg font-bold text-slate-900 dark:text-white">
        {post.title}
      </h3>
      <p className="mb-3 break-words text-sm text-slate-500 dark:text-slate-400">
        {post.body}
      </p>

      {/* Tags */}
      {post.tagResponses && post.tagResponses.length > 0 && (
        <div className="mb-4 flex flex-wrap gap-2">
          {post.tagResponses.map((tag) => (
            <span
              key={tag.id}
              className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300"
            >
              {tag.tagName}
            </span>
          ))}
        </div>
      )}

      {/* Action buttons */}
      <div className="flex flex-wrap items-center gap-2">
        {isOwner && (
          <button
            type="button"
            onClick={() => onEdit?.(post)}
            className="rounded-full border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            Edit
          </button>
        )}

        <button
          type="button"
          onClick={() => onLike?.(post)}
          className="rounded-full border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
        >
          Likes ({likeCount})
        </button>

        <button
          type="button"
          onClick={() => onCommentsClick?.(post)}
          className="rounded-full border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
        >
          Comments ({commentCount})
        </button>

        <button
          type="button"
          onClick={() => onSave?.(post)}
          className="flex items-center gap-1 rounded-full border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill={isSaved ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth={2}
            className="h-3.5 w-3.5"
          >
            <path d="M5 3a1 1 0 0 0-1 1v17l8-5 8 5V4a1 1 0 0 0-1-1H5Z" />
          </svg>
          Save
        </button>

        {isOwner && (
          <button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting}
            className="rounded-full border border-red-300 px-3 py-1.5 text-xs font-medium text-red-500 hover:bg-red-50 disabled:opacity-50 dark:border-red-900/60 dark:text-red-400 dark:hover:bg-red-950/40"
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        )}
      </div>
    </div>
  );
};