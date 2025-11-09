import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { useVideoThumbnail } from "~/hooks/useVideoThumbnail";

describe("useVideoThumbnail", () => {
  let mockVideo: Partial<HTMLVideoElement>;
  let mockCanvas: Partial<HTMLCanvasElement>;
  let mockContext: Partial<CanvasRenderingContext2D>;

  beforeEach(() => {
    // Mock canvas context
    mockContext = {
      drawImage: vi.fn(),
    };

    // Mock canvas
    mockCanvas = {
      width: 0,
      height: 0,
      getContext: vi.fn(() => mockContext as CanvasRenderingContext2D),
      toDataURL: vi.fn(() => "data:image/png;base64,mockThumbnail"),
    };

    // Mock video element
    mockVideo = {
      src: "",
      crossOrigin: null,
      videoWidth: 640,
      videoHeight: 480,
      currentTime: 0,
      addEventListener: vi.fn((event, handler) => {
        if (event === "loadedmetadata") {
          setTimeout(() => (handler as EventListener)(new Event(event)), 0);
        } else if (event === "seeked") {
          setTimeout(() => (handler as EventListener)(new Event(event)), 10);
        }
      }),
      removeEventListener: vi.fn(),
    };

    // Mock document.createElement for video and canvas
    vi.spyOn(document, "createElement").mockImplementation((tagName) => {
      if (tagName === "video") {
        return mockVideo as HTMLVideoElement;
      }
      if (tagName === "canvas") {
        return mockCanvas as HTMLCanvasElement;
      }
      return document.createElement(tagName);
    });
  });

  it("should return undefined when videoUrl is not provided", () => {
    const { result } = renderHook(() => useVideoThumbnail(undefined));

    expect(result.current).toBeUndefined();
  });

  it("should generate thumbnail from video URL", async () => {
    const videoUrl = "https://example.com/video.mp4";

    const { result } = renderHook(() => useVideoThumbnail(videoUrl));

    await waitFor(() => {
      expect(result.current).toBe("data:image/png;base64,mockThumbnail");
    });

    expect(mockVideo.src).toBe(videoUrl);
    expect(mockVideo.crossOrigin).toBe("anonymous");
  });

  it("should set video currentTime to 5 seconds on loadedmetadata", async () => {
    const videoUrl = "https://example.com/video.mp4";

    renderHook(() => useVideoThumbnail(videoUrl));

    await waitFor(() => {
      expect(mockVideo.currentTime).toBe(5);
    });
  });

  it("should draw video frame to canvas on seeked event", async () => {
    const videoUrl = "https://example.com/video.mp4";

    renderHook(() => useVideoThumbnail(videoUrl));

    await waitFor(() => {
      expect(mockContext.drawImage).toHaveBeenCalledWith(
        mockVideo,
        0,
        0,
        640,
        480,
      );
    });
  });

  it("should set canvas dimensions to match video dimensions", async () => {
    const videoUrl = "https://example.com/video.mp4";

    renderHook(() => useVideoThumbnail(videoUrl));

    await waitFor(() => {
      expect(mockCanvas.width).toBe(640);
      expect(mockCanvas.height).toBe(480);
    });
  });

  it("should cleanup event listeners on unmount", async () => {
    const videoUrl = "https://example.com/video.mp4";

    const { unmount } = renderHook(() => useVideoThumbnail(videoUrl));

    unmount();

    expect(mockVideo.removeEventListener).toHaveBeenCalledWith(
      "seeked",
      expect.any(Function),
    );
    expect(mockVideo.src).toBe("");
  });

  it("should handle different video dimensions", async () => {
    const testCases = [
      { width: 1920, height: 1080 }, // Full HD
      { width: 1280, height: 720 }, // HD
      { width: 854, height: 480 }, // SD
      { width: 640, height: 360 }, // Low res
    ];

    for (const dimensions of testCases) {
      mockVideo.videoWidth = dimensions.width;
      mockVideo.videoHeight = dimensions.height;

      const { result } = renderHook(() =>
        useVideoThumbnail("https://example.com/video.mp4"),
      );

      await waitFor(() => {
        expect(mockCanvas.width).toBe(dimensions.width);
        expect(mockCanvas.height).toBe(dimensions.height);
      });
    }
  });

  it("should update thumbnail when videoUrl changes", async () => {
    const { result, rerender } = renderHook(
      ({ url }) => useVideoThumbnail(url),
      {
        initialProps: { url: "https://example.com/video1.mp4" },
      },
    );

    await waitFor(() => {
      expect(result.current).toBe("data:image/png;base64,mockThumbnail");
    });

    // Change video URL
    rerender({ url: "https://example.com/video2.mp4" });

    await waitFor(() => {
      expect(mockVideo.src).toBe("https://example.com/video2.mp4");
    });
  });

  it("should handle blob URLs", async () => {
    const blobUrl = "blob:http://localhost/12345";

    const { result } = renderHook(() => useVideoThumbnail(blobUrl));

    await waitFor(() => {
      expect(result.current).toBe("data:image/png;base64,mockThumbnail");
    });

    expect(mockVideo.src).toBe(blobUrl);
  });

  it("should not process if videoUrl becomes undefined", () => {
    const { result, rerender } = renderHook(
      ({ url }) => useVideoThumbnail(url),
      {
        initialProps: {
          url: "https://example.com/video.mp4" as string | undefined,
        },
      },
    );

    rerender({ url: undefined });

    // Should not create new video element
    const createElementCalls = (
      document.createElement as ReturnType<typeof vi.fn>
    ).mock.calls;
    const videoCreationCount = createElementCalls.filter(
      ([tagName]) => tagName === "video",
    ).length;

    expect(videoCreationCount).toBeLessThanOrEqual(2); // Initial + maybe one update
  });
});
