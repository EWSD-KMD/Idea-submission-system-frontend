"use client";
import dynamic from "next/dynamic";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Form } from "antd";
import Button from "../atoms/Button";
import { getIcon } from "../atoms/Icon";

const Input = dynamic(() => import("antd").then((mod) => mod.Input), {
  ssr: false,
});

const Password = dynamic(
  () => import("antd/es/input/Password").then((mod) => mod.default),
  {
    ssr: false,
  }
);

export interface LoginFormValues {
  username: string;
  password: string;
}

const Login = () => {
  const onFinish = (values: LoginFormValues) => {
    console.log("Success:", values);
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center h-screen bg-gray-50">
        <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-lg">
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
          >
            <Form.Item
              name="username"
              rules={[
                { required: true, message: "Please input your username!" },
              ]}
            >
              <Input prefix={getIcon("userRound")} placeholder="Username" />
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
              <Button label="Forgot Password?" type="link" className="p-0" />
            </Form.Item>
            <Form.Item>
              <Button
                htmlType="submit"
                label="Sign In"
                type="primary"
                className="w-full"
              />
            </Form.Item>
          </Form>
        </div>
      </div>
    </>
  );
};

export default Login;
