"use client";
import { AvatarProps } from "antd";
import dynamic from "next/dynamic";

const AntAvatar = dynamic(() => import("antd").then((mod) => mod.Avatar), {
  ssr: false,
});

interface CustomAvatarProps extends AvatarProps {
  src?: string;
  alt?: string;
  size?: number;
}

const Avatar = ({
  src,
  alt = "user avatar",
  size = 40,
  ...props
}: CustomAvatarProps) => {
  return <AntAvatar src={src} alt={alt} size={size} {...props} />;
};

export default Avatar;
