"use client";

import {
  useState,
  forwardRef,
  useImperativeHandle,
  Dispatch,
  SetStateAction,
} from "react";
import TwoStepModal from "../organisms/TwoStepModal";
import UploadPostIdeaBox from "../organisms/UploadPostIdeaBox";

export interface CreatePostIdeaRef {
  openModal: () => void;
}

interface CreatePostIdeaProps {
  setIsDataRefresh: Dispatch<SetStateAction<boolean>>;
}

const CreatePostIdea = forwardRef<CreatePostIdeaRef, CreatePostIdeaProps>(
  ({ setIsDataRefresh }, ref) => {
    const [showModal, setShowModal] = useState(false);

    const handleOpenModal = () => setShowModal(true);
    const handleCloseModal = () => setShowModal(false);

    useImperativeHandle(ref, () => ({
      openModal: handleOpenModal,
    }));

    return (
      <div>
        <UploadPostIdeaBox onOpenModal={handleOpenModal} />
        <TwoStepModal
          visible={showModal}
          onCancel={handleCloseModal}
          setIsDataRefresh={setIsDataRefresh}
        />
      </div>
    );
  }
);

CreatePostIdea.displayName = "CreatePostIdea";

export default CreatePostIdea;
