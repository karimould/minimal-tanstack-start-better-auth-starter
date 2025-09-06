import { createMiddleware, createServerFn, json } from "@tanstack/react-start";
import { getWebRequest } from "@tanstack/react-start/server";
import { auth } from "~/utils/auth/auth";
import { authClient } from "~/utils/auth/client";
import { SignUpSchema } from "./auth.schema";

export const getUserSession = createServerFn({ method: "GET" }).handler(
  async () => {
    const request = getWebRequest();

    if (!request?.headers) {
      return null;
    }

    const userSession = await auth.api.getSession({ headers: request.headers });

    return userSession;
  }
);

export const userMiddleware = createMiddleware({ type: "function" }).server(
  async ({ next }) => {
    const userSession = await getUserSession();

    return next({ context: { userSession } });
  }
);

export const userRequiredMiddleware = createMiddleware({ type: "function" })
  .middleware([userMiddleware])
  .server(async ({ next, context }) => {
    if (!context.userSession) {
      throw json(
        { message: "You must be logged in to do that!" },
        { status: 401 }
      );
    }

    return next({ context: { userSession: context.userSession } });
  });

export const signUp = async (data: SignUpSchema) => {
  const { error } = await authClient.signUp.email({
    email: data.email,
    password: data.password,
    name: data.name,
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const logout = async () => {
  await authClient.signOut();
};

export const login = async (data: { email: string; password: string }) => {
  const { error } = await authClient.signIn.email({
    email: data.email,
    password: data.password,
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
};
