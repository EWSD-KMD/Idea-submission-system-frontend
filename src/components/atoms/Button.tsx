import { Button as AntButton } from "antd";
import type { ButtonProps as AntButtonProps } from "antd";
import { ReactNode } from "react";

interface ButtonProps extends AntButtonProps {
  label?: string;
  icon?: ReactNode;
  rounded?: boolean;
}

const Button = ({
  label,
  icon,
  rounded = false,
  className = "",
  ...props
}: ButtonProps) => {
  return (
    <AntButton
      icon={icon}
      className={`${rounded ? "rounded-full" : "rounded-lg"} ${className}`}
      {...props}
    >
      {label}
    </AntButton>
  );
};

export default Button;
