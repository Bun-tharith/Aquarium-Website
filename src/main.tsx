import "./index.css";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store/store";
import App from "./App";
import RegisterPage from "./page/RegisterPage";
import LoginPage from "./page/LoginPage";
import { SectionComponent } from "./components/SectionComponent";
import { CreatePostComponent } from "./components/CreatePostComponent";
import HomePage from "./page/HomePage";
import AiAssistPage from "./page/AiAssistPage";
import SavedQuestionPage from "./page/SavedQuestionPage";
import PostDetailPage from "./page/PostDetailPage";
import ProfileComponent from "./components/ProfileComponent";
import { ThemeProvider } from "./ThemeProvider";
import TagPage from "./page/TagPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/home",
        element: <SectionComponent />,
      },
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "/:postId",
        element: <PostDetailPage />,
      },
      {
        path: "/create-post",
        element: <CreatePostComponent />,
      },
      {
        path: "/saves",
        element: <SavedQuestionPage />,
      },
      {
        path: "/ai",
        element: <AiAssistPage />,
      },
      {
        path: "/profile",
        element: <ProfileComponent />,
      },
      {
          path: "/tag",
        element: <TagPage/>,
      }
    ],
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
]);

const root = document.getElementById("root");
createRoot(root!).render(
  <ThemeProvider>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </ThemeProvider>
);