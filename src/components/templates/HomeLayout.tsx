"use client";

import { useEffect, useRef, useState } from "react";
import { Col, Grid, Modal, Row } from "antd";
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
import { useAuth } from "@/contexts/AuthContext";
import Button from "../atoms/Button";
import Cookies from "js-cookie";

const { useBreakpoint } = Grid;

const HomeLayout = () => {
  const createPostIdeaRef = useRef<CreatePostIdeaRef>(null);
  const screens = useBreakpoint();
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;
  const [mounted, setMounted] = useState<boolean>(false);
  const {
    departmentName,
    academicYear,
    submissionDate,
    finalClosureDate,
    isSubmissionClose,
    isFinalClosure,
  } = useUser();

  const { isFirstLogin } = useAuth();
  console.log("isFirst", isFirstLogin);
  const [showFirstLoginModal, setShowFirstLoginModal] = useState(true);

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

  useEffect(() => {
    if (isFirstLogin) {
      setShowFirstLoginModal(true);
      setMounted(true);
    }
  }, [isFirstLogin]);

  const handleCloseModal = () => {
    setShowFirstLoginModal(false);
    Cookies.set("isFirstLogin", "false");
  };

  return (
    <>
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
                      <SortingDropdown
                        onFiltersChange={handleSelectionChange}
                      />
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
      {mounted && (
        <Modal
          open={showFirstLoginModal}
          footer={null}
          closable={false}
          centered
          className="rounded-2xl shadow-lg"
        >
          <div className="flex flex-col items-center gap-4 p-6 text-center">
            <h2 className="text-2xl font-bold text-primary">
              Welcome aboard !!! 🎉
            </h2>

            <p className="text-gray-600 text-sm">
              You’ve just joined a platform built for sharing, innovating, and
              growing ideas together.
            </p>

            <p className="text-gray-600 text-sm">
              Go ahead and post your first idea or explore what others are
              thinking!
            </p>

            <Button
              onClick={handleCloseModal}
              type="primary"
              label="Let's get started!"
            />
          </div>
        </Modal>
      )}
    </>
  );
};
export default HomeLayout;
