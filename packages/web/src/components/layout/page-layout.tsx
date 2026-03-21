import type { ReactNode } from "react";
import { Nav } from "./nav";
import { Footer } from "./footer";

type ContainerWidth = "narrow" | "default" | "wide" | "full";

interface PageLayoutProps {
  children: ReactNode;
  showNav?: boolean;
  containerWidth?: ContainerWidth;
}

const containerClasses: Record<ContainerWidth, string> = {
  narrow: "container container-narrow",
  default: "container",
  wide: "container container-wide",
  full: "container container-full",
};

export function PageLayout({
  children,
  showNav = true,
  containerWidth = "default",
}: PageLayoutProps) {
  return (
    <div className="page">
      <div className={containerClasses[containerWidth]}>
        {showNav && <Nav />}
        <main className="page-content">{children}</main>
        <Footer />
      </div>
    </div>
  );
}
