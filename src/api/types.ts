export interface PresignedUrlRequest {
  fileName: string;
  contentType: string;
}

export interface PresignedUrlResponse {
  uploadUrl: string;
  videoKey: string;
  expiresIn: number;
}

export interface GenerationRequest {
  videoKey: string;
  clothingId: string;
}

export interface ImageGenerationRequest {
  imageBytes: string; // base64 encoded
  garmentId: string;
}

export interface GenerationResponse {
  jobId: string;
  status: "processing";
}

export interface GenerationStatusResponse {
  status: "processing" | "completed" | "failed";
  videoUrl?: string;
  error?: string;
}
