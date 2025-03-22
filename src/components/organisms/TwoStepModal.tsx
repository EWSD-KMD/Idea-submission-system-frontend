"use client";

import React from "react";
import { Divider, Input, Modal } from "antd";
import AnonymousDropdown from "../molecules/AnonymousDropdown";
import TextArea from "antd/es/input/TextArea";
import Button from "../atoms/Button";
import { getIcon } from "../atoms/Icon";

interface TwoStepModalProps {
  visible: boolean;
  onCancel: () => void;
}

const TwoStepModal = ({ visible, onCancel }: TwoStepModalProps) => {
  const [title, setTitle] = React.useState("");
  const [body, setBody] = React.useState("");
  const [currentStep, setCurrentStep] = React.useState<number>(0);

  const nextStep = () => setCurrentStep(currentStep + 1);
  const prevStep = () => setCurrentStep(currentStep - 1);

  const steps = [
    {
      content: (
        <>
          <div className="flex flex-col">
            <AnonymousDropdown name="KSH" showName />
            <Divider className=" my-3" />
            <span className="text-body-xl font-bold mb-4">
              What do you want to share?
            </span>
            <Input
              placeholder="Title"
              className="mb-4"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <TextArea
              placeholder="Body"
              style={{ height: "180px" }}
              value={body}
              onChange={(e) => setBody(e.target.value)}
            />
            <Divider className=" my-4" />
            <div className="flex justify-between">
              <div className=" flex gap-2">
                <Button
                  icon={getIcon("layoutList")}
                  label="Add Category"
                  rounded
                  className=" text-primary"
                />
                <Button
                  icon={getIcon("wrapper", 20)}
                  label="Upload Media"
                  rounded
                  className=" text-primary"
                />
                <Button icon={getIcon("paperclip")} rounded />
              </div>
              <Button
                label="Post Idea"
                rounded
                type="primary"
                onClick={nextStep}
                disabled={title.trim() === "" || body.trim() === ""}
              />
            </div>
          </div>
        </>
      ),
    },
    {
      content: (
        <>
          <div className="flex items-center">
            <Button
              icon={getIcon("chevronLeft")}
              type="text"
              onClick={prevStep}
            />
            <span className="text-body-xl font-bold">Terms and Conditions</span>
          </div>
          <Divider className=" my-4" />
          <span>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborum.
          </span>
          <Divider className=" my-4" />
          <div className="flex justify-between">
            <div className="flex items-center">
              <Button
                icon={getIcon("checked", 16)}
                type="text"
                onClick={() => {}}
              />
              <span className="text-body-md">Don't show this again</span>
            </div>
            <div className="flex gap-2">
              <Button label="Cancel" onClick={onCancel} rounded />
              <Button
                type="primary"
                label="Continue"
                onClick={() => {}}
                rounded
              />
            </div>
          </div>
        </>
      ),
    },
  ];

  return (
    <>
      <Modal
        open={visible}
        onCancel={onCancel}
        width={600}
        footer={null}
        title={null}
      >
        {steps[currentStep].content}
      </Modal>
    </>
  );
};

export default TwoStepModal;
