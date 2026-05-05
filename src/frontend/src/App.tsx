import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { Suspense, lazy, useEffect } from "react";
import { useEditorStore } from "./store/editorStore";

const EditorPage = lazy(() => import("./pages/EditorPage"));
const ProjectDashboard = lazy(() => import("./pages/ProjectDashboard"));
const LoginPage = lazy(() => import("./pages/LoginPage"));

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, staleTime: 30_000 } },
});

const rootRoute = createRootRoute({
  component: () => <RootLayout />,
});

const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: () => (
    <Suspense fallback={<div className="h-screen w-screen bg-background" />}>
      <ProjectDashboard />
    </Suspense>
  ),
});

const editorRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/editor/$projectId",
  component: () => (
    <Suspense fallback={<div className="h-screen w-screen bg-background" />}>
      <EditorPage />
    </Suspense>
  ),
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  component: () => (
    <Suspense fallback={<div className="h-screen w-screen bg-background" />}>
      <LoginPage />
    </Suspense>
  ),
});

const routeTree = rootRoute.addChildren([
  dashboardRoute,
  editorRoute,
  loginRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

function RootLayout() {
  const theme = useEditorStore((s) => s.theme);
  // Sync theme class on mount
  useEffect(() => {
    if (theme === "dark") document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, [theme]);
  // Outlet is handled by RouterProvider via routeTree
  return null;
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}
