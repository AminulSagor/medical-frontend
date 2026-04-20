import { Suspense } from "react";
import CreateBlogPostPage from "./_components/create-blog-post-page";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CreateBlogPostPage />;
    </Suspense>
  );
}
