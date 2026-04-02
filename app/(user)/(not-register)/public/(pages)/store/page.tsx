"use client";

import { useState } from "react";
import ProductSection from "@/app/(user)/(not-register)/public/(pages)/store/_components/products-section";
import StoreHero from "@/app/(user)/(not-register)/public/(pages)/store/_components/store-hero";
import StoreToolbar from "@/app/(user)/(not-register)/public/(pages)/store/_components/store-toolbar";

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
