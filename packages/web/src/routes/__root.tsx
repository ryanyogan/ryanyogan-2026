import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRoute,
} from "@tanstack/react-router";
import type { ReactNode } from "react";
import { Header, Footer } from "~/components/layout";
import { CommandPalette } from "~/components/ui/command-palette";
import appCss from "~/styles/app.css?url";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { name: "theme-color", content: "#fafafa" },
      {
        name: "description",
        content:
          "Ryan Yogan is a software engineer and engineering leader. Building at the intersection of AI and the physical world.",
      },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "Ryan Yogan" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:creator", content: "@ryanyogan" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.ico" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossOrigin: "anonymous",
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap",
      },
    ],
  }),
  component: RootComponent,
});

function RootComponent() {
  return (
    <RootDocument>
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <CommandPalette />
    </RootDocument>
  );
}

function RootDocument({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                const stored = localStorage.getItem('ryanyogan-theme');
                const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                const theme = stored === 'dark' || stored === 'light' 
                  ? stored 
                  : (systemDark ? 'dark' : 'light');
                document.documentElement.classList.add(theme);
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-[--color-background] text-[--color-foreground]">
        {children}
        <Scripts />
      </body>
    </html>
  );
}
