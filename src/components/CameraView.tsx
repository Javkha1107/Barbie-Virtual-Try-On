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
    <div className="relative w-full aspect-[9/16] max-h-[80vh] mx-auto">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="w-full h-full object-cover rounded-2xl shadow-2xl"
      />
    </div>
  );
}
