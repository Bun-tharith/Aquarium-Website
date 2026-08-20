import { forumApi } from "./api";

export const mediaService = forumApi.injectEndpoints({
  endpoints: (builder) => ({
    // POST /upload/upload-single (multipart/form-data)
    uploadSingleFile: builder.mutation({
      query: ({ file }) => {
        const formData = new FormData();
        formData.append("file", file);
        return {
          url: `/upload/upload-single`,
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: ["Media"],
    }),

    // POST /upload/upload-multiple (multipart/form-data)
    uploadMultipleFiles: builder.mutation({
      query: ({ files }) => {
        const formData = new FormData();
        files.forEach((file) => formData.append("files", file));
        return {
          url: `/upload/upload-multiple`,
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: ["Media"],
    }),
  }),
});

export const { useUploadSingleFileMutation, useUploadMultipleFilesMutation } =
  mediaService;
