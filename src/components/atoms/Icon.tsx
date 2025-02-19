"use client";
import {
  plusIcon,
  bellIcon,
  keyIcon,
  logoutIcon,
  wrapperIcon,
  paperclipIcon,
  chveronDownIcon,
} from "../../assets/icons";
import { ReactNode } from "react";
import Image from "next/image";

export type IconName =
  | "plus"
  | "bell"
  | "key"
  | "logout"
  | "wrapper"
  | "paperclip"
  | "chevronDown";

interface IconConfig {
  src: string;
  alt: string;
  size: number;
}

interface IconComponentProps extends IconConfig {
  className?: string;
}

const iconConfig: Record<IconName, IconConfig> = {
  plus: { src: plusIcon, alt: "plus icon", size: 24 },
  bell: { src: bellIcon, alt: "bell icon", size: 24 },
  key: { src: keyIcon, alt: "key icon", size: 24 },
  logout: { src: logoutIcon, alt: "logout icon", size: 24 },
  wrapper: { src: wrapperIcon, alt: "wrapper icon", size: 20 },
  paperclip: { src: paperclipIcon, alt: "paperclip icon", size: 20 },
  chevronDown: { src: chveronDownIcon, alt: "chveron down icon", size: 18 },
};

const IconComponent = ({
  src,
  alt,
  size,
  className = "",
}: IconComponentProps) => (
  <div
    className={`items-center justify-center ${className}`}
    style={{ width: `${size}px`, height: `${size}px` }}
  >
    <Image
      src={src}
      alt={alt}
      width={size}
      height={size}
      style={{
        width: "100%",
        height: "100%",
        objectFit: "contain",
      }}
    />
  </div>
);

const iconMap: Record<IconName, ReactNode> = Object.entries(iconConfig).reduce(
  (acc, [key, config]) => ({
    ...acc,
    [key]: <IconComponent {...config} />,
  }),
  {} as Record<IconName, ReactNode>
);

export const getIcon = (name: IconName): ReactNode => iconMap[name];
