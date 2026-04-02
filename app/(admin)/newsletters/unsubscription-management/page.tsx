import { getMockUnsubPageData } from "./_lib/mock-data";
import PageShell from "./_components/page-shell";

export default async function UnsubscriptionManagementPage() {
  const data = getMockUnsubPageData();
  return <PageShell data={data} />;
}
