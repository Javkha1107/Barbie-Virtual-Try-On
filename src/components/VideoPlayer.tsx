interface VideoPlayerProps {
  videoUrl: string;
}

export function VideoPlayer({ videoUrl }: VideoPlayerProps) {
  return (
    <div className="w-full max-w-4xl mx-auto">
      <video
        src={videoUrl}
        autoPlay
        loop
        controls
        className="w-full rounded-2xl shadow-2xl"
      />
    </div>
  );
}
