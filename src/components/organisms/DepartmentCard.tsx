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
  academicYear?: number | null;
  submissionDate?: string | null;
  finalClosureDate?: string | null;
  isSubmissionClose?: boolean;
  isFinalClosure?: boolean;
  className?: string;
}

const DepartmentCard = ({
  image = "/classroom.png",
  department = "Department",
  academicYear,
  submissionDate,
  finalClosureDate,
  isSubmissionClose,
  isFinalClosure,
  className = "",
}: DepartmentCardProps) => {
  return (
    <AntCard
      cover={<Image src={image} alt={department} />}
      className={`overflow-hidden ${className}`}
    >
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <Tag
            label={department}
            color="blue"
            className="text-body-sm mb-1 rounded-lg border-none inline-block w-fit"
          />
          <span className="font-semibold text-primary text-body-xl">
            {academicYear && `${academicYear}/${academicYear + 1}`}
          </span>
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-gray-500 text-body-xs">
            Final Idea Submission Date
          </span>
          <span
            className={`${
              isSubmissionClose ? "text-red-500" : ""
            } font-semibold text-body-lg`}
          >
            {submissionDate &&
              new Date(submissionDate).toLocaleDateString("en-CA")}
          </span>
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-gray-500 text-body-xs">
            Final Idea Submission Date
          </span>
          <span
            className={`${
              isFinalClosure ? "text-red-500" : ""
            } font-semibold text-body-lg`}
          >
            {finalClosureDate &&
              new Date(finalClosureDate).toLocaleDateString("en-CA")}
          </span>
        </div>
      </div>
    </AntCard>
  );
};

export default DepartmentCard;
