"use client";

import NavBar from "@/components/organisms/NavBar";
import ProfileCard from "@/components/organisms/ProfileCard";
import PostCard from "@/components/organisms/PostCard";
import dynamic from "next/dynamic";

const Row = dynamic(() => import("antd").then((mod) => mod.Row), {
  ssr: false,
});

const Col = dynamic(() => import("antd").then((mod) => mod.Col), {
  ssr: false,
});

const Profile_Page = () => {
    return (
        <div>
            <NavBar/>
            <div className="mx-auto py-4 px-4 lg:px-20 xl:px-40">
                <Row gutter={24}>
                    <Col span={6}>
                        <ProfileCard name="Dianne Russell" department="Department" email="example@gmail.com" last_login={new Date(Date.now())}/>
                    </Col>
                    <Col span={18}>
                        <PostCard/>
                    </Col>
                 </Row>
            </div>
        </div>
    );
};

export default Profile_Page;

