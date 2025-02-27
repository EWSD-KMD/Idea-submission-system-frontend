import { Card } from "antd";
import Image from "../atoms/Image";
import AvatarWithNameAndDept from "../molecules/AvatarWithNameAndDept";
import LikeAndDislikeButton from "../molecules/LikeAndDislikeButton";
import CommentButton from "../molecules/CommentButton";
import ViewCount from "../molecules/ViewCount";

const PostCard = () => {
  return (
    <Card>
      <AvatarWithNameAndDept
        name="Dianne Russell"
        department="Department"
        classroom="Classroom"
        time="1hr"
        avatarSrc="Media.jpg"
      />
      <p className="my-4">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
        commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
        velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
        occaecat cupidatat non proident, sunt in culpa qui officia deserunt
        mollit anim id est laborum.
      </p>
      <div className="mb-4">
        <Image src="university.jpg" />
      </div>
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          <LikeAndDislikeButton likeCount="1.2K" dislikeCount="350" />
          <CommentButton commentCount="500K" />
        </div>
        <ViewCount viewCount="2K" />
      </div>
    </Card>
  );
};

export default PostCard;
