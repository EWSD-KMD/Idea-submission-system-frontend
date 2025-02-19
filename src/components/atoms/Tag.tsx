"use client";
import dynamic from "next/dynamic";
import { TagProps as AntTagProps } from "antd";

const AntTag = dynamic(() => import("antd").then((mod) => mod.Tag), {
  ssr: false,
});

interface TagProps extends AntTagProps {
  label?: string;
  color?: string;
  className?: string;
}

const Tag = ({ label, color, className = "", ...props }: TagProps) => {
  return (
    <AntTag color={color} className={` ${className}`} {...props}>
      {label}
    </AntTag>
  );
};

export default Tag;
