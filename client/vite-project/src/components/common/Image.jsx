export default function Image({
  src,
  alt,
  width,
  height,
  borderRadius,
  className,
  ...rest
}) {
  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      style={{ borderRadius: borderRadius }}
      {...rest}
    />
  );
}

// Dương dan anh mac dinh
// src="https://firebasestorage.googleapis.com/v0/b/hg-store-a11c5.firebasestorage.app/o/images%2F1751092040674-logo.png?alt=media&token=4b72bf76-9c9c-4257-9290-808098ceac2f"
