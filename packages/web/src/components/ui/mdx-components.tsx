import { highlight } from "sugar-high";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

// Code block with syntax highlighting
function Code({ children, ...props }: ComponentPropsWithoutRef<"code">) {
  const codeString = typeof children === "string" ? children : "";
  const html = highlight(codeString);

  return (
    <code
      dangerouslySetInnerHTML={{ __html: html }}
      {...props}
    />
  );
}

// Pre block for code blocks
function Pre({ children, ...props }: ComponentPropsWithoutRef<"pre">) {
  return (
    <pre {...props}>
      {children}
    </pre>
  );
}

// Anchor with external link handling
function Anchor({ href, children, ...props }: ComponentPropsWithoutRef<"a">) {
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

// Table styling
function Table({ children, ...props }: ComponentPropsWithoutRef<"table">) {
  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse" }} {...props}>
        {children}
      </table>
    </div>
  );
}

function Th({ children, ...props }: ComponentPropsWithoutRef<"th">) {
  return (
    <th
      style={{
        textAlign: "left",
        padding: "0.5rem",
        borderBottom: "1px solid var(--color-border)",
        fontWeight: 600,
      }}
      {...props}
    >
      {children}
    </th>
  );
}

function Td({ children, ...props }: ComponentPropsWithoutRef<"td">) {
  return (
    <td
      style={{
        padding: "0.5rem",
        borderBottom: "1px solid var(--color-border)",
      }}
      {...props}
    >
      {children}
    </td>
  );
}

// Export MDX components - using any for now to avoid type conflicts
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const mdxComponents: Record<string, any> = {
  code: Code,
  pre: Pre,
  a: Anchor,
  table: Table,
  th: Th,
  td: Td,
};
