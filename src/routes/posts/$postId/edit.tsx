import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { usePostSuspense, usePostQueries } from "~/services/post/post.queries";
import { useAuthQueries } from "~/services/auth/auth.queries";
import { useState, useEffect } from "react";

export const Route = createFileRoute("/posts/$postId/edit")({ 
  component: EditPost,
});

function EditPost() {
  const { postId } = Route.useParams();
  const { data: post } = usePostSuspense(postId);
  const { updatePost } = usePostQueries();
  const { user } = useAuthQueries();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    if (post) {
      setTitle(post.title);
      setContent(post.content);
    }
  }, [post]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await updatePost.mutateAsync({ id: postId, title, content });
      router.navigate({ to: "/posts/$postId", params: { postId } });
    } catch (error) {
      console.error("Failed to update post:", error);
      alert("Failed to update post");
    }
  };

  if (!user || user.id !== post.authorId) {
    return (
      <div>
        <h1>Edit Post</h1>
        <p>You don't have permission to edit this post.</p>
        <Link to="/posts/$postId" params={{ postId }}>← Back to Post</Link>
      </div>
    );
  }

  return (
    <div>
      <h1>Edit Post</h1>
      <Link to="/posts/$postId" params={{ postId }}>← Back to Post</Link>
      <br /><br />
      
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
        <button type="submit" disabled={updatePost.isPending}>
          {updatePost.isPending ? "Updating..." : "Update Post"}
        </button>
      </form>
    </div>
  );
}
