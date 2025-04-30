"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { getIcon } from "../atoms/Icon";
import { Divider, List, message } from "antd";
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
import Notification from "./Notification";

const AntBadge = dynamic(() => import("antd").then((mod) => mod.Badge), {
  ssr: false,
});
const AntPopover = dynamic(() => import("antd").then((mod) => mod.Popover), {
  ssr: false,
});

interface NotificationItem {
  id: number;
  fromUserId: number; // ← carry the userId
  userName: string;
  message: string;
  time: string;
  read: boolean;
  ideaId: number | null;
}

const NotificationBox = () => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [pagination, setPagination] = useState<{
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  } | null>(null);

  const [popoverOpen, setPopoverOpen] = useState(false);
  const router = useRouter();

  const fetchNotifications = async (page: number, limit: number) => {
    if (page === 1) setLoading(true);
    try {
      const res: NotificationsResponseData = await getNotifications(
        page,
        limit
      );
      const mapped = res.notifications.map((n: any) => ({
        id: n.id,
        fromUserId: n.fromUser?.id ?? 0, // ← grab their userId
        userName: n.fromUser?.name || "Unknown",
        message: n.message,
        time: new Date(n.createdAt).toLocaleTimeString(),
        read: n.isRead,
        ideaId: n.idea?.id || null,
      }));
      setNotifications((prev) => (page === 1 ? mapped : [...prev, ...mapped]));
      setPagination({
        page: res.page,
        limit: res.limit,
        total: res.total,
        totalPages: res.totalPages,
      });
    } catch (err: any) {
      message.error(err.message || "Failed to load notifications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications(1, 10);
  }, []);

  // only load page 1 once, the first time popover opens
  const handlePopoverOpenChange = (open: boolean) => {
    setPopoverOpen(open);
    if (open && notifications.length === 0) {
      fetchNotifications(1, 10);
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

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
    console.log("I am here")
    if (pagination && pagination.page < pagination.totalPages) {
      await fetchNotifications(pagination.page + 1, pagination.limit);
    }
  };

  const notificationContent = (
    <div className="w-60 sm:w-80">
      <div className="flex justify-between items-center px-2 sm:px-3 py-2 border-b border-gray-200">
        <h3 className="text-md sm:text-lg font-semibold text-gray-900">
          Notifications
        </h3>
        <button
          onClick={handleMarkAllRead}
          disabled={unreadCount === 0}
          className={
            unreadCount === 0
              ? "text-gray-300 text-[10px] sm:text-sm font-medium"
              : "text-[10px] sm:text-sm font-medium hover:underline"
          }
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
            hasMore={Boolean(pagination && notifications.length < pagination.total)}
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
                <Notification
                  key={notif.id}
                  notif={notif}
                  onClick={() => handleNotificationClick(notif)}
                />
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
    <AntBadge count={unreadCount > 9 ? "9+" : unreadCount} size="small">
      <AntPopover
        content={notificationContent}
        trigger="click"
        open={popoverOpen}
        onOpenChange={handlePopoverOpenChange}
        placement="bottomLeft"
        autoAdjustOverflow
        arrow
      >
        <button className="bg-opacity-30 bg-gray-600 text-white rounded-full p-2">
          {getIcon("bell")}
        </button>
      </AntPopover>
    </AntBadge>
  );
};

export default NotificationBox;
