"use client";
import dynamic from "next/dynamic";
import { ButtonProps as AntButtonProps } from "antd";
import { ReactNode } from "react";
import { getIcon, IconName } from "./Icon";
import { useResponsive } from "@/utils/responsive";

const AntButton = dynamic(() => import("antd").then((mod) => mod.Button), {
  ssr: false,
});

interface ButtonProps extends AntButtonProps {
  label?: string;
  icon?: IconName | ReactNode;
  rounded?: boolean;
  responsive?: boolean; // New prop to control responsive behavior
}

const Button = ({
  label,
  icon,
  rounded = false,
  className = "",
  responsive = false,
  ...props
}: ButtonProps) => {
  const { showLabel } = useResponsive();
  const buttonIcon =
    typeof icon === "string" ? getIcon(icon as IconName) : icon;

  const shouldShowLabel = responsive ? showLabel && label : label;

  return (
    <AntButton
      icon={buttonIcon}
      className={`${rounded ? "rounded-full" : "rounded-lg"} ${className}`}
      {...props}
    >
      {shouldShowLabel && <span>{shouldShowLabel}</span>}
    </AntButton>
  );
};

export default Button;
