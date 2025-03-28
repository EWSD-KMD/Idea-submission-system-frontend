import { useState } from "react";
import { Form, Input, Modal, message } from "antd";
import { ChangePasswordRequest } from "@/constant/type";
import { changePassword } from "@/lib/user";
// import { changePassword } from "@/lib/auth";

interface ChangePasswordModalProps {
  visible: boolean;
  onCancel: () => void;
}

const ChangePasswordModal = ({
  visible,
  onCancel,
}: ChangePasswordModalProps) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values: ChangePasswordRequest) => {
    setLoading(true);
    try {
      await changePassword(values);
      message.success("Password changed successfully");
      form.resetFields();
      onCancel();
    } catch (error) {
      message.error("Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Change Password"
      open={visible}
      onCancel={onCancel}
      okText="Change Password"
      confirmLoading={loading}
      onOk={() => form.submit()}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        requiredMark={false}
      >
        <Form.Item
          name="currentPassword"
          label="Current Password"
          rules={[{ required: true, message: "Please enter current password" }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          name="newPassword"
          label="New Password"
          rules={[
            { required: true, message: "Please enter new password" },
            { min: 6, message: "Password must be at least 6 characters" },
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          name="confirmPassword"
          label="Confirm Password"
          rules={[
            { required: true, message: "Please confirm new password" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("newPassword") === value) {
                  return Promise.resolve();
                }
                return Promise.reject("Passwords do not match");
              },
            }),
          ]}
        >
          <Input.Password />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ChangePasswordModal;
