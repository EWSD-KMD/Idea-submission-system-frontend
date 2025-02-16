// import Button from "@/components/atoms/Button";
// import NavBar from "@/components/organisms/NavBar";
// import plusIcon from "../../assets/icons/plus.svg";

// const Test = () => {
//   return (
//     <div>
//       <NavBar />
//       <Button label="Hello" rounded icon={plusIcon} />
//     </div>
//   );
// };

// export default Test;

import Button from "@/components/atoms/Button";
import NavBar from "@/components/organisms/NavBar";
import Image from "next/image";
import plusIcon from "../../assets/icons/plus.svg";

const Test = () => {
  return (
    <div>
      <NavBar />
      <Button
        label="Hello"
        rounded
        icon={<Image src={plusIcon} alt="plus" width={24} height={24} />}
      />
    </div>
  );
};

export default Test;
