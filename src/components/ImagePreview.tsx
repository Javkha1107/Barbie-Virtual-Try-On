import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";

interface ImagePreviewProps {
  originalImage?: string;
  processedImage?: string;
  isProcessing: boolean;
  onGenerateRunway: () => void;
}

export function ImagePreview({
  originalImage,
  processedImage,
  isProcessing,
  onGenerateRunway,
}: ImagePreviewProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>試着結果</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium mb-2">元画像</p>
            <div className="aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden">
              {originalImage ? (
                <img
                  src={originalImage}
                  alt="元画像"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  画像なし
                </div>
              )}
            </div>
          </div>

          <div>
            <p className="text-sm font-medium mb-2">試着後</p>
            <div className="aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden relative">
              {isProcessing ? (
                <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                  <Loader2 className="h-8 w-8 animate-spin mb-2" />
                  <p className="text-sm">処理中...</p>
                </div>
              ) : processedImage ? (
                <img
                  src={processedImage}
                  alt="試着後"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  衣装を選択してください
                </div>
              )}
            </div>
          </div>
        </div>

        {processedImage && !isProcessing && (
          <Button onClick={onGenerateRunway} className="w-full">
            ランウェイ動画を生成
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
