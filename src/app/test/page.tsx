"use client";
import Image from "@/components/atoms/Image";
import Tag from "@/components/atoms/Tag";
import SortingMenuTab from "@/components/molecules/SortingMenuTab";
import NavBar from "@/components/organisms/NavBar";
import UploadPostIdeaBox from "@/components/organisms/UploadPostIdeaBox";
import DepartmentCard from "@/components/organisms/DepartmentCard";
import dynamic from "next/dynamic";

const Row = dynamic(() => import("antd").then((mod) => mod.Row), {
  ssr: false,
});

const Col = dynamic(() => import("antd").then((mod) => mod.Col), {
  ssr: false,
});

const menuItems = [
  {
    key: "sorting",
    label: "Sort By",
    children: [
      { key: "latest", label: "Latest" },
      { key: "popular", label: "Most Popular" },
      { key: "viewed", label: "Most Viewed" },
    ],
  },
  {
    key: "departments",
    label: "Department",
    children: [
      { key: "allDept", label: "All Departments" },
      { key: "dept1", label: "Department 1" },
      { key: "dept2", label: "Department 2" },
    ],
  },
  {
    key: "categories",
    label: "Category",
    children: [
      { key: "allCtg", label: "All Categories" },
      { key: "ctg1", label: "Category 1" },
      { key: "ctg2", label: "Category 2" },
    ],
  },
];
const Test = () => {
  return (
    <div>
      <NavBar />

      {/* Main content with Ant Design Grid */}
      <div className="mx-auto py-4 px-4 lg:px-20 xl:px-40">
        <Row gutter={24}>
          <Col span={4}>
            <SortingMenuTab
              items={menuItems}
              defaultSelected={["latest"]}
              defaultOpen={["sort"]}
              onChange={(key) => console.log(`Selected: ${key}`)}
            />
          </Col>

          <Col span={16}>
            <UploadPostIdeaBox />
          </Col>

          <Col span={4}>
            <DepartmentCard />
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default Test;
