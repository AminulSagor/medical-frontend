"use client";

import { useParams } from "next/navigation";
import EditBlogPostPage from "@/app/dashboard/admin/(pages)/blogs/edit/_components/edit-blog-post-page";

export default function Page() {
  const params = useParams<{ id: string }>();

  if (!params?.id) {
    return null;
  }

  return <EditBlogPostPage blogId={params.id} />;
}
