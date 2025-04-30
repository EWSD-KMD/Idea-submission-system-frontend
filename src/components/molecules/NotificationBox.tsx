// NotificationBox.tsx
"use client";

import React, { useEffect, useState, useRef, UIEvent } from "react";
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
import Notification from "./Notification";

const AntBadge = dynamic(() => import("antd").then((mod) => mod.Badge), {
  ssr: false,
});
const AntPopover = dynamic(() => import("antd").then((mod) => mod.Popover), {
  ssr: false,
});

interface NotificationItem {
  id: number;
  fromUserId: number;
  userName: string;
  message: string;
  time: string;
  read: boolean;
  ideaId: number | null;
}

export default function NotificationBox() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState<{
    page: number;
    limit: number;
    totalPages: number;
  } | null>(null);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const router = useRouter();
  const scrollRef = useRef<HTMLDivElement>(null);

  // fetch a page
  const fetchNotifications = async (page: number, limit: number) => {
    setLoading(true);
    try {
      const res: NotificationsResponseData = await getNotifications(
        page,
        limit
      );
      const mapped = res.notifications.map((n: any) => ({
        id: n.id,
        fromUserId: n.fromUser?.id ?? 0,
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
        totalPages: res.totalPages,
      });
    } catch (err: any) {
      message.error(err.message || "Failed to load notifications");
    } finally {
      setLoading(false);
    }
  };

  // initial load on mount
  useEffect(() => {
    fetchNotifications(1, 10);
  }, []);

  // when popover opens, optionally reload page 1 if empty
  const handleOpenChange = (open: boolean) => {
    setPopoverOpen(open);
    if (open && notifications.length === 0) {
      fetchNotifications(1, 10);
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;
  const hasMore =
    pagination !== null && pagination.page < pagination.totalPages;

  const handleMarkAllRead = async () => {
    try {
      await markAllNotificationsAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
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
      message.info("No associate Idea for this Notification!");
    }
  };

  // manual infinite-scroll via onScroll
  const onScroll = (e: UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    if (
      !loading &&
      hasMore &&
      el.scrollTop + el.clientHeight >= el.scrollHeight - 20
    ) {
      fetchNotifications((pagination?.page ?? 1) + 1, 10);
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

      <div ref={scrollRef} onScroll={onScroll} className="h-80 overflow-y-auto">
        {notifications.length === 0 && !loading ? (
          <div className="flex flex-col items-center justify-center p-4 mt-20">
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
        ) : (
          <List
            dataSource={notifications}
            renderItem={(notif) => (
              <Notification
                key={notif.id}
                notif={notif}
                onClick={() => {
                  handleNotificationClick(notif);
                }}
              />
            )}
          />
        )}

        {loading && (
          <div className="flex justify-center p-2">
            <DotLottieReact
              src="https://lottie.host/fce7f0b5-ed51-4cf5-b87c-c54e181f2423/Q5CUbjHeB0.lottie"
              loop
              autoplay
              style={{ width: 48, height: 48 }}
            />
          </div>
        )}

        {!hasMore && !loading && notifications.length > 0 && (
          <Divider plain>It is all, nothing more 🤐</Divider>
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
        onOpenChange={handleOpenChange}
        placement="bottomLeft"
        arrow
      >
        <button className="bg-opacity-30 bg-gray-600 text-white rounded-full p-2">
          {getIcon("bell")}
        </button>
      </AntPopover>
    </AntBadge>
  );
}
