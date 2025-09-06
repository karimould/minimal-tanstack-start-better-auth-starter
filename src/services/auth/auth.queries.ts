import {
  queryOptions,
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { getUserSession, login, logout, signUp } from "./auth.api";
import { useRouter } from "@tanstack/react-router";
import { auth } from "~/utils/auth/auth";
import { k } from "node_modules/better-auth/dist/shared/better-auth.DnUZno9_";

export const authQueries = {
  all: ["auth"],
  user: () =>
    queryOptions({
      queryKey: [...authQueries.all, "user"],
      queryFn: () => getUserSession(),
      staleTime: 5000,
    }),
};

export const useAuthQueries = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const signUpMutation = useMutation({
    mutationFn: signUp,
    onSuccess: () => {
      console.log("success");
      // toast.success("You have successfully signed up.")
      queryClient.resetQueries();
      router.invalidate();
    },
  });

  const logoutMutation = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.resetQueries();
      router.invalidate();
    },
  });

  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: () => {
      queryClient.resetQueries();
      router.invalidate();
    },
  });

  return {
    user: useSuspenseQuery(authQueries.user()).data?.user,
    session: useSuspenseQuery(authQueries.user()).data?.session,
    logout: logoutMutation,
    signUp: signUpMutation,
    login: loginMutation,
  };
};
