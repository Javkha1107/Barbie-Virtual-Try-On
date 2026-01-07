import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Download, Loader2 } from "lucide-react";

interface RunwayAnimationProps {
  videoUrl?: string;
  isGenerating: boolean;
}

export function RunwayAnimation({
  videoUrl,
  isGenerating,
}: RunwayAnimationProps) {
  const handleDownload = () => {
    if (videoUrl) {
      const a = document.createElement("a");
      a.href = videoUrl;
      a.download = "barbie-runway.mp4";
      a.click();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>ランウェイ動画</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
          {isGenerating ? (
            <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
              <Loader2 className="h-12 w-12 animate-spin mb-4" />
              <p className="text-lg font-medium">動画生成中...</p>
              <p className="text-sm mt-2">
                プロフェッショナルなランウェイ動画を作成しています
              </p>
            </div>
          ) : videoUrl ? (
            <video
              src={videoUrl}
              controls
              autoPlay
              loop
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <div className="text-center">
                <p className="text-lg">動画はまだ生成されていません</p>
                <p className="text-sm mt-2">試着画像を生成してください</p>
              </div>
            </div>
          )}
        </div>

        {videoUrl && !isGenerating && (
          <Button onClick={handleDownload} className="w-full" variant="outline">
            <Download className="mr-2 h-4 w-4" />
            動画をダウンロード
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
