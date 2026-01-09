import heic2any from "heic2any";

/**
 * Convert any image file to PNG or JPEG format
 * Supports HEIF/HEIC files from iPhone
 * @param file - Input image file
 * @param format - Target format ('png' or 'jpeg')
 * @param quality - JPEG quality (0-1), only used for JPEG
 * @returns Converted image as Blob
 */
export async function convertImageFormat(
  file: File,
  format: "png" | "jpeg" = "png",
  quality: number = 0.95
): Promise<Blob> {
  // Check if file is HEIF/HEIC format
  const isHEIC =
    file.type === "image/heic" ||
    file.type === "image/heif" ||
    file.name.toLowerCase().endsWith(".heic") ||
    file.name.toLowerCase().endsWith(".heif");

  let processFile = file;

  // Convert HEIC to JPEG first if needed
  if (isHEIC) {
    try {
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
    } catch (error) {
      console.error("HEIC conversion failed:", error);
      throw new Error(
        "Failed to convert HEIC image. Please try a different image."
      );
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
          // Create canvas with image dimensions
          const canvas = document.createElement("canvas");
          canvas.width = img.width;
          canvas.height = img.height;

          const ctx = canvas.getContext("2d");
          if (!ctx) {
            reject(new Error("Failed to get canvas context"));
            return;
          }

          // Draw image on canvas
          ctx.drawImage(img, 0, 0);

          // Convert to blob
          canvas.toBlob(
            (blob) => {
              if (blob) {
                resolve(blob);
              } else {
                reject(new Error("Failed to convert image"));
              }
            },
            format === "jpeg" ? "image/jpeg" : "image/png",
            quality
          );
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
