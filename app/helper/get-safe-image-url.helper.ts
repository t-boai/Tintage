export const getSafeImageUrl = (img: unknown): string => {
  if (!img) return "/placeholder-image.png";

  if (typeof img === "string") {
    const trimmed = img.trim();
    return trimmed.length > 0 ? trimmed : "/placeholder-image.png";
  }

  if (Array.isArray(img) && img.length > 0) {
    return getSafeImageUrl(img[0]);
  }

  if (typeof img === "object" && img !== null && "url" in img) {
    const candidate = (img as { url: unknown }).url;
    if (typeof candidate === "string" && candidate.trim().length > 0) {
      return candidate.trim();
    }
  }

  return "/placeholder-image.png";
};
