"use client";

import { useRef } from "react";
import NavBar from "@/components/organisms/NavBar";
import { CreatePostIdeaRef } from "@/components/templates/CreatePostIdea";
import CreatePostIdea from "@/components/templates/CreatePostIdea";

export default function NavBarWrapper() {
  const createPostIdeaRef = useRef<CreatePostIdeaRef>(null);

  return (
    <>
      <NavBar createPostIdeaRef={createPostIdeaRef} />
      {/* The CreatePostIdea component is mounted so the ref attaches,
          but its UI is hidden */}
      <div style={{ display: "none" }}>
        <CreatePostIdea ref={createPostIdeaRef} />
      </div>
    </>
  );
}
