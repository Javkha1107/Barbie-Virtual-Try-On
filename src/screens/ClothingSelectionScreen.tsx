import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Sparkles, Star, Wand2, ArrowLeft, RotateCcw } from "lucide-react";
import { useAppContext } from "../context/AppContext";
import { ClothingGrid } from "../components/ClothingGrid";
import { Button } from "../components/ui/button";
import { clothingItems } from "../data/clothingData";
import { StarDecoration } from "../components/decorations/StarDecoration";
import { HeartDecoration } from "../components/decorations/HeartDecoration";

// Toggle this to enable/disable API calls
const USE_REAL_API = false;

export function ClothingSelectionScreen() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const { setSelectedClothing, recordedVideo, setIsProcessing } =
    useAppContext();
  const navigate = useNavigate();

  const handleSelect = (id: string) => {
    setSelectedId(id);
  };

  const handleStart = async () => {
    if (!selectedId || !recordedVideo) return;

    const selected = clothingItems.find((item) => item.id === selectedId);
    if (!selected) return;

    setSelectedClothing(selected);
    setIsProcessing(true);
    setIsUploading(true);

    // Dummy mode: Skip API calls and use recorded video
    if (!USE_REAL_API) {
      // Simulate upload progress
      for (let i = 0; i <= 100; i += 10) {
        await new Promise((resolve) => setTimeout(resolve, 100));
        setUploadProgress(i);
      }

      // Wait a bit then navigate to result page
      await new Promise((resolve) => setTimeout(resolve, 500));
      setIsUploading(false);
      setIsProcessing(false);

      // Use recorded video as dummy result
      const dummyVideoUrl = URL.createObjectURL(recordedVideo.blob);
      navigate("/result", { state: { videoUrl: dummyVideoUrl } });
      return;
    }

    // Real API mode
    try {
      // Step 1: Get presigned URL for upload
      setUploadProgress(10);

      // Determine file extension based on mime type
      const fileExtension = recordedVideo.mimeType.includes("webm")
        ? "webm"
        : "mp4";
      const filename = `video-${Date.now()}.${fileExtension}`;

      const uploadResponse = await fetch(
        "https://nccdhlc5bhjdk3zcmhf73mp76u0ireha.lambda-url.us-west-2.on.aws/",
        {
          method: "POST",
          body: JSON.stringify({
            action: "create_upload",
            filename: filename,
            contentType: recordedVideo.mimeType,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!uploadResponse.ok) {
        throw new Error("Failed to get upload URL");
      }

      const { uploadUrl, inputKey } = await uploadResponse.json();
      setUploadProgress(20);

      // Step 2: Upload video to S3 using presigned URL
      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("PUT", uploadUrl, true);
        xhr.setRequestHeader("Content-Type", recordedVideo.mimeType);

        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            const percentComplete = 20 + (event.loaded / event.total) * 50; // 20% to 70%
            setUploadProgress(Math.round(percentComplete));
          }
        };

        xhr.onload = () => {
          if (xhr.status === 200) {
            resolve();
          } else {
            reject(new Error("Upload failed"));
          }
        };

        xhr.onerror = () => {
          reject(new Error("Upload failed"));
        };

        xhr.send(recordedVideo.blob);
      });

      setUploadProgress(70);

      // Step 3: Process video with selected garment
      const processResponse = await fetch(
        "https://nccdhlc5bhjdk3zcmhf73mp76u0ireha.lambda-url.us-west-2.on.aws/",
        {
          method: "POST",
          body: JSON.stringify({
            action: "process",
            inputKey: inputKey,
            garmentId: selectedId,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!processResponse.ok) {
        throw new Error("Failed to process video");
      }

      const { jobId, outputKey, resultUrl } = await processResponse.json();
      setUploadProgress(100);

      // Step 4: Navigate to result screen with video URL
      setIsUploading(false);
      setIsProcessing(false);
      navigate("/result", { state: { videoUrl: resultUrl, jobId, outputKey } });
    } catch (error) {
      console.error("Error processing video:", error);
      setIsUploading(false);
      setIsProcessing(false);
      alert("Failed to process video. Please try again.");
    }
  };

  return (
    <div className="min-h-screen h-screen bg-linear-to-br from-pink-pastel to-purple-accent p-3 md:p-6 relative overflow-hidden flex flex-col">
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <StarDecoration className="absolute top-2 left-2 md:top-10 md:left-10 scale-50 md:scale-100" />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <StarDecoration className="absolute top-4 right-4 md:top-20 md:right-20 scale-50 md:scale-100" />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <HeartDecoration className="absolute bottom-6 left-2 md:bottom-20 md:left-20 scale-50 md:scale-100" />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <HeartDecoration className="absolute bottom-6 right-4 md:bottom-20 md:right-20 scale-50 md:scale-100" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-5xl mx-auto space-y-4 md:space-y-6 relative z-10 py-2 md:py-4 flex flex-col h-full"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center space-y-1 md:space-y-2 px-2 shrink-0"
        >
          <div className="relative flex items-center justify-center">
            {/* Back button */}
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              onClick={() => navigate("/")}
              className="absolute left-0 p-2 md:p-3 rounded-full bg-white/80 hover:bg-white shadow-lg hover:shadow-xl transition-all duration-300 group"
            >
              <ArrowLeft className="w-5 h-5 md:w-6 md:h-6 text-pink-primary group-hover:scale-110 transition-transform" />
            </motion.button>

            <h1 className="text-xl sm:text-3xl md:text-5xl font-bold text-pink-primary font-heading flex items-center justify-center gap-1 sm:gap-2 md:gap-3 leading-tight">
              <Sparkles className="w-6 h-6 sm:w-10 sm:h-10 md:w-12 md:h-12 text-yellow-400 shrink-0" />
              <span className="px-1">Choose Your Outfit</span>
              <Sparkles className="w-6 h-6 sm:w-10 sm:h-10 md:w-12 md:h-12 text-yellow-400 shrink-0" />
            </h1>
          </div>
          <p className="text-sm sm:text-base md:text-xl text-gray-700">
            Find the perfect look for you
          </p>
        </motion.div>

        {isUploading ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-linear-to-br from-pink-400/30 via-purple-400/30 to-pink-500/30 backdrop-blur-md rounded-2xl md:rounded-3xl p-6 md:p-12 shadow-2xl border-2 border-pink-300/50 flex-1 flex items-center justify-center"
          >
            <div className="text-center space-y-6 md:space-y-8">
              <motion.div className="relative h-24 md:h-32 flex items-center justify-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  className="absolute"
                >
                  <Sparkles className="w-12 h-12 md:w-16 md:h-16 text-yellow-300" />
                </motion.div>

                {[0, 60, 120, 180, 240, 300].map((angle, i) => (
                  <motion.div
                    key={i}
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [0.4, 1, 0.4],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      delay: i * 0.2,
                    }}
                    className="absolute"
                    style={{
                      transform: `rotate(${angle}deg) translateY(-40px)`,
                    }}
                  >
                    {i % 2 === 0 ? (
                      <Star className="w-6 h-6 md:w-8 md:h-8 text-pink-300 fill-pink-300" />
                    ) : (
                      <Sparkles className="w-6 h-6 md:w-8 md:h-8 text-purple-300" />
                    )}
                  </motion.div>
                ))}

                <motion.div
                  animate={{
                    rotate: [0, 10, -10, 0],
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                  }}
                  className="z-10"
                >
                  <Wand2 className="w-16 h-16 md:w-20 md:h-20 text-pink-500" />
                </motion.div>
              </motion.div>

              {/* Title */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-2 md:space-y-3"
              >
                <motion.div
                  transition={{ duration: 2, repeat: Infinity }}
                  className="flex items-center justify-center gap-2 md:gap-3 text-2xl md:text-4xl font-bold bg-linear-to-r from-pink-600 via-purple-600 to-pink-600 bg-clip-text text-transparent px-2"
                >
                  Preparing your video...
                </motion.div>
              </motion.div>

              {/* Progress bar */}
              <div className="space-y-2 md:space-y-3">
                <div className="w-full bg-pink-200/50 rounded-full h-2 md:h-3 overflow-hidden shadow-inner">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${uploadProgress}%` }}
                    transition={{ duration: 0.3 }}
                    className="h-full bg-linear-to-r from-pink-500 via-purple-500 to-pink-500 relative shadow-lg"
                  >
                    <motion.div
                      animate={{
                        x: ["-100%", "200%"],
                      }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      className="absolute inset-0 bg-linear-to-r from-transparent via-white/60 to-transparent"
                    />
                  </motion.div>
                </div>
                <motion.div
                  animate={{
                    scale: [1, 1.1, 1],
                    opacity: [0.8, 1, 0.8],
                  }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="text-purple-700 text-xl md:text-2xl font-bold"
                >
                  {Math.round(uploadProgress)}%
                </motion.div>
              </div>

              {/* Flying sparkles */}
              <div className="relative h-12 md:h-16">
                {[...Array(8)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{
                      opacity: [0, 1, 0],
                      scale: [0, 1.5, 0],
                      x: [0, (i - 3.5) * 30],
                      y: [0, -30],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: i * 0.2,
                    }}
                    className="absolute left-1/2 top-1/2"
                    style={{ transform: "translate(-50%, -50%)" }}
                  >
                    {i % 3 === 0 ? (
                      <Sparkles className="w-6 h-6 md:w-8 md:h-8 text-yellow-300" />
                    ) : i % 3 === 1 ? (
                      <Star className="w-6 h-6 md:w-8 md:h-8 text-pink-300 fill-pink-300" />
                    ) : (
                      <Sparkles className="w-6 h-6 md:w-8 md:h-8 text-purple-300" />
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        ) : (
          <>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex-1 overflow-y-auto px-2 py-2"
              style={{
                maxHeight: "calc(100vh - 240px)",
                scrollbarWidth: "thin",
                scrollbarColor: "#FF69B4 transparent",
              }}
            >
              <ClothingGrid
                items={clothingItems}
                selectedId={selectedId}
                onSelect={handleSelect}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="flex flex-col sm:flex-row justify-center gap-3 px-4 pb-4 shrink-0"
            >
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate("/recording")}
                className="flex items-center justify-center gap-2 text-lg font-semibold py-7 w-full sm:w-auto sm:min-w-50 rounded-full"
              >
                <RotateCcw className="w-6 h-6" />
                Record Again
              </Button>
              <Button
                size="lg"
                disabled={!selectedId}
                onClick={handleStart}
                className="flex items-center justify-center gap-2 text-lg font-semibold py-7 w-full sm:w-auto sm:min-w-50 rounded-full"
              >
                Generate
              </Button>
            </motion.div>
          </>
        )}
      </motion.div>
    </div>
  );
}
