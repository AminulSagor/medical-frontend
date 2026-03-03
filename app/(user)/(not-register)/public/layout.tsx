import Footer from "@/components/layout/footer";
import Navbar from "@/components/layout/navbar";

interface Props {
  children: React.ReactNode;
}

const PublicLayout = ({ children }: Props) => {
  return (
    <div className="min-h-screen text-black">
      {/* Navbar overlay */}
      <div className="pointer-events-none fixed left-0 top-0 z-50 w-full">
        <div className="pointer-events-auto mx-auto padding pt-4">
          <Navbar />
        </div>
      </div>
      {/* Page content */}
      <main className="min-h-screen">{children}</main>
      <Footer />
    </div>
  );
};

export default PublicLayout;
