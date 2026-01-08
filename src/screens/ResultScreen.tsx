import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useAppContext } from "../context/AppContext";
import { Button } from "../components/ui/button";
import { StarDecoration } from "../components/decorations/StarDecoration";
import { HeartDecoration } from "../components/decorations/HeartDecoration";
import { Download, Home, RotateCcw } from "lucide-react";

export function ResultScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const { selectedClothing, recordedVideo } = useAppContext();

  const videoUrl =
    location.state?.videoUrl ||
    (recordedVideo ? URL.createObjectURL(recordedVideo.blob) : "");

  const handleDownload = async () => {
    if (!videoUrl) return;

    try {
      // 外部URLの場合はfetchでblobを取得してからダウンロード
      const response = await fetch(videoUrl);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = `barbie-fitting-${Date.now()}.mp4`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      // メモリ解放
      setTimeout(() => URL.revokeObjectURL(blobUrl), 100);
    } catch (error) {
      console.error("Download failed:", error);
      // フォールバック: 新しいタブで開く
      window.open(videoUrl, "_blank");
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-pink-pastel to-purple-accent p-4 md:p-8 relative overflow-hidden">
      {/* Decorative elements - scaled for portrait */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <StarDecoration className="absolute top-4 left-4 md:top-10 md:left-10 scale-75 md:scale-100" />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <StarDecoration className="absolute top-8 right-8 md:top-20 md:right-20 scale-75 md:scale-100" />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <HeartDecoration className="absolute bottom-10 left-4 md:bottom-20 md:left-20 scale-75 md:scale-100" />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <HeartDecoration className="absolute bottom-10 right-8 md:bottom-20 md:right-20 scale-75 md:scale-100" />
      </motion.div>

      <div className="max-w-2xl mx-auto space-y-4 md:space-y-8 relative z-10 py-4">
        {/* Title */}
        {/* <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-2 md:space-y-4 px-2"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-pink-primary font-heading leading-tight">
            ✨ Your Look is Ready! ✨
          </h2>
        </motion.div> */}

        {/* Video Result */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white rounded-2xl md:rounded-3xl p-4 md:p-8 shadow-2xl"
        >
          <div className="space-y-4 md:space-y-6">
            {/* Selected Clothing Info */}
            {selectedClothing && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="flex items-center gap-3 md:gap-4 p-3 md:p-4 bg-pink-50 rounded-xl md:rounded-2xl"
              >
                <img
                  src={selectedClothing.thumbnailUrl}
                  alt={selectedClothing.name}
                  className="w-16 h-16 md:w-20 md:h-20 object-cover object-top rounded-lg md:rounded-xl shrink-0"
                />
                <div className="min-w-0">
                  <h3 className="text-lg md:text-xl font-semibold text-pink-primary truncate">
                    {selectedClothing.name}
                  </h3>
                  <p className="text-sm md:text-base text-gray-600 line-clamp-2">
                    {selectedClothing.description}
                  </p>
                </div>
              </motion.div>
            )}

            {/* Video Player - Portrait optimized for runway video */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="relative bg-gray-900 rounded-xl md:rounded-2xl overflow-hidden mx-auto"
              style={{
                aspectRatio: "9/16",
                maxHeight: "60vh",
                width: "auto",
              }}
            >
              {videoUrl ? (
                <video
                  src={videoUrl}
                  controls
                  autoPlay
                  loop
                  playsInline
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white">
                  <p className="text-sm md:text-base">No video available</p>
                </div>
              )}
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="flex flex-col gap-3 md:gap-4"
            >
              <Button
                size="lg"
                onClick={handleDownload}
                className="flex items-center justify-center gap-2 w-full text-lg font-semibold py-7 rounded-full"
              >
                <Download className="w-6 h-6" />
                Download
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate("/clothing-selection")}
                className="flex items-center justify-center gap-2 w-full text-lg font-semibold py-7 rounded-full"
              >
                <RotateCcw className="w-6 h-6" />
                Try Another Outfit
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate("/")}
                className="flex items-center justify-center gap-2 w-full text-lg font-semibold py-7 rounded-full"
              >
                <Home className="w-6 h-6" />
                Back to Home
              </Button>
            </motion.div>
          </div>
        </motion.div>

        {/* Share Section */}
        {/* <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1 }}
          className="text-center space-y-4"
        >
          <p className="text-lg text-gray-700">
            💕 Share your fabulous look! 💕
          </p>
        </motion.div> */}
      </div>
    </div>
  );
}
