"use client";

import { useEffect, useMemo, useState } from "react";
import ProductsTable, { ProductRow } from "./products-table";
import ProductsTableToolbar from "./products-table-toolbar";

type TabKey = "all" | "active" | "outOfStock" | "lowStock" | "drafts";

export type ExportMeta = {
    totalRecords: number;
    filterLabel: string;
};

const PAGE_SIZE = 4;

// ✅ placeholder rows (replace with API later)
const SEED: ProductRow[] = [
    {
        id: "p1",
        name: "Laryngeal Mask Airway Supreme",
        category: "Airway Management",
        sku: "TAI-001-SZ4",
        stock: 142,
        price: 45.0,
        sales: 1204,
        updatedLabel: "Oct 24, 2023",
        status: "active",
        stockTone: "good",
        imageUrl: "/photos/laryngeal-mask-airway.png",
    },
    {
        id: "p2",
        name: "Digital Pulse Oximeter",
        category: "Diagnostic Instruments",
        sku: "TAI-DPO-X2",
        stock: 45,
        price: 29.99,
        sales: 856,
        updatedLabel: "2 hours ago",
        status: "active",
        stockTone: "warn",
        imageUrl: "/photos/diagnostic-pen.png",
    },
    {
        id: "p3",
        name: "Sterile Surgical Gloves (L)",
        category: "Surgical Supplies",
        sku: "TAI-GLV-L",
        stock: 0,
        price: 12.5,
        sales: 4500,
        updatedLabel: "Nov 01, 2023",
        status: "active",
        stockTone: "bad",
        imageUrl: "/photos/child.png",
    },
    {
        id: "p4",
        name: "Portable AED - DefibTech",
        category: "Emergency Care",
        sku: "—",
        stock: null,
        price: null,
        sales: null,
        updatedLabel: "Just now",
        status: "draft",
        stockTone: "draft",
        imageUrl: "/photos/image.png",
    },
    {
        id: "p5",
        name: "Disposable Syringe 5ml",
        category: "Surgical Supplies",
        sku: "TAI-SYR-5ML",
        stock: 320,
        price: 3.5,
        sales: 7850,
        updatedLabel: "1 day ago",
        status: "active",
        stockTone: "good",
        imageUrl: "/photos/stethoscope.png",
    },
    {
        id: "p6",
        name: "Infrared Thermometer Pro",
        category: "Diagnostic Instruments",
        sku: "TAI-THERM-PRO",
        stock: 18,
        price: 59.99,
        sales: 1320,
        updatedLabel: "3 hours ago",
        status: "active",
        stockTone: "warn",
        imageUrl: "/photos/diagnostic-pen.png",
    },
    {
        id: "p7",
        name: "Surgical Face Mask (Box)",
        category: "Airway Management",
        sku: "TAI-MASK-BOX",
        stock: 0,
        price: 22.0,
        sales: 11200,
        updatedLabel: "Nov 10, 2023",
        status: "active",
        stockTone: "bad",
        imageUrl: "/photos/airway-pro-kit.png",
    },
    {
        id: "p8",
        name: "IV Cannula 22G",
        category: "Emergency Care",
        sku: "TAI-IV-22G",
        stock: 140,
        price: 1.2,
        sales: 4300,
        updatedLabel: "Yesterday",
        status: "active",
        stockTone: "good",
        imageUrl: "/photos/elite-stethoscope.png",
    },
    {
        id: "p9",
        name: "Blood Pressure Monitor",
        category: "Diagnostic Instruments",
        sku: "TAI-BP-01",
        stock: 34,
        price: 89.99,
        sales: 980,
        updatedLabel: "5 days ago",
        status: "active",
        stockTone: "warn",
        imageUrl: "/photos/diagnostic-pen.png",
    },
    {
        id: "p10",
        name: "Medical Lubricant Gel",
        category: "Surgical Supplies",
        sku: "TAI-LUBE-01",
        stock: 76,
        price: 8.75,
        sales: 2150,
        updatedLabel: "Just now",
        status: "active",
        stockTone: "good",
        imageUrl: "/photos/laryngeal-mask-airway.png",
    },
    {
        id: "p11",
        name: "Portable Suction Machine",
        category: "Emergency Care",
        sku: "TAI-SUCT-01",
        stock: 9,
        price: 199.0,
        sales: 320,
        updatedLabel: "2 weeks ago",
        status: "active",
        stockTone: "warn",
        imageUrl: "/photos/elite-stethoscope.png",
    },
    {
        id: "p12",
        name: "Surgical Cap (Disposable)",
        category: "Surgical Supplies",
        sku: "TAI-CAP-01",
        stock: 410,
        price: 4.25,
        sales: 6780,
        updatedLabel: "Today",
        status: "draft",
        stockTone: "good",
        imageUrl: "/photos/stethoscope.png",
    },
    {
        id: "p13",
        name: "Oxygen Nasal Cannula",
        category: "Airway Management",
        sku: "TAI-ONC-01",
        stock: 210,
        price: 6.5,
        sales: 3200,
        updatedLabel: "Today",
        status: "active",
        stockTone: "good",
        imageUrl: "/photos/airway-pro-kit.png",
    },
    {
        id: "p14",
        name: "Nebulizer Kit Standard",
        category: "Airway Management",
        sku: "TAI-NEB-STD",
        stock: 12,
        price: 34.99,
        sales: 890,
        updatedLabel: "Yesterday",
        status: "active",
        stockTone: "warn",
        imageUrl: "/photos/airway-pro-kit.png",
    },
    {
        id: "p15",
        name: "Stethoscope Classic",
        category: "Diagnostic Instruments",
        sku: "TAI-STETH-01",
        stock: 75,
        price: 120,
        sales: 540,
        updatedLabel: "3 days ago",
        status: "active",
        stockTone: "good",
        imageUrl: "/photos/elite-stethoscope.png",
    },
    {
        id: "p16",
        name: "Glucose Test Strips",
        category: "Diagnostic Instruments",
        sku: "TAI-GLU-STR",
        stock: 0,
        price: 25.5,
        sales: 4100,
        updatedLabel: "1 week ago",
        status: "active",
        stockTone: "bad",
        imageUrl: "/photos/diagnostic-pen.png",
    },
    {
        id: "p17",
        name: "Surgical Tape Roll",
        category: "Surgical Supplies",
        sku: "TAI-TAPE-01",
        stock: 180,
        price: 3.25,
        sales: 2900,
        updatedLabel: "Today",
        status: "active",
        stockTone: "good",
        imageUrl: "/photos/stethoscope.png",
    },
    {
        id: "p18",
        name: "Examination Gloves (M)",
        category: "Surgical Supplies",
        sku: "TAI-GLV-M",
        stock: 22,
        price: 14.99,
        sales: 5100,
        updatedLabel: "2 hours ago",
        status: "active",
        stockTone: "warn",
        imageUrl: "/photos/child.png",
    },
    {
        id: "p19",
        name: "Defibrillator Pads",
        category: "Emergency Care",
        sku: "TAI-DEF-PAD",
        stock: 7,
        price: 49.99,
        sales: 640,
        updatedLabel: "4 days ago",
        status: "active",
        stockTone: "warn",
        imageUrl: "/photos/image.png",
    },
    {
        id: "p20",
        name: "Surgical Gown Disposable",
        category: "Surgical Supplies",
        sku: "TAI-GOWN-01",
        stock: 390,
        price: 18.75,
        sales: 8300,
        updatedLabel: "Today",
        status: "active",
        stockTone: "good",
        imageUrl: "/photos/stethoscope.png",
    },
    {
        id: "p21",
        name: "Pulse Oximeter Finger Clip",
        category: "Diagnostic Instruments",
        sku: "TAI-OXI-FC",
        stock: 48,
        price: 39.99,
        sales: 1450,
        updatedLabel: "5 hours ago",
        status: "active",
        stockTone: "warn",
    },
    {
        id: "p22",
        name: "Portable Ventilator Mini",
        category: "Airway Management",
        sku: "TAI-VENT-M",
        stock: 4,
        price: 850,
        sales: 75,
        updatedLabel: "2 weeks ago",
        status: "active",
        stockTone: "warn",
    },
    {
        id: "p23",
        name: "Surgical Scissors 6in",
        category: "Surgical Supplies",
        sku: "TAI-SCISS-6",
        stock: 63,
        price: 15.5,
        sales: 980,
        updatedLabel: "Yesterday",
        status: "active",
        stockTone: "good",
    },
    {
        id: "p24",
        name: "Thermal Printer Roll",
        category: "Diagnostic Instruments",
        sku: "TAI-TPR-01",
        stock: 95,
        price: 12.99,
        sales: 1200,
        updatedLabel: "Today",
        status: "active",
        stockTone: "good",
    },
    {
        id: "p25",
        name: "ECG Electrodes Pack",
        category: "Diagnostic Instruments",
        sku: "TAI-ECG-EL",
        stock: 16,
        price: 27.0,
        sales: 540,
        updatedLabel: "3 days ago",
        status: "active",
        stockTone: "warn",
    },
    {
        id: "p26",
        name: "Surgical Suction Catheter",
        category: "Emergency Care",
        sku: "TAI-SUCT-CAT",
        stock: 132,
        price: 9.5,
        sales: 3100,
        updatedLabel: "Today",
        status: "active",
        stockTone: "good",
    },
    {
        id: "p27",
        name: "Medical Waste Bags",
        category: "Surgical Supplies",
        sku: "TAI-WASTE-01",
        stock: 260,
        price: 11.75,
        sales: 4700,
        updatedLabel: "Yesterday",
        status: "active",
        stockTone: "good",
    },
    {
        id: "p28",
        name: "Laryngoscope Handle",
        category: "Airway Management",
        sku: "TAI-LARY-H",
        stock: 14,
        price: 145,
        sales: 230,
        updatedLabel: "1 week ago",
        status: "active",
        stockTone: "warn",
    },
    {
        id: "p29",
        name: "Oxygen Regulator",
        category: "Emergency Care",
        sku: "TAI-OXY-REG",
        stock: 58,
        price: 210,
        sales: 410,
        updatedLabel: "Today",
        status: "active",
        stockTone: "good",
    },
    {
        id: "p30",
        name: "Sterile Gauze Pads",
        category: "Surgical Supplies",
        sku: "TAI-GAUZE-01",
        stock: 0,
        price: 5.25,
        sales: 6200,
        updatedLabel: "3 weeks ago",
        status: "active",
        stockTone: "bad",
    },
    {
        id: "p31",
        name: "Digital Weighing Scale",
        category: "Diagnostic Instruments",
        sku: "TAI-SCALE-01",
        stock: 37,
        price: 72.5,
        sales: 410,
        updatedLabel: "2 days ago",
        status: "active",
        stockTone: "warn",
    },
    {
        id: "p32",
        name: "Airway Lubricant Spray",
        category: "Airway Management",
        sku: "TAI-LUBE-SPR",
        stock: 190,
        price: 13.99,
        sales: 950,
        updatedLabel: "Today",
        status: "draft",
        stockTone: "good",
    },
];

