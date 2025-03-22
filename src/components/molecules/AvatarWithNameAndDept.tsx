import Avatar from "../atoms/Avatar";

interface AvatarWithNameAndDeptProps {
  name: string;
  department: string;
  classroom: string;
  time: string;
  avatarSrc?: string;
  size?: number;
}

const AvatarWithNameAndDept = ({
  name,
  department,
  classroom,
  time,
  avatarSrc,
  size,
}: AvatarWithNameAndDeptProps) => {
  return (
    <div className="flex items-center justify-between w-full">
      <Avatar src={avatarSrc} size={size || 48} />
      <div className="flex flex-col flex-grow ml-3">
        <span className="font-bold text-lg">{name}</span>
        <div className="flex items-center gap-1">
          <span className="text-body-sm text-gray-500">{department}</span>
          <span className="text-body-sm text-gray-500">•</span>
          <span className="text-body-sm text-gray-500">{classroom}</span>
          <span className="text-body-sm text-gray-500">•</span>
          <span className="text-body-sm text-gray-500">{time}</span>
        </div>
      </div>
    </div>
  );
};

export default AvatarWithNameAndDept;
