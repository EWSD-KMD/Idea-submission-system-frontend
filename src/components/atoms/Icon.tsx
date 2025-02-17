"use client";
import { plusIcon, bellIcon, keyIcon, logoutIcon } from "../../assets/icons";
import { ReactNode } from "react";
import Image from "next/image";

export type IconName = "plus" | "bell" | "key" | "logout";

const iconMap: Record<IconName, ReactNode> = {
  plus: <Image src={plusIcon} alt="plus icon" width={24} height={24} />,
  bell: <Image src={bellIcon} alt="bell icon" width={24} height={24} />,
  key: <Image src={keyIcon} alt="key icon" width={24} height={24} />,
  logout: <Image src={logoutIcon} alt="logout icon" width={24} height={24} />,
};

export const getIcon = (name: IconName): ReactNode => {
  return iconMap[name];
};
