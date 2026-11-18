import type { SyntheticEvent } from "react";

/** Keep the image's space and accessible description when its CDN is unavailable. */
export function imageFallback(event: SyntheticEvent<HTMLImageElement>) {
  applyImageFallback(event.currentTarget);
}

export function applyImageFallback(image: HTMLImageElement) {
  if (image.getAttribute("src") === "/images/image-unavailable.svg") return;
  image.src = "/images/image-unavailable.svg";
  if (image.alt) image.alt = `${image.alt} — image unavailable`;
}
