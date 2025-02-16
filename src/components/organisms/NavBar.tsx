import Image from "next/image";
import { logo, navigationBackground } from "../../assets/images";

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
    >
      <Image src={logo} alt="logo" width={191} height={44} />
    </div>
  );
};

export default NavBar;
