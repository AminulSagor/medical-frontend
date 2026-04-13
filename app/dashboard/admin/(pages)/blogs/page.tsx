import { Suspense } from "react";
import BlogsClient from "./_components/blogs-management/blogs-client";

export default function BlogsPage() {
  return (
    <Suspense fallback={null}>
      <BlogsClient />
    </Suspense>
  );
}
