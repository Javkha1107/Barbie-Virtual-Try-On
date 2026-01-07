export interface BrowserCompatibility {
  isCompatible: boolean;
  missingFeatures: string[];
}

export function checkBrowserCompatibility(): BrowserCompatibility {
  const missingFeatures: string[] = [];

  // Check for getUserMedia API
  const hasGetUserMedia = !!(
    navigator.mediaDevices && navigator.mediaDevices.getUserMedia
  );

  // Check for MediaRecorder API
  const hasMediaRecorder = typeof MediaRecorder !== "undefined";

  if (!hasGetUserMedia) {
    missingFeatures.push("カメラアクセス (getUserMedia API)");
  }

  if (!hasMediaRecorder) {
    missingFeatures.push("動画録画 (MediaRecorder API)");
  }

  return {
    isCompatible: missingFeatures.length === 0,
    missingFeatures,
  };
}

export function getBrowserName(): string {
  const userAgent = navigator.userAgent;

  if (userAgent.includes("Chrome") && !userAgent.includes("Edg")) {
    return "Chrome";
  } else if (userAgent.includes("Safari") && !userAgent.includes("Chrome")) {
    return "Safari";
  } else if (userAgent.includes("Firefox")) {
    return "Firefox";
  } else if (userAgent.includes("Edg")) {
    return "Edge";
  }

  return "Unknown";
}