export const PRODUCTS_SEED = SEED;

function pillClass(active: boolean) {
    return [
        "relative -mb-px inline-flex items-center gap-2 px-1 py-3 text-xs font-semibold transition",
        active ? "text-[var(--primary)]" : "text-slate-500 hover:text-slate-800",
        active
            ? "after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:bg-[var(--primary)] after:content-['']"
            : "",
    ].join(" ");
}

function tabLabel(tab: TabKey) {
    if (tab === "all") return "All Products";
    if (tab === "active") return "Active";
    if (tab === "outOfStock") return "Out of Stock";
    if (tab === "lowStock") return "Low Stock";
    return "Drafts";
}

export default function ProductsTabsAndTable({
    onTabChange,
    onExportMetaChange,
}: {
    onTabChange?: (tab: TabKey) => void;
    onExportMetaChange?: (meta: ExportMeta) => void;
}) {
    const [tab, setTab] = useState<TabKey>("all");
    const [query, setQuery] = useState("");
    const [category, setCategory] = useState("All");
    const [page, setPage] = useState(1);

    // ✅ report selected tab
    useEffect(() => {
        onTabChange?.(tab);
    }, [tab, onTabChange]);

    // reset pagination when filters change
    useEffect(() => {
        setPage(1);
    }, [tab, query, category]);


    const counts = useMemo(() => {
        const all = SEED.length;
        const active = SEED.filter((r) => r.status === "active").length;
        const outOfStock = SEED.filter((r) => r.stock === 0).length;
        const lowStock = SEED.filter(
            (r) => (r.stock ?? 999999) > 0 && (r.stock ?? 999999) <= 50
        ).length;
        const drafts = SEED.filter((r) => r.status === "draft").length;
        return { all, active, outOfStock, lowStock, drafts };
    }, []);

    const filtered = useMemo(() => {
        let rows = [...SEED];

        // tab filter
        rows = rows.filter((r) => {
            if (tab === "all") return true;
            if (tab === "active") return r.status === "active";
            if (tab === "drafts") return r.status === "draft";
            if (tab === "outOfStock") return r.stock === 0;
            if (tab === "lowStock")
                return (r.stock ?? 999999) > 0 && (r.stock ?? 999999) <= 50;
            return true;
        });

        // search filter
        const q = query.trim().toLowerCase();
        if (q) {
            rows = rows.filter((r) => {
                return (
                    r.name.toLowerCase().includes(q) ||
                    (r.sku ?? "").toLowerCase().includes(q) ||
                    (r.category ?? "").toLowerCase().includes(q)
                );
            });
        }

        // category filter
        if (category !== "All") {
            rows = rows.filter((r) => r.category === category);
        }

        return rows;
    }, [tab, query, category]);

    // ✅ build exact "Filter Applied" label (tab + optional category + optional search)
    const filterLabel = useMemo(() => {
        const parts: string[] = [];

        // base tab
        parts.push(tabLabel(tab));

        // category only if not All
        if (category !== "All") parts.push(`Category: ${category}`);

        // query only if exists
        const q = query.trim();
        if (q) parts.push(`Search: "${q}"`);

        // if only tab => return tab label, else join nicely
        return parts.join(" • ");
    }, [tab, category, query]);

    // ✅ report export meta based on TAB PILL numbers (2nd screenshot)
    useEffect(() => {
        if (!onExportMetaChange) return;

        const totalRecords =
            tab === "all"
                ? counts.all
                : tab === "active"
                    ? counts.active
                    : tab === "outOfStock"
                        ? counts.outOfStock
                        : tab === "lowStock"
                            ? counts.lowStock
                            : counts.drafts;

        onExportMetaChange({
            totalRecords,
            filterLabel, // ✅
        });
    }, [tab, counts, filterLabel, onExportMetaChange]);

    // const counts = useMemo(() => {
    //     const all = SEED.length;
    //     const active = SEED.filter((r) => r.status === "active").length;
    //     const outOfStock = SEED.filter((r) => r.stock === 0).length;
    //     const lowStock = SEED.filter(
    //         (r) => (r.stock ?? 999999) > 0 && (r.stock ?? 999999) <= 50
    //     ).length;
    //     const drafts = SEED.filter((r) => r.status === "draft").length;
    //     return { all, active, outOfStock, lowStock, drafts };
    // }, []);

    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    const safePage = Math.min(page, totalPages);
    const start = (safePage - 1) * PAGE_SIZE;
    const pageRows = filtered.slice(start, start + PAGE_SIZE);

    return (
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            {/* Tabs */}
            <div className="flex flex-wrap items-center gap-6 border-b border-slate-100 px-5">
                <button className={pillClass(tab === "all")} onClick={() => setTab("all")}>
                    All Products{" "}
                    <span className="ml-2 rounded-full bg-slate-200 px-2 py-0.5 text-[11px]">
                        {counts.all}
                    </span>
                </button>

                <button className={pillClass(tab === "active")} onClick={() => setTab("active")}>
                    Active{" "}
                    <span className="ml-2 rounded-full bg-slate-200 px-2 py-0.5 text-[11px]">
                        {counts.active}
                    </span>
                </button>

                <button
                    className={pillClass(tab === "outOfStock")}
                    onClick={() => setTab("outOfStock")}
                >
                    Out of Stock{" "}
                    <span className="ml-2 rounded-full bg-red-50 px-2 py-0.5 text-[11px] text-red-600 ring-1 ring-red-100">
                        {counts.outOfStock}
                    </span>
                </button>

                <button className={pillClass(tab === "lowStock")} onClick={() => setTab("lowStock")}>
                    Low Stock{" "}
                    <span className="ml-2 rounded-full bg-orange-50 px-2 py-0.5 text-[11px] text-orange-700 ring-1 ring-orange-100">
                        {counts.lowStock}
                    </span>
                </button>

                <button className={pillClass(tab === "drafts")} onClick={() => setTab("drafts")}>
                    Drafts{" "}
                    <span className="ml-2 rounded-full bg-yellow-50 px-2 py-0.5 text-[11px] text-yellow-700 ring-1 ring-yellow-100">
                        {counts.drafts}
                    </span>
                </button>
            </div>

            {/* Search + category */}
            <ProductsTableToolbar
                query={query}
                onQueryChange={setQuery}
                category={category}
                onCategoryChange={setCategory}
            />

            {/* Table */}
            <ProductsTable
                rows={pageRows}
                totalCount={filtered.length} // ✅ count after filters
                page={safePage}
                pageSize={PAGE_SIZE}
                totalPages={totalPages}
                onPageChange={setPage}
            />
        </div>
    );
}