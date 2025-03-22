"use client";
import dynamic from "next/dynamic";
import { ImageProps as AntImageProps } from "antd";

const AntImage = dynamic(() => import("antd").then((mod) => mod.Image), {
  ssr: false,
});

interface ImageProps extends AntImageProps {
  src: string;
  alt?: string;
  preview?: boolean;
  width?: number;
  height?: number;
  className?: string;
}

const Image = ({
  src,
  alt = "",
  preview = true,
  width,
  height,
  className = "",
  ...props
}: ImageProps) => {
  return (
    <AntImage
      src={src}
      alt={alt}
      preview={preview}
      width={width}
      height={height}
      className={`rounded-lg object-cover ${className}`}
      {...props}
    />
  );
};

export default Image;
