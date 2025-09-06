import { createFileRoute, redirect } from "@tanstack/react-router";
import { useAuthQueries } from "~/services/auth/auth.queries";

export const Route = createFileRoute("/login")({
  component: Login,
  beforeLoad: async ({ context }) => {
    if (context.userSession) {
      throw redirect({ to: "/" });
    }
  },
});

function Login() {
  const { login } = useAuthQueries();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const email = (e.target as HTMLFormElement).email.value;
    const password = (e.target as HTMLFormElement).password.value;
    login.mutateAsync({
      email,
      password,
    });
  };
  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <input name="email" type="email" placeholder="Email" />
        <input name="password" type="password" placeholder="Password" />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}
