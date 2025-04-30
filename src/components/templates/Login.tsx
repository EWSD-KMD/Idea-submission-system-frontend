"use client";

import dynamic from "next/dynamic";
import { Form, message } from "antd";
import Button from "../atoms/Button";
import { getIcon } from "../atoms/Icon";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

const Input = dynamic(
  () => import("antd/es/input").then((mod) => mod.default),
  {
    ssr: false,
  }
);

const Password = dynamic(
  () => import("antd/es/input/Password").then((mod) => mod.default),
  { ssr: false }
);

export interface LoginFormValues {
  email: string;
  password: string;
}

const Login = () => {
  const [loading, setLoading] = useState(false);
  const { loginUser } = useAuth();
  const router = useRouter();
  const [form] = Form.useForm();

  const onFinish = async (values: LoginFormValues) => {
    const { email, password } = values;
    setLoading(true);
    try {
      await loginUser(email, password);
      message.success({
        content: "Logged in successfully!",
        key: "login",
        duration: 3,
      });
      router.push("/");
      window.location.reload();
    } catch (err: any) {
      const errorMessage =
        err?.message === "Login failed"
          ? "Invalid username or password"
          : err?.message || "Login failed. Please try again.";
      message.error({
        content: errorMessage,
        key: "login",
        duration: 3,
      });

      form.setFields([
        {
          name: "password",
          value: "",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 sm:p-6">
      <div className="w-full max-w-xs sm:max-w-sm md:max-w-md bg-white rounded-lg shadow-lg p-6 sm:p-8 space-y-6">
        {/* Title Section */}
        <div className="text-center">
          <h1 className="font-bold text-xl sm:text-2xl md:text-3xl text-gray-800 mb-2 sm:mb-4">
            Welcome Back
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-gray-500">
            Please sign in to continue
          </p>
        </div>

        {/* Form */}
        <Form
          name="login"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          layout="vertical"
          size="large"
        >
          <Form.Item
            name="email"
            rules={[
              { required: true, message: "Please input your email!" },
              { type: "email", message: "Please enter a valid email!" },
            ]}
            className="pb-3"
          >
            <Input prefix={getIcon("userRound")} placeholder="Email" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              { required: true, message: "Please input your password!" },
              { min: 6, message: "Password must be at least 6 characters!" },
            ]}
          >
            <Password prefix={getIcon("lockKeyHole")} placeholder="Password" />
          </Form.Item>

          <Form.Item>
            <Button
              label="Forgot Password?"
              type="link"
              onClick={() => router.push("/forgot-password")}
              className="text-sm sm:text-base text-primary hover:underline p-0"
            />
          </Form.Item>

          <Form.Item>
            <Button
              htmlType="submit"
              label="Sign In"
              type="primary"
              className="w-full"
              size="large"
              loading={loading}
            />
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default Login;
