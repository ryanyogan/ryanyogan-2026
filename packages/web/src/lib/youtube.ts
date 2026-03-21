/**
 * YouTube API Client
 *
 * Abstractable client for fetching video details, parsing URLs,
 * and handling YouTube-specific data transformations.
 *
 * API Key should be stored in Cloudflare secrets and passed to functions.
 */

// ============================================================================
// Types
// ============================================================================

export interface YouTubeVideoDetails {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  duration: string; // ISO 8601 duration (e.g., "PT4M13S")
  durationSeconds: number;
  viewCount: number;
  likeCount: number;
  publishedAt: string;
}

export interface YouTubeVideoStats {
  viewCount: number;
  likeCount: number;
  commentCount: number;
}

export interface YouTubePlaylistItem {
  videoId: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  position: number;
}

export interface ParsedYouTubeUrl {
  type: "video" | "playlist" | "channel";
  id: string;
}

interface YouTubeApiConfig {
  apiKey: string;
  baseUrl?: string;
}

// ============================================================================
// YouTube API Client Class
// ============================================================================

export class YouTubeClient {
  private readonly apiKey: string;
  private readonly baseUrl: string;

  constructor(config: YouTubeApiConfig) {
    this.apiKey = config.apiKey;
    this.baseUrl = config.baseUrl ?? "https://www.googleapis.com/youtube/v3";
  }

  /**
   * Fetch video details including title, description, duration, and stats
   */
  async getVideoDetails(videoId: string): Promise<YouTubeVideoDetails> {
    const url = new URL(`${this.baseUrl}/videos`);
    url.searchParams.set("part", "snippet,contentDetails,statistics");
    url.searchParams.set("id", videoId);
    url.searchParams.set("key", this.apiKey);

    const response = await fetch(url.toString());

    if (!response.ok) {
      throw new YouTubeApiError(
        `Failed to fetch video details: ${response.status} ${response.statusText}`,
        response.status
      );
    }

    const data = (await response.json()) as YouTubeApiResponse;

    if (!data.items || data.items.length === 0) {
      throw new YouTubeApiError(`Video not found: ${videoId}`, 404);
    }

    const item = data.items[0]!;
    const snippet = item.snippet;
    const contentDetails = item.contentDetails;
    const statistics = item.statistics;

    return {
      id: videoId,
      title: snippet.title,
      description: snippet.description,
      thumbnailUrl: getBestThumbnail(snippet.thumbnails),
      duration: contentDetails.duration,
      durationSeconds: parseDuration(contentDetails.duration),
      viewCount: parseInt(statistics.viewCount ?? "0", 10),
      likeCount: parseInt(statistics.likeCount ?? "0", 10),
      publishedAt: snippet.publishedAt,
    };
  }

  /**
   * Fetch only video statistics (view count, like count)
   */
  async getVideoStats(videoId: string): Promise<YouTubeVideoStats> {
    const url = new URL(`${this.baseUrl}/videos`);
    url.searchParams.set("part", "statistics");
    url.searchParams.set("id", videoId);
    url.searchParams.set("key", this.apiKey);

    const response = await fetch(url.toString());

    if (!response.ok) {
      throw new YouTubeApiError(
        `Failed to fetch video stats: ${response.status} ${response.statusText}`,
        response.status
      );
    }

    const data = (await response.json()) as YouTubeApiResponse;

    if (!data.items || data.items.length === 0) {
      throw new YouTubeApiError(`Video not found: ${videoId}`, 404);
    }

    const statistics = data.items[0]!.statistics;

    return {
      viewCount: parseInt(statistics.viewCount ?? "0", 10),
      likeCount: parseInt(statistics.likeCount ?? "0", 10),
      commentCount: parseInt(statistics.commentCount ?? "0", 10),
    };
  }

  /**
   * Fetch all videos from a playlist
   */
  async getPlaylistVideos(playlistId: string): Promise<YouTubePlaylistItem[]> {
    const videos: YouTubePlaylistItem[] = [];
    let pageToken: string | undefined;

    do {
      const url = new URL(`${this.baseUrl}/playlistItems`);
      url.searchParams.set("part", "snippet");
      url.searchParams.set("playlistId", playlistId);
      url.searchParams.set("maxResults", "50");
      url.searchParams.set("key", this.apiKey);

      if (pageToken) {
        url.searchParams.set("pageToken", pageToken);
      }

      const response = await fetch(url.toString());

      if (!response.ok) {
        throw new YouTubeApiError(
          `Failed to fetch playlist: ${response.status} ${response.statusText}`,
          response.status
        );
      }

      const data = (await response.json()) as YouTubePlaylistApiResponse;

      for (const item of data.items ?? []) {
        videos.push({
          videoId: item.snippet.resourceId.videoId,
          title: item.snippet.title,
          description: item.snippet.description,
          thumbnailUrl: getBestThumbnail(item.snippet.thumbnails),
          position: item.snippet.position,
        });
      }

      pageToken = data.nextPageToken;
    } while (pageToken);

    return videos;
  }
}

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Parse a YouTube URL and extract the video/playlist ID
 *
 * Supported formats:
 * - https://www.youtube.com/watch?v=VIDEO_ID
 * - https://youtu.be/VIDEO_ID
 * - https://www.youtube.com/embed/VIDEO_ID
 * - https://www.youtube.com/playlist?list=PLAYLIST_ID
 * - https://www.youtube.com/@CHANNEL_HANDLE
 */
