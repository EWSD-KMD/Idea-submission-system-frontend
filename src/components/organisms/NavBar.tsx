"use client";

import Image from "next/image";
import { logo, navigationBackground } from "../../assets/images";
import Button from "../atoms/Button";
import AvatarDropdown from "./AvatarDropdown";
import NotificationBox from "../molecules/NotificationBox";
import { useRouter } from "next/navigation";
import { RefObject, useState } from "react";
import { CreatePostIdeaRef } from "../templates/CreatePostIdea";
import { useUser } from "@/contexts/UserContext";
import { Tooltip } from "antd";

interface NavBarProps {
  createPostIdeaRef?: RefObject<CreatePostIdeaRef>;
}

const NavBar = (
  { createPostIdeaRef }: NavBarProps,
  avatarSrc: string | null
) => {
  const router = useRouter();
  const { isSubmissionClose } = useUser();
  const [src, setSrc] = useState<string | null>(null);

  const handleHomeClick = () => {
    router.push("/");
  };

  const handleClick = () => {
    if (createPostIdeaRef?.current) {
      createPostIdeaRef.current.openModal();
    } else {
      console.error("createPostIdeaRef is not defined or null");
    }
  };

  return (
    <div
      style={{
        backgroundImage: `url(${navigationBackground.src})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: "80px",
      }}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 sm:px-6 md:px-8 lg:px-20 xl:px-40"
    >
      <div
        className="relative w-[191px] h-[44px] cursor-pointer"
        onClick={handleHomeClick}
      >
        <Image
          src={logo}
          alt="logo"
          fill
          style={{ objectFit: "contain" }}
          priority
        />
      </div>
      <div className="flex gap-3 items-center">
        {/* Mobile version - icon only */}
        <div className="flex gap-3 items-center">
          {isSubmissionClose ? (
            <Tooltip title="Idea submission is closed" color="red">
              <span>
                <Button
                  icon="plusDisabled"
                  label="Post Idea"
                  rounded
                  responsive
                  className="text-primary disabled:bg-white"
                  onClick={handleClick}
                  disabled
                />
              </span>
            </Tooltip>
          ) : (
            <Button
              icon="plus"
              label="Post Idea"
              rounded
              responsive
              className="text-primary"
              onClick={handleClick}
            />
          )}
          <NotificationBox />
          <AvatarDropdown />
        </div>
      </div>
    </div>
  );
};

export default NavBar;
