import { useRef, useState, useCallback } from "react";
import { Camera as CameraIcon, StopCircle } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

interface CameraProps {
  onCapture: (imageData: string) => void;
}

export function Camera({ onCapture }: CameraProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const startCamera = useCallback(async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: 1280, height: 720 },
      });

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        setStream(mediaStream);
        setIsStreaming(true);
      }
    } catch (err) {
      console.error("カメラアクセスエラー:", err);
      alert("カメラにアクセスできませんでした");
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
      setIsStreaming(false);
    }
  }, [stream]);

  const captureImage = useCallback(() => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(video, 0, 0);
        const imageData = canvas.toDataURL("image/jpeg");
        onCapture(imageData);
      }
    }
  }, [onCapture]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>カメラ撮影</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-full h-full object-cover"
          />
          <canvas ref={canvasRef} className="hidden" />
        </div>

        <div className="flex gap-2">
          {!isStreaming ? (
            <Button onClick={startCamera} className="flex-1">
              <CameraIcon className="mr-2 h-4 w-4" />
              カメラ起動
            </Button>
          ) : (
            <>
              <Button onClick={captureImage} className="flex-1">
                撮影
              </Button>
              <Button onClick={stopCamera} variant="outline">
                <StopCircle className="mr-2 h-4 w-4" />
                停止
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
