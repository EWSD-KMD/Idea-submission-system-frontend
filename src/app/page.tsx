"use client";

import { useRef } from "react";
import DepartmentCard from "@/components/organisms/DepartmentCard";
import NavBar from "@/components/organisms/NavBar";
import CreatePostIdea, {
  CreatePostIdeaRef,
} from "@/components/templates/CreatePostIdea";
import SortingMenu from "@/components/templates/SortingMenu";
import { Col, Row } from "antd";
import PostCardIdeaList from "@/components/templates/PostCardIdeaList";

export default function Home() {
  const createPostIdeaRef = useRef<CreatePostIdeaRef>(null);

  return (
    <div>
      <NavBar createPostIdeaRef={createPostIdeaRef} />
      <div className="mx-auto py-4 px-4 lg:px-20 xl:px-40">
        <Row gutter={24}>
          <Col span={4}>
            <SortingMenu />
          </Col>
          <Col span={16}>
            <CreatePostIdea ref={createPostIdeaRef} />
            <PostCardIdeaList />
          </Col>
          <Col span={4}>
            <DepartmentCard />
          </Col>
        </Row>
      </div>
    </div>
  );
}
