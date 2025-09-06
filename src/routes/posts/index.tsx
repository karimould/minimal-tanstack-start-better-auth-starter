import { createFileRoute, Link } from "@tanstack/react-router";
import { usePostsSuspense, usePostQueries } from "~/services/post/post.queries";
import { useAuthQueries } from "~/services/auth/auth.queries";

export const Route = createFileRoute("/posts/")({
  component: Posts,
});

function Posts() {
  const { data: posts } = usePostsSuspense();
  const { deletePost } = usePostQueries();
  const { user } = useAuthQueries();

  const handleDelete = async (postId: string) => {
    if (confirm("Are you sure you want to delete this post?")) {
      deletePost.mutate({ id: postId });
    }
  };

  return (
    <div>
      <h1>Posts</h1>
      <Link to="/posts/new">Create New Post</Link>
      <br />
      <Link to="/">← Back to Home</Link>
      <br />
      <br />

      {posts.length === 0 ? (
        <p>
          No posts yet. <Link to="/posts/new">Create the first one!</Link>
        </p>
      ) : (
        <div>
          {posts.map((post) => (
            <div
              key={post.id}
              style={{
                border: "1px solid #ccc",
                padding: "10px",
                margin: "10px 0",
              }}
            >
              <h3>
                <Link to="/posts/$postId" params={{ postId: post.id }}>
                  {post.title}
                </Link>
              </h3>
              <p>
                {post.content.substring(0, 100)}
                {post.content.length > 100 ? "..." : ""}
              </p>
              <small>
                Created: {new Date(post.createdAt).toLocaleDateString()}
              </small>
              <br />
              <Link to="/posts/$postId" params={{ postId: post.id }}>
                View
              </Link>
              {user?.id === post.authorId && (
                <>
                  {" | "}
                  <Link to="/posts/$postId/edit" params={{ postId: post.id }}>
                    Edit
                  </Link>
                  {" | "}
                  <button
                    onClick={() => handleDelete(post.id)}
                    style={{
                      background: "none",
                      border: "none",
                      color: "red",
                      cursor: "pointer",
                    }}
                  >
                    Delete
                  </button>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
