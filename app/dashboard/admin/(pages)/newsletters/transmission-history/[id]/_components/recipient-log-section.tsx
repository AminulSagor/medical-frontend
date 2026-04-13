import RecipientLogTable from "@/app/dashboard/admin/(pages)/newsletters/transmission-history/[id]/_components/recipient-log-table";
import RecipientLogTabs from "@/app/dashboard/admin/(pages)/newsletters/transmission-history/[id]/_components/recipient-log-tabs";
import RecipientLogToolbar from "@/app/dashboard/admin/(pages)/newsletters/transmission-history/[id]/_components/recipient-log-toolbar";
import type {
  RecipientLogTab,
  TransmissionReportRecipientLogItem,
  TransmissionReportRecipientLogMeta,
} from "@/types/admin/newsletter/dashboard/transmission-report.types";

type RecipientTabCounts = Partial<Record<RecipientLogTab, number>>;

type Props = {
  activeTab: RecipientLogTab;
  onTabChange: (tab: RecipientLogTab) => void;
  searchValue: string;
  onSearchChange: (value: string) => void;
  items: TransmissionReportRecipientLogItem[];
  meta: TransmissionReportRecipientLogMeta | null;
  isLoading: boolean;
  page: number;
  onPageChange: (page: number) => void;
  tabCounts?: RecipientTabCounts;
};

export default function RecipientLogSection({
  activeTab,
  onTabChange,
  searchValue,
  onSearchChange,
  items,
  meta,
  isLoading,
  page,
  onPageChange,
  tabCounts,
}: Props) {
  return (
    <section className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.06)]">
      <div className="border-b border-slate-100 px-5 pt-5 md:px-7 md:pt-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0">
            <h2 className="text-base font-semibold text-slate-900 md:text-[18px]">
              Recipient Log
            </h2>
          </div>

          <RecipientLogToolbar
            searchValue={searchValue}
            onSearchChange={onSearchChange}
          />
        </div>

        <div className="mt-4">
          <RecipientLogTabs
            activeTab={activeTab}
            onTabChange={onTabChange}
            counts={tabCounts}
          />
        </div>
      </div>

      <RecipientLogTable
        items={items}
        meta={meta}
        isLoading={isLoading}
        page={page}
        onPageChange={onPageChange}
      />
    </section>
  );
}
