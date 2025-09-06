import { createFileRoute, redirect } from "@tanstack/react-router";
import { useAuthQueries } from "~/services/auth/auth.queries";

export const Route = createFileRoute("/register")({
  component: Register,
  beforeLoad: async ({ context }) => {
    if (context.userSession) {
      throw redirect({ to: "/" });
    }
  },
});

function Register() {
  const { signUp } = useAuthQueries();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const email = (e.target as HTMLFormElement).email.value;
    const password = (e.target as HTMLFormElement).password.value;
    const confirmPassword = (e.target as HTMLFormElement).confirmPassword.value;
    const name = (e.target as HTMLFormElement).username.value;
    signUp.mutateAsync({
      email,
      password,
      confirmPassword,
      name,
    });
  };
  return (
    <div>
      <h1>Register</h1>
      <form
        style={{ display: "flex", flexDirection: "column" }}
        onSubmit={handleSubmit}
      >
        <label>Name</label>
        <input
          autoComplete="username"
          name="username"
          type="text"
          placeholder="Name"
        />
        <label>Email</label>
        <input
          autoComplete="email"
          name="email"
          type="email"
          placeholder="Email"
        />
        <label>Password</label>
        <input
          name="password"
          type="password"
          placeholder="Password"
          autoComplete="new-password"
        />
        <label>Confirm Password</label>
        <input
          name="confirmPassword"
          type="password"
          placeholder="Confirm Password"
          autoComplete="new-password"
        />
        <button type="submit">Register</button>
      </form>
    </div>
  );
}
