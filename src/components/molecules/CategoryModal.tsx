import React, { useEffect, useState } from "react";
import { Divider, Modal, message } from "antd";
import { getIcon } from "../atoms/Icon";
import { getShowCategories } from "@/lib/category";

export interface Category {
  id: number;
  name: string;
}

interface CategoryModalProps {
  open: boolean;
  selectedCategoryId: number | null;
  onSelect: (category: Category) => void;
  onCancel: () => void;
}

const CategoryModal: React.FC<CategoryModalProps> = ({
  open,
  selectedCategoryId,
  onSelect,
  onCancel,
}) => {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    if (open) {
      loadCategories();
    }
  }, [open]);

  const loadCategories = async () => {
    try {
      const data = await getShowCategories();
      setCategories(data);
    } catch (error: any) {
      console.error("Error fetching categories:", error);
      message.error(error.message || "Something went wrong.");
    }
  };

  return (
    <Modal open={open} onCancel={onCancel} footer={null} title={null} closable={false}>
      <div className="flex items-center pb-3">
        <div
          className="flex items-center justify-center w-8 h-8 rounded-md cursor-pointer hover:bg-black/5"
          onClick={onCancel}
        >
          {getIcon("chevronLeft")}
        </div>
        <span className="text-lg font-semibold">Select Category</span>
      </div>
      <Divider className="w-full m-0" />

      
        <div className="flex flex-col">
          {categories.map((cat, index) => (
            <React.Fragment key={cat.id}>
              <div
                className={`flex justify-between items-center px-4 py-3 cursor-pointer ${
                  selectedCategoryId === cat.id ? "bg-blue-100 text-blue-600 font-semibold" : "bg-white"
                }`}
                onClick={() => onSelect(cat)}
              >
                <span>{cat.name}</span>
                <span className={selectedCategoryId === cat.id ? "text-blue-600" : "text-gray-400"}>
                  {selectedCategoryId === cat.id ? (
                    getIcon("checked", 18)
                  ) : (
                    <span className="inline-block w-4 h-4 rounded-full border-2 border-gray-400"></span>
                  )}
                </span>
              </div>
              {index < categories.length - 1 && <Divider className="w-full m-0" />}
            </React.Fragment>
          ))}
        </div>
    </Modal>
  );
};

export default CategoryModal;
