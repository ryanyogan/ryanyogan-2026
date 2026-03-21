import { getEmbedUrl } from "~/lib/youtube";

interface VideoPlayerProps {
  videoId: string;
  title: string;
  autoplay?: boolean;
  startTime?: number;
}

export function VideoPlayer({
  videoId,
  title,
  autoplay = false,
  startTime,
}: VideoPlayerProps) {
  const embedUrl = getEmbedUrl(videoId, {
    autoplay,
    start: startTime,
    modestBranding: true,
    rel: false,
  });

  return (
    <div className="video-player">
      <div className="video-player-wrapper">
        <iframe
          src={embedUrl}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          loading="lazy"
        />
      </div>
    </div>
  );
}
