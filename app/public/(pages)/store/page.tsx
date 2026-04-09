"use client";

import ProductSection from "@/app/public/(pages)/store/_components/products-section";
import StoreHero from "@/app/public/(pages)/store/_components/store-hero";
import StoreToolbar from "@/app/public/(pages)/store/_components/store-toolbar";
import { useState } from "react";

const StorePage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  return (
    <main>
      <StoreHero />
      <StoreToolbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        sortBy={sortBy}
        onSortChange={setSortBy}
      />
      <div className="padding">
        <ProductSection searchQuery={searchQuery} sortBy={sortBy} />
      </div>
    </main>
  );
};

export default StorePage;
