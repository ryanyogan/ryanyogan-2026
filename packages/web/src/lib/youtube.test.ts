import { describe, it, expect } from "vitest";
import {
  parseYouTubeUrl,
  parseDuration,
  formatDuration,
  getEmbedUrl,
  getThumbnailUrl,
} from "./youtube";

describe("parseYouTubeUrl", () => {
  describe("video URLs", () => {
    it("parses standard watch URL", () => {
      const result = parseYouTubeUrl("https://www.youtube.com/watch?v=dQw4w9WgXcQ");
      expect(result).toEqual({ type: "video", id: "dQw4w9WgXcQ" });
    });

    it("parses short youtu.be URL", () => {
      const result = parseYouTubeUrl("https://youtu.be/dQw4w9WgXcQ");
      expect(result).toEqual({ type: "video", id: "dQw4w9WgXcQ" });
    });

    it("parses embed URL", () => {
      const result = parseYouTubeUrl("https://www.youtube.com/embed/dQw4w9WgXcQ");
      expect(result).toEqual({ type: "video", id: "dQw4w9WgXcQ" });
    });

    it("parses URL with additional parameters", () => {
      const result = parseYouTubeUrl(
        "https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=30&list=PLtest"
      );
      expect(result).toEqual({ type: "video", id: "dQw4w9WgXcQ" });
    });
  });

  describe("playlist URLs", () => {
    it("parses playlist URL", () => {
      const result = parseYouTubeUrl(
        "https://www.youtube.com/playlist?list=PLrAXtmErZgOeiKm4sgNOknGvNjby9efdf"
      );
      expect(result).toEqual({
        type: "playlist",
        id: "PLrAXtmErZgOeiKm4sgNOknGvNjby9efdf",
      });
    });
  });

  describe("channel URLs", () => {
    it("parses channel handle URL", () => {
      const result = parseYouTubeUrl("https://www.youtube.com/@RyanYogan");
      expect(result).toEqual({ type: "channel", id: "RyanYogan" });
    });
  });

  describe("invalid URLs", () => {
    it("returns null for non-YouTube URL", () => {
      expect(parseYouTubeUrl("https://vimeo.com/12345")).toBeNull();
    });

    it("returns null for invalid URL", () => {
      expect(parseYouTubeUrl("not-a-url")).toBeNull();
    });

    it("returns null for empty string", () => {
      expect(parseYouTubeUrl("")).toBeNull();
    });

    it("returns null for YouTube URL without video ID", () => {
      expect(parseYouTubeUrl("https://www.youtube.com/")).toBeNull();
    });
  });
});

describe("parseDuration", () => {
  it("parses minutes and seconds", () => {
    expect(parseDuration("PT4M13S")).toBe(253);
  });

  it("parses hours, minutes, and seconds", () => {
    expect(parseDuration("PT1H2M3S")).toBe(3723);
  });

  it("parses seconds only", () => {
    expect(parseDuration("PT30S")).toBe(30);
  });

  it("parses minutes only", () => {
    expect(parseDuration("PT5M")).toBe(300);
  });

  it("parses hours only", () => {
    expect(parseDuration("PT2H")).toBe(7200);
  });

  it("returns 0 for invalid duration", () => {
    expect(parseDuration("invalid")).toBe(0);
  });

  it("returns 0 for empty string", () => {
    expect(parseDuration("")).toBe(0);
  });
});

describe("formatDuration", () => {
  it("formats seconds to minutes:seconds", () => {
    expect(formatDuration(253)).toBe("4:13");
  });

  it("formats with hours", () => {
    expect(formatDuration(3723)).toBe("1:02:03");
  });

  it("formats short duration", () => {
    expect(formatDuration(30)).toBe("0:30");
  });

  it("pads seconds with zero", () => {
    expect(formatDuration(65)).toBe("1:05");
  });

  it("formats zero duration", () => {
    expect(formatDuration(0)).toBe("0:00");
  });

  it("formats exactly one hour", () => {
    expect(formatDuration(3600)).toBe("1:00:00");
  });
});

describe("getEmbedUrl", () => {
  it("generates basic embed URL", () => {
    const url = getEmbedUrl("dQw4w9WgXcQ");
    expect(url).toBe("https://www.youtube.com/embed/dQw4w9WgXcQ?modestbranding=1");
  });

  it("includes autoplay parameter", () => {
    const url = getEmbedUrl("dQw4w9WgXcQ", { autoplay: true });
    expect(url).toContain("autoplay=1");
  });

  it("includes start time parameter", () => {
    const url = getEmbedUrl("dQw4w9WgXcQ", { start: 30 });
    expect(url).toContain("start=30");
  });

  it("disables related videos", () => {
    const url = getEmbedUrl("dQw4w9WgXcQ", { rel: false });
    expect(url).toContain("rel=0");
  });

  it("combines multiple options", () => {
    const url = getEmbedUrl("dQw4w9WgXcQ", {
      autoplay: true,
      start: 60,
      rel: false,
    });
    expect(url).toContain("autoplay=1");
    expect(url).toContain("start=60");
    expect(url).toContain("rel=0");
  });
});

describe("getThumbnailUrl", () => {
  it("generates default thumbnail URL", () => {
    const url = getThumbnailUrl("dQw4w9WgXcQ");
    expect(url).toBe("https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg");
  });

  it("generates maxres thumbnail URL", () => {
    const url = getThumbnailUrl("dQw4w9WgXcQ", "maxres");
    expect(url).toBe("https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg");
  });

  it("generates medium thumbnail URL", () => {
    const url = getThumbnailUrl("dQw4w9WgXcQ", "medium");
    expect(url).toBe("https://img.youtube.com/vi/dQw4w9WgXcQ/mqdefault.jpg");
  });

  it("generates default quality thumbnail URL", () => {
    const url = getThumbnailUrl("dQw4w9WgXcQ", "default");
    expect(url).toBe("https://img.youtube.com/vi/dQw4w9WgXcQ/default.jpg");
  });
});
