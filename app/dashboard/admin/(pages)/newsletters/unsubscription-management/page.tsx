import { getMockUnsubPageData } from "./_lib/mock-data";
import { getUnsubscribeRequestsServer } from "@/service/admin/newsletter/general-newsletter/subscribes/unsubscription-management.server.service";
import PageShell from "./_components/page-shell";

export const dynamic = "force-dynamic";

export default async function UnsubscriptionManagementPage() {
  const data = await (async () => {
    try {
      const [requestedResponse, unsubscribedResponse] = await Promise.all([
        getUnsubscribeRequestsServer({ tab: "requested", page: 1, limit: 10 }),
        getUnsubscribeRequestsServer({
          tab: "unsubscribed",
          page: 1,
          limit: 10,
        }),
      ]);

      return {
        metrics: requestedResponse.cards,
        requested: requestedResponse.items,
        requestedMeta: requestedResponse.meta,
        unsubscribed: unsubscribedResponse.items,
        unsubscribedMeta: unsubscribedResponse.meta,
      };
    } catch (error) {
      console.error("Failed to load unsubscribe requests:", error);
      return getMockUnsubPageData();
    }
  })();

  return <PageShell data={data} />;
}
