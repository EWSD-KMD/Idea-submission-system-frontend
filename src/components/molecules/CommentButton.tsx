import Button from "../atoms/Button";
import { getIcon } from "../atoms/Icon";

interface CommentButtonProps {
  commentCount: string;
}

const CommentButton = ({ commentCount }: CommentButtonProps) => {
  return (
    <div className="bg-[#E6EFFD] rounded-full inline-flex">
      <Button
        label={commentCount}
        icon={getIcon("messageCircleMore")}
        type="text"
        className="text-primary font-bold"
      />
    </div>
  );
};

export default CommentButton;
