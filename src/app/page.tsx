import DepartmentCard from "@/components/organisms/DepartmentCard";
import NavBar from "@/components/organisms/NavBar";
import PostCard from "@/components/organisms/PostCard";
import CreatePostIdea from "@/components/templates/CreatePostIdea";
import SortingMenu from "@/components/templates/SortingMenu";
import { Col, Row } from "antd";

export default function Home() {
  return (
    <div>
      <NavBar />
      <div className="mx-auto py-4 px-4 lg:px-20 xl:px-40">
        <Row gutter={24}>
          <Col span={4}>
            <SortingMenu />
          </Col>
          <Col span={16}>
            <CreatePostIdea />
            <PostCard />
          </Col>
          <Col span={4}>
            <DepartmentCard />
          </Col>
        </Row>
      </div>
    </div>
  );
}
