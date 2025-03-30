import CreatePostIdea from "@/components/templates/CreatePostIdea";
import NavBarWrapper from "@/components/templates/NavBarWrapper";

const ProtectedLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen">
      <NavBarWrapper />

      <main className="pt-24">{children}</main>
    </div>
  );
};

export default ProtectedLayout;
