"use client";
import dynamic from "next/dynamic";
import Image from "../atoms/Image";
import Tag from "../atoms/Tag";

const AntCard = dynamic(() => import("antd").then((mod) => mod.Card), {
  ssr: false,
});

interface DepartmentCardProps {
  image?: string;
  department?: string;
  academicYear?: string;
  submissionDate?: string;
  closureDate?: string;
  className?: string;
}

const DepartmentCard = ({
  image = "/classroom.png",
  department = "Department",
  academicYear = "2025/2026",
  submissionDate = "12.6.2025",
  closureDate = "12.6.2025",
  className = "",
}: DepartmentCardProps) => {
  return (
    <AntCard
      cover={<Image src={image} alt={department} />}
      className={`overflow-hidden ${className}`}
    >
      <div className="flex flex-col gap-4">
        <div>
          <Tag label={department} color="blue" className="text-body-xs mb-1" />
          <span className="font-semibold text-primary text-body-xl">
            {academicYear}
          </span>
        </div>

        <div className="flex flex-col">
          <span className="text-gray-500 text-body-xs">
            Final Idea Submission Date
          </span>
          <span className="font-semibold text-body-lg">{submissionDate}</span>
        </div>

        <div className="flex flex-col">
          <span className="text-gray-500 text-body-xs">
            Final Idea Submission Date
          </span>
          <span className="font-semibold text-body-lg">{closureDate}</span>
        </div>
      </div>
    </AntCard>
  );
};

export default DepartmentCard;
