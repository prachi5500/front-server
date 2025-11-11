import { createBrowserRouter } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import { RequireAuth, RequireAdmin } from "./components/RouteGuards";
import AdminLayout from "./pages/admin/AdminLayout";
import Payments from "./pages/admin/Payments";
import TemplatesList from "./pages/admin/TemplatesList";
import NewTemplate from "./pages/admin/NewTemplate";
import EditTemplate from "./pages/admin/EditTemplate";

export const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <Index />,
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      element: <RequireAuth />,
      children: [
        {
          element: <RequireAdmin />,
          children: [
            {
              path: "/admin",
              element: <AdminLayout />,
              children: [
                { index: true, element: <TemplatesList /> },
                { path: "templates", element: <TemplatesList /> },
                { path: "templates/new", element: <NewTemplate /> },
                { path: "templates/:id/edit", element: <EditTemplate /> },
                { path: "payments", element: <Payments /> },
              ],
            },
          ],
        },
      ],
    },
    {
      path: "*",
      element: <NotFound />,
    },
  ]
);