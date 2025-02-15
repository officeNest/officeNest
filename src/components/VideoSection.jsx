import React from "react";

const VideoSection = () => {
  const videoId = "IxRVa1DbSAg"; // YouTube video ID
  
  return (
    <div className="flex flex-col items-center py-10 px-4 bg-gray-200">
      <h2 className="text-[#0C2BA1] text-5xl font-bold mb-8">Flexora Space</h2>
      <div className="max-w-4xl w-full rounded-lg shadow-lg overflow-hidden">
        <div className="relative">
          <iframe
            className="w-full h-[500px]"
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&modestbranding=1&controls=0&showinfo=0&rel=0`}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default VideoSection;
