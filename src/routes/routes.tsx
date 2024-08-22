import Login from "../client/login";
import ProtectedRoute from "../client/protectedRoute";
import MessagePage from "../client/messages/messagePage";
import MessageWindow from "../client/messages/MessageWindow/MessageWindow";

import { createBrowserRouter, Navigate } from "react-router-dom";
import { actionLogin, loginLoader, MessageLoader } from "./loaders";
import { MessageReplyAction } from "./actions";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
    action: actionLogin,
    loader: loginLoader,
  },
  {
    path: "*",
    element: <Navigate to="/login" replace />,
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "/messages",
        element: <MessagePage />,
        children: [
          {
            path: ":messageId",
            element: <MessageWindow />,
            loader: MessageLoader,
            action: MessageReplyAction,
          },
        ],
      },
    ],
  },
]);
