"use client";
import dynamic from "next/dynamic";
import Button from "../atoms/Button";
import { useRouter } from "next/navigation";
import { Form } from "antd";

const Password = dynamic(
  () => import("antd/es/input/Password").then((mod) => mod.default),
  {
    ssr: false,
  }
);

interface ResetPasswordFormValues {
  newPassword: string;
  confirmPassword: string;
}

const ResetPassword = () => {
  const router = useRouter();

  const onFinish = (values: ResetPasswordFormValues) => {
    console.log("Success:", values);
    router.push("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center h-screen bg-gray-50">
      <div className="max-w-lg w-full space-y-8 p-8 bg-white rounded-lg shadow-lg">
        <p className=" text-body-xl text-center">
          Please put your new password
        </p>

        <Form
          name="resetPassword"
          onFinish={onFinish}
          layout="vertical"
          className="flex flex-col gap-4"
        >
          <Form.Item
            name="newPassword"
            rules={[
              { required: true, message: "Please input your new password!" },
              { min: 8, message: "Password must be at least 8 characters!" },
            ]}
          >
            <Password placeholder="New Password" size="large" />
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
            <Password placeholder="Confirm Password" size="large" />
          </Form.Item>
          <Form.Item>
            <Button
              label="Reset Password"
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

export default ResetPassword;
