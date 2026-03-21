import type { ReactNode } from "react";

interface SectionGroupProps {
  title: string;
  children: ReactNode;
}

export function SectionGroup({ title, children }: SectionGroupProps) {
  return (
    <div className="section-group">
      <h4 className="section-group-title">{title}</h4>
      <div className="section-group-lessons">{children}</div>
    </div>
  );
}
