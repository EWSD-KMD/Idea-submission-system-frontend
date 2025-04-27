"use client";
import { MenuProps, message } from "antd";
import Avatar from "../atoms/Avatar";
import { getIcon } from "../atoms/Icon";
import dynamic from "next/dynamic";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useUser } from "@/contexts/UserContext";
import { useState } from "react";
import ChangePasswordModal from "./ChangePasswordModal";

const AntBadge = dynamic(() => import("antd").then((mod) => mod.Badge), {
  ssr: false,
});

const AntDropdown = dynamic(() => import("antd").then((mod) => mod.Dropdown), {
  ssr: false,
});

const renderProfileItem = (
  userName: string | null,
  department: string | null,
  avatarSrc: string | null
) => {
  return (
    <div className="flex items-center gap-2">
      <Avatar src={avatarSrc} size={32} label={userName} />
      <div className="flex flex-col">
        <span className="font-medium">{userName}</span>
        <span className="text-xs text-gray-500">{department}</span>
      </div>
    </div>
  );
};

const getDropdownItems = (
  userName: string | null,
  department: string | null,
  avatarSrc: string | null,
): MenuProps["items"] => [
  {
    key: "profile",
    label: renderProfileItem(userName, department, avatarSrc),
  },
  {
    type: "divider",
  },
  {
    key: "changePassword",
    label: "Change Password",
    icon: getIcon("key"),
  },
  {
    type: "divider",
  },
  {
    key: "logout",
    label: "Logout",
    icon: getIcon("logout"),
  },
];

const AvatarDropdown = () => {
  const { logoutUser } = useAuth();
  const { userName, departmentName, profileImageUrl } = useUser();
  const router = useRouter();
  const [changePasswordModal, setChangePasswordModal] = useState(false);
  const handleMenuClick = ({ key }: { key: string }) => {
    switch (key) {
      case "profile":
        router.push("/profile-page");
        break;
      case "changePassword":
        setChangePasswordModal(true);
        break;
      case "logout":
        logoutUser();
        message.success({
          content: "Logged out successfully!",
          duration: 3,
        });
        break;
      default:
        break;
    }
  };

  return (
    <>
      <AntDropdown
        menu={{
          items: getDropdownItems(userName, departmentName, profileImageUrl),
          onClick: handleMenuClick,
        }}
        placement="bottomRight"
        arrow
        trigger={["click"]}
      >
        <div className="relative cursor-pointer">
          <AntBadge
            size="small"
            offset={[-8, 32]}
            count={
              <div
                style={{
                  backgroundColor: "#fff",
                  borderRadius: "100%",
                }}
              >
                {getIcon("chevronDown")}
              </div>
            }
          >
            <Avatar src={profileImageUrl} label={userName} />
          </AntBadge>
        </div>
      </AntDropdown>
      <ChangePasswordModal
        visible={changePasswordModal}
        onCancel={() => setChangePasswordModal(false)}
      />
    </>
  );
};

export default AvatarDropdown;
