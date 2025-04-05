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

const AntCard = dynamic(() => import("antd").then((mod) => mod.Card), {
  ssr: false,
});

interface ProfileCardProps {
  image?: string;
  name: string | null;
  department: string | null;
  email: string | null;
  last_login: Date;
}

const ProfileCard = ({
  image = "/Media.jpg",
  name,
  department,
  email,
  last_login,
}: ProfileCardProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState(image);

  const { isMobile } = useResponsive();

  if (!name || !email) {
    return (
      <AntCard className="overflow-hidden">
        {isMobile ? (
          <div className="flex gap-4">
            <div className="flex flex-col items-center mb-3">
             <Skeleton.Avatar size={80} active/>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex flex-col gap-2">
                <Skeleton.Input block active/>
                <Skeleton.Input size="small" active/>
              </div>
              <div className="flex flex-col">
                <span className="text-500 text-body-xs">Email</span>
                <Skeleton.Input size="small" block active/>
              </div>
              <div className="flex flex-col">
                <span className="text-500 text-body-xs">Last Login</span>
                <Skeleton.Input size="small" block active/>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <div className="text-center">
              <div className="flex flex-col items-center mb-3">
                <Skeleton.Avatar size={120} active/>
              </div>
              <div className="flex flex-col gap-1">
                <Skeleton.Input block active/>

                <Skeleton.Input size="small" active/>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-500 text-body-xs">Email</span>
              <Skeleton.Input size="small" block active/>
            </div>

            <div className="flex flex-col">
              <span className="text-500 text-body-xs">Last Login</span>
              <Skeleton.Input size="small" block active/>
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
      setCurrentImage("/default.png");
    } else {
      setCurrentImage(currentImage);
    }
  };

  return (
    <AntCard className="overflow-hidden">
      {isMobile ? (
        <div className="flex gap-4">
          <div className="flex flex-col items-center mb-3">
            <Avatar size={80} src={image} className="z-10" />
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
              <h5 className="font-semibold text-lg">{name}</h5>
              <Tag
                label={department || ""}
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
                {last_login.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <div className="text-center">
            <div className="flex flex-col items-center mb-3">
              <Avatar size={120} src={image} className="z-10" />
              <Button
                icon={getIcon("pencil", 16)}
                size="small"
                rounded={true}
                className="bg-white-200 p-2 rounded-full hover:bg-gray-200 shadow-md transition -mt-6 ml-16 z-20"
                onClick={showModal}
              />
            </div>
            <Title level={4}>{name}</Title>

            <Tag
              label={department || ""}
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
              {last_login.toLocaleString()}
            </span>
          </div>
        </div>
      )}

      <ProfileImageModal
        visible={isModalOpen}
        onCancel={handleCancel}
        onSave={handleSave}
        currentImage={currentImage}
      />
    </AntCard>
  );
};

export default ProfileCard;
