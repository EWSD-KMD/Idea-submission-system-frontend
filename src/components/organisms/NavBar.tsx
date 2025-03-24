"use client";

import Image from "next/image";
import { logo, navigationBackground } from "../../assets/images";
import Button from "../atoms/Button";
import AvatarDropdown from "../molecules/AvatarDropdown";
import Notification from "../molecules/Notification";
import { useRouter } from "next/navigation";
import { RefObject } from "react";
import { CreatePostIdeaRef } from "../templates/CreatePostIdea";

interface NavBarProps {
  createPostIdeaRef?: RefObject<CreatePostIdeaRef>;
}

const NavBar = ({ createPostIdeaRef }: NavBarProps) => {
  const router = useRouter();

  const handleHomeClick = () => {
    router.push("/");
  };

  const handleClick = () => {
    if (createPostIdeaRef?.current) {
      createPostIdeaRef.current.openModal();
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
      <div className="relative w-[191px] h-[44px]" onClick={handleHomeClick}>
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
          <Button
            icon="plus"
            label={"Post Idea"}
            rounded
            responsive
            className="text-primary"
            onClick={handleClick}
          />
          <Notification />
          <AvatarDropdown />
        </div>
      </div>
    </div>
  );
};

export default NavBar;
