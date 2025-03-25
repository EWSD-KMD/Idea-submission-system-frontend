import Button from "@/components/atoms/Button";
import Image from "@/components/atoms/Image";
import Link from "next/link";

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <Image
        src="/not-found.svg"
        alt="404 Page Not Found"
        className="max-w-md w-full h-auto mb-8"
        preview={false}
      />
      <Button label="Back to Home" href="/" type="primary" />
    </div>
  );
};

export default NotFound;
