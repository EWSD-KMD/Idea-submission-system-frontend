"use client";

import NavBarWrapper from "@/components/templates/NavBarWrapper";
import ProfileCard from "@/components/organisms/ProfileCard";
import UserIdeaList from "@/components/templates/UserIdeaList";
import { useUser } from "@/contexts/UserContext";
import dynamic from "next/dynamic";

const Col = dynamic(() => import("antd").then((mod) => mod.Col), {
  ssr: false,
});

const Row = dynamic(() => import("antd").then((mod) => mod.Row), {
  ssr: false,
});

const Profile_Page = () => {

  return (
    <div>
      <NavBarWrapper />
      <div className="mx-auto py-4 px-4 lg:px-20 xl:px-40">
        <Row gutter={[24, 24]} className="relative">
          <Col xs={24} sm={24} md={7} lg={7}>
              <ProfileCard/>
          </Col>
          <Col xs={24} sm={24} md={17} lg={17}>
            <UserIdeaList />
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default Profile_Page;
