import Image from "next/image";
import { logo, navigationBackground } from "../../assets/images";
import Button from "../atoms/Button";
import AvatarDropdown from "../molecules/AvatarDropdown";

const NavBar = () => {
  return (
    <div
      style={{
        backgroundImage: `url(${navigationBackground.src})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        width: "100%",
        height: "80px",
        display: "flex",
        alignItems: "center",
        padding: "16px 156px",
      }}
      className="flex justify-between"
    >
      <Image src={logo} alt="logo" width={191} height={44} />
      <div className="flex gap-3 items-center">
        <Button
          label="Post Idea"
          icon="plus"
          rounded
          className="text-primary"
        />
        <Button type="primary" icon="bell" rounded />
        <AvatarDropdown />
      </div>
    </div>
  );
};

export default NavBar;
