import { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAppContext, ErrorType } from "../context/AppContext";
import { CameraView } from "../components/CameraView";
import { PersonGuide } from "../components/PersonGuide";
import { Countdown } from "../components/Countdown";
import { RecordingIndicator } from "../components/RecordingIndicator";

// Toggle this to use test video instead of actual recording
const USE_TEST_VIDEO = false;
const TEST_VIDEO_FILENAME = "test1.webm"; // or "test.mp4"

// Toggle this to auto-download recorded video for testing
const AUTO_DOWNLOAD_RECORDING = false;

export function RecordingScreen() {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isCountingDown, setIsCountingDown] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [isRecording, setIsRecording] = useState(false);
  const [remainingTime, setRemainingTime] = useState(4);
  const [needsCanvasCrop, setNeedsCanvasCrop] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const { setError, setRecordedVideo } = useAppContext();
  const navigate = useNavigate();

  useEffect(() => {
    async function requestCamera() {
      try {
        // まず9:16を試す（resizeMode: "crop-and-scale"も指定）
        let mediaStream: MediaStream;
        try {
          mediaStream = await navigator.mediaDevices.getUserMedia({
            video: {
              width: { ideal: 720 },
              height: { ideal: 1280 },
              aspectRatio: { ideal: 9 / 16 },
              facingMode: "user",
              // @ts-expect-error resizeMode is not in standard types but supported by some browsers
              resizeMode: "crop-and-scale",
            },
            audio: false,
          });
        } catch {
          // 9:16が失敗したら、制約なしで試す
          console.warn("9:16 aspect ratio not supported, using default");
          mediaStream = await navigator.mediaDevices.getUserMedia({
            video: {
              facingMode: "user",
            },
            audio: false,
          });
        }

        setStream(mediaStream);

        // 実際の解像度を確認
        const videoTrack = mediaStream.getVideoTracks()[0];
        console.log(
          "settings before applyConstraints:",
          videoTrack.getSettings()
        );

        // さらに可能ならapplyConstraintsで「強めに」要求してみる
        try {
          await videoTrack.applyConstraints({
            width: 720,
            height: 1280,
            aspectRatio: 9 / 16,
            // @ts-expect-error resizeMode is not in standard types but supported by some browsers
            resizeMode: "crop-and-scale",
          });
        } catch (e) {
          console.warn("applyConstraints failed:", e);
        }

        const settings = videoTrack.getSettings();
        console.log(
          "Camera resolution after applyConstraints:",
          settings.width,
          "x",
          settings.height
        );
        const actualAspectRatio = settings.width! / settings.height!;
        console.log("Aspect ratio:", actualAspectRatio.toFixed(2));

        // 9:16 = 0.5625
        // アスペクト比が0.5625から大きく外れている場合はCanvasクロップが必要
        const targetAspectRatio = 9 / 16;
        const aspectRatioDiff = Math.abs(actualAspectRatio - targetAspectRatio);
        const needsCrop = aspectRatioDiff > 0.05; // 5%以上の差があればクロップ
        setNeedsCanvasCrop(needsCrop);
        console.log("Needs canvas crop:", needsCrop);

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
      // Cleanup is handled by the stream state
    };
  }, [setError]);

  // Cleanup effect for stream
  useEffect(() => {
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
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [stream]);

  const startRecording = useCallback(async () => {
    if (!stream) return;

    try {
      setIsRecording(true);
      setRemainingTime(4);

      if (USE_TEST_VIDEO) {
        // テスト用: test video を使用
        setTimeout(async () => {
          try {
            const response = await fetch(`/${TEST_VIDEO_FILENAME}`);
            if (!response.ok) {
              throw new Error(`${TEST_VIDEO_FILENAME} not found`);
            }
            const blob = await response.blob();
            const mimeType = TEST_VIDEO_FILENAME.endsWith(".mp4")
              ? "video/mp4"
              : "video/webm";

            setRecordedVideo({
              blob,
              duration: 4000,
              mimeType: mimeType,
            });

            setIsRecording(false);
            navigate("/clothing-selection");
          } catch (err) {
            console.error("Failed to load test video:", err);
            setError({
              type: ErrorType.RECORDING_FAILED,
              message: err instanceof Error ? err.message : "Unknown error",
              userMessage: `テスト動画の読み込みに失敗しました。public/${TEST_VIDEO_FILENAME} を配置してください。`,
              retryable: true,
            });
          }
        }, 4000);
        return;
      }

      // 実際の録画
      let recordingStream: MediaStream;
      let mediaRecorder: MediaRecorder;

      if (needsCanvasCrop) {
        // Canvas経由でクロップして録画
        console.log("Using canvas crop for recording");

        const video = videoRef.current;
        if (!video) {
          throw new Error("Video element not found");
        }

        // 出力サイズ（9:16の720x1280）
        const outH = 1280;
        const outW = Math.round((outH * 9) / 16);

        // Canvas用意
        let canvas = canvasRef.current;
        if (!canvas) {
          canvas = document.createElement("canvas");
          canvasRef.current = canvas;
        }
        canvas.width = outW;
        canvas.height = outH;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          throw new Error("Canvas context not available");
        }

        recordingStream = canvas.captureStream(30); // 30fps

        const options = { mimeType: "video/webm;codecs=vp9" };
        mediaRecorder = MediaRecorder.isTypeSupported(options.mimeType)
          ? new MediaRecorder(recordingStream, options)
          : new MediaRecorder(recordingStream);

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

          if (AUTO_DOWNLOAD_RECORDING) {
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `recorded-${Date.now()}.webm`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            setTimeout(() => URL.revokeObjectURL(url), 100);
            console.log("Recording downloaded!");
          }

          setRecordedVideo({
            blob,
            duration: 4000,
            mimeType: mediaRecorder.mimeType,
          });

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

        // ストリームのフレームごとにCanvasに中央9:16描画
        const startTime = Date.now();
        const drawFrame = () => {
          const iw = video.videoWidth;
          const ih = video.videoHeight;
          if (!iw || !ih) {
            animationFrameRef.current = requestAnimationFrame(drawFrame);
            return;
          }

          const cropW = (ih * 9) / 16; // 高さ基準で9:16
          const sx = (iw - cropW) / 2; // 中央を切り出し
          const sy = 0;

          ctx.drawImage(
            video,
            sx,
            sy,
            cropW,
            ih, // 元動画からの切り出し
            0,
            0,
            outW,
            outH // 出力キャンバス全面に描画
          );

          // 4秒後に録画停止
          const elapsed = Date.now() - startTime;
          if (elapsed >= 4000) {
            if (
              mediaRecorderRef.current &&
              mediaRecorderRef.current.state !== "inactive"
            ) {
              mediaRecorderRef.current.stop();
            }
            setIsRecording(false);
          } else {
            animationFrameRef.current = requestAnimationFrame(drawFrame);
          }
        };

        animationFrameRef.current = requestAnimationFrame(drawFrame);
      } else {
        // 9:16が取れているのでそのまま録画
        console.log("Using direct stream recording (already 9:16)");

        const options = { mimeType: "video/webm;codecs=vp9" };
        mediaRecorder = MediaRecorder.isTypeSupported(options.mimeType)
          ? new MediaRecorder(stream, options)
          : new MediaRecorder(stream);

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

          if (AUTO_DOWNLOAD_RECORDING) {
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `recorded-${Date.now()}.webm`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            setTimeout(() => URL.revokeObjectURL(url), 100);
            console.log("Recording downloaded!");
          }

          setRecordedVideo({
            blob,
            duration: 4000,
            mimeType: mediaRecorder.mimeType,
          });

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
      }
    } catch (err) {
      console.error("Failed to start recording:", err);
      setError({
        type: ErrorType.RECORDING_FAILED,
        message: err instanceof Error ? err.message : "Unknown error",
        userMessage: "録画の開始に失敗しました。",
        retryable: true,
      });
    }
  }, [stream, needsCanvasCrop, setRecordedVideo, navigate, setError]);

  const stopRecording = useCallback(() => {
    if (USE_TEST_VIDEO) {
      // テスト用: 何もしない
      setIsRecording(false);
    } else {
      // 実際の録画を停止
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      if (
        mediaRecorderRef.current &&
        mediaRecorderRef.current.state !== "inactive"
      ) {
        mediaRecorderRef.current.stop();
        setIsRecording(false);
      }
    }
  }, []);

  // streamが取れたらvideoに接続して再生開始（Canvas録画用）
  useEffect(() => {
    if (!stream || !needsCanvasCrop) return;

    const video = document.createElement("video");
    video.srcObject = stream;
    video.autoplay = true;
    video.playsInline = true;
    video.muted = true;
    videoRef.current = video;

    video.play().catch((err) => {
      console.error("Failed to play video:", err);
    });

    return () => {
      if (videoRef.current) {
        videoRef.current.srcObject = null;
        videoRef.current = null;
      }
    };
  }, [stream, needsCanvasCrop]);

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
          <div className="animate-spin rounded-full h-12 w-12 md:h-16 md:w-16 border-4 border-pink-700 border-t-transparent mx-auto"></div>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-pink-700"
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
