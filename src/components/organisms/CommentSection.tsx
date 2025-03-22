"use client";

import React, { useState } from "react";
import CommentBox from "../molecules/CommentBox";
import Comments from "../molecules/Comments";

interface Comment {
  id: string;
  text: string;
  name: string;
  department: string;
  classroom: string;
  time: string;
  avatarSrc?: string;
}

//mock comments data
const mockComments: Comment[] = [
    {
      id: "1",
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
      name: "Anonymous",
      department: "Department",
      classroom: "Classroom",
      time: "1hr",
      avatarSrc: "/anonymous-avatar.jpg",
    },
    {
      id: "2",
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
      name: "Ronald Richards",
      department: "Department",
      classroom: "Classroom",
      time: "1hr",
      avatarSrc: "/ronald-richards.jpg",
    },
    {
      id: "3",
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
      name: "Brooklyn Simmons",
      department: "Department",
      classroom: "Classroom",
      time: "1hr",
      avatarSrc: "/brooklyn-simmons.jpg",
    },
  ];

interface CommentSectionProps {
  postId: number | string;
  isOpen: boolean;
}

const CommentSection: React.FC<CommentSectionProps> = ({ postId, isOpen }) => {
  const [comments, setComments] = useState<Comment[]>(mockComments);


  if (!isOpen) return null; // Render nothing if closed

  return (
    <div className="flex flex-col gap-4 mt-5 my-4 bg-white rounded-lg">
      {/* Comment Input Section */}
      <CommentBox />
      {/* Comments Section */}
      <Comments comments={comments} />
    </div>
  );
};

export default CommentSection;
