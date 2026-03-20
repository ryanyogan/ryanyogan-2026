/**
 * Generate favicon and Open Graph images for the website.
 *
 * This script uses Satori to render JSX to SVG, then sharp/resvg to convert to PNG.
 * Run with: pnpm tsx scripts/generate-assets.ts
 */

import satori from "satori";
import { Resvg } from "@resvg/resvg-js";
import sharp from "sharp";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import matter from "gray-matter";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = path.join(__dirname, "../public");
const CONTENT_DIR = path.join(__dirname, "../content");

// Site configuration
const SITE_NAME = "Ryan Yogan";
const SITE_URL = "https://ryanyogan.com";

// Satori font weight type
type FontWeight = 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;

interface FontOptions {
  name: string;
  data: ArrayBuffer;
  weight: FontWeight;
  style: "normal" | "italic";
}

// Cache for loaded fonts
const fontCache: Map<FontWeight, FontOptions> = new Map();

// Load Inter font - Satori only supports TTF/OTF, not WOFF2
// Download from GitHub releases where TTF files are available
async function loadFont(weight: FontWeight): Promise<FontOptions> {
  // Check cache first
  const cached = fontCache.get(weight);
  if (cached) return cached;

  // Inter font from bunny.net CDN (provides TTF)
  // Using a static mapping for reliable builds
  const weightMap: Record<FontWeight, string> = {
    100: "Thin",
    200: "ExtraLight",
    300: "Light",
    400: "Regular",
    500: "Medium",
    600: "SemiBold",
    700: "Bold",
    800: "ExtraBold",
    900: "Black",
  };

  const weightName = weightMap[weight] || "Regular";

  // Try multiple font sources
  const fontUrls = [
    // Bunny CDN (usually has TTF)
    `https://fonts.bunny.net/inter/files/inter-latin-${weight}-normal.ttf`,
    // cdnjs
    `https://cdnjs.cloudflare.com/ajax/libs/inter-ui/3.19.3/Inter%20(Desktop)/Inter-${weightName}.otf`,
    // Fallback: use Geist which is also in the project as variable font
  ];

  for (const fontUrl of fontUrls) {
    try {
      const fontResponse = await fetch(fontUrl);
      if (fontResponse.ok) {
        const buffer = await fontResponse.arrayBuffer();
        const font: FontOptions = {
          name: "Inter",
          data: buffer,
          weight,
          style: "normal",
        };
        fontCache.set(weight, font);
        return font;
      }
    } catch {
      // Try next URL
    }
  }

  // If all else fails, use a system font approach with a hardcoded simple font
  // Download Roboto as fallback (widely available as TTF)
  const robotoUrl = `https://github.com/googlefonts/roboto/raw/main/src/hinted/Roboto-${weightMap[weight] || "Regular"}.ttf`;

  try {
    const response = await fetch(robotoUrl);
    if (response.ok) {
      const buffer = await response.arrayBuffer();
      const font: FontOptions = {
        name: "Inter",
        data: buffer,
        weight,
        style: "normal",
      };
      fontCache.set(weight, font);
      return font;
    }
  } catch {
    // Continue to error
  }

  throw new Error(`Could not load font for weight ${weight}`);
}

// SVG to PNG conversion using resvg
async function svgToPng(svg: string, width: number): Promise<Buffer> {
  const resvg = new Resvg(svg, {
    fitTo: {
      mode: "width",
      value: width,
    },
  });
  const pngData = resvg.render();
  return pngData.asPng();
}

// =============================================================================
// Favicon Generation - RY Monogram Style
// =============================================================================

function createFaviconSvg(): string {
  // RY monogram design - clean, modern, professional
  return `
    <svg width="512" height="512" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="512" height="512" rx="96" fill="#171717"/>
      <text x="256" y="340" text-anchor="middle" font-family="Inter, system-ui, sans-serif" font-size="280" font-weight="700" fill="#FAFAFA">
        <tspan>R</tspan><tspan font-size="200" dy="10">Y</tspan>
      </text>
    </svg>
  `;
}

