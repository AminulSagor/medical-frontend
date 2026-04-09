import type { ProductDetails } from "../_types/product-details.types";

export const MOCK_PRODUCT_DETAILS: ProductDetails = {
    id: "lma-supreme",
    name: "Laryngeal Mask Airway Supreme",
    breadcrumbCategory: "Clinical Gear",

    totalUnitsSold: 854,
    totalRevenueLabel: "$33,297.46",
    lastSaleDateLabel: "Oct 24, 2026",
    lastSaleSubLabel: "JUST NOW",

    description:
        "The Laryngeal Mask Airway Supreme is a high-performance, single-use supraglottic device tailored for both routine anesthetic procedures and rapid-access emergency airway scenarios. Engineered with a double-seal design, it offers superior oropharyngeal leak pressures, providing clinicians with increased confidence during positive pressure ventilation.\n\nFeaturing a pre-curved shape for rapid, trauma-free insertion, the device remains stable in the airway even during patient movement.",

    images: [
        { id: "img_1", label: "Primary" },
        { id: "img_2" },
        { id: "img_3" },
        { id: "img_4", label: "+2 MORE" },
    ],

    organization: {
        availabilityLabel: "Availability",
        availabilityValue: "INSTOCK",
        deptLabel: "Dept.",
        deptValue: "Airway Management",
    },

    benefits: [
        {
            id: "b1",
            title: "Atraumatic Design",
            description: "Minimizes mucosal injury during rapid insertion phases.",
            tone: "teal",
        },
        {
            id: "b2",
            title: "Integrated Gastric Port",
            description: "Allows for easy placement of orogastric tubes to drain contents.",
            tone: "blue",
        },
        {
            id: "b3",
            title: "Double Seal Technology",
            description: "Enhanced protection against aspiration risks.",
            tone: "purple",
        },
        {
            id: "b4",
            title: "Bite Block Stability",
            description: "Reinforced tube prevents occlusion from dental pressure.",
            tone: "orange",
        },
    ],

    specs: [
        { id: "s1", label: "Material", value: "Medical Grade Silicone (Latex Free)" },
        { id: "s2", label: "Sterility", value: "EO Gas Sterilized" },
        { id: "s3", label: "Connector", value: "15mm ISO Standard" },
        { id: "s4", label: "Pressure Limit", value: "Up to 30 cm H₂O Seal" },
    ],

    pricingStrip: {
        statusLabel: "INVENTORY ASSET STATUS: OPTIMAL",
        skuLabel: "SKU: TAI-LMA-S4",
        publicPriceLabel: "$45.00",
        memberPriceLabel: "$34.99",
        currentStockLabel: "142",
    },

    bulkTiers: [
        { id: "t1", qtyLabel: "10+ UNITS", priceLabel: "$32.00 ea" },
        { id: "t2", qtyLabel: "25+ UNITS", priceLabel: "$29.50 ea" },
        { id: "t3", qtyLabel: "50+ UNITS", priceLabel: "$27.00 ea" },
    ],

    crossSell: {
        frequentlyBoughtTogether: [
            { id: "c1", title: "Sterile Lube Pack", subtitle: "Add-on", priceLabel: "$2.49 Add-on" },
        ],
        completeSetup: [
            { id: "c2", title: "ET Tube Kit v2", subtitle: "Clinical Bundle" },
        ],
    },
};