import Avatar from "../atoms/Avatar";
import { useResponsive } from "@/utils/responsive";

interface AvatarWithNameAndDeptProps {
  name: string | null;
  department: string;
  category: string;
  time: string;
  avatarSrc?: string | null;
  size?: number;
  className?: string;
}

const AvatarWithNameAndDept = ({
  name,
  department,
  category,
  time,
  avatarSrc,
  size,
  className = "",
}: AvatarWithNameAndDeptProps) => {
  const { isMobile } = useResponsive();

  // Responsive sizes
  const avatarSize = isMobile ? 44 : size || 48;
  const nameSize = isMobile ? "text-base" : "text-lg";
  const infoSize = isMobile ? "text-xs" : "text-sm";

  return (
    <div className={`flex items-center justify-between w-full ${className}`}>
      <Avatar src={avatarSrc} size={avatarSize} label={name} />
      <div className="flex flex-col flex-grow ml-2 sm:ml-3">
        <span className={`font-bold ${nameSize}`}>{name}</span>
        <div className="flex flex-wrap items-center gap-1">
          <span className={`${infoSize} text-gray-500`}>{department}</span>
          <span className={`${infoSize} text-gray-500`}>•</span>
          <span className={`${infoSize} text-gray-500`}>{category}</span>
          <span className={`${infoSize} text-gray-500 `}>•</span>
          <span className={`${infoSize} text-gray-500`}>{time}</span>
        </div>
      </div>
    </div>
  );
};

export default AvatarWithNameAndDept;
