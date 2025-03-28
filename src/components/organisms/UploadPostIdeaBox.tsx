"use client";

import dynamic from "next/dynamic";
import Avatar from "../atoms/Avatar";
import Button from "../atoms/Button";
import { useResponsive } from "@/utils/responsive";

const AntCard = dynamic(() => import("antd").then((mod) => mod.Card), {
  ssr: false,
});

interface PostBoxProps {
  onOpenModal: () => void;
}

const PostBox = ({ onOpenModal }: PostBoxProps) => {
  const { isMobile, isTablet } = useResponsive();

  const handleCardClick = () => {
    onOpenModal();
  };

  return (
    <AntCard
      onClick={handleCardClick}
      className="cursor-pointer rounded-2xl shadow-[0px_5px_24px_0px_#0000000D]"
    >
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <Avatar label="Kaung Sat" size={isMobile ? 32 : 40} />
          <span
            className={`${isMobile ? "text-sm" : "text-body-xl"} opacity-50`}
          >
            What do you want to share?
          </span>
        </div>

        <div className="flex gap-2">
          <Button
            icon="wrapper"
            label="Upload Media"
            rounded
            responsive
            className="text-primary"
            size={"middle"}
          />

          {/* <Button icon="paperclip" rounded size={"middle"} /> */}
        </div>
      </div>
    </AntCard>
  );
};

export default PostBox;
