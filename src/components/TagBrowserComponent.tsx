// src/components/TagBrowserComponent.tsx
import { useState } from "react";
import {
  useGetAllTagsQuery,
  useGetTagByIdQuery,
  useCreateTagMutation,
  useUpdateTagByIdMutation,
  useDeleteTagByIdMutation,
  useGetTopTagsQuery,
  useGetPopularTagsQuery,
  useSearchTagsQuery,
} from "../services/tag";
import { useGetPostByIdQuery, useGetPostsByTagQuery, useDeletePostByIdMutation } from "../services/post";

// ============================================================
// PostCard
// ============================================================

type TagResponse = { id: string | number; tagName: string };
type CommentResponse = { id: string | number };

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

// ============================================================
// TagBrowserComponent
// ============================================================

type Tag = {
  id: string | number;
  tagName: string;
  count?: number;
  excerptPostId?: string;
  wikiPostId?: number;
};

type ViewMode = "popular" | "top" | "all" | "search";

type TagBrowserComponentProps = {
  onSelectTag?: (tag: Tag) => void;
  selectedTagId?: string | number | null;
  isAdmin?: boolean;
  currentUserDisplayName?: string;
};

const VIEW_TABS: { key: ViewMode; label: string }[] = [
  { key: "popular", label: "Popular" },
  { key: "top", label: "Top" },
  { key: "all", label: "All" },
  { key: "search", label: "Search" },
];

const TABLE_COLUMNS: { key: keyof Tag; label: string }[] = [
  { key: "id", label: "ID" },
  { key: "tagName", label: "Tag Name" },
  { key: "count", label: "Count" },
  { key: "excerptPostId", label: "Excerpt Post" },
  { key: "wikiPostId", label: "Wiki Post" },
];

// How many posts to reveal per "Show more" click
const POSTS_PAGE_SIZE = 5;

const formatCellValue = (value: unknown) => {
  if (value === null || value === undefined || value === "") return "—";
  return String(value);
};

const LinkedPost = ({
  label,
  postId,
}: {
  label: string;
  postId?: string | number;
}) => {
  const {
    data: post,
    isFetching,
    isError,
  } = useGetPostByIdQuery(postId as string | number, {
    skip: postId === undefined || postId === null || postId === "",
  });

  if (postId === undefined || postId === null || postId === "") {
    return (
      <p className="text-xs text-slate-400 dark:text-slate-500">
        {label}: <span className="text-slate-300 dark:text-slate-600">none</span>
      </p>
    );
  }

  return (
    <p className="text-xs text-slate-500 dark:text-slate-400">
      {label}:{" "}
      {isFetching && <span className="text-slate-400 dark:text-slate-500">loading...</span>}
      {!isFetching && isError && (
        <span className="text-red-400 dark:text-red-300">couldn't load post #{postId}</span>
      )}
      {!isFetching && !isError && post && (
        <span className="font-medium text-slate-700 dark:text-slate-200">
          {post.title ?? `Post #${postId}`}
        </span>
      )}
    </p>
  );
};

// Live post count for a single tag row, used in the "All" table since
// GET /tags does not return a count (unlike /tags/popular and /tags/top/{limit}).
const TagCount = ({ tagId }: { tagId: string | number }) => {
  const { data: posts, isFetching, isError } = useGetPostsByTagQuery(tagId);

  if (isFetching) {
    return <span className="text-slate-300 dark:text-slate-600">…</span>;
  }
  if (isError) {
    return <span className="text-red-400 dark:text-red-300">—</span>;
  }
  return <>{posts?.length ?? 0}</>;
};

