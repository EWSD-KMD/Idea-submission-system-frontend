"use client";
import {
  plusIcon,
  bellIcon,
  keyIcon,
  logoutIcon,
  wrapperIcon,
  paperclipIcon,
  chveronDownIcon,
  anonymousIcon,
  checkedIcon,
  uncheckedIcon,
  layoutListIcon,
  chveronLeftIcon,
  messageCircleMoreIcon,
  thumbsUpIcon,
  thumbsDownIcon,
  eyeIcon,
  userRoundIcon,
  lockKeyHoleIcon,
  mailIcon,
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
  | "chevronDown"
  | "anonymous"
  | "checked"
  | "unchecked"
  | "layoutList"
  | "chevronLeft"
  | "messageCircleMore"
  | "thumbsUp"
  | "thumbsDown"
  | "eye"
  | "userRound"
  | "lockKeyHole"
  | "mail";

interface IconConfig {
  src: string;
  alt: string;
  size: number;
}

const iconConfig: Record<IconName, IconConfig> = {
  plus: { src: plusIcon, alt: "plus icon", size: 24 },
  bell: { src: bellIcon, alt: "bell icon", size: 24 },
  key: { src: keyIcon, alt: "key icon", size: 24 },
  logout: { src: logoutIcon, alt: "logout icon", size: 24 },
  wrapper: { src: wrapperIcon, alt: "wrapper icon", size: 20 },
  paperclip: { src: paperclipIcon, alt: "paperclip icon", size: 20 },
  chevronDown: { src: chveronDownIcon, alt: "chveron down icon", size: 16 },
  anonymous: { src: anonymousIcon, alt: "anonymous icon", size: 24 },
  checked: { src: checkedIcon, alt: "checked icon", size: 20 },
  unchecked: { src: uncheckedIcon, alt: "unchecked icon", size: 20 },
  layoutList: { src: layoutListIcon, alt: "layout list icon", size: 20 },
  chevronLeft: { src: chveronLeftIcon, alt: "chveron left icon", size: 20 },
  messageCircleMore: {
    src: messageCircleMoreIcon,
    alt: "message circle more icon",
    size: 20,
  },
  thumbsUp: { src: thumbsUpIcon, alt: "thumbs up icon", size: 20 },
  thumbsDown: { src: thumbsDownIcon, alt: "thumbs down icon", size: 20 },
  eye: { src: eyeIcon, alt: "eye icon", size: 20 },
  userRound: { src: userRoundIcon, alt: "user round icon", size: 18 },
  lockKeyHole: { src: lockKeyHoleIcon, alt: "lock key hole icon", size: 18 },
  mail: { src: mailIcon, alt: "mail icon", size: 18 },
};

const IconComponent = ({
  src,
  alt,
  size,
  className = "",
}: IconConfig & { className?: string }) => (
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

export const getIcon = (name: IconName, customSize?: number): ReactNode => {
  const config = iconConfig[name];
  return <IconComponent {...config} size={customSize || config.size} />;
};
