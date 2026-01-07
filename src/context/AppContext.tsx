import { createContext, useContext, useState, type ReactNode } from "react";

// Data Models
export interface ClothingItem {
  id: string;
  name: string;
  thumbnailUrl: string;
  description?: string;
  s3Key?: string;
}

export interface RecordedVideo {
  blob: Blob;
  duration: number;
  mimeType: string;
}

export const ErrorType = {
  CAMERA_ACCESS_DENIED: "CAMERA_ACCESS_DENIED",
  CAMERA_NOT_AVAILABLE: "CAMERA_NOT_AVAILABLE",
  RECORDING_FAILED: "RECORDING_FAILED",
  UPLOAD_FAILED: "UPLOAD_FAILED",
  GENERATION_FAILED: "GENERATION_FAILED",
  NETWORK_ERROR: "NETWORK_ERROR",
} as const;

export type ErrorType = (typeof ErrorType)[keyof typeof ErrorType];

export interface AppError {
  type: ErrorType;
  message: string;
  userMessage: string;
  retryable: boolean;
}

// Global State Interface
interface AppState {
  recordedVideo: RecordedVideo | null;
  selectedClothing: ClothingItem | null;
  generatedVideoUrl: string | null;
  isProcessing: boolean;
  error: AppError | null;
  videoKey: string | null;
  jobId: string | null;
}

// Context Actions Interface
interface AppContextType extends AppState {
  setRecordedVideo: (video: RecordedVideo | null) => void;
  setSelectedClothing: (clothing: ClothingItem | null) => void;
  setGeneratedVideoUrl: (url: string | null) => void;
  setIsProcessing: (processing: boolean) => void;
  setError: (error: AppError | null) => void;
  setVideoKey: (key: string | null) => void;
  setJobId: (id: string | null) => void;
  resetState: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [recordedVideo, setRecordedVideo] = useState<RecordedVideo | null>(
    null
  );
  const [selectedClothing, setSelectedClothing] = useState<ClothingItem | null>(
    null
  );
  const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(
    null
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<AppError | null>(null);
  const [videoKey, setVideoKey] = useState<string | null>(null);
  const [jobId, setJobId] = useState<string | null>(null);

  const resetState = () => {
    setRecordedVideo(null);
    setSelectedClothing(null);
    setGeneratedVideoUrl(null);
    setIsProcessing(false);
    setError(null);
    setVideoKey(null);
    setJobId(null);
  };

  const value: AppContextType = {
    recordedVideo,
    selectedClothing,
    generatedVideoUrl,
    isProcessing,
    error,
    videoKey,
    jobId,
    setRecordedVideo,
    setSelectedClothing,
    setGeneratedVideoUrl,
    setIsProcessing,
    setError,
    setVideoKey,
    setJobId,
    resetState,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
}
