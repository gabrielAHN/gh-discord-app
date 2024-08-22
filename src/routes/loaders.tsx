import Cookies from "js-cookie";
import fetchGraphQL from "@/hooks/fetchGraphQL.tsx";
import { getMessageInfo } from "@/graphql/graphqlCalls";

import {
  redirect,
  defer,
  LoaderFunctionArgs,
  ActionFunctionArgs,
} from "react-router-dom";

export const USER_NAME = import.meta.env.VITE_USER_NAME;
export const PASSWORD = import.meta.env.VITE_PASSWORD;
export const DISCORD_CATEGORY = import.meta.env.VITE_DISCORD_CATEGORY;

const getAccessToken = (): string | undefined => {
  return Cookies.get("accessToken");
};

const isAuthenticated = (): boolean => {
  return !!getAccessToken();
};

const handleLogout = (): void => {
  Cookies.remove("accessToken");
};

export async function loginLoader(): Promise<null | ReturnType<
  typeof redirect
>> {
  handleLogout();
  if (isAuthenticated()) {
    return redirect("/messages");
  }
  return null;
}

export async function MessageLoader({
  params,
}: LoaderFunctionArgs): Promise<ReturnType<typeof defer>> {
  const messageId = params.messageId as string;
  return defer({
    MessageData: fetchGraphQL(getMessageInfo, {
      MessageId: messageId,
      CategoryId: DISCORD_CATEGORY,
    }),
  });
}

export async function actionLogin({
  request,
}: ActionFunctionArgs): Promise<ReturnType<typeof redirect>> {
  const formData = await request.formData();
  const user = formData.get("username");
  const pass = formData.get("password");

  if (user === USER_NAME && pass === PASSWORD) {
    console.log("Login successful");
    Cookies.set("accessToken", "your-token-here", { expires: 1 });
    return redirect("/messages");
  } else {
    return redirect("/");
  }
}
