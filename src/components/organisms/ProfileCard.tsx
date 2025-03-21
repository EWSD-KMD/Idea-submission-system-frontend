"use client";
import dynamic from "next/dynamic";
import Tag from "../atoms/Tag";
import Avatar from "../atoms/Avatar";
import Button from "../atoms/Button";
import { getIcon } from "../atoms/Icon";
import Title from "antd/es/typography/Title";
import { useState } from "react";
import ProfileImageModal from "./ProfileImageModal";

const AntCard = dynamic(() => import("antd").then((mod) => mod.Card), {
  ssr: false,
});

interface ProfileCardProps {
  image?: string;
  name: string;
  department: string;
  email: string;
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

          <Tag label={department} color="blue" className="text-body-xs mb-1" />
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
