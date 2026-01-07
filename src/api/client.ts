import { ErrorType, type AppError } from "../context/AppContext";
import type {
  PresignedUrlRequest,
  PresignedUrlResponse,
  GenerationRequest,
  GenerationResponse,
  GenerationStatusResponse,
} from "./types";

// API base URL - should be configured via environment variables
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";

class ApiError extends Error {
  statusCode?: number;
  response?: unknown;

  constructor(message: string, statusCode?: number, response?: unknown) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.response = response;
  }
}

function createAppError(error: unknown, defaultMessage: string): AppError {
  console.error("API Error:", error);

  if (error instanceof ApiError) {
    return {
      type: ErrorType.NETWORK_ERROR,
      message: error.message,
      userMessage: "ネットワークエラーが発生しました。もう一度お試しください。",
      retryable: true,
    };
  }

  return {
    type: ErrorType.NETWORK_ERROR,
    message: error instanceof Error ? error.message : defaultMessage,
    userMessage: defaultMessage,
    retryable: true,
  };
}

async function fetchWithErrorHandling<T>(
  url: string,
  options?: RequestInit
): Promise<T> {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new ApiError(
        `HTTP ${response.status}: ${response.statusText}`,
        response.status,
        errorData
      );
    }

    return await response.json();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(
      error instanceof Error ? error.message : "Network request failed",
      undefined,
      error
    );
  }
}

export async function getPresignedUrl(
  request: PresignedUrlRequest
): Promise<PresignedUrlResponse> {
  try {
    return await fetchWithErrorHandling<PresignedUrlResponse>(
      `${API_BASE_URL}/upload/presigned-url`,
      {
        method: "POST",
        body: JSON.stringify(request),
      }
    );
  } catch (error) {
    throw createAppError(error, "アップロードURLの取得に失敗しました。");
  }
}

export async function uploadToS3(
  presignedUrl: string,
  file: Blob,
  contentType: string,
  onProgress?: (progress: number) => void
): Promise<void> {
  try {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      xhr.upload.addEventListener("progress", (event) => {
        if (event.lengthComputable && onProgress) {
          const progress = (event.loaded / event.total) * 100;
          onProgress(progress);
        }
      });

      xhr.addEventListener("load", () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve();
        } else {
          reject(
            new ApiError(`Upload failed with status ${xhr.status}`, xhr.status)
          );
        }
      });

      xhr.addEventListener("error", () => {
        reject(new ApiError("Upload failed due to network error"));
      });

      xhr.open("PUT", presignedUrl);
      xhr.setRequestHeader("Content-Type", contentType);
      xhr.send(file);
    });
  } catch (error) {
    throw createAppError(error, "ファイルのアップロードに失敗しました。");
  }
}

export async function startGeneration(
  request: GenerationRequest
): Promise<GenerationResponse> {
  try {
    return await fetchWithErrorHandling<GenerationResponse>(
      `${API_BASE_URL}/generate`,
      {
        method: "POST",
        body: JSON.stringify(request),
      }
    );
  } catch (error) {
    throw createAppError(error, "動画生成の開始に失敗しました。");
  }
}

export async function checkGenerationStatus(
  jobId: string
): Promise<GenerationStatusResponse> {
  try {
    return await fetchWithErrorHandling<GenerationStatusResponse>(
      `${API_BASE_URL}/generate/status/${jobId}`
    );
  } catch (error) {
    throw createAppError(error, "生成状況の確認に失敗しました。");
  }
}
