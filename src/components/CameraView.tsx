import { useEffect, useRef } from "react";

interface CameraViewProps {
  stream: MediaStream | null;
}

export function CameraView({ stream }: CameraViewProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <div className="relative aspect-9/16 max-h-[80vh] mx-auto">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="h-full w-auto object-cover rounded-2xl shadow-2xl"
      />
    </div>
  );
}
