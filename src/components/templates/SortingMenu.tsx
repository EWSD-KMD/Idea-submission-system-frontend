"use client";
import SortingMenuTab from "../molecules/SortingMenuTab";

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
      { key: "allCtg", label: "All Categories" },
      { key: "ctg1", label: "Category 1" },
      { key: "ctg2", label: "Category 2" },
      { key: "allCtg", label: "All Categories" },
      { key: "ctg1", label: "Category 1" },
      { key: "ctg2", label: "Category 2" },
      { key: "allCtg", label: "All Categories" },
      { key: "ctg1", label: "Category 1" },
      { key: "ctg2", label: "Category 2" },
    ],
  },
];

const SortingMenu = () => {
  return (
    <SortingMenuTab
      items={menuItems}
      defaultSelected={["latest"]}
      defaultOpen={["sort"]}
      onChange={(key) => console.log(`Selected: ${key}`)}
    />
  );
};

export default SortingMenu;
