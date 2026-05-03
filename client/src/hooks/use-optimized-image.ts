interface CloudinaryTransformOptions {
  width?: number;
  height?: number;
  quality?: "auto" | "auto:best" | "auto:good" | "auto:eco" | "auto:low" | number;
  format?: "auto" | "webp" | "png" | "jpg";
  crop?: "fill" | "fit" | "scale" | "thumb";
  gravity?: "auto" | "face" | "center";
}

export function optimizeImageUrl(
  url: string,
  options: CloudinaryTransformOptions = {}
): string {
  if (!url || !url.includes("cloudinary")) return url;

  const {
    width = 200,
    height = 200,
    quality = "auto:best",
    format = "auto",
    crop = "fill",
    gravity = "auto",
  } = options;

  const uploadIndex = url.indexOf("/upload/");
  if (uploadIndex === -1) return url;

  const transformations = `w_${width},h_${height},c_${crop},g_${gravity},q_${quality},f_${format}`;

  return `${url.slice(0, uploadIndex + 8)}${transformations}${url.slice(uploadIndex + 8)}`;
}

export function useOptimizedImage(
  url: string | null,
  options?: CloudinaryTransformOptions
): string | null {
  if (!url) return null;
  return optimizeImageUrl(url, options);
}
