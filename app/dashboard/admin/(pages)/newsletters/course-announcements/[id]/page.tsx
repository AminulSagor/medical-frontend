import ComposeShell from "./_components/compose-shell";

export default async function BroadcastAnnouncementPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <ComposeShell id={id} />;
}
