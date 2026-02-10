import { highlight } from "sugar-high";
import type { ComponentPropsWithoutRef } from "react";

// Code block with syntax highlighting
function Code({
  children,
  className,
  ...props
}: ComponentPropsWithoutRef<"code">) {
  const codeString = typeof children === "string" ? children : "";

  // Check if this is an inline code or a code block
  // Code blocks typically have a className like "language-javascript"
  const isCodeBlock = className?.startsWith("language-");

  if (!isCodeBlock) {
    // Inline code - no syntax highlighting needed
    return (
      <code className={className} {...props}>
        {children}
      </code>
    );
  }

  // Code block - apply syntax highlighting
  const html = highlight(codeString);

  return (
    <code
      className={className}
      dangerouslySetInnerHTML={{ __html: html }}
      {...props}
    />
  );
}

// Pre block for code blocks - extracts language for display
function Pre({
  children,
  ...props
}: ComponentPropsWithoutRef<"pre">) {
  // Try to extract language from the code child's className
  let language: string | undefined;

  if (
    children &&
    typeof children === "object" &&
    "props" in children &&
    children.props?.className
  ) {
    const match = children.props.className.match(/language-(\w+)/);
    if (match) {
      language = match[1];
    }
  }

  return (
    <pre data-language={language} {...props}>
      {children}
    </pre>
  );
}

// Anchor with external link handling
function Anchor({
  href,
  children,
  ...props
}: ComponentPropsWithoutRef<"a">) {
  const isExternal = href?.startsWith("http");

  return (
    <a
      href={href}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer" : undefined}
      {...props}
    >
      {children}
    </a>
  );
}

// Table wrapper for horizontal scroll on small screens
function Table({
  children,
  ...props
}: ComponentPropsWithoutRef<"table">) {
  return (
    <div className="table-wrapper">
      <table {...props}>{children}</table>
    </div>
  );
}

// Table header cell
function Th({
  children,
  ...props
}: ComponentPropsWithoutRef<"th">) {
  return <th {...props}>{children}</th>;
}

// Table data cell
function Td({
  children,
  ...props
}: ComponentPropsWithoutRef<"td">) {
  return <td {...props}>{children}</td>;
}

// Blockquote styling
function Blockquote({
  children,
  ...props
}: ComponentPropsWithoutRef<"blockquote">) {
  return <blockquote {...props}>{children}</blockquote>;
}

// Horizontal rule
function Hr(props: ComponentPropsWithoutRef<"hr">) {
  return <hr {...props} />;
}

// Image with lazy loading
function Img({
  alt,
  ...props
}: ComponentPropsWithoutRef<"img">) {
  return <img alt={alt || ""} loading="lazy" {...props} />;
}

// Unordered list
function Ul({
  children,
  ...props
}: ComponentPropsWithoutRef<"ul">) {
  return <ul {...props}>{children}</ul>;
}

// Ordered list
function Ol({
  children,
  ...props
}: ComponentPropsWithoutRef<"ol">) {
  return <ol {...props}>{children}</ol>;
}

// List item
function Li({
  children,
  ...props
}: ComponentPropsWithoutRef<"li">) {
  return <li {...props}>{children}</li>;
}

// Headings with anchor links
function createHeading(level: 1 | 2 | 3 | 4 | 5 | 6) {
  const Tag = `h${level}` as const;

  return function Heading({
    children,
    id,
    ...props
  }: ComponentPropsWithoutRef<typeof Tag>) {
    // Generate id from children text if not provided
    const headingId =
      id ||
      (typeof children === "string"
        ? children.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, "")
        : undefined);

    return (
      <Tag id={headingId} {...props}>
        {children}
      </Tag>
    );
  };
}

// Details/Summary for collapsible content
function Details({
  children,
  ...props
}: ComponentPropsWithoutRef<"details">) {
  return <details {...props}>{children}</details>;
}

function Summary({
  children,
  ...props
}: ComponentPropsWithoutRef<"summary">) {
  return <summary {...props}>{children}</summary>;
}

// Export MDX components
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const mdxComponents: Record<string, any> = {
  // Text elements
  code: Code,
  pre: Pre,
  a: Anchor,
  blockquote: Blockquote,
  hr: Hr,
  img: Img,

  // Lists
  ul: Ul,
  ol: Ol,
  li: Li,

  // Tables
  table: Table,
  th: Th,
  td: Td,

  // Headings
  h1: createHeading(1),
  h2: createHeading(2),
  h3: createHeading(3),
  h4: createHeading(4),
  h5: createHeading(5),
  h6: createHeading(6),

  // Collapsible
  details: Details,
  summary: Summary,
};
