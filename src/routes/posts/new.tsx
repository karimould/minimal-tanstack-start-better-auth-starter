import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { usePostQueries } from "~/services/post/post.queries";
import { useAuthQueries } from "~/services/auth/auth.queries";
import { useState } from "react";

export const Route = createFileRoute("/posts/new")({
  component: NewPost,
});

function NewPost() {
  const { createPost } = usePostQueries();
  const { user, session, logout } = useAuthQueries();

  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createPost.mutateAsync({ title, content });
    router.navigate({ to: "/posts" });
  };

  if (!session) {
    return (
      <div>
        <h1>Create New Post</h1>
        <p>You must be logged in to create a post.</p>
        <Link to="/login">Login</Link>
        <br />
        <Link to="/posts">← Back to Posts</Link>
      </div>
    );
  }

  return (
    <div>
      <h1>Create New Post</h1>
      <Link to="/posts">← Back to Posts</Link>
      <br />
      <br />

      <form onSubmit={handleSubmit}>
        <div>
          <label>Title:</label>
          <br />
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            style={{ width: "100%", padding: "5px" }}
          />
        </div>
        <br />
        <div>
          <label>Content:</label>
          <br />
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            rows={10}
            style={{ width: "100%", padding: "5px" }}
          />
        </div>
        <br />
        <button type="submit" disabled={createPost.isPending}>
          {createPost.isPending ? "Creating..." : "Create Post"}
        </button>
      </form>
    </div>
  );
}
