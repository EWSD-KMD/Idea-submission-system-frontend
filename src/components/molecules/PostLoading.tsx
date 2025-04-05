"use client";

import React from "react";
import Card from "antd/es/card/Card";
import { Skeleton } from "antd";

const PostLoading = () => {
  return (
    <>
      <div className="space-y-4">
        <Card className="w-full cursor-pointer">
          <div className="space-y-3 sm:space-y-4">
            <div className="flex gap-2 items-center">
              <Skeleton.Avatar size="large" active />
              <Skeleton.Input active />
            </div>
            <Skeleton active />
            <div className="mb-4 w-full">
              <Skeleton.Image active />
            </div>

            <div className="flex justify-between items-center">
              <div className="flex gap-2">
                <Skeleton.Button shape="round" active />
                <Skeleton.Button shape="round" active />
                <Skeleton.Button shape="round" active />
              </div>
              <Skeleton.Button shape="round" active />
            </div>
          </div>
        </Card>
        <Card className="w-full cursor-pointer">
          <div className="space-y-3 sm:space-y-4">
            <div className="flex gap-2 items-center">
              <Skeleton.Avatar size="large" active />
              <Skeleton.Input active />
            </div>
            <Skeleton active />
            <div className="mb-4 w-full">
              <Skeleton.Image active />
            </div>

            <div className="flex justify-between items-center">
              <div className="flex gap-2">
                <Skeleton.Button shape="round" active />
                <Skeleton.Button shape="round" active />
                <Skeleton.Button shape="round" active />
              </div>
              <Skeleton.Button shape="round" active />
            </div>
          </div>
        </Card>
        <Card className="w-full cursor-pointer">
          <div className="space-y-3 sm:space-y-4">
            <div className="flex gap-2 items-center">
              <Skeleton.Avatar size="large" active />
              <Skeleton.Input active />
            </div>
            <Skeleton active />
            <div className="mb-4 w-full">
              <Skeleton.Image active />
            </div>

            <div className="flex justify-between items-center">
              <div className="flex gap-2">
                <Skeleton.Button shape="round" active />
                <Skeleton.Button shape="round" active />
                <Skeleton.Button shape="round" active />
              </div>
              <Skeleton.Button shape="round" active />
            </div>
          </div>
        </Card>
      </div>
    </>
  );
};

export default PostLoading;
