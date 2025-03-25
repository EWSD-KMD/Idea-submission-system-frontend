"use client";

import { useRef } from "react";
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
            {(screens.md || screens.lg || screens.xl) && (
              <Col xs={0} sm={0} md={6} lg={4} className="h-screen">
                <div className="fixed top-24 w-[inherit] max-h-[calc(100vh-6rem)] overflow-y-auto hide-scrollbar">
                  <SortingMenu />
                </div>
              </Col>
            )}

            <Col
              xs={24}
              sm={24}
              md={18}
              lg={16}
              className="flex flex-col gap-3"
            >
              <div className={currentPage === 1 ? "block" : "hidden"}>
                <CreatePostIdea ref={createPostIdeaRef} />
              </div>
              <PostCardIdeaList />
            </Col>

            {screens.lg && (
              <Col xs={0} sm={0} md={0} lg={4} className="h-screen">
                <div className="fixed top-24 w-[inherit]">
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
