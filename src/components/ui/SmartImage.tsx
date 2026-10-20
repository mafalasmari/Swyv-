import Image, { type ImageProps } from "next/image";

/**
 * next/image wrapper. SVGs are served as-is because the optimizer
 * does not rasterize them.
 */
export function SmartImage({ src, alt, ...props }: ImageProps) {
  const unoptimized = typeof src === "string" && src.endsWith(".svg");
  return <Image src={src} alt={alt} unoptimized={unoptimized} {...props} />;
}
