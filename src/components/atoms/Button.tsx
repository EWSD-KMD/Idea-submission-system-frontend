"use client";
import dynamic from "next/dynamic";
import { ButtonProps as AntButtonProps } from "antd";
import { ReactNode } from "react";
import { getIcon, IconName } from "./Icon";

interface ButtonProps extends AntButtonProps {
  label?: string;
  icon?: IconName | ReactNode;
  rounded?: boolean;
}

const AntButton = dynamic(() => import("antd").then((mod) => mod.Button), {
  ssr: false,
});

const Button = ({
  label,
  icon,
  rounded = false,
  className = "",
  ...props
}: ButtonProps) => {
  const buttonIcon = typeof icon === "string" ? getIcon(icon as IconName) : "";

  return (
    <AntButton
      icon={buttonIcon}
      className={`${rounded ? "rounded-full" : "rounded-lg"} ${className}`}
      {...props}
    >
      {label}
    </AntButton>
  );
};

export default Button;
