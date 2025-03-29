"use client";

import { useRef, useEffect, useState } from "react";
import { Col, Grid, Row } from "antd";
import DepartmentCard from "@/components/organisms/DepartmentCard";
import NavBar from "@/components/organisms/NavBar";
import CreatePostIdea, {
  CreatePostIdeaRef,
} from "@/components/templates/CreatePostIdea";
import SortingMenu from "@/components/templates/SortingMenu";
import PostCard from "@/components/organisms/PostCard"; // Your PostCard component
import { useSearchParams } from "next/navigation";
import Loading from "@/app/loading";
import { getIdeaById } from "@/lib/idea";
import { Idea } from "@/constant/type";

const { useBreakpoint } = Grid;

const DetailLayout = () => {
  const createPostIdeaRef = useRef<CreatePostIdeaRef>(null);
  const screens = useBreakpoint();
  const searchParams = useSearchParams();
  const ideaId = Number(searchParams.get("ideaId"));

  const [idea, setIdea] = useState<Idea | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (ideaId) {
      setLoading(true);
      getIdeaById(ideaId)
        .then((response) => {
          setIdea(response.data);
          console.log(idea);
        })
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [ideaId]);

  if (!idea) return <Loading />;

  return (
    <div>
      <NavBar createPostIdeaRef={createPostIdeaRef} />
      <div className="pt-24">
        <div className="mx-auto px-4 lg:px-20 xl:px-40">
          <Row gutter={[24, 24]} className="relative">
            {/* Sorting Menu - Fixed Position */}
            {(screens.md || screens.lg || screens.xl) && (
              <Col xs={0} sm={0} md={6} lg={4}>
                <div className="sticky top-24 max-h-[calc(100vh-6rem)] overflow-y-auto hide-scrollbar">
                  <SortingMenu />
                </div>
              </Col>
            )}

            {/* Main Content - Scrollable */}
            <Col xs={24} sm={24} md={18} lg={16} className="min-h-screen">
              {/* Hide CreatePostIdea for detail view */}
              <div className="pb-3 hidden">
                <CreatePostIdea ref={createPostIdeaRef} />
              </div>
              {/* Render the PostCard component with the fetched idea data */}
              {loading ? (
                <Loading />
              ) : (
                <PostCard
                  id={idea.id}
                  title={idea.title}
                  description={idea.description}
                  userName={idea.user.name}
                  departmentName={idea.department.name}
                  createdAt={idea.createdAt}
                  likes={idea.likes}
                  dislikes={idea.dislikes}
                  views={idea.views}
                  imageSrc={idea.imageSrc || undefined}
                  commentsCount={idea.comments.length}
                />
              )}
            </Col>

            {/* Department Card - Fixed Position */}
            {screens.lg && (
              <Col xs={0} sm={0} md={0} lg={4}>
                <div className="sticky top-24">
                  <DepartmentCard />
                </div>
              </Col>
            )}
          </Row>
        </div>
      </div>
    </div>
  );
};

export default DetailLayout;
