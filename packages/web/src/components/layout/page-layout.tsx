import type { ReactNode } from "react";
import { Nav } from "./nav";
import { Footer } from "./footer";

interface PageLayoutProps {
  children: ReactNode;
  showNav?: boolean;
}

export function PageLayout({ children, showNav = true }: PageLayoutProps) {
  return (
    <div className="page">
      <div className="container">
        {showNav && <Nav />}
        {children}
        <Footer />
      </div>
    </div>
  );
}
