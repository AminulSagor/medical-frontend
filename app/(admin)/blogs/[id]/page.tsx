import BlogDetailsClient from "./_components/blog-details-client";

type BlogDetailsPageProps = {
  params: Promise<{ id: string }>;
};

export default async function BlogDetailsPage({ params }: BlogDetailsPageProps) {
  const { id } = await params;
  return <BlogDetailsClient blogId={id} />;
}
