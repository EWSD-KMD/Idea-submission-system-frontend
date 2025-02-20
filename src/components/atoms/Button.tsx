"use client";
import dynamic from "next/dynamic";
import { ButtonProps as AntButtonProps } from "antd";
import { ReactNode } from "react";
import { getIcon, IconName } from "./Icon";

const AntButton = dynamic(() => import("antd").then((mod) => mod.Button), {
  ssr: false,
});

interface ButtonProps extends AntButtonProps {
  label?: string;
  icon?: IconName | ReactNode;
  rounded?: boolean;
}

const Button = ({
  label,
  icon,
  rounded = false,
  className = "",
  ...props
}: ButtonProps) => {
  const buttonIcon =
    typeof icon === "string" ? getIcon(icon as IconName) : icon;

  return (
    <AntButton
      icon={buttonIcon}
      className={`${rounded ? "rounded-full" : "rounded-lg"} ${className}`}
      {...props}
    >
      {label && (
        // The label is hidden on extra-small screens and shown on sm and above.
        <span className="hidden sm:inline">{label}</span>
      )}
    </AntButton>
  );
};

export default Button;
