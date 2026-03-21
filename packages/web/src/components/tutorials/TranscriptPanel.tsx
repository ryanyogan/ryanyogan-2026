import { useState } from "react";
import type { TranscriptSegment } from "@ryanyogan/db";
import { ChevronDownIcon, ChevronUpIcon } from "~/components/ui/icons";

interface TranscriptPanelProps {
  content: string;
  segments?: TranscriptSegment[];
  onSeek?: (time: number) => void;
}

export function TranscriptPanel({ content, segments, onSeek }: TranscriptPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpanded = () => setIsExpanded(!isExpanded);

  // If we have segments, render them with clickable timestamps
  if (segments && segments.length > 0) {
    return (
      <div className="transcript-panel">
        <button
          className="transcript-toggle"
          onClick={toggleExpanded}
          aria-expanded={isExpanded}
        >
          <span className="transcript-toggle-text">Transcript</span>
          {isExpanded ? <ChevronUpIcon /> : <ChevronDownIcon />}
        </button>
        {isExpanded && (
          <div className="transcript-content">
            {segments.map((segment, index) => (
              <button
                key={index}
                className="transcript-segment"
                onClick={() => onSeek?.(segment.start)}
                type="button"
              >
                <span className="transcript-timestamp">
                  {formatTimestamp(segment.start)}
                </span>
                <span className="transcript-text">{segment.text}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Fallback to plain text transcript
  return (
    <div className="transcript-panel">
      <button
        className="transcript-toggle"
        onClick={toggleExpanded}
        aria-expanded={isExpanded}
      >
        <span className="transcript-toggle-text">Transcript</span>
        {isExpanded ? <ChevronUpIcon /> : <ChevronDownIcon />}
      </button>
      {isExpanded && (
        <div className="transcript-content">
          <p className="transcript-plain">{content}</p>
        </div>
      )}
    </div>
  );
}

function formatTimestamp(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${minutes}:${secs.toString().padStart(2, "0")}`;
}
