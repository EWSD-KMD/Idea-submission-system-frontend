import React, { useEffect, useState } from "react";
import { Divider, Modal, message } from "antd";
import { getIcon } from "../atoms/Icon";
import { getShowCategories } from "@/lib/category";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

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
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (open) {
      loadCategories();
    }
  }, [open]);

  const loadCategories = async () => {
    setLoading(true);
    try {
      const data = await getShowCategories();
      setCategories(data);
    } catch (error: any) {
      console.error("Error fetching categories:", error);
      message.error(error.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      onCancel={onCancel}
      footer={null}
      title={null}
      closable={false}
    >
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
      {loading ? (
        <div className="flex items-center justify-center">
          <div className="w-20 h-20">
            <DotLottieReact
              src="https://lottie.host/fce7f0b5-ed51-4cf5-b87c-c54e181f2423/Q5CUbjHeB0.lottie"
              loop
              autoplay
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
              }}
            />
          </div>
        </div>
      ) : (
        <div className="flex flex-col">
          {categories.map((cat, index) => (
            <React.Fragment key={cat.id}>
              <div
                className={`flex justify-between items-center px-4 py-3 cursor-pointer ${
                  selectedCategoryId === cat.id
                    ? "bg-blue-100 text-blue-600 font-semibold"
                    : "bg-white"
                }`}
                onClick={() => onSelect(cat)}
              >
                <span>{cat.name}</span>
                <span
                  className={
                    selectedCategoryId === cat.id
                      ? "text-blue-600"
                      : "text-gray-400"
                  }
                >
                  {selectedCategoryId === cat.id ? (
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
      )}
    </Modal>
  );
};

export default CategoryModal;
