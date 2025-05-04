"use client";
import { AvatarProps } from "antd";
import dynamic from "next/dynamic";
import { CSSProperties } from "react";
import { getIcon } from "./Icon";

const AntAvatar = dynamic(() => import("antd").then((mod) => mod.Avatar), {
  ssr: false,
});

interface CustomAvatarProps extends AvatarProps {
  src?: string | null;
  alt?: string;
  size?: number;
  label?: string | null; // Add label prop for fallback text
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
    backgroundColor: "#E6ECFF",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  // Get first letter and capitalize it
  const firstLetter = label ? label.charAt(0).toUpperCase() : "";
  const isAnonymous = src === "anonymous";
  const isHide = src === "hide";

  return (
    <AntAvatar
      src={isAnonymous ? undefined : isHide ? undefined : src ?? undefined}
      alt={alt}
      size={size}
      style={avatarStyle}
      className={`rounded-full overflow-hidden ${className} text-primary font-bold`}
      {...props}
    >
      {isAnonymous
        ? getIcon("anonymous")
        : isHide
        ? getIcon("info") // render your anonymous SVG
        : src === null && (
            <span
              style={{ fontSize: size * 0.5, lineHeight: 1 }}
              className="leading-none"
            >
              {firstLetter}
            </span>
          )}
    </AntAvatar>
  );
};

export default Avatar;
