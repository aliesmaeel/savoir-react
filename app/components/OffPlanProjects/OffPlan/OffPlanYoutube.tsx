import React from "react";
import { useLoaderData } from "react-router";

export default function OffPlanYoutube() {
  const { property } = useLoaderData() as { property: any };

  if (!property.youtube_link) {
    return null;
  }

  // Extract video ID from YouTube URL
  const getYouTubeVideoId = (url: string) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const videoId = getYouTubeVideoId(property.youtube_link);
  if (!videoId) {
    return null;
  }

  return (
    <div className="flex flex-col items-start gap-[17px] w-full mt-[67px]">
      <p className="text-[21px] font-semibold">Watch this video</p>
      <iframe
        src={`https://www.youtube.com/embed/${videoId}`}
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
        className="w-full aspect-[794/464] rounded-[15px] object-cover"
      ></iframe>
    </div>
  );
}
