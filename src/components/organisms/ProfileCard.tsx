"use client";

import dynamic from "next/dynamic";
import Tag from "../atoms/Tag";
import Avatar from "../atoms/Avatar";
import Button from "../atoms/Button";
import { getIcon } from "../atoms/Icon";
import Title from "antd/es/typography/Title";
import { useState } from "react";
import ProfileImageModal from "./ProfileImageModal";
import { useResponsive } from "@/utils/responsive";
import { Skeleton } from "antd";
import { useUser } from "@/contexts/UserContext";

const AntCard = dynamic(() => import("antd").then((mod) => mod.Card), {
  ssr: false,
});

interface ProfileCardProps {}

const ProfileCard: React.FC<ProfileCardProps> = () => {
  const { isMobile } = useResponsive();
  const { profileImageUrl, userName, email, lastLoginTime, departmentName } =
    useUser();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState(profileImageUrl);

  // Format last login
  const formattedLoginTime = lastLoginTime
    ? (() => {
        const d = new Date(lastLoginTime);
        const dateStr = d.toLocaleDateString(undefined, {
          year: "numeric",
          month: "short",
          day: "2-digit",
        });
        const timeStr = d.toLocaleTimeString(undefined, {
          hour: "2-digit",
          minute: "2-digit",
        });
        return `${dateStr} ${timeStr}`;
      })()
    : "—";

  // Loading skeleton
  if (!userName || !email) {
    return (
      <AntCard className="overflow-hidden">
        {isMobile ? (
          <div className="flex gap-4">
            <div className="flex flex-col items-center mb-3">
              <Skeleton.Avatar size={80} active />
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex flex-col gap-2">
                <Skeleton.Input block active />
                <Skeleton.Input size="small" active />
              </div>
              <div className="flex flex-col">
                <span className="text-500 text-body-xs">Email</span>
                <Skeleton.Input size="small" block active />
              </div>
              <div className="flex flex-col">
                <span className="text-500 text-body-xs">Last Login</span>
                <Skeleton.Input size="small" block active />
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <div className="text-center">
              <div className="flex flex-col items-center mb-3">
                <Skeleton.Avatar size={120} active />
              </div>
              <div className="flex flex-col gap-1">
                <Skeleton.Input block active />

                <Skeleton.Input size="small" active />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-500 text-body-xs">Email</span>
              <Skeleton.Input size="small" block active />
            </div>

            <div className="flex flex-col">
              <span className="text-500 text-body-xs">Last Login</span>
              <Skeleton.Input size="small" block active />
            </div>
          </div>
        )}
      </AntCard>
    );
  }

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleSave = (newImage?: string | File) => {
    if (newImage instanceof File) {
      const previewUrl = URL.createObjectURL(newImage);
      setCurrentImage(previewUrl);
    } else if (newImage === null) {
      setCurrentImage(null);
    } else {
      setCurrentImage(currentImage);
    }
  };

  return (
    <AntCard className="overflow-hidden">
      {isMobile ? (
        <div className="flex gap-4">
          <div className="flex flex-col items-center mb-3">
            <Avatar size={80} src={profileImageUrl} label={userName} className="z-10" />
            <Button
              icon={getIcon("pencil", 16)}
              size="small"
              rounded={true}
              className="bg-white-200 p-2 rounded-full hover:bg-gray-200 shadow-md transition -mt-7 ml-14 z-20"
              onClick={showModal}
            />
          </div>
          <div className="flex flex-col gap-2">
            <div>
              <h5 className="font-semibold text-lg">{userName}</h5>
              <Tag
                label={departmentName || ""}
                color="blue"
                className="text-body-xs mb-1 rounded-lg border-none"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-500 text-body-xs">Email</span>
              <span className="font-semibold text-body-lg">{email}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-500 text-body-xs">Last Login</span>
              <span className="font-semibold text-body-lg">
                {formattedLoginTime}
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <div className="text-center">
            <div className="flex flex-col items-center mb-3">
              <Avatar size={120} src={profileImageUrl} label={userName} className="z-10" />
              <Button
                icon={getIcon("pencil", 16)}
                size="small"
                rounded={true}
                className="bg-white-200 p-2 rounded-full hover:bg-gray-200 shadow-md transition -mt-6 ml-16 z-20"
                onClick={showModal}
              />
            </div>
            <Title level={4}>{userName}</Title>
            <Tag
              label={departmentName || ""}
              color="blue"
              className="text-body-xs mb-1 rounded-lg border-none"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-500 text-body-xs">Email</span>
            <span className="font-semibold text-body-lg">{email}</span>
          </div>

          <div className="flex flex-col">
            <span className="text-500 text-body-xs">Last Login</span>
            <span className="font-semibold text-body-lg">
              {formattedLoginTime}
            </span>
          </div>
        </div>
      )}

      <ProfileImageModal
        visible={isModalOpen}
        onCancel={handleCancel}
        onSave={(newUrl) => {
          setCurrentImage(newUrl);
        }}
        currentImage={currentImage}
      />
    </AntCard>
  );
};

export default ProfileCard;
