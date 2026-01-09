import heic2any from "heic2any";

/**
 * Calculate dimensions to fit within max size while maintaining aspect ratio
 */
function calculateResizeDimensions(
  width: number,
  height: number,
  maxWidth: number,
  maxHeight: number
): { width: number; height: number } {
  let newWidth = width;
  let newHeight = height;

  if (width > maxWidth) {
    newWidth = maxWidth;
    newHeight = (height * maxWidth) / width;
  }

  if (newHeight > maxHeight) {
    newHeight = maxHeight;
    newWidth = (width * maxHeight) / height;
  }

  return { width: Math.round(newWidth), height: Math.round(newHeight) };
}

/**
 * Convert any image file to PNG or JPEG format
 * Supports HEIF/HEIC files from iPhone
 * Automatically resizes large images to reduce file size
 * @param file - Input image file
 * @param format - Target format ('png' or 'jpeg')
 * @param quality - JPEG quality (0-1), only used for JPEG
 * @param maxSizeKB - Maximum file size in KB (default: 500KB to account for base64 overhead)
 * @param maxDimension - Maximum width or height in pixels (default: 1920)
 * @returns Converted image as Blob
 */
export async function convertImageFormat(
  file: File,
  format: "png" | "jpeg" = "png",
  quality: number = 0.85,
  maxSizeKB: number = 500,
  maxDimension: number = 1920
): Promise<Blob> {
  // Check if file is HEIF/HEIC format
  const isHEICByExtension =
    file.name.toLowerCase().endsWith(".heic") ||
    file.name.toLowerCase().endsWith(".heif");
  const isHEICByMime = file.type === "image/heic" || file.type === "image/heif";

  let processFile = file;

  // Try to convert HEIC if needed
  if (isHEICByExtension || isHEICByMime) {
    try {
      // Only attempt heic2any conversion if file type is explicitly heic/heif
      if (file.type === "image/heic" || file.type === "image/heif") {
        const convertedBlob = await heic2any({
          blob: file,
          toType: "image/jpeg",
          quality: 0.95,
        });

        // heic2any can return Blob or Blob[], handle both cases
        const blob = Array.isArray(convertedBlob)
          ? convertedBlob[0]
          : convertedBlob;
        processFile = new File([blob], file.name.replace(/\.heic$/i, ".jpg"), {
          type: "image/jpeg",
        });
        console.log("HEIC converted successfully to JPEG");
      }
    } catch (error: unknown) {
      console.error("HEIC conversion failed:", error);
      // If heic2any fails, try to load the image directly
      // Some browsers/systems may have already converted it
      console.log("Attempting to process HEIC file directly, type:", file.type);
      // Continue with original file - canvas will attempt to load it
      processFile = file;
    }
  }

  return new Promise((resolve, reject) => {
    const img = new Image();
    const reader = new FileReader();

    reader.onload = (e) => {
      if (!e.target?.result) {
        reject(new Error("Failed to read file"));
        return;
      }

      img.onload = () => {
        try {
          // Calculate new dimensions if image is too large
          const originalWidth = img.width;
          const originalHeight = img.height;
          const { width, height } = calculateResizeDimensions(
            originalWidth,
            originalHeight,
            maxDimension,
            maxDimension
          );

          const needsResize =
            width !== originalWidth || height !== originalHeight;

          if (needsResize) {
            console.log(
              `Resizing image from ${originalWidth}x${originalHeight} to ${width}x${height}`
            );
          }

          // Create canvas with calculated dimensions
          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext("2d");
          if (!ctx) {
            reject(new Error("Failed to get canvas context"));
            return;
          }

          // Use high-quality image smoothing
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = "high";

          // Draw image on canvas (resized if needed)
          ctx.drawImage(img, 0, 0, width, height);

          // Function to convert with quality adjustment
          const convertWithQuality = (
            currentQuality: number,
            currentMaxDimension: number
          ) => {
            // If we need to resize further, recalculate dimensions
            if (currentMaxDimension < maxDimension) {
              const newDimensions = calculateResizeDimensions(
                originalWidth,
                originalHeight,
                currentMaxDimension,
                currentMaxDimension
              );
              canvas.width = newDimensions.width;
              canvas.height = newDimensions.height;

              // Redraw with new dimensions
              const ctx = canvas.getContext("2d");
              if (ctx) {
                ctx.imageSmoothingEnabled = true;
                ctx.imageSmoothingQuality = "high";
                ctx.drawImage(
                  img,
                  0,
                  0,
                  newDimensions.width,
                  newDimensions.height
                );
              }

              console.log(
                `Further resizing to ${newDimensions.width}x${newDimensions.height}`
              );
            }

            canvas.toBlob(
              (blob) => {
                if (!blob) {
                  reject(new Error("Failed to convert image"));
                  return;
                }

                const fileSizeKB = blob.size / 1024;
                console.log(
                  `Image size: ${fileSizeKB.toFixed(
                    2
                  )}KB (quality: ${currentQuality}, max dimension: ${currentMaxDimension})`
                );

                // If file is still too large, try to reduce further
                if (fileSizeKB > maxSizeKB) {
                  // First try reducing quality (for JPEG)
                  if (currentQuality > 0.4 && format === "jpeg") {
                    const newQuality = Math.max(0.4, currentQuality - 0.15);
                    console.log(
                      `File too large (${fileSizeKB.toFixed(
                        2
                      )}KB > ${maxSizeKB}KB), reducing quality to ${newQuality}`
                    );
                    convertWithQuality(newQuality, currentMaxDimension);
                  }
                  // Then try reducing dimensions
                  else if (currentMaxDimension > 800) {
                    const newMaxDimension = Math.max(
                      800,
                      Math.floor(currentMaxDimension * 0.75)
                    );
                    console.log(
                      `File too large (${fileSizeKB.toFixed(
                        2
                      )}KB > ${maxSizeKB}KB), reducing max dimension to ${newMaxDimension}`
                    );
                    convertWithQuality(currentQuality, newMaxDimension);
                  } else {
                    // Can't reduce further, return what we have
                    console.warn(
                      `Unable to reduce file size below ${maxSizeKB}KB, final size: ${fileSizeKB.toFixed(
                        2
                      )}KB`
                    );
                    resolve(blob);
                  }
                } else {
                  resolve(blob);
                }
              },
              format === "jpeg" ? "image/jpeg" : "image/png",
              currentQuality
            );
          };

          // Start conversion with initial quality and dimensions
          convertWithQuality(quality, maxDimension);
        } catch (error) {
          reject(error);
        }
      };

      img.onerror = () => {
        reject(new Error("Failed to load image"));
      };

      img.src = e.target.result as string;
    };

    reader.onerror = () => {
      reject(new Error("Failed to read file"));
    };

    reader.readAsDataURL(processFile);
  });
}

/**
 * Convert blob to base64 string
 */
export async function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === "string") {
        // Remove data URL prefix (e.g., "data:image/png;base64,")
        const base64 = reader.result.split(",")[1];
        resolve(base64);
      } else {
        reject(new Error("Failed to convert blob to base64"));
      }
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

/**
 * Get data URL from blob
 */
export async function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
      } else {
        reject(new Error("Failed to convert blob to data URL"));
      }
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}
