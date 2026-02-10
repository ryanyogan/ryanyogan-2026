import { cn } from "~/lib/cn";

type StatusBadgeProps = {
  status: "available" | "busy" | "exploring";
  children: React.ReactNode;
  className?: string;
};

export function StatusBadge({ status, children, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "status-badge",
        status === "available" && "status-badge-available",
        status === "busy" && "status-badge-busy",
        status === "exploring" && "status-badge-exploring",
        className
      )}
    >
      <span className="status-badge-dot" />
      <span className="status-badge-text">{children}</span>
    </span>
  );
}
