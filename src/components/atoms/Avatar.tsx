"use client";
import { AvatarProps } from "antd";
import dynamic from "next/dynamic";
import { CSSProperties } from "react";

const AntAvatar = dynamic(() => import("antd").then((mod) => mod.Avatar), {
  ssr: false,
});

interface CustomAvatarProps extends AvatarProps {
  src?: string;
  alt?: string;
  size?: number;
  label?: string; // Add label prop for fallback text
}

const Avatar = ({
  src,
  alt = "user avatar",
  size = 40,
  style,
  className = "",
  label = "",
  ...props
}: CustomAvatarProps) => {
  const avatarStyle: CSSProperties = {
    ...style,
    minWidth: size,
    aspectRatio: "1 / 1",
    objectFit: "cover",
    backgroundColor: src ? undefined : "#E6ECFF",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  // Get first letter and capitalize it
  const firstLetter = label ? label.charAt(0).toUpperCase() : "";

  return (
    <AntAvatar
      src={src}
      alt={alt}
      size={size}
      style={avatarStyle}
      className={`rounded-full overflow-hidden ${className} text-primary font-bold`}
      {...props}
    >
      {!src && firstLetter}
    </AntAvatar>
  );
};

export default Avatar;
