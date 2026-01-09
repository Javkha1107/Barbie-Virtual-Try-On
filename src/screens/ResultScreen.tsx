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
    <div className="h-screen bg-linear-to-br from-pink-pastel to-purple-accent relative overflow-hidden flex items-center justify-center">
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

      <div className="w-full h-full max-w-2xl mx-auto flex flex-col py-4 px-4 md:py-6 md:px-8 relative z-10">
        {/* Title */}
        {/* <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-2 md:space-y-4 px-2"
        >
          <h2 className="text-xl md:text-3xl font-bold text-pink-primary font-heading leading-tight">
            Your Look is Ready!
          </h2>
        </motion.div> */}

        {/* Video Result */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-linear-to-br from-pink-400/30 via-purple-400/30 to-pink-500/30 backdrop-blur-md rounded-2xl md:rounded-3xl p-3 md:p-4 shadow-2xl flex-1 flex flex-col min-h-0"
        >
          <div className="flex flex-col gap-2 md:gap-3 h-full min-h-0">
            {/* Selected Clothing Info */}
            {selectedClothing && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="flex items-center gap-3 md:gap-4 p-2 md:p-3 bg-white/40 rounded-xl md:rounded-2xl"
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
              className="relative bg-gray-900 rounded-xl md:rounded-2xl overflow-hidden mx-auto flex-1 min-h-0"
              style={{
                aspectRatio: "9/16",
                maxWidth: "100%",
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
              className="flex flex-col gap-2 shrink-0"
            >
              <Button
                size="lg"
                onClick={handleDownload}
                className="flex items-center justify-center gap-2 w-full text-base md:text-lg font-semibold py-5 md:py-6 rounded-full"
              >
                <Download className="w-5 h-5 md:w-6 md:h-6" />
                Download
              </Button>
              <Button
                size="lg"
                variant="custom"
                onClick={() => navigate("/clothing-selection")}
                className="flex items-center justify-center gap-2 w-full text-base md:text-lg font-semibold py-5 md:py-6 rounded-full"
              >
                <RotateCcw className="w-5 h-5 md:w-6 md:h-6" />
                Try Another Outfit
              </Button>
              <Button
                size="lg"
                variant="custom"
                onClick={() => navigate("/")}
                className="flex items-center justify-center gap-2 w-full text-base md:text-lg font-semibold py-5 md:py-6 rounded-full"
              >
                <Home className="w-5 h-5 md:w-6 md:h-6" />
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
