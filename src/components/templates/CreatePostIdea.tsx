"use client";

import { useState } from "react";
import UploadPostIdeaBox from "../organisms/UploadPostIdeaBox";
import TwoStepModal from "../organisms/TwoStepModal";

const CreatePostIdea = () => {
  const [showModal, setShowModal] = useState(false);

  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  return (
    <div>
      <UploadPostIdeaBox onOpenModal={handleOpenModal} />
      <TwoStepModal visible={showModal} onCancel={handleCloseModal} />
    </div>
  );
};

export default CreatePostIdea;
