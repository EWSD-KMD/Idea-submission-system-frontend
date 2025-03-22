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
      className="flex items-center justify-between px-4 sm:px-6 md:px-8 lg:px-20 xl:px-40"
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
        <div className="block sm:hidden">
          <Button icon="plus" rounded className="text-primary" />
        </div>
        {/* Desktop version - icon with label */}
        <div className="hidden sm:block">
          <Button
            label="Post Idea"
            icon="plus"
            rounded
            className="text-primary"
            onClick={handleClick}
          />
        </div>
        <Notification />
        <AvatarDropdown />
      </div>
    </div>
  );
};

export default NavBar;
