import { Avatar as AntAvatar } from "antd";
import { AvatarProps } from "antd";

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
