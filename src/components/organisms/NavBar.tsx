"use client";
import Image from "next/image";
import { logo, navigationBackground } from "../../assets/images";
import Button from "../atoms/Button";
import AvatarDropdown from "../molecules/AvatarDropdown";

const handleCLick = () => {
  alert("Clicked!");
};

const NavBar = () => {
  return (
    <div
      style={{
        backgroundImage: `url(${navigationBackground.src})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: "80px",
      }}
      className="flex justify-between px-4 sm:px-6 md:px-8 lg:px-20 xl:px-40"
    >
      <Image src={logo} alt="logo" width={191} height={44} />
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
            onClick={handleCLick}
          />
        </div>
        <Button type="primary" icon="bell" rounded />
        <AvatarDropdown />
      </div>
    </div>
  );
};

export default NavBar;
