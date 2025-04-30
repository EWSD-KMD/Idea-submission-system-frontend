"use client";

import { useEffect, useRef, useState } from "react";
import { Col, Grid, Row } from "antd";
import DepartmentCard from "@/components/organisms/DepartmentCard";
import CreatePostIdea, {
  CreatePostIdeaRef,
} from "@/components/templates/CreatePostIdea";
import SortingMenu from "@/components/templates/SortingMenu";
import PostCardIdeaList from "@/components/templates/PostCardIdeaList";
import { useSearchParams } from "next/navigation";
import NavBarWrapper from "./NavBarWrapper";
import SortingDropdown from "../molecules/SortingDropdown";
import { useUser } from "@/contexts/UserContext";

const { useBreakpoint } = Grid;

const HomeLayout = () => {
  const createPostIdeaRef = useRef<CreatePostIdeaRef>(null);
  const screens = useBreakpoint();
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;
  const {
    departmentName,
    academicYear,
    submissionDate,
    finalClosureDate,
    isSubmissionClose,
    isFinalClosure,
  } = useUser();

  const [selectedFilters, setSelectedFilters] = useState({
    sorting: "latest",
    department: "allDept",
    category: "allCtg",
  });

  const handleSelectionChange = (selected: {
    sorting: string;
    department: string;
    category: string;
  }) => {
    setSelectedFilters({
      sorting: selected.sorting,
      department: selected.department,
      category: selected.category,
    });
  };

  return (
    <div>
      <NavBarWrapper />
      <div className="pt-24">
        <div className="mx-auto px-4 lg:px-20 xl:px-40">
          <Row gutter={[24, 24]} className="relative">
            {/* Sorting Menu - Fixed Position */}
            {(screens.md || screens.lg || screens.xl) && (
              <Col xs={0} sm={0} md={6} lg={4}>
                <div className="sticky top-24 max-h-[calc(100vh-6rem)] overflow-y-auto hide-scrollbar">
                  <SortingMenu onSelectionChange={handleSelectionChange} />
                </div>
              </Col>
            )}

            {/* Main Content - Scrollable */}
            <Col xs={24} sm={24} md={18} lg={16}>
              <div className="max-h-[calc(100vh-6rem)] overflow-y-auto hide-scrollbar">
                {currentPage === 1 && !isSubmissionClose && (
                  <div className="pb-3">
                    <CreatePostIdea ref={createPostIdeaRef} />
                  </div>
                )}
                {!screens.md && (
                  <div className="flex justify-start py-1">
                    <SortingDropdown onFiltersChange={handleSelectionChange} />
                  </div>
                )}
                <PostCardIdeaList
                  sortBy={
                    selectedFilters.sorting === "latest"
                      ? undefined
                      : selectedFilters.sorting
                  }
                  departmentId={
                    selectedFilters.department === "allDept"
                      ? undefined
                      : selectedFilters.department
                  }
                  categoryId={
                    selectedFilters.category === "allCtg"
                      ? undefined
                      : selectedFilters.category
                  }
                />
              </div>
            </Col>

            {/* Department Card - Fixed Position */}
            {screens.lg && (
              <Col xs={0} sm={0} md={0} lg={4}>
                <div className="sticky top-24">
                  <DepartmentCard
                    department={departmentName ?? undefined}
                    academicYear={academicYear}
                    submissionDate={submissionDate}
                    finalClosureDate={finalClosureDate}
                    isSubmissionClose={isSubmissionClose}
                    isFinalClosure={isFinalClosure}
                  />
                </div>
              </Col>
            )}
          </Row>
        </div>
      </div>
    </div>
  );
};
export default HomeLayout;
