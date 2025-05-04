import { getProfileImage } from "@/utils/getProfileImage";
import { List } from "antd";
import React from "react";
import Avatar from "../atoms/Avatar";

interface NotificationItem {
  id: number;
  type: "LIKE" | "DISLIKE" | "COMMENT" | "HIDE";
  fromUserId: number; // ← carry the userId
  userName: string;
  message: string;
  time: string;
  read: boolean;
  ideaId: number | null;
}

const Notification: React.FC<{
  notif: NotificationItem;
  onClick: () => void;
}> = ({ notif, onClick }) => {
  // fetch their profile blob→objectUrl:
  const { url: avatarUrl } = getProfileImage(notif.fromUserId);

  return (
    <List.Item
      key={notif.id}
      className={`hover:bg-gray-50 ${
        notif.read ? "bg-white" : "bg-blue-50"
      } rounded-md`}
      onClick={onClick}
    >
      <div className="flex items-center gap-3 p-2 sm:p-3 cursor-pointer w-full min-h-[3rem]">
        <Avatar
          src={
            notif.message.startsWith("Anonymous")
              ? "anonymous"
              : notif.type === "HIDE"
              ? "hide"
              : avatarUrl
          }
          label={
            notif.message.startsWith("Anonymous")
              ? "Anonymous"
              : notif.type === "HIDE"
              ? ""
              : notif.userName
          }
          size={40}
        />
        <div className="flex-1">
          <p className="text-[12px] sm:text-sm text-gray-900">
            {notif.message.startsWith("Anonymous") ? (
              <>
                <span className="font-semibold">Anonymous</span>
                {notif.message.slice("Anonymous".length)}
              </>
            ) : notif.type === "HIDE" ? (
              <> {notif.message}</>
            ) : (
              <>
                <span className="font-semibold">{notif.userName}</span>{" "}
                {notif.message}
              </>
            )}
          </p>
          <p className="text-[10px] sm:text-xs text-gray-500">{notif.time}</p>
        </div>
      </div>
    </List.Item>
  );
};

export default Notification;
