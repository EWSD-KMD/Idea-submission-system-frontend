"use client";
import dynamic from "next/dynamic";
import { getIcon } from "../atoms/Icon";
import Button from "../atoms/Button";
import { useRouter } from "next/navigation";
import { Form } from "antd";

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
  const onFinish = (values: ForgotPasswordFormValues) => {
    console.log("Received values:", values);
    router.push("/reset-password");
  };
  return (
    <div className="min-h-screen flex items-center justify-center h-screen bg-gray-50">
      <div className="max-w-lg w-full space-y-8 p-8 bg-white rounded-lg shadow-lg">
        <p className="text-body-xl text-center">
          Enter the email address associated with your account and we’ll send
          you a code to next your password.
        </p>

        <Form
          name="forgotPassword"
          onFinish={onFinish}
          layout="vertical"
          className="flex flex-col gap-4"
        >
          <Form.Item
            name="email"
            rules={[
              { required: true, message: "Please input your email!" },
              { type: "email", message: "Please enter a valid email!" },
            ]}
          >
            <Input prefix={getIcon("mail")} placeholder="Email" size="large" />
          </Form.Item>
          <Form.Item>
            <Button
              label="Continue"
              className="w-full"
              type="primary"
              htmlType="submit"
              size="large"
            />
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default ForgotPassword;
