"use client";
import dynamic from "next/dynamic";
import { getIcon } from "../atoms/Icon";
import Button from "../atoms/Button";
import { useRouter } from "next/navigation";

const Input = dynamic(
  () => import("antd/es/input").then((mod) => mod.default),
  {
    ssr: false,
  }
);

const ForgotPassword = () => {
  const router = useRouter();
  return (
    <div className="min-h-screen flex items-center justify-center h-screen bg-gray-50">
      <div className="max-w-lg w-full space-y-8 p-8 bg-white rounded-lg shadow-lg">
        <div className="text-center">
          <p className="text-body-xl">
            Enter the email address associated with your account and we’ll send
            you a code to next your password.
          </p>
        </div>
        <Input prefix={getIcon("userRound")} placeholder="Email" />
        <Button
          label="Continue"
          className="w-full"
          type="primary"
          onClick={() => router.push("/reset-your-password")}
        />
      </div>
    </div>
  );
};

export default ForgotPassword;
