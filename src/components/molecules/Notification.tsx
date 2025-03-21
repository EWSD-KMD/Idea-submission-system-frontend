"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { getIcon } from "../atoms/Icon";
import Avatar from "../atoms/Avatar";
import { Divider } from "antd";

const AntBadge = dynamic(() => import("antd").then((mod) => mod.Badge), {
  ssr: false,
});

const AntPopover = dynamic(() => import("antd").then((mod) => mod.Popover), {
  ssr: false,
});

interface Notification {
  id: string;
  userName: string;
  userAvatar: string;
  message: string;
  time: string;
  read: boolean;
}

const Notification = () => {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      userName: "Dwight",
      userAvatar: "/avatars/dwight.jpg",
      message: "commented on your post.",
      time: "1hr",
      read: false,
    },
    {
      id: "2",
      userName: "Gregory",
      userAvatar: "/avatars/gregory.jpg",
      message: "liked on your post.",
      time: "1hr",
      read: true,
    },
    {
      id: "3",
      userName: "Guy",
      userAvatar: "/avatars/guy.jpg",
      message: "commented on your post.",
      time: "1hr",
      read: false,
    },
    {
      id: "4",
      userName: "Darrell",
      userAvatar: "/avatars/darrell.jpg",
      message: "liked on your post.",
      time: "1hr",
      read: false,
    },
    {
      id: "5",
      userName: "Robert",
      userAvatar: "/avatars/robert.jpg",
      message: "commented on your post.",
      time: "1hr",
      read: true,
    },
    {
      id: "6",
      userName: "Gregory",
      userAvatar: "/avatars/gregory.jpg",
      message: "liked on your post.",
      time: "1hr",
      read: true,
    },
    {
      id: "7",
      userName: "Gregory",
      userAvatar: "/avatars/gregory.jpg",
      message: "liked on your post.",
      time: "1hr",
      read: true,
    },
  ]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const notificationContent = (
    <div className="w-80">
      <div className="flex justify-between items-center p-3 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
        <button
          onClick={handleMarkAllRead}
          className={
            unreadCount == 0
              ? `text-gray-300 text-sm font-medium `
              : `text-sm font-medium hover:underline`
          }
          disabled={unreadCount == 0}
        >
          Mark all read
        </button>
      </div>
      <div className="max-h-80 overflow-y-auto">
        {notifications.length > 0 ? (
          notifications.map((notification, index) => (
            <React.Fragment key={notification.id}>
              <div
                className={`flex items-center gap-3 p-3 ${
                  notification.read ? "bg-white" : "bg-blue-50"
                } rounded-md hover:bg-gray-50`}
              >
                <Avatar src={notification.userAvatar} size={40} />
                <div className="flex-1">
                  <p className="text-sm text-gray-900">
                    <span className="font-semibold">
                      {notification.userName}
                    </span>{" "}
                    {notification.message}
                  </p>
                  <p className="text-xs text-gray-500">{notification.time}</p>
                </div>
              </div>
              {index < notifications.length - 1 && (
                <Divider className="m-0 border-gray-150" />
              )}
            </React.Fragment>
          ))
        ) : (
          <div className="p-3 text-gray-500 text-sm text-center">
            No new notifications
          </div>
        )}
      </div>
    </div>
  );

  return (
    <AntBadge size="small" count={unreadCount}>
      <AntPopover
        content={notificationContent}
        arrow
        placement="bottomRight"
        trigger="click"
      >
        <button className="bg-opacity-30 bg-gray-600 text-white rounded-full p-2">
          {getIcon("bell")}
        </button>
      </AntPopover>
    </AntBadge>
  );
};

export default Notification;
