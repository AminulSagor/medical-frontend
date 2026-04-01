import BlogCreateClient from "../../create/_components/blog-create-client";

type EditBlogPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditBlogPage({ params }: EditBlogPageProps) {
  const { id } = await params;
  return <BlogCreateClient mode="edit" blogId={id} />;
}