export const TagBrowserComponent = ({
  onSelectTag,
  selectedTagId = null,
  isAdmin = false,
  currentUserDisplayName,
}: TagBrowserComponentProps) => {
  const [viewMode, setViewMode] = useState<ViewMode>("popular");
  const [query, setQuery] = useState("");
  const [topLimit, setTopLimit] = useState(10);
  const [detailTagId, setDetailTagId] = useState<string | number | null>(null);
  const [editName, setEditName] = useState("");

  // --- Manage number of posts shown for the selected tag ---
  const [postsVisibleCount, setPostsVisibleCount] = useState(POSTS_PAGE_SIZE);

  const trimmedQuery = query.trim();

  // --- List queries (only one active at a time, based on viewMode) ---
  const {
    data: popularTags,
    isLoading: isPopularLoading,
    isError: isPopularError,
  } = useGetPopularTagsQuery(undefined, { skip: viewMode !== "popular" });

  const {
    data: topTags,
    isLoading: isTopLoading,
    isError: isTopError,
  } = useGetTopTagsQuery(topLimit, { skip: viewMode !== "top" });

  const {
    data: allTags,
    isLoading: isAllLoading,
    isError: isAllError,
  } = useGetAllTagsQuery(undefined, { skip: viewMode !== "all" });

  const {
    data: searchResults,
    isFetching: isSearchFetching,
    isError: isSearchError,
  } = useSearchTagsQuery(trimmedQuery, {
    skip: viewMode !== "search" || trimmedQuery.length === 0,
  });

  // --- Detail query for whichever tag is selected for inspection ---
  const { data: detailTag, isFetching: isDetailFetching } = useGetTagByIdQuery(
    detailTagId as string | number,
    { skip: detailTagId === null }
  );

  // --- Posts tagged with the selected tag ---
  const { data: tagPosts, isFetching: isTagPostsFetching } = useGetPostsByTagQuery(
    detailTagId as string | number,
    { skip: detailTagId === null }
  );

  // --- Mutations ---
  const [createTag, { isLoading: isCreating }] = useCreateTagMutation();
  const [updateTagById, { isLoading: isUpdating }] = useUpdateTagByIdMutation();
  const [deleteTagById, { isLoading: isDeleting }] = useDeleteTagByIdMutation();

  const listMap: Record<ViewMode, { data?: Tag[]; loading: boolean; error: boolean }> = {
    popular: { data: popularTags, loading: isPopularLoading, error: isPopularError },
    top: { data: topTags, loading: isTopLoading, error: isTopError },
    all: { data: allTags, loading: isAllLoading, error: isAllError },
    search: {
      data: searchResults,
      loading: isSearchFetching,
      error: isSearchError,
    },
  };

  const { data: activeData, loading: isLoading, error: isError } = listMap[viewMode];
  const tags: Tag[] = activeData ?? [];

  const handleSelect = (tag: Tag) => {
    onSelectTag?.(tag);
    setDetailTagId(tag.id);
    setEditName(tag.tagName);
    setPostsVisibleCount(POSTS_PAGE_SIZE); // reset paging whenever a new tag is picked
  };

  const handleCreate = async () => {
    if (!editName.trim()) return;
    await createTag({ newTag: { tagName: editName.trim() } }).unwrap();
    setEditName("");
  };

  const handleUpdate = async () => {
    if (detailTagId === null || !editName.trim()) return;
    await updateTagById({
      tagId: detailTagId,
      updatedTag: { tagName: editName.trim() },
    }).unwrap();
  };

  const handleDelete = async (tagId: string | number) => {
    await deleteTagById({ tagId }).unwrap();
    if (detailTagId === tagId) {
      setDetailTagId(null);
      setEditName("");
    }
  };

  const totalPostsForTag = tagPosts?.length ?? 0;
  const visiblePosts: Post[] = (tagPosts ?? []).slice(0, postsVisibleCount);
  const hasMorePosts = postsVisibleCount < totalPostsForTag;

  const handleShowMore = () => {
    setPostsVisibleCount((count) => count + POSTS_PAGE_SIZE);
  };

  const handleShowAll = () => {
    setPostsVisibleCount(totalPostsForTag);
  };

  const handleShowLess = () => {
    setPostsVisibleCount(POSTS_PAGE_SIZE);
  };

  return (
    <div className="w-full space-y-4 bg-slate-50 transition-colors duration-300 dark:bg-slate-900">
      <div className="rounded-2xl border border-slate-200 bg-white p-3 transition-colors duration-300 sm:p-4 dark:border-slate-800 dark:bg-slate-950">
        {/* View mode tabs */}
        <div className="mb-3 flex items-center gap-1 overflow-x-auto rounded-xl bg-slate-100 p-1 dark:bg-slate-900">
          {VIEW_TABS.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setViewMode(tab.key)}
              className={`flex-1 whitespace-nowrap rounded-lg px-2 py-1.5 text-xs font-medium transition-colors ${
                viewMode === tab.key
                  ? "bg-white text-slate-800 shadow-sm dark:bg-slate-800 dark:text-slate-100"
                  : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Top-N limit control */}
        {viewMode === "top" && (
          <div className="mb-3 flex items-center gap-2">
            <label className="text-xs text-slate-500 dark:text-slate-400">Limit</label>
            <input
              type="number"
              min={1}
              value={topLimit}
              onChange={(e) => setTopLimit(Math.max(1, Number(e.target.value) || 1))}
              className="w-20 rounded-lg border border-slate-300 bg-white px-2 py-1.5 text-sm text-slate-800 outline-none focus:border-blue-500 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
            />
          </div>
        )}

        {/* Search input */}
        {viewMode === "search" && (
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search tags..."
            className="mb-3 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none transition-colors focus:border-blue-500 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500"
          />
        )}

        {isLoading && (
          <p className="text-sm text-slate-400 dark:text-slate-500">Loading tags...</p>
        )}

        {isError && (
          <p className="rounded-lg bg-red-50 p-2.5 text-sm text-red-600 dark:bg-red-950/50 dark:text-red-300">
            Couldn't load tags. Try again.
          </p>
        )}

        {!isLoading && !isError && tags.length === 0 && (
          <p className="text-sm text-slate-400 dark:text-slate-500">
            {viewMode === "search" && trimmedQuery.length === 0
              ? "Type to search."
              : "No tags found."}
          </p>
        )}

        {/* "All" view: full data table */}
        {!isLoading && !isError && tags.length > 0 && viewMode === "all" && (
          <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 dark:bg-slate-900">
                <tr>
                  {TABLE_COLUMNS.map((col) => (
                    <th
                      key={String(col.key)}
                      className="whitespace-nowrap px-3 py-2 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400"
                    >
                      {col.label}
                    </th>
                  ))}
                  {isAdmin && (
                    <th className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                      Actions
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {tags.map((tag) => {
                  const isActive = tag.id === selectedTagId;
                  return (
                    <tr
                      key={tag.id}
                      onClick={() => handleSelect(tag)}
                      className={`cursor-pointer transition-colors ${
                        isActive
                          ? "bg-blue-50 dark:bg-blue-950/50"
                          : "hover:bg-slate-50 dark:hover:bg-slate-900"
                      }`}
                    >
                      {TABLE_COLUMNS.map((col) => (
                        <td
                          key={String(col.key)}
                          className="whitespace-nowrap px-3 py-2 text-slate-700 dark:text-slate-200"
                        >
                          {col.key === "count" ? (
                            <TagCount tagId={tag.id} />
                          ) : (
                            formatCellValue(tag[col.key])
                          )}
                        </td>
                      ))}
                      {isAdmin && (
                        <td className="px-3 py-2">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(tag.id);
                            }}
                            disabled={isDeleting}
                            className="text-xs text-red-400 hover:text-red-600 disabled:opacity-50"
                            title="Delete tag"
                          >
                            Delete
                          </button>
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Popular / Top / Search views: compact pill list with rounded count badge */}
        {!isLoading && !isError && tags.length > 0 && viewMode !== "all" && (
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => {
              const isActive = tag.id === selectedTagId;
              return (
                <div key={tag.id} className="group relative">
                  <button
                    type="button"
                    onClick={() => handleSelect(tag)}
                    className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-blue-600 text-white dark:bg-blue-500"
                        : "bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-950 dark:text-blue-300 dark:hover:bg-blue-900"
                    }`}
                  >
                    {tag.tagName}
                    <span
                      className={`flex h-5 min-w-[1.25rem] items-center justify-center rounded-full px-1 text-[10px] font-semibold ${
                        isActive
                          ? "bg-white/20 text-white"
                          : "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300"
                      }`}
                    >
                      <TagCount tagId={tag.id} />
                    </span>
                  </button>
                  {isAdmin && (
                    <button
                      type="button"
                      onClick={() => handleDelete(tag.id)}
                      disabled={isDeleting}
                      className="ml-1 text-[10px] text-red-400 opacity-0 transition-opacity group-hover:opacity-100 hover:text-red-600 disabled:opacity-50"
                      title="Delete tag"
                    >
                      ✕
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Detail panel for the currently selected tag */}
        {detailTagId !== null && (
          <div className="mt-4 rounded-xl border border-slate-200 p-3 dark:border-slate-800">
            <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
              Tag details
            </h4>
            {isDetailFetching && (
              <p className="text-sm text-slate-400 dark:text-slate-500">Loading...</p>
            )}
            {!isDetailFetching && detailTag && (
              <>
                <p className="text-sm text-slate-700 dark:text-slate-200">
                  #{detailTag.id} — {detailTag.tagName}
                  {tagPosts && ` (${totalPostsForTag} posts)`}
                </p>
                <div className="mt-2 space-y-1 border-t border-slate-100 pt-2 dark:border-slate-800">
                  <LinkedPost label="Excerpt post" postId={detailTag.excerptPostId} />
                  <LinkedPost label="Wiki post" postId={detailTag.wikiPostId} />
                </div>
              </>
            )}
          </div>
        )}

        {/* Admin create / update controls */}
        {isAdmin && (
          <div className="mt-4 flex flex-col gap-2 border-t border-slate-200 pt-3 sm:flex-row sm:items-center dark:border-slate-800">
            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              placeholder={detailTagId !== null ? "Rename tag..." : "New tag name..."}
              className="w-full flex-1 rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-blue-500 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
            />
            {detailTagId !== null ? (
              <button
                type="button"
                onClick={handleUpdate}
                disabled={isUpdating || !editName.trim()}
                className="w-full shrink-0 rounded-xl bg-blue-600 px-3 py-2 text-xs font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50 sm:w-auto dark:bg-blue-500"
              >
                Save
              </button>
            ) : (
              <button
                type="button"
                onClick={handleCreate}
                disabled={isCreating || !editName.trim()}
                className="w-full shrink-0 rounded-xl bg-blue-600 px-3 py-2 text-xs font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50 sm:w-auto dark:bg-blue-500"
              >
                Add
              </button>
            )}
          </div>
        )}
      </div>

      {/* Posts tagged with the selected tag */}
      {detailTagId !== null && (
        <div className="bg-slate-50 transition-colors duration-300 dark:bg-slate-900">
          <div className="mb-3 flex flex-col gap-1 rounded-xl bg-white px-1 py-2 dark:bg-slate-950 sm:flex-row sm:items-center sm:justify-between">
            <h3 className="text-base font-bold text-slate-900 sm:text-lg dark:text-white">
              Posts tagged with{" "}
              <span className="text-orange-500">#{detailTag?.tagName ?? ""}</span>
            </h3>
            {totalPostsForTag > 0 && (
              <span className="text-xs text-slate-400 dark:text-slate-500">
                Showing {Math.min(postsVisibleCount, totalPostsForTag)} of {totalPostsForTag}
              </span>
            )}
          </div>

          {isTagPostsFetching && (
            <p className="text-sm text-slate-400 dark:text-slate-500">Loading posts...</p>
          )}

          {!isTagPostsFetching && totalPostsForTag === 0 && (
            <p className="text-sm text-slate-400 dark:text-slate-500">
              No posts for this tag yet.
            </p>
          )}

          {!isTagPostsFetching && totalPostsForTag > 0 && (
            <>
              <div className="space-y-3 bg-slate-50 transition-colors duration-300 dark:bg-slate-900">
                {visiblePosts.map((post: Post) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    currentUserDisplayName={currentUserDisplayName}
                  />
                ))}
              </div>

              {/* Manage how many posts are shown */}
              <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
                {hasMorePosts && (
                  <>
                    <button
                      type="button"
                      onClick={handleShowMore}
                      className="rounded-full border border-slate-300 px-4 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-900"
                    >
                      Show {Math.min(POSTS_PAGE_SIZE, totalPostsForTag - postsVisibleCount)} more
                    </button>
                    <button
                      type="button"
                      onClick={handleShowAll}
                      className="rounded-full border border-slate-300 px-4 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-900"
                    >
                      Show all ({totalPostsForTag})
                    </button>
                  </>
                )}
                {!hasMorePosts && postsVisibleCount > POSTS_PAGE_SIZE && (
                  <button
                    type="button"
                    onClick={handleShowLess}
                    className="rounded-full border border-slate-300 px-4 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-900"
                  >
                    Show less
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};