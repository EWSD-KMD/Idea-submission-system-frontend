"use client";
import dynamic from "next/dynamic";
import { Form } from "antd";
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
  {
    ssr: false,
  }
);

export interface LoginFormValues {
  email: string;
  password: string;
}

const Login = () => {
  const [email, setemail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { loginUser } = useAuth();
  const router = useRouter();

  const onFinish = async (values: LoginFormValues) => {
    const { email, password } = values;
    setemail(email);
    setPassword(password);
    setError("");
    try {
      await loginUser(email, password);
      router.push("/");
    } catch (err) {
      setError("Invalid credentials or server error.");
    }
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center h-screen bg-gray-50">
        <div className="max-w-lg w-full space-y-8 p-8 bg-white rounded-lg shadow-lg">
          <div className="text-center">
            <p className="font-bold text-2xl mb-4">Welcome Back</p>
            <p className=" text-body-xl text-gray-500">
              Please sign in to continue
            </p>
          </div>
          <Form
            name="login"
            initialValues={{ remember: true }}
            onFinish={onFinish}
            layout="vertical"
            size="large"
            className="flex flex-col gap-2"
          >
            <Form.Item
              name="email"
              rules={[{ required: true, message: "Please input your email!" }]}
            >
              <Input prefix={getIcon("userRound")} placeholder="email" />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[
                { required: true, message: "Please input your password!" },
              ]}
            >
              <Password
                prefix={getIcon("lockKeyHole")}
                placeholder="Password"
              />
            </Form.Item>
            <Form.Item>
              <Button
                label="Forgot Password?"
                type="link"
                onClick={() => router.push("/forgot-password")}
              />
            </Form.Item>
            <Form.Item>
              <Button
                htmlType="submit"
                label="Sign In"
                type="primary"
                className="w-full"
                size="large"
              />
            </Form.Item>
          </Form>
        </div>
      </div>
    </>
  );
};

export default Login;
