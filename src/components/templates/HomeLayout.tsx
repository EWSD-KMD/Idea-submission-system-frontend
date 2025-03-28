"use client";

import { useRef, useState } from "react";
import { Col, Grid, Row } from "antd";
import DepartmentCard from "@/components/organisms/DepartmentCard";
import NavBar from "@/components/organisms/NavBar";
import CreatePostIdea, {
  CreatePostIdeaRef,
} from "@/components/templates/CreatePostIdea";
import SortingMenu from "@/components/templates/SortingMenu";
import PostCardIdeaList from "@/components/templates/PostCardIdeaList";
import { useSearchParams } from "next/navigation";

const { useBreakpoint } = Grid;

const HomeLayout = () => {
  const createPostIdeaRef = useRef<CreatePostIdeaRef>(null);
  const screens = useBreakpoint();
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;

  return (
    <div>
      <NavBar createPostIdeaRef={createPostIdeaRef} />
      <div className="pt-24">
        <div className="mx-auto px-4 lg:px-20 xl:px-40">
          <Row gutter={[24, 24]} className="relative">
            {/* Sorting Menu - Fixed Position */}
            {(screens.md || screens.lg || screens.xl) && (
              <Col xs={0} sm={0} md={6} lg={4}>
                <div className="sticky top-24 max-h-[calc(100vh-6rem)] overflow-y-auto hide-scrollbar">
                  <SortingMenu />
                </div>
              </Col>
            )}

            {/* Main Content - Scrollable */}
            <Col xs={24} sm={24} md={18} lg={16} className="min-h-screen">
              {currentPage === 1 && (
                <div className="pb-3">
                  <CreatePostIdea ref={createPostIdeaRef} />
                </div>
              )}
              <PostCardIdeaList />
            </Col>

            {/* Department Card - Fixed Position */}
            {screens.lg && (
              <Col xs={0} sm={0} md={0} lg={4}>
                <div className="sticky top-24">
                  <DepartmentCard />
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
