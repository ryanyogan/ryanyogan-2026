import { render, type RenderOptions, type RenderResult } from "@testing-library/react";
import {
  createRouter,
  createMemoryHistory,
  createRootRoute,
  createRoute,
  RouterProvider,
  Outlet,
} from "@tanstack/react-router";
import type { ReactElement, ReactNode } from "react";

interface RenderWithRouterOptions extends Omit<RenderOptions, "wrapper"> {
  initialLocation?: string;
  routes?: Array<{
    path: string;
    component: () => ReactElement;
  }>;
}

/**
 * Create a test router with custom routes
 */
export function createTestRouter(options: {
  initialLocation?: string;
  routes?: Array<{
    path: string;
    component: () => ReactElement;
  }>;
} = {}) {
  const { initialLocation = "/", routes = [] } = options;

  const rootRoute = createRootRoute({
    component: () => <Outlet />,
  });

  const childRoutes = routes.map(({ path, component }) =>
    createRoute({
      getParentRoute: () => rootRoute,
      path,
      component,
    })
  );

  const routeTree = rootRoute.addChildren(childRoutes);

  return createRouter({
    routeTree,
    history: createMemoryHistory({
      initialEntries: [initialLocation],
    }),
  });
}

/**
 * Render a component with router context
 */
export function renderWithRouter(
  ui: ReactElement,
  options: RenderWithRouterOptions = {}
): RenderResult & { router: ReturnType<typeof createTestRouter> } {
  const { initialLocation = "/", routes = [], ...renderOptions } = options;

  const router = createTestRouter({ initialLocation, routes });

  function Wrapper({ children }: { children: ReactNode }) {
    return (
      <>
        <RouterProvider router={router} />
        {children}
      </>
    );
  }

  return {
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
    router,
  };
}

/**
 * Wait for router to be ready
 */
export async function waitForRouter(router: ReturnType<typeof createRouter>) {
  await router.load();
}
