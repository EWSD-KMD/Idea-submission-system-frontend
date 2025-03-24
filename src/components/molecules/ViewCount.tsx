import { formatCount } from "@/utils/formatCount";
import Button from "../atoms/Button";
import { getIcon } from "../atoms/Icon";

interface ViewCountProps {
  viewCount: number;
}

const ViewCount = ({ viewCount }: ViewCountProps) => {
  return (
    <>
      <Button
        label={formatCount(viewCount)}
        icon={getIcon("eye")}
        rounded
        className="font-bold"
      />
    </>
  );
};

export default ViewCount;
