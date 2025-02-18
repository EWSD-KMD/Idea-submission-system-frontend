"use client";

import { Card } from "antd";
import Avatar from "../atoms/Avatar";

// Example "PostBox" component
const PostBox = () => {
  return (
    <Card
      style={{
        display: "flex",
        alignItems: "center",
        backgroundColor: "#fff",
        borderRadius: 16,
        // boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
      }}
    >
      {/* Avatar */}
      <Avatar size={48}>U</Avatar>

      {/* <Input
        placeholder="What do you want to share?"
        bordered={false}
        style={{ flex: 1, marginRight: 12 }}
      />

      <Button
        icon={<UploadOutlined />}
        shape="round"
        style={{ marginRight: 8 }}
      >
        Upload Media
      </Button>

      <Button icon={<EditOutlined />} shape="circle" type="text" /> */}
    </Card>
  );
};

export default PostBox;
