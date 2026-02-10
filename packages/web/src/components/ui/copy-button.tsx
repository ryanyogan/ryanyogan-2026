import { useState, useCallback } from "react";
import { CopyIcon, CheckIcon } from "./icons";
import { cn } from "~/lib/cn";

type CopyButtonProps = {
  text: string;
  label?: string;
  className?: string;
};

export function CopyButton({ text, label, className }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  }, [text]);

  return (
    <button
      onClick={handleCopy}
      className={cn("copy-button", copied && "copy-button-copied", className)}
      aria-label={`Copy ${label || text}`}
    >
      <span className="copy-button-content">
        {copied ? (
          <>
            <CheckIcon size={16} className="copy-button-icon" />
            <span className="copy-button-text">Copied!</span>
          </>
        ) : (
          <>
            <CopyIcon size={16} className="copy-button-icon" />
            <span className="copy-button-text">{label || text}</span>
          </>
        )}
      </span>
    </button>
  );
}
