import { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAppContext, ErrorType } from "../context/AppContext";
import { CameraView } from "../components/CameraView";
import { PersonGuide } from "../components/PersonGuide";
import { Countdown } from "../components/Countdown";
import { RecordingIndicator } from "../components/RecordingIndicator";

export function RecordingScreen() {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isCountingDown, setIsCountingDown] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [isRecording, setIsRecording] = useState(false);
  const [remainingTime, setRemainingTime] = useState(4);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const { setError, setRecordedVideo } = useAppContext();
  const navigate = useNavigate();

  useEffect(() => {
    async function requestCamera() {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 1280 },
            height: { ideal: 720 },
            facingMode: "user",
          },
          audio: false,
        });
        setStream(mediaStream);

        // Start countdown after camera is ready
        setTimeout(() => {
          setIsCountingDown(true);
        }, 1000);
      } catch (err) {
        console.error("Camera access error:", err);

        if (err instanceof Error) {
          if (
            err.name === "NotAllowedError" ||
            err.name === "PermissionDeniedError"
          ) {
            setError({
              type: ErrorType.CAMERA_ACCESS_DENIED,
              message: err.message,
              userMessage:
                "カメラへのアクセスが拒否されました。ブラウザの設定でカメラの使用を許可してください。",
              retryable: true,
            });
          } else if (
            err.name === "NotFoundError" ||
            err.name === "DevicesNotFoundError"
          ) {
            setError({
              type: ErrorType.CAMERA_NOT_AVAILABLE,
              message: err.message,
              userMessage:
                "カメラが見つかりませんでした。カメラが接続されているか確認してください。",
              retryable: false,
            });
          } else {
            setError({
              type: ErrorType.CAMERA_NOT_AVAILABLE,
              message: err.message,
              userMessage: "カメラの起動に失敗しました。",
              retryable: true,
            });
          }
        }
      }
    }

    requestCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
      if (
        mediaRecorderRef.current &&
        mediaRecorderRef.current.state !== "inactive"
      ) {
        mediaRecorderRef.current.stop();
      }
    };
  }, [setError]);

  const startRecording = useCallback(() => {
    if (!stream) return;

    try {
      const options = { mimeType: "video/webm;codecs=vp9" };
      let mediaRecorder: MediaRecorder;

      if (MediaRecorder.isTypeSupported(options.mimeType)) {
        mediaRecorder = new MediaRecorder(stream, options);
      } else {
        mediaRecorder = new MediaRecorder(stream);
      }

      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, {
          type: mediaRecorder.mimeType,
        });
        setRecordedVideo({
          blob,
          duration: 4000,
          mimeType: mediaRecorder.mimeType,
        });

        // Navigate to clothing selection
        navigate("/clothing-selection");
      };

      mediaRecorder.onerror = () => {
        setError({
          type: ErrorType.RECORDING_FAILED,
          message: "Recording failed",
          userMessage: "録画に失敗しました。もう一度お試しください。",
          retryable: true,
        });
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      setIsRecording(true);
      setRemainingTime(4);
    } catch (err) {
      console.error("Failed to start recording:", err);
      setError({
        type: ErrorType.RECORDING_FAILED,
        message: err instanceof Error ? err.message : "Unknown error",
        userMessage: "録画の開始に失敗しました。",
        retryable: true,
      });
    }
  }, [stream, setRecordedVideo, navigate, setError]);

  const stopRecording = useCallback(() => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== "inactive"
    ) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  }, []);

  // Countdown logic
  useEffect(() => {
    if (!isCountingDown) return;

    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      // Start recording when countdown reaches 0
      setIsCountingDown(false);
      startRecording();
    }
  }, [isCountingDown, countdown, startRecording]);

  // Recording timer
  useEffect(() => {
    if (!isRecording) return;

    if (remainingTime > 0) {
      const timer = setTimeout(() => {
        setRemainingTime(remainingTime - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      // Stop recording after 4 seconds
      stopRecording();
    }
  }, [isRecording, remainingTime, stopRecording]);

  if (!stream) {
    return (
      <div className="min-h-screen bg-linear-to-br from-pink-pastel to-purple-accent flex items-center justify-center p-4 md:p-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-4 md:space-y-6"
        >
          <div className="animate-spin rounded-full h-12 w-12 md:h-16 md:w-16 border-4 border-pink-primary border-t-transparent mx-auto"></div>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-gray-700"
          >
            Starting camera...
          </motion.p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-pink-pastel to-purple-accent flex items-center justify-center p-4 md:p-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full h-full max-w-xl md:max-w-2xl relative"
      >
        <CameraView stream={stream} />
        <PersonGuide />
        <AnimatePresence>
          {isCountingDown && <Countdown count={countdown} />}
        </AnimatePresence>
        <AnimatePresence>
          {isRecording && (
            <RecordingIndicator
              isRecording={isRecording}
              remainingTime={remainingTime}
            />
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
