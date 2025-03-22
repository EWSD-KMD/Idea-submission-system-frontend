import Button from "../atoms/Button";
import { getIcon } from "../atoms/Icon";

interface ViewCountProps {
  viewCount: string;
}

const ViewCount = ({ viewCount }: ViewCountProps) => {
  return (
    <>
      <Button
        label={viewCount}
        icon={getIcon("eye")}
        rounded
        className="font-bold"
      />
    </>
  );
};

export default ViewCount;
