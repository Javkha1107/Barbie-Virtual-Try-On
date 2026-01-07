import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, Star } from "lucide-react";
import { useAppContext, ErrorType } from "../context/AppContext";
import { LoadingAnimation } from "../components/LoadingAnimation";
import { checkGenerationStatus } from "../api/client";
import { StarDecoration } from "../components/decorations/StarDecoration";
import { HeartDecoration } from "../components/decorations/HeartDecoration";

export function LoadingScreen() {
  const { jobId, setGeneratedVideoUrl, setError, setIsProcessing } =
    useAppContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (!jobId) {
      // No job ID, redirect to home
      navigate("/");
      return;
    }

    let intervalId: number;
    let isMounted = true;

    const pollStatus = async () => {
      try {
        const status = await checkGenerationStatus(jobId);

        if (!isMounted) return;

        if (status.status === "completed" && status.videoUrl) {
          setGeneratedVideoUrl(status.videoUrl);
          setIsProcessing(false);
          clearInterval(intervalId);
          navigate("/result");
        } else if (status.status === "failed") {
          setError({
            type: ErrorType.GENERATION_FAILED,
            message: status.error || "Generation failed",
            userMessage: "Video generation failed. Please try again.",
            retryable: true,
          });
          setIsProcessing(false);
          clearInterval(intervalId);
        }
        // If still processing, continue polling
      } catch (error) {
        console.error("Status check failed:", error);
        if (isMounted) {
          setError({
            type: ErrorType.NETWORK_ERROR,
            message: error instanceof Error ? error.message : "Unknown error",
            userMessage: "Failed to check generation status. Please try again.",
            retryable: true,
          });
          setIsProcessing(false);
          clearInterval(intervalId);
        }
      }
    };

    // Start polling every 2 seconds
    pollStatus(); // Initial check
    intervalId = window.setInterval(pollStatus, 2000);

    return () => {
      isMounted = false;
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [jobId, navigate, setGeneratedVideoUrl, setError, setIsProcessing]);

  return (
    <div className="min-h-screen bg-linear-to-br from-pink-300 via-purple-300 to-pink-400 flex items-center justify-center p-4 md:p-8 relative overflow-hidden">
      {/* Animated sparkle background - scaled for portrait */}
      <div className="absolute inset-0 overflow-hidden">
        <Sparkles className="absolute top-[10%] left-[10%] w-10 h-10 md:w-16 md:h-16 text-yellow-300 animate-pulse opacity-60" />
        <Star
          className="absolute top-[20%] right-[15%] w-8 h-8 md:w-14 md:h-14 text-pink-300 fill-pink-300 animate-pulse opacity-50"
          style={{ animationDelay: "1s" }}
        />
        <Sparkles
          className="absolute top-[60%] left-[5%] w-12 h-12 md:w-20 md:h-20 text-purple-300 animate-pulse opacity-40"
          style={{ animationDelay: "2s" }}
        />
        <Star
          className="absolute bottom-[15%] right-[10%] w-10 h-10 md:w-16 md:h-16 text-yellow-300 fill-yellow-300 animate-pulse opacity-60"
          style={{ animationDelay: "1.5s" }}
        />
        <Sparkles
          className="absolute top-[40%] right-[5%] w-8 h-8 md:w-14 md:h-14 text-pink-300 animate-pulse opacity-50"
          style={{ animationDelay: "0.5s" }}
        />
        <Star
          className="absolute bottom-[30%] left-[15%] w-10 h-10 md:w-16 md:h-16 text-purple-300 fill-purple-300 animate-pulse opacity-40"
          style={{ animationDelay: "2.5s" }}
        />
      </div>

      <StarDecoration className="absolute top-4 left-4 md:top-10 md:left-10 scale-75 md:scale-100" />
      <StarDecoration className="absolute top-8 right-8 md:top-20 md:right-20 scale-75 md:scale-100" />
      <StarDecoration className="absolute bottom-10 left-4 md:bottom-20 md:left-20 scale-75 md:scale-100" />
      <HeartDecoration className="absolute top-1/4 right-4 md:right-10 scale-75 md:scale-100" />
      <HeartDecoration className="absolute bottom-1/4 left-4 md:left-10 scale-75 md:scale-100" />

      <div className="relative z-10">
        <LoadingAnimation />
      </div>
    </div>
  );
}