export function parseYouTubeUrl(url: string): ParsedYouTubeUrl | null {
  try {
    const parsed = new URL(url);

    // youtu.be short links
    if (parsed.hostname === "youtu.be") {
      const videoId = parsed.pathname.slice(1);
      if (videoId) {
        return { type: "video", id: videoId };
      }
    }

    // youtube.com links
    if (parsed.hostname.includes("youtube.com")) {
      // Channel URLs
      if (parsed.pathname.startsWith("/@")) {
        return { type: "channel", id: parsed.pathname.slice(2) };
      }

      // Embed URLs
      if (parsed.pathname.startsWith("/embed/")) {
        const videoId = parsed.pathname.slice(7);
        if (videoId) {
          return { type: "video", id: videoId };
        }
      }

      // Playlist URLs
      const listParam = parsed.searchParams.get("list");
      if (listParam && parsed.pathname === "/playlist") {
        return { type: "playlist", id: listParam };
      }

      // Video URLs (with optional playlist)
      const videoParam = parsed.searchParams.get("v");
      if (videoParam) {
        return { type: "video", id: videoParam };
      }
    }

    return null;
  } catch {
    return null;
  }
}

/**
 * Parse ISO 8601 duration to seconds
 *
 * @example parseDuration("PT4M13S") // => 253
 * @example parseDuration("PT1H2M3S") // => 3723
 * @example parseDuration("PT30S") // => 30
 */
export function parseDuration(isoDuration: string): number {
  const match = isoDuration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);

  if (!match) {
    return 0;
  }

  const hours = parseInt(match[1] ?? "0", 10);
  const minutes = parseInt(match[2] ?? "0", 10);
  const seconds = parseInt(match[3] ?? "0", 10);

  return hours * 3600 + minutes * 60 + seconds;
}

/**
 * Format seconds to human-readable duration
 *
 * @example formatDuration(253) // => "4:13"
 * @example formatDuration(3723) // => "1:02:03"
 * @example formatDuration(30) // => "0:30"
 */
export function formatDuration(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  }

  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

/**
 * Generate YouTube embed URL
 */
export function getEmbedUrl(
  videoId: string,
  options: {
    autoplay?: boolean;
    start?: number;
    modestBranding?: boolean;
    rel?: boolean;
  } = {}
): string {
  const url = new URL(`https://www.youtube.com/embed/${videoId}`);

  if (options.autoplay) {
    url.searchParams.set("autoplay", "1");
  }

  if (options.start) {
    url.searchParams.set("start", options.start.toString());
  }

  if (options.modestBranding !== false) {
    url.searchParams.set("modestbranding", "1");
  }

  if (options.rel === false) {
    url.searchParams.set("rel", "0");
  }

  return url.toString();
}

/**
 * Generate thumbnail URL for a video
 */
export function getThumbnailUrl(
  videoId: string,
  quality: "default" | "medium" | "high" | "maxres" = "high"
): string {
  const qualityMap = {
    default: "default",
    medium: "mqdefault",
    high: "hqdefault",
    maxres: "maxresdefault",
  };

  return `https://img.youtube.com/vi/${videoId}/${qualityMap[quality]}.jpg`;
}

// ============================================================================
// Error Class
// ============================================================================

export class YouTubeApiError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number
  ) {
    super(message);
    this.name = "YouTubeApiError";
  }
}

// ============================================================================
// Internal Types (YouTube API Response)
// ============================================================================

interface YouTubeApiResponse {
  items?: Array<{
    snippet: {
      title: string;
      description: string;
      publishedAt: string;
      thumbnails: YouTubeThumbnails;
    };
    contentDetails: {
      duration: string;
    };
    statistics: {
      viewCount?: string;
      likeCount?: string;
      commentCount?: string;
    };
  }>;
}

interface YouTubePlaylistApiResponse {
  items?: Array<{
    snippet: {
      title: string;
      description: string;
      position: number;
      thumbnails: YouTubeThumbnails;
      resourceId: {
        videoId: string;
      };
    };
  }>;
  nextPageToken?: string;
}

interface YouTubeThumbnails {
  default?: { url: string };
  medium?: { url: string };
  high?: { url: string };
  maxres?: { url: string };
}

function getBestThumbnail(thumbnails: YouTubeThumbnails): string {
  return (
    thumbnails.maxres?.url ??
    thumbnails.high?.url ??
    thumbnails.medium?.url ??
    thumbnails.default?.url ??
    ""
  );
}
