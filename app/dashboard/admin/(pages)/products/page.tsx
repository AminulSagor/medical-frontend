"use client";

import { useState } from "react";
import ProductStatCards from "./_components/product-stat-cards";
import ProductsTabsAndTable, {
  ExportMeta,
} from "./_components/products-tabs-and-table";
import ProductsToolbar from "./_components/products-toolbar";
import ExportInitiatedModal from "./_components/export-initiated-modal";
import PageTitle from "@/app/dashboard/admin/_components/page-title";

export default function ProductsPage() {
  const [openExport, setOpenExport] = useState(false);

  // ✅ comes from tabs (pill counts + current filter label)
  const [exportMeta, setExportMeta] = useState<ExportMeta>({
    totalRecords: 0,
    filterLabel: "All Products",
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <PageTitle
          title="Product Inventory"
          subtitle="Manage and track your clinical gear inventory"
        />
        <ProductsToolbar onExport={() => setOpenExport(true)} />
      </div>

      <ProductStatCards />

      <ProductsTabsAndTable onExportMetaChange={setExportMeta} />

      <ExportInitiatedModal
        open={openExport}
        onClose={() => setOpenExport(false)}
        totalRecords={exportMeta.totalRecords}
        filterLabel={exportMeta.filterLabel}
      />
    </div>
  );
}
