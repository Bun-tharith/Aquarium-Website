import {
  useGetBookmarksQuery,
  useRemoveBookmarkMutation,
} from "../services/bookmark";

interface Tag {
  id: number;
  tagName: string;
}

interface Bookmark {
  id: number;
  title?: string;
  body?: string;
  ownerDisplayName?: string;
  score?: number;
  viewCount?: number;
  creationDate?: string;
  tagResponses?: Tag[];
}

interface BookmarkResponse {
  bookMarkList?: Bookmark[];
  data?: Bookmark[];
  bookmarks?: Bookmark[];
  items?: Bookmark[];
  results?: Bookmark[];
}

const SavedQuestionComponent = () => {

  const {
    data,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useGetBookmarksQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  const [removeBookmark, { isLoading: removing }] =
    useRemoveBookmarkMutation();

  const getBookmarks = (): Bookmark[] => {
    if (!data) {
      return [];
    }

    if (Array.isArray(data)) {
      return data as Bookmark[];
    }

    if (typeof data === "object") {
      const response = data as BookmarkResponse;

      if (Array.isArray(response.bookMarkList)) {
        return response.bookMarkList;
      }

      if (Array.isArray(response.data)) {
        return response.data;
      }

      if (Array.isArray(response.bookmarks)) {
        return response.bookmarks;
      }

      if (Array.isArray(response.items)) {
        return response.items;
      }

      if (Array.isArray(response.results)) {
        return response.results;
      }
    }

    return [];
  };

  const bookmarks = getBookmarks();

  const handleRemove = async (postId: number) => {
    if (!postId) {
      console.error("Invalid post ID:", postId);
      return;
    }

    try {
      await removeBookmark([postId]).unwrap();

      await refetch();
    } catch (err) {
      console.error("Remove bookmark failed:", err);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
        <p className="text-gray-500">
          Loading saved posts...
        </p>
      </div>
    );
  }

  if (isError) {
    console.error("Bookmark API error:", error);

    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 p-6 dark:bg-gray-900">
        <div className="w-full max-w-md rounded-xl bg-white p-8 text-center shadow dark:bg-gray-800">
          <h2 className="text-xl font-bold text-red-500">
            Failed to load saved posts
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            Please try again.
          </p>

          <button
            type="button"
            onClick={() => refetch()}
            className="mt-5 rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-500"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 dark:bg-gray-900">
      <div className="mx-auto max-w-5xl">

        {/* HEADER */}

        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Saved Questions
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Your saved posts
            </p>
          </div>

          <div className="flex items-center gap-3">
            {isFetching && !isLoading && (
              <span className="text-xs text-gray-400">
                Refreshing...
              </span>
            )}

            <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-600">
              {bookmarks.length} Saved
            </span>
          </div>
        </div>

        {/* EMPTY */}

        {bookmarks.length === 0 ? (
          <div className="rounded-xl bg-white p-10 text-center shadow dark:bg-gray-800">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-100">
              <svg
                className="h-7 w-7 text-blue-600"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path d="M6 3h12a1 1 0 011 1v17l-7-4-7 4V4a1 1 0 011-1z" />
              </svg>
            </div>

            <h2 className="mt-4 text-xl font-semibold text-gray-800 dark:text-white">
              No saved questions
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              You haven't saved any questions yet.
            </p>

            <button
              type="button"
              onClick={() => refetch()}
              className="mt-5 rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-500"
            >
              Refresh
            </button>
          </div>
        ) : (

          <div className="space-y-5">
            {bookmarks.map((bookmark) => (
              <article
                key={bookmark.id}
                className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800"
              >

                {/* TITLE */}

                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  {bookmark.title || "Untitled Question"}
                </h2>

                {/* BODY */}

                {bookmark.body && (
                  <p className="mt-3 whitespace-pre-wrap text-gray-600 dark:text-gray-300">
                    {bookmark.body}
                  </p>
                )}

                {/* AUTHOR */}

                {bookmark.ownerDisplayName && (
                  <p className="mt-4 text-sm text-gray-500">
                    By {bookmark.ownerDisplayName}
                  </p>
                )}

                {/* TAGS */}

                {bookmark.tagResponses &&
                  bookmark.tagResponses.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {bookmark.tagResponses.map((tag) => (
                        <span
                          key={tag.id}
                          className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600 dark:bg-gray-700 dark:text-gray-300"
                        >
                          {tag.tagName}
                        </span>
                      ))}
                    </div>
                  )}

                {/* INFO */}

                <div className="mt-4 flex gap-4 text-sm text-gray-500">
                  {bookmark.score !== undefined && (
                    <span>
                      {bookmark.score} likes
                    </span>
                  )}

                  {bookmark.viewCount !== undefined && (
                    <span>
                      {bookmark.viewCount} views
                    </span>
                  )}

                  {bookmark.creationDate && (
                    <span>
                      {new Date(
                        bookmark.creationDate
                      ).toLocaleDateString()}
                    </span>
                  )}
                </div>

                {/* REMOVE */}

                <div className="mt-5 border-t border-gray-200 pt-4 dark:border-gray-700">
                  <button
                    type="button"
                    onClick={() =>
                      handleRemove(bookmark.id)
                    }
                    disabled={removing}
                    className="rounded-lg border border-red-300 px-4 py-2 text-sm font-medium text-red-500 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {removing
                      ? "Removing..."
                      : "Remove Save"}
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedQuestionComponent;
