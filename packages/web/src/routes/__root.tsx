import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRoute,
} from "@tanstack/react-router";
import type { ReactNode } from "react";
import { CommandPalette } from "~/components/ui/command-palette";
import appCss from "~/styles/app.css?url";
import {
  SITE_NAME,
  SITE_URL,
  SITE_DESCRIPTION,
  TWITTER_HANDLE,
} from "~/lib/seo";

// Fonts
import "@fontsource-variable/inter";
import "@fontsource-variable/space-grotesk";
import "@fontsource/jetbrains-mono";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      // Basic
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },

      // Theme & Colors
      { name: "theme-color", content: "#171717", media: "(prefers-color-scheme: dark)" },
      { name: "theme-color", content: "#fafafa", media: "(prefers-color-scheme: light)" },
      { name: "color-scheme", content: "light dark" },
      { name: "msapplication-TileColor", content: "#171717" },

      // Default SEO (overridden by page-specific head())
      { name: "description", content: SITE_DESCRIPTION },
      { name: "author", content: SITE_NAME },
      { name: "robots", content: "index, follow" },
      { name: "googlebot", content: "index, follow, max-video-preview:-1, max-image-preview:large, max-snippet:-1" },

      // Open Graph defaults
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:locale", content: "en_US" },
      { property: "og:image", content: `${SITE_URL}/og/default.png` },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },

      // Twitter Card defaults
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:site", content: TWITTER_HANDLE },
      { name: "twitter:creator", content: TWITTER_HANDLE },

      // Additional SEO
      { name: "format-detection", content: "telephone=no" },
    ],
    links: [
      // Stylesheet
      { rel: "stylesheet", href: appCss },

      // Favicons
      { rel: "icon", href: "/favicon.ico", sizes: "32x32" },
      { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
      { rel: "icon", href: "/favicon-16x16.png", type: "image/png", sizes: "16x16" },
      { rel: "icon", href: "/favicon-32x32.png", type: "image/png", sizes: "32x32" },
      { rel: "apple-touch-icon", href: "/apple-touch-icon.png", sizes: "180x180" },

      // Manifest
      { rel: "manifest", href: "/site.webmanifest" },

      // Preconnect for performance
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
    ],
  }),
  component: RootComponent,
});

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
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
                if (stored === 'dark' || (!stored && systemDark)) {
                  document.documentElement.classList.add('dark');
                } else if (stored === 'light') {
                  document.documentElement.classList.add('light');
                }
              })();
            `,
          }}
        />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}
