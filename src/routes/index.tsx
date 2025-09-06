import { createFileRoute, Link } from "@tanstack/react-router";
import { useAuthQueries } from "~/services/auth/auth.queries";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  const { user, session, logout } = useAuthQueries();

  return (
    <div>
      {session && <button onClick={() => logout.mutate()}>Logout</button>}
      <h1>Hello</h1>
      {user && <p>User: {user?.email}</p>}
      <br />
      <Link to="/posts">View Posts</Link>
      {!session && (
        <>
          <br />
          <Link to="/register">Register</Link>
          <br />
          <Link to="/login">Login</Link>
        </>
      )}
    </div>
  );
}
