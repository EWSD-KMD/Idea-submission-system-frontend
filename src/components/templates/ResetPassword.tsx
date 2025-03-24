"use client";

import dynamic from "next/dynamic";
import Button from "../atoms/Button";
import { useRouter, useSearchParams } from "next/navigation";
import { Form, message } from "antd";
import { useState } from "react";
import { resetPassword } from "@/lib/auth";

const Password = dynamic(
  () => import("antd/es/input/Password").then((mod) => mod.default),
  { ssr: false }
);

interface ResetPasswordFormValues {
  newPassword: string;
  confirmPassword: string;
}

const ResetPassword = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const token = searchParams.get("token");

  const onFinish = async (values: ResetPasswordFormValues) => {
    const { newPassword } = values;

    if (!token) {
      message.error({
        content: "Invalid or missing reset token.",
        key: "resetPassword",
        duration: 3,
      });
      router.push("/forgot-password");
      return;
    }

    setLoading(true);
    try {
      await resetPassword(token, newPassword);
      message.success({
        content: "Password reset successfully!",
        key: "resetPassword",
        duration: 3,
      });
      router.push("/login");
    } catch (error: any) {
      message.error({
        content: error.message || "Failed to reset password.",
        key: "resetPassword",
        duration: 3,
      });
      form.resetFields();
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 sm:p-6">
        <div className="w-full max-w-xs sm:max-w-sm md:max-w-md bg-white rounded-lg shadow-lg p-6 sm:p-8 space-y-6 text-center">
          <p className="text-sm sm:text-base md:text-lg text-red-500">
            No reset token provided. Please use the link from your email.
          </p>
          <Button
            label="Go to Forgot Password"
            type="primary"
            onClick={() => router.push("/forgot-password")}
            className="w-full"
            size="large"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 sm:p-6">
      <div className="w-full max-w-xs sm:max-w-sm md:max-w-md bg-white rounded-lg shadow-lg p-6 sm:p-8 space-y-6">
        <p className="text-center text-sm sm:text-base md:text-lg text-gray-800">
          Please enter your new password
        </p>
        <Form
          form={form}
          name="resetPassword"
          onFinish={onFinish}
          layout="vertical"
        >
          <Form.Item
            name="newPassword"
            rules={[
              { required: true, message: "Please input your new password!" },
              { min: 8, message: "Password must be at least 8 characters!" },
            ]}
            className="pb-3"
          >
            <Password placeholder="New Password" size="large" className="" />
          </Form.Item>
          <Form.Item
            name="confirmPassword"
            dependencies={["newPassword"]}
            rules={[
              { required: true, message: "Please confirm your password!" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("newPassword") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("Passwords do not match!"));
                },
              }),
            ]}
          >
            <Password
              placeholder="Confirm Password"
              size="large"
              className="w-full"
            />
          </Form.Item>
          <Form.Item>
            <Button
              label="Reset Password"
              className="w-full"
              type="primary"
              htmlType="submit"
              size="large"
              loading={loading}
            />
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default ResetPassword;
