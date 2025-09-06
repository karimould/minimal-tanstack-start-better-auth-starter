import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { usePostSuspense, usePostQueries } from "~/services/post/post.queries";
import { useAuthQueries } from "~/services/auth/auth.queries";

export const Route = createFileRoute("/posts/$postId")({
  component: PostDetail,
});

function PostDetail() {
  const { postId } = Route.useParams();
  const { data: post } = usePostSuspense(postId);
  const { deletePost } = usePostQueries();
  const { user } = useAuthQueries();
  const router = useRouter();

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this post?")) {
      try {
        await deletePost.mutateAsync({ id: postId });
        router.navigate({ to: "/posts" });
      } catch (error) {
        console.error("Failed to delete post:", error);
        alert("Failed to delete post");
      }
    }
  };

  const isOwner = user?.id === post.authorId;

  return (
    <div>
      <Link to="/posts">← Back to Posts</Link>
      <br />
      <br />

      <h1>{post.title}</h1>
      <small>Created: {new Date(post.createdAt).toLocaleDateString()}</small>
      {post.updatedAt !== post.createdAt && (
        <>
          <br />
          <small>
            Updated: {new Date(post.updatedAt).toLocaleDateString()}
          </small>
        </>
      )}

      <div style={{ marginTop: "20px", whiteSpace: "pre-wrap" }}>
        {post.content}
      </div>

      {isOwner && (
        <div style={{ marginTop: "20px" }}>
          <Link to="/posts/$postId/edit" params={{ postId }}>
            Edit Post
          </Link>
          {" | "}
          <button
            onClick={handleDelete}
            style={{
              background: "none",
              border: "none",
              color: "red",
              cursor: "pointer",
            }}
            disabled={deletePost.isPending}
          >
            {deletePost.isPending ? "Deleting..." : "Delete Post"}
          </button>
        </div>
      )}
    </div>
  );
}
