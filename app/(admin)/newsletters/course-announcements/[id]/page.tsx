import ComposeShell from "./_components/compose-shell";
import { getMockComposeData } from "./_lib/compose-mock";


export default async function BroadcastAnnouncementPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const data = getMockComposeData(id);

  return <ComposeShell data={data} />;
}