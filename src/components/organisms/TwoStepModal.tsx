"use client";

import React from "react";
import Avatar from "../atoms/Avatar";
import { Modal } from "antd";
import AnonymousDropdown from "../molecules/AnonymousDropdown";

interface TwoStepModalProps {
  visible: boolean;
  onCancel: () => void;
}

const TwoStepModal = ({ visible, onCancel }: TwoStepModalProps) => {
  const [title, setTitle] = React.useState("");
  const [body, setBody] = React.useState("");
  const [agree, setAgree] = React.useState(false);
  const [currentStep, setCurrentStep] = React.useState<number>(0);

  const nextStep = () => setCurrentStep(currentStep + 1);
  const prevStep = () => setCurrentStep(currentStep - 1);

  const steps = [
    {
      title: "What do you want to share?",
      content: (
        <>
          <div>
            <AnonymousDropdown name="KSH" showName />
          </div>
        </>
      ),
    },
    {
      title: "Terms & Conditions",
      content: (
        <>
          <span>hi</span>
        </>
      ),
    },
  ];

  return (
    <>
      <Modal open={visible} onCancel={onCancel}>
        {steps[currentStep].content}
      </Modal>
    </>
  );
};

export default TwoStepModal;
