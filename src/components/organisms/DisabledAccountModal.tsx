// src/components/DisabledAccountModal.tsx
"use client";

import React, { useEffect } from "react";
import { Modal } from "antd";
import { useErrorStore } from "@/utils/errorStore";
import { useAuth } from "@/contexts/AuthContext";

export function DisabledAccountModal() {
  const disabledError = useErrorStore((s) => s.disabledError);
  const setDisabledError = useErrorStore((s) => s.setDisabledError);
  const { logoutUser } = useAuth();

  useEffect(() => {
    if (!disabledError) return;

    Modal.error({
      icon: null,
      width: 400,
      centered: true,
      title: "Account Blocked",
      content: (
        <div>
          <p>You no longer have access to your account.</p>
          <p>
            Your account has been blocked due to violations of our community
            guidelines. This may include:
          </p>
          <div className="mt-4">
            <ul
              style={{
                margin: 0,
                paddingLeft: "1.5em",
                listStyleType: "disc",
              }}
            >
              <li>Posting offensive or inappropriate content</li>
              <li>Engaging in harassment or bullying</li>
              <li>Sharing misleading or false information</li>
              <li>Violating privacy policies</li>
              <li>Spamming or posting irrelevant content</li>
            </ul>
          </div>
        </div>
      ),
      okText: "Close",
      onOk() {
        // reset the flag and redirect to login
        setDisabledError(false);
        logoutUser();
      },
      okButtonProps: { shape: "round" },
    });
  }, [disabledError, setDisabledError]);

  return null;
}
