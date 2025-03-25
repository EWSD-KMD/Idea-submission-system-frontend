"use client";

import dynamic from "next/dynamic";
import { getIcon } from "../atoms/Icon";
import Button from "../atoms/Button";
import { useRouter } from "next/navigation";
import { Form, message } from "antd"; // Added message for feedback
import { useAuth } from "@/contexts/AuthContext";
import Cookies from "js-cookie";
import { useState } from "react";

const Input = dynamic(
  () => import("antd/es/input").then((mod) => mod.default),
  {
    ssr: false,
  }
);

interface ForgotPasswordFormValues {
  email: string;
}

const ForgotPassword = () => {
  const router = useRouter();
  const { forgotPassword } = useAuth();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: ForgotPasswordFormValues) => {
    const { email } = values;
    setLoading(true);
    try {
      await forgotPassword(email);
      message.success({
        content: "Reset code sent to your email!",
        key: "forgotPassword",
        duration: 3,
      });
    } catch (error: any) {
      message.error({
        content: error.message || "Failed to send reset code.",
        key: "forgotPassword",
        duration: 3,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 sm:p-6">
      <div className="w-full max-w-xs sm:max-w-sm md:max-w-md bg-white rounded-lg shadow-lg p-6 sm:p-8 space-y-6">
        <div className="text-center">
          <h1 className="font-bold text-lg sm:text-xl md:text-2xl text-gray-800 mb-2 sm:mb-4">
            Forgot Password
          </h1>
          <p className="text-center text-base pb-2 text-gray-500">
            Enter the email address and we’ll send you a code to reset your
            password.
          </p>
        </div>

        <Form name="forgotPassword" onFinish={onFinish} layout="vertical">
          <Form.Item
            name="email"
            rules={[
              { required: true, message: "Please input your email!" },
              { type: "email", message: "Please enter a valid email!" },
            ]}
            className="pb-3"
          >
            <Input
              prefix={getIcon("mail")}
              placeholder="Email"
              size="large"
              className="w-full"
            />
          </Form.Item>
          <Form.Item>
            <Button
              label="Continue"
              className="w-full"
              type="primary"
              htmlType="submit"
              size="large"
              loading={loading}
            />
          </Form.Item>
          <Form.Item>
            <Button
              label="Back to login form"
              className="w-full"
              type="link"
              size="small"
              onClick={() => router.push("/login")}
            />
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default ForgotPassword;
