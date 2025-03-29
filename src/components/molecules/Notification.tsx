"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { getIcon } from "../atoms/Icon";
import Avatar from "../atoms/Avatar";
import { Divider, List, message, Skeleton } from "antd";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import {
  getNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from "@/lib/notification";
import { NotificationsResponseData } from "@/constant/type";
import Image from "../atoms/Image";
import InfiniteScroll from "react-infinite-scroll-component";
import Loading from "@/app/loading";

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

const NotificationComponent = () => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [pagination, setPagination] = useState<{
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  } | null>(null);
  const router = useRouter();
  const accessToken = Cookies.get("accessToken");

  // Fetch notifications from the API
  const fetchNotifications = async (page: number = 1, limit: number = 10) => {
    if (page === 1) {
      setLoading(true);
    }
    try {
      const res: NotificationsResponseData = await getNotifications(
        page,
        limit,
        accessToken
      );
      // Map the API response to the shape used in UI:
      const mappedNotifications: NotificationItem[] = res.notifications.map(
        (notif: any) => ({
          id: notif.id,
          userName: notif.fromUser?.name || "Unknown",
          userAvatar: "", // Update if your API returns an avatar URL
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
    // Fetch notifications on mount
    fetchNotifications();
    // Set an interval to refresh notifications every 30 seconds (60000 ms)
    const intervalId = setInterval(fetchNotifications, 30000);
    // Cleanup the interval on unmount
    return () => clearInterval(intervalId);
  }, []);

  // Count unread notifications
  const unreadCount = notifications.filter((n) => !n.read).length;

  // Mark all notifications as read and update state without re-fetching
  const handleMarkAllRead = async () => {
    try {
      await markAllNotificationsAsRead(accessToken);
      setNotifications((prev) =>
        prev.map((notif) => ({ ...notif, read: true }))
      );
      message.success("All notifications marked as read");
    } catch (error: any) {
      message.error(error.message || "Failed to mark all as read");
    }
  };

  // Handle clicking on a notification: mark it as read and route to the idea
  const handleNotificationClick = async (notif: NotificationItem) => {
    if (!notif.read) {
      try {
        console.log(notif.id);
        await markNotificationAsRead(notif.id, accessToken);

        setNotifications((prev) =>
          prev.map((n) => (n.id === notif.id ? { ...n, read: true } : n))
        );
      } catch (error: any) {
        message.error(error.message || "Failed to mark notification as read");
      }
    }
    if (notif.ideaId) {
      router.push(`/detail-page/?ideaId=${notif.ideaId}`);
    } else {
      message.info("No associated idea for this notification");
    }
  };

  const handleLoadMore = async () => {
    if (pagination && pagination.page < pagination.totalPages) {
      await fetchNotifications(pagination.page + 1, pagination.limit);
    }
  };

  const notificationContent = (
    <div className="w-80">
      <div className="flex justify-between items-center p-3 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
        <button
          onClick={handleMarkAllRead}
          className={
            unreadCount === 0
              ? "text-gray-300 text-sm font-medium"
              : "text-sm font-medium hover:underline"
          }
          disabled={unreadCount === 0}
        >
          Mark all read
        </button>
      </div>
      <div id="scrollableDiv" className="min-h-80 max-h-80 overflow-y-auto">
        {loading ? (
          <div className="flex justify-center p-3 mt-20">
            <div className="w-40 h-20">
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
            hasMore={
              pagination ? notifications.length < pagination.total : false
            }
            loader={<Loading />}
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
                    className="flex items-center gap-3 p-3 cursor-pointer w-full min-h-20"
                    onClick={() => handleNotificationClick(notif)}
                  >
                    <Avatar src={notif.userAvatar} size={40} />
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">
                        <span className="font-semibold">{notif.userName}</span>{" "}
                        {notif.message}
                      </p>
                      <p className="text-xs text-gray-500">{notif.time}</p>
                    </div>
                  </div>
                </List.Item>
              )}
            />
          </InfiniteScroll>
        ) : (
          // notifications.map((notif) => (
          //   <React.Fragment key={notif.id}>
          //     <div
          //       className={`flex items-center gap-3 p-3 cursor-pointer ${
          //         notif.read ? "bg-white" : "bg-blue-50"
          //       } rounded-md hover:bg-gray-50`}
          //       onClick={() => handleNotificationClick(notif)}
          //     >
          //       <Avatar src={notif.userAvatar} size={40} />
          //       <div className="flex-1">
          //         <p className="text-sm text-gray-900">
          //           <span className="font-semibold">{notif.userName}</span>{" "}
          //           {notif.message}
          //         </p>
          //         <p className="text-xs text-gray-500">{notif.time}</p>
          //       </div>
          //     </div>
          //     <Divider className="m-0" />
          //   </React.Fragment>
          // ))
          <div className="flex flex-col items-center justify-center p-4 mt-20">
            <Image
              src="/no_bell_alarm.svg"
              alt="No Notifications yet"
              className="max-w-md w-full h-auto"
              preview={false}
            />
            <div className="p-4 text-gray-500 text-sm text-center">
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

export default NotificationComponent;
