import { useState, useEffect } from "react";

export const useVideoThumbnail = (videoUrl: string | undefined) => {
  const [thumbnail, setThumbnail] = useState<string>();

  useEffect(() => {
    if (!videoUrl) return;

    const video = document.createElement("video");
    video.src = videoUrl;
    video.crossOrigin = "anonymous"; // Needed if video is from another domain

    const captureFrame = () => {
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);
      setThumbnail(canvas.toDataURL("image/png"));
    };

    video.addEventListener("loadedmetadata", () => {
      video.currentTime = 5;
    });

    video.addEventListener("seeked", captureFrame);

    // Clean up
    return () => {
      video.removeEventListener("seeked", captureFrame);
      video.src = "";
    };
  }, [videoUrl]);

  return thumbnail;
};
