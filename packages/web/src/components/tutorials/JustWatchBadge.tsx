import { PlayIcon } from "~/components/ui/icons";

interface JustWatchBadgeProps {
  className?: string;
}

export function JustWatchBadge({ className }: JustWatchBadgeProps) {
  return (
    <span className={`just-watch-badge ${className ?? ""}`}>
      <PlayIcon size={12} />
      <span>Just Watch</span>
    </span>
  );
}
