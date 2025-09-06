import {
  queryOptions,
  useMutation,
  useQueryClient,
  useSuspenseQuery,
  useQuery,
} from "@tanstack/react-query";
import {
  createPost,
  getPosts,
  getPost,
  updatePost,
  deletePost,
  getUserPosts,
} from "./post.api";
import { useRouter } from "@tanstack/react-router";
import type {
  CreatePostSchema,
  UpdatePostSchema,
  DeletePostSchema,
  GetPostSchema,
} from "./post.schema";

export const postQueries = {
  all: ["posts"] as const,
  lists: () => [...postQueries.all, "list"] as const,
  list: (filters?: any) => [...postQueries.lists(), filters] as const,
  details: () => [...postQueries.all, "detail"] as const,
  detail: (id: string) => [...postQueries.details(), id] as const,
  userPosts: () => [...postQueries.all, "user"] as const,
};

export const postsQueryOptions = () =>
  queryOptions({
    queryKey: postQueries.lists(),
    queryFn: () => getPosts(),
    staleTime: 30000, // 30 seconds
  });

export const postQueryOptions = (id: string) =>
  queryOptions({
    queryKey: postQueries.detail(id),
    queryFn: () => getPost({ data: { id } }),
    staleTime: 30000,
  });

export const userPostsQueryOptions = () =>
  queryOptions({
    queryKey: postQueries.userPosts(),
    queryFn: () => getUserPosts(),
    staleTime: 30000,
  });

export const usePostQueries = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const createPostMutation = useMutation({
    mutationFn: (data: CreatePostSchema) => createPost({ data }),
    onSuccess: () => {
      // Invalidate and refetch posts
      queryClient.invalidateQueries({ queryKey: postQueries.lists() });
      queryClient.invalidateQueries({ queryKey: postQueries.userPosts() });
      router.invalidate();
    },
    onError: (error) => {
      console.error("Failed to create post:", error);
    },
  });

  const updatePostMutation = useMutation({
    mutationFn: (data: UpdatePostSchema) => updatePost({ data }),
    onSuccess: (updatedPost) => {
      // Update the specific post in cache
      queryClient.setQueryData(postQueries.detail(updatedPost.id), updatedPost);
      // Invalidate lists to ensure consistency
      queryClient.invalidateQueries({ queryKey: postQueries.lists() });
      queryClient.invalidateQueries({ queryKey: postQueries.userPosts() });
      router.invalidate();
    },
    onError: (error) => {
      console.error("Failed to update post:", error);
    },
  });

  const deletePostMutation = useMutation({
    mutationFn: (data: DeletePostSchema) => deletePost({ data }),
    onSuccess: (_, variables) => {
      // Remove the post from cache
      queryClient.removeQueries({ queryKey: postQueries.detail(variables.id) });
      // Invalidate lists
      queryClient.invalidateQueries({ queryKey: postQueries.lists() });
      queryClient.invalidateQueries({ queryKey: postQueries.userPosts() });
      router.invalidate();
    },
    onError: (error) => {
      console.error("Failed to delete post:", error);
    },
  });

  return {
    createPost: createPostMutation,
    updatePost: updatePostMutation,
    deletePost: deletePostMutation,
  };
};

// Hook to get all posts
export const usePosts = () => {
  return useQuery(postsQueryOptions());
};

// Hook to get all posts with suspense
export const usePostsSuspense = () => {
  return useSuspenseQuery(postsQueryOptions());
};

// Hook to get a single post
export const usePost = (id: string) => {
  return useQuery(postQueryOptions(id));
};

// Hook to get a single post with suspense
export const usePostSuspense = (id: string) => {
  return useSuspenseQuery(postQueryOptions(id));
};

// Hook to get user's posts
export const useUserPosts = () => {
  return useQuery(userPostsQueryOptions());
};

// Hook to get user's posts with suspense
export const useUserPostsSuspense = () => {
  return useSuspenseQuery(userPostsQueryOptions());
};
