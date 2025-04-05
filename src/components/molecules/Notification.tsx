"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { getIcon } from "../atoms/Icon";
import Avatar from "../atoms/Avatar";
import { Divider, List, message, Skeleton } from "antd";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { useRouter } from "next/navigation";
import {
  getNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from "@/lib/notification";
import { NotificationsResponseData } from "@/constant/type";
import Image from "../atoms/Image";
import InfiniteScroll from "react-infinite-scroll-component";

const AntBadge = dynamic(() => import("antd").then((mod) => mod.Badge), {
  ssr: false,
});
const AntPopover = dynamic(() => import("antd").then((mod) => mod.Popover), {
  ssr: false,
});

interface NotificationItem {
  id: number;
  userName: string;
  userAvatar: string;
  message: string;
  time: string;
  read: boolean;
  ideaId: number | null;
}

const Notification = () => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [pagination, setPagination] = useState<{
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  } | null>(null);
  const router = useRouter();

  // Fetch notifications from the API
  const fetchNotifications = async (page: number = 1, limit: number = 10) => {
    if (page === 1) {
      setLoading(true);
    }
    try {
      const res: NotificationsResponseData = await getNotifications(page, limit);
      const mappedNotifications: NotificationItem[] = res.notifications.map(
        (notif: any) => ({
          id: notif.id,
          userName: notif.fromUser?.name || "Unknown",
          userAvatar: "", // Adjust if API returns an avatar URL
          message: notif.message,
          time: new Date(notif.createdAt).toLocaleTimeString(),
          read: notif.isRead,
          ideaId: notif.idea?.id || null,
        })
      );
      setNotifications((prev) =>
        page === 1 ? mappedNotifications : [...prev, ...mappedNotifications]
      );
      setPagination({
        page: res.page,
        limit: res.limit,
        total: res.total,
        totalPages: res.totalPages,
      });
    } catch (error: any) {
      message.error(error.message || "Failed to load notifications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  // Count unread notifications
  const unreadCount = notifications.filter((n) => !n.read).length;

  // Mark all notifications as read
  const handleMarkAllRead = async () => {
    try {
      await markAllNotificationsAsRead();
      setNotifications((prev) =>
        prev.map((notif) => ({ ...notif, read: true }))
      );
      message.success("All notifications marked as read");
    } catch (error: any) {
      message.error(error.message || "Failed to mark all as read");
    }
  };

  // Handle notification click: mark as read and route to idea detail if available.
  const handleNotificationClick = async (notif: NotificationItem) => {
    if (!notif.read) {
      try {
        await markNotificationAsRead(notif.id);
        setNotifications((prev) =>
          prev.map((n) => (n.id === notif.id ? { ...n, read: true } : n))
        );
      } catch (error: any) {
        message.error(error.message || "Failed to mark notification as read");
      }
    }
    if (notif.ideaId) {
      router.push(`/idea/${notif.ideaId}`);
    } else {
      message.info("No associated idea for this notification");
    }
  };

  // Load more notifications when scrolled to bottom
  const handleLoadMore = async () => {
    if (pagination && pagination.page < pagination.totalPages) {
      await fetchNotifications(pagination.page + 1, pagination.limit);
    }
  };

  const notificationContent = (
    <div className="w-60 sm:w-80">
      <div className="flex justify-between items-center px-2 sm:px-3 py-2 border-b border-gray-200">
        <h3 className="text-md sm:text-lg font-semibold text-gray-900">Notifications</h3>
        <button
          onClick={handleMarkAllRead}
          className={
            unreadCount === 0
              ? "text-gray-300 text-[10px] sm:text-sm font-medium"
              : "text-[10px] sm:text-sm font-medium hover:underline"
          }
          disabled={unreadCount === 0}
        >
          Mark all read
        </button>
      </div>
      <div id="scrollableDiv" className="min-h-40 max-h-80 overflow-y-auto">
        {loading ? (
          <div className="flex justify-center p-3 mt-10">
            <div className="w-32 h-16">
              <DotLottieReact
                src="https://lottie.host/fce7f0b5-ed51-4cf5-b87c-c54e181f2423/Q5CUbjHeB0.lottie"
                loop
                autoplay
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                }}
              />
            </div>
          </div>
        ) : notifications.length > 0 ? (
          <InfiniteScroll
            dataLength={notifications.length}
            next={handleLoadMore}
            hasMore={pagination ? notifications.length < pagination.total : false}
            loader={
              <div className="flex justify-center p-3">
                <div className="w-32 h-16">
                  <DotLottieReact
                    src="https://lottie.host/fce7f0b5-ed51-4cf5-b87c-c54e181f2423/Q5CUbjHeB0.lottie"
                    loop
                    autoplay
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                    }}
                  />
                </div>
              </div>
            }
            endMessage={<Divider plain>It is all, nothing more 🤐</Divider>}
            scrollableTarget="scrollableDiv"
          >
            <List
              dataSource={notifications}
              renderItem={(notif) => (
                <List.Item
                  key={notif.id}
                  className={`hover:bg-gray-50 ${
                    notif.read ? "bg-white" : "bg-blue-50"
                  } rounded-md`}
                >
                  <div
                    className="flex items-center gap-3 p-2 sm:p-3 cursor-pointer w-full min-h-[3rem]"
                    onClick={() => handleNotificationClick(notif)}
                  >
                    <Avatar src={notif.userAvatar} size={40} />
                    <div className="flex-1">
                      <p className="text-[12px] sm:text-sm text-gray-900">
                        <span className="font-semibold">{notif.userName}</span>{" "}
                        {notif.message}
                      </p>
                      <p className="text-[10px] sm:text-xs text-gray-500">{notif.time}</p>
                    </div>
                  </div>
                </List.Item>
              )}
            />
          </InfiniteScroll>
        ) : (
          <div className="flex flex-col items-center justify-center p-4 mt-10">
            <Image
              src="/no_bell_alarm.svg"
              alt="No Notifications yet"
              className="max-w-md w-full h-auto"
              preview={false}
            />
            <div className="p-2 text-gray-500 text-xs sm:text-sm text-center">
              No notifications yet.
            </div>
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
        placement="bottomLeft"
        trigger="click"
        autoAdjustOverflow
      >
        <button className="bg-opacity-30 bg-gray-600 text-white rounded-full p-2">
          {getIcon("bell")}
        </button>
      </AntPopover>
    </AntBadge>
  );
};

export default Notification;
