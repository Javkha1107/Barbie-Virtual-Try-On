import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ImageUploadButton } from "../components/ImageUploadButton";
import { StarDecoration } from "../components/decorations/StarDecoration";
import { HeartDecoration } from "../components/decorations/HeartDecoration";
import { useAppContext } from "../context/AppContext";
import { convertImageFormat, blobToDataUrl } from "../utils/imageConverter";
import { useState } from "react";
import { Video } from "lucide-react";

export function HomeScreen() {
  const navigate = useNavigate();
  const { setUploadedImage, setIsImageMode } = useAppContext();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleImageSelect = async (file: File) => {
    try {
      setIsProcessing(true);

      // Convert to PNG format
      const convertedBlob = await convertImageFormat(file, "png");
      const dataUrl = await blobToDataUrl(convertedBlob);

      setUploadedImage({
        blob: convertedBlob,
        dataUrl,
        fileName: file.name,
      });
      setIsImageMode(true);

      // Navigate to clothing selection
      navigate("/clothing-selection");
    } catch (error) {
      console.error("Failed to process image:", error);
      alert("画像の処理に失敗しました。もう一度お試しください。");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRecordingClick = () => {
    setIsImageMode(false);
    navigate("/recording");
  };

  return (
    <div className="min-h-screen h-screen bg-linear-to-br from-pink-pastel to-purple-accent flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated decorative elements */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <StarDecoration className="absolute top-4 left-4 md:top-8 md:left-8 scale-50 md:scale-75" />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <StarDecoration className="absolute top-6 right-6 md:top-12 md:right-12 scale-50 md:scale-75" />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <HeartDecoration className="absolute bottom-8 left-6 md:bottom-12 md:left-12 scale-50 md:scale-75" />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <HeartDecoration className="absolute bottom-8 right-6 md:bottom-12 md:right-12 scale-50 md:scale-75" />
      </motion.div>

      {/* Main content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center z-10 w-full max-w-md px-4"
      >
        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-3xl md:text-5xl font-bold text-pink-primary font-heading leading-tight mb-8 md:mb-10"
        >
          Barbie Virtual Fitting
        </motion.h1>

        {/* Action cards container */}
        <div className="space-y-4">
          {/* Recording Card */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            whileHover={{ opacity: 0.8 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleRecordingClick}
            disabled={isProcessing}
            className="w-full bg-linear-to-r cursor-pointer border border-transparent from-pink-400 to-pink-500 text-white rounded-2xl p-5 shadow-xl hover:shadow-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden"
          >
            {/* Shine effect */}
            <motion.div
              className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent"
              animate={{ x: ["-100%", "200%"] }}
              transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
            />

            <div className="relative z-10 flex items-center justify-center gap-4">
              <motion.div
                whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
                transition={{ duration: 0.4 }}
                className="bg-white/20 p-3 rounded-full"
              >
                <Video className="w-6 h-6 md:w-7 md:h-7" />
              </motion.div>
              <div className="text-left">
                <h2 className="text-xl md:text-2xl font-bold">
                  Start Recording
                </h2>
                <p className="text-white/80 text-xs md:text-sm">
                  Record a 4-second video
                </p>
              </div>
            </div>
          </motion.button>

          {/* Divider */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="relative py-2"
          >
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t-2 border-white/30"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="px-4 py-1 bg-white text-pink-400 font-bold text-sm rounded-full shadow-md">
                OR
              </span>
            </div>
          </motion.div>

          {/* Upload Card */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <ImageUploadButton
              onImageSelect={handleImageSelect}
              disabled={isProcessing}
            />
          </motion.div>
        </div>

        {/* Processing indicator */}
        {isProcessing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-6 flex items-center justify-center gap-2 text-pink-primary"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-5 h-5 border-3 border-pink-primary border-t-transparent rounded-full"
            />
            <p className="text-sm font-semibold">Processing...</p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
