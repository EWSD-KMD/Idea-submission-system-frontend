import React from "react";
import { Divider, Modal } from "antd";
import { getIcon } from "../atoms/Icon";
import { chveronLeftIcon } from "@/assets/icons";

interface CategoryModalProps {
  open: boolean;
  categories: string[];
  selectedCategory: string;
  onSelect: (category: string) => void;
  onCancel: () => void;
}

const CategoryModal: React.FC<CategoryModalProps> = ({
  open,
  categories,
  selectedCategory,
  onSelect,
  onCancel,
}) => {
  return (
    <Modal
      open={open}
      onCancel={onCancel}
      footer={null}
      title={null}
      closable={false}
      className=""
    >
      <div className="flex items-center pb-3">
        <div
          className="flex items-center justify-center w-8 h-8 rounded-md transition-colors duration-200 ease-in-out cursor-pointer hover:bg-black/5"
          onClick={onCancel}
        >
          {getIcon("chevronLeft")}
        </div>
        <span className="text-lg font-semibold">Add Category</span>
      </div>
      <Divider className="w-full m-0" />
      <div className="flex flex-col">
        {categories.map((cat, index) => (
          <React.Fragment key={cat}>
            <div
              className={`flex justify-between items-center px-4 py-3 cursor-pointer ${
                selectedCategory === cat
                  ? "bg-blue-100 text-blue-600 font-semibold"
                  : "bg-white"
              }`}
              onClick={() => onSelect(cat)}
            >
              <span>{cat}</span>
              <span
                className={
                  selectedCategory === cat ? "text-blue-600" : "text-gray-400"
                }
              >
                {selectedCategory === cat ? (
                  getIcon("checked", 18)
                ) : (
                  <span className="inline-block w-4 h-4 rounded-full border-2 border-gray-400"></span>
                )}
              </span>
            </div>
            {index < categories.length - 1 && (
              <Divider className="w-full m-0" />
            )}
          </React.Fragment>
        ))}
      </div>
    </Modal>
  );
};

export default CategoryModal;