async function generateFavicons() {
  console.log("Generating favicons...");

  const fonts = [await loadFont(700)];

  // Create the RY monogram using Satori for better font rendering
  const faviconJsx = {
    type: "div",
    props: {
      style: {
        width: "512px",
        height: "512px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#171717",
        borderRadius: "96px",
      },
      children: {
        type: "div",
        props: {
          style: {
            display: "flex",
            alignItems: "baseline",
            color: "#FAFAFA",
            fontFamily: "Inter",
          },
          children: [
            {
              type: "span",
              props: {
                style: {
                  fontSize: "280px",
                  fontWeight: 700,
                  letterSpacing: "-0.02em",
                },
                children: "R",
              },
            },
            {
              type: "span",
              props: {
                style: {
                  fontSize: "200px",
                  fontWeight: 700,
                  marginLeft: "-20px",
                  opacity: 0.7,
                },
                children: "Y",
              },
            },
          ],
        },
      },
    },
  };

  const svg = await satori(faviconJsx as any, {
    width: 512,
    height: 512,
    fonts,
  });

  // Save SVG
  await fs.writeFile(path.join(PUBLIC_DIR, "favicon.svg"), svg);
  console.log("  - favicon.svg");

  // Generate PNG versions
  const sizes = [
    { name: "favicon-16x16.png", size: 16 },
    { name: "favicon-32x32.png", size: 32 },
    { name: "apple-touch-icon.png", size: 180 },
    { name: "android-chrome-192x192.png", size: 192 },
    { name: "android-chrome-512x512.png", size: 512 },
  ];

  for (const { name, size } of sizes) {
    const png = await svgToPng(svg, size);
    await fs.writeFile(path.join(PUBLIC_DIR, name), png);
    console.log(`  - ${name}`);
  }

  // Generate ICO (contains 16, 32, 48 sizes)
  const ico16 = await svgToPng(svg, 16);
  const ico32 = await svgToPng(svg, 32);
  const ico48 = await svgToPng(svg, 48);

  // Create ICO file manually (simplified - just use 32x32 as main)
  // For proper multi-resolution ICO, we'd need a dedicated library
  // But most modern browsers use PNG favicons anyway
  await fs.writeFile(path.join(PUBLIC_DIR, "favicon.ico"), ico32);
  console.log("  - favicon.ico");
}

// =============================================================================
// Open Graph Image Generation
// =============================================================================

interface OGImageOptions {
  title: string;
  subtitle?: string;
  type?: "default" | "article" | "page";
}

async function generateOGImage(options: OGImageOptions): Promise<Buffer> {
  const { title, subtitle, type = "default" } = options;
  const fonts = [await loadFont(400), await loadFont(700)];

  const ogJsx = {
    type: "div",
    props: {
      style: {
        width: "1200px",
        height: "630px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "80px",
        backgroundColor: "#FAFAFA",
        fontFamily: "Inter",
      },
      children: [
        // Site name at top
        {
          type: "div",
          props: {
            style: {
              display: "flex",
              alignItems: "center",
              marginBottom: "40px",
            },
            children: [
              // RY monogram
              {
                type: "div",
                props: {
                  style: {
                    width: "56px",
                    height: "56px",
                    borderRadius: "12px",
                    backgroundColor: "#171717",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: "20px",
                  },
                  children: {
                    type: "div",
                    props: {
                      style: {
                        display: "flex",
                        alignItems: "baseline",
                        color: "#FAFAFA",
                      },
                      children: [
                        {
                          type: "span",
                          props: {
                            style: {
                              fontSize: "28px",
                              fontWeight: 700,
                            },
                            children: "R",
                          },
                        },
                        {
                          type: "span",
                          props: {
                            style: {
                              fontSize: "20px",
                              fontWeight: 700,
                              marginLeft: "-2px",
                              opacity: 0.7,
                            },
                            children: "Y",
                          },
                        },
                      ],
                    },
                  },
                },
              },
              {
                type: "span",
                props: {
                  style: {
                    fontSize: "24px",
                    fontWeight: 400,
                    color: "#525252",
                  },
                  children: SITE_NAME,
                },
              },
            ],
          },
        },
        // Main title
        {
          type: "div",
          props: {
            style: {
              fontSize: title.length > 40 ? "56px" : "72px",
              fontWeight: 700,
              color: "#171717",
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
              maxWidth: "1000px",
            },
            children: title,
          },
        },
        // Subtitle if provided
        subtitle
          ? {
              type: "div",
              props: {
                style: {
                  fontSize: "28px",
                  fontWeight: 400,
                  color: "#525252",
                  marginTop: "24px",
                  maxWidth: "900px",
                  lineHeight: 1.4,
                },
                children: subtitle,
              },
            }
          : null,
        // Bottom accent line
        {
          type: "div",
          props: {
            style: {
              position: "absolute",
              bottom: "0",
              left: "0",
              right: "0",
              height: "6px",
              backgroundColor: "#171717",
            },
            children: null,
          },
        },
      ].filter(Boolean),
    },
  };

  const svg = await satori(ogJsx as any, {
    width: 1200,
    height: 630,
    fonts,
  });

  return svgToPng(svg, 1200);
}

