"use client";
import SortingMenuTab from "@/components/molecules/SortingMenuTab";
import NavBar from "@/components/organisms/NavBar";
import UploadPostIdeaBox from "@/components/organisms/UploadPostIdeaBox";

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
      <SortingMenuTab
        items={menuItems}
        defaultSelected={["latest"]}
        defaultOpen={["sort"]}
        onChange={(key) => console.log(`Selected: ${key}`)}
      />
      <UploadPostIdeaBox />
    </div>
  );
};

export default Test;
