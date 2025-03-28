"use client";

import { useState, forwardRef, useImperativeHandle } from "react";
import TwoStepModal from "../organisms/TwoStepModal";
import UploadPostIdeaBox from "../organisms/UploadPostIdeaBox";

export interface CreatePostIdeaRef {
  openModal: () => void;
}

const CreatePostIdea = forwardRef<CreatePostIdeaRef>((props, ref) => {
  const [showModal, setShowModal] = useState(false);

  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  useImperativeHandle(ref, () => ({
    openModal: handleOpenModal,
  }));

  return (
    <div>
      <UploadPostIdeaBox onOpenModal={handleOpenModal} />
      <TwoStepModal visible={showModal} onCancel={handleCloseModal} />
    </div>
  );
});

CreatePostIdea.displayName = "CreatePostIdea";

export default CreatePostIdea;