async function generateAllOGImages() {
  console.log("\nGenerating Open Graph images...");

  const ogDir = path.join(PUBLIC_DIR, "og");
  await fs.mkdir(ogDir, { recursive: true });

  // Static pages
  const staticPages = [
    {
      filename: "default.png",
      title: "Ryan Yogan",
      subtitle:
        "Engineering leader with 20 years of experience building teams and products",
    },
    {
      filename: "home.png",
      title: "Ryan Yogan",
      subtitle:
        "Engineering leader with 20 years of experience building teams and products",
    },
    {
      filename: "work.png",
      title: "Work Experience",
      subtitle:
        "20 years building and scaling engineering teams through IPO and beyond",
    },
    {
      filename: "projects.png",
      title: "Projects",
      subtitle: "Open source projects and things I've built",
    },
    {
      filename: "writing.png",
      title: "Writing",
      subtitle: "Thoughts on engineering, leadership, and building things",
    },
  ];

  for (const page of staticPages) {
    const png = await generateOGImage({
      title: page.title,
      subtitle: page.subtitle,
    });
    await fs.writeFile(path.join(ogDir, page.filename), png);
    console.log(`  - og/${page.filename}`);
  }

  // Generate OG images for blog posts
  const writingDir = path.join(CONTENT_DIR, "writing");
  const writingOgDir = path.join(ogDir, "writing");
  await fs.mkdir(writingOgDir, { recursive: true });

  try {
    const mdxFiles = await fs.readdir(writingDir);
    for (const file of mdxFiles.filter((f) => f.endsWith(".mdx"))) {
      const content = await fs.readFile(path.join(writingDir, file), "utf-8");
      const { data } = matter(content);

      const slug = file.replace(".mdx", "");
      const png = await generateOGImage({
        title: data.title || slug,
        subtitle: data.description,
        type: "article",
      });
      await fs.writeFile(path.join(writingOgDir, `${slug}.png`), png);
      console.log(`  - og/writing/${slug}.png`);
    }
  } catch (error) {
    console.log("  (No writing posts found)");
  }
}

// =============================================================================
// Site Manifest
// =============================================================================

async function generateManifest() {
  console.log("\nGenerating site.webmanifest...");

  const manifest = {
    name: SITE_NAME,
    short_name: "RY",
    description:
      "Engineering leader with 20 years of experience building teams and products",
    start_url: "/",
    display: "standalone",
    background_color: "#FAFAFA",
    theme_color: "#171717",
    icons: [
      {
        src: "/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };

  await fs.writeFile(
    path.join(PUBLIC_DIR, "site.webmanifest"),
    JSON.stringify(manifest, null, 2)
  );
  console.log("  - site.webmanifest");
}

// =============================================================================
// Main
// =============================================================================

async function main() {
  console.log("=".repeat(60));
  console.log("Generating SEO Assets");
  console.log("=".repeat(60));

  await generateFavicons();
  await generateAllOGImages();
  await generateManifest();

  console.log("\n" + "=".repeat(60));
  console.log("Done! All assets generated successfully.");
  console.log("=".repeat(60));
}

main().catch(console.error);
